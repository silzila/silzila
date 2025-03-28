package com.silzila.querybuilder;

import java.util.List;
import java.util.Map;
import com.silzila.exception.BadRequestException;
import com.silzila.helper.OptionsBuilder;
import com.silzila.helper.QueryNegator;
import com.silzila.payload.request.Filter;

public class WhereClauseDateOracle implements WhereClauseDate{

    public String buildWhereClauseDate(Filter filter) throws BadRequestException {
        // MAP of request comparison operator name to symbol in Oracle
        Map<String, String> comparisonOperator = Map.of("GREATER_THAN", " > ", "GREATER_THAN_OR_EQUAL_TO", " >= ",
                "LESS_THAN", " < ", "LESS_THAN_OR_EQUAL_TO", " <= ", "NOT_EQUAL_TO", " <> ");

        // field string holds partial field related and where holds the complete
        // condition for the field
        String field = "";
        String where = "";
        Boolean shouldExcludeTillDate = filter.getShouldExclude();

        if(filter.getIsTillDate() && filter.getShouldExclude()){
            filter.setShouldExclude(false);
        }

        String whereField = filter.getIsCalculatedField() || !"field".equals(filter.getConditionType().getLeftOperandType())? filter.getFieldName() : filter.getTableId() + "." + filter.getFieldName();

        // input of number less than 10 in userSelection is should be in '01','02'
        // format not '1','2'
        if (filter.getTimeGrain().name().equals("DAYOFMONTH")) {
            filter.setUserSelection(formatNumber(filter.getUserSelection()));
        }

        // field
        field = getDatePartExpression(filter.getTimeGrain().name(), whereField);

        /*
         * EXACT MATCH - Can be single match or multiple matches
         */

        // DROP DOWN - string time grain match - eg., month in (January, February)
        if (filter.getOperator().name().equals("IN")) {
            String excludeOperator = QueryNegator.makeNagateExpression(filter.getShouldExclude(),
                    filter.getOperator().name());

                    String nullCondition = NullClauseGenerator.generateNullCheckQuery(filter, excludeOperator);
                    String options = OptionsBuilder.buildStringOptions(filter.getUserSelection());
                    where = field + excludeOperator + "IN (" + options + ")" + nullCondition;
        }

        /*
         * SLIDER - Numerical value - COMPARISON OPERATOR
         */
        else if (List
                .of("GREATER_THAN", "GREATER_THAN_OR_EQUAL_TO", "LESS_THAN", "LESS_THAN_OR_EQUAL_TO", "NOT_EQUAL_TO",
                        "BETWEEN", "EQUAL_TO")
                .contains(filter.getOperator().name())) {

            // slider can't take time grains like yearquarter & yearmonth
            // in that case give error
            if (!List.of("YEAR", "MONTH", "QUARTER", "DATE", "DAYOFMONTH", "DAYOFWEEK")
                    .contains(filter.getTimeGrain().name())) {
                throw new BadRequestException("Error: Time grain is not correct for Comparsion Operator in the field "
                        + filter.getFieldName() + " in Filter!");
            }

            // input of number less than 10 in userSelection is should be in '01','02'
            // format not '1','2'
            if (filter.getTimeGrain().name().equals("MONTH")) {
                filter.setUserSelection(formatNumber(filter.getUserSelection()));
                field = "TO_CHAR(" + whereField + ", 'mm')";
            } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
                field = "TO_CHAR(" + whereField + " , 'D')";
            } else if (filter.getTimeGrain().name().equals("QUARTER")) {
                field = "TO_CHAR(" + whereField + ",'Q')";
            }
            // Between requires 2 values and other operators require just 1 value
            // SLIDER - numerical time grain match - eg., year = 2018
            if (filter.getOperator().name().equals("EQUAL_TO")) {

                String excludeOperator = QueryNegator.makeNagateExpression(filter.getShouldExclude(),
                        filter.getOperator().name());

                where = field + excludeOperator + "= '" + filter.getUserSelection().get(0) + "'";

            } else if (List.of("GREATER_THAN", "GREATER_THAN_OR_EQUAL_TO", "LESS_THAN", "LESS_THAN_OR_EQUAL_TO",
                    "NOT_EQUAL_TO")
                    .contains(filter.getOperator().name())) {

                String excludeOperator = QueryNegator.makeNegateCondition(filter.getShouldExclude());

                where = OptionsBuilder.buildSingleOption(filter, excludeOperator, field, comparisonOperator);
            } else if (filter.getOperator().name().equals("BETWEEN")) {
                if (filter.getUserSelection().size() > 1) {
                    String excludeOperator = QueryNegator.makeNegateCondition(filter.getShouldExclude());

                    where = OptionsBuilder.buildBetweenOptions(filter, excludeOperator, field);
                }
                // for between, throw error if 2 values are not given
                else {
                    throw new BadRequestException("Error: Between Operator needs two inputs for the field "
                            + filter.getFieldName() + " in Filter!");
                }
            }
        }
        //tillDate
        if(filter.getIsTillDate() && List.of("MONTH","DAYOFMONTH","YEARMONTH","YEAR","DAYOFWEEK","QUARTER","YEARQUARTER").contains(filter.getTimeGrain().name())){
            where = "(\n\t\t" + where+ TillDate.tillDate("oracle", filter,whereField) + "\n\t\t)";
            if(shouldExcludeTillDate){
                where = " NOT " + where;
            }
        }
        return where;

    }

    // for format the Number to double digit
    public static List<String> formatNumber(List<String> userSelection) {
        userSelection.forEach(input -> {
            try {
                int num = Integer.parseInt(input);
                if (num <= 9) {
                    String formattedNum = "0" + input;
                    userSelection.set(userSelection.indexOf(input), formattedNum);
                }
            } catch (NumberFormatException e) {

            }
        });

        return userSelection;
    }

    public String getDatePartExpression(String timeGrain, String columnName){
        String dateExpression = "";
        
        if (timeGrain.equals("YEAR")) {
            dateExpression = "TO_CHAR(" + columnName + ", 'yyyy')";
        } else if (timeGrain.equals("QUARTER")) {
            dateExpression = "TO_CHAR(" + columnName + ",'\"Q\"Q')";
        } else if (timeGrain.equals("MONTH")) {
            dateExpression = "TO_CHAR(" + columnName + ", 'fmMonth')";
        } else if (timeGrain.equals("YEARQUARTER")) {
            dateExpression = "TO_CHAR(" + columnName + ", 'YYYY-\"Q\"Q')";
        } else if (timeGrain.equals("YEARMONTH")) {
            dateExpression = "TO_CHAR(" + columnName + ", 'yyyy-mm')";
        } else if (timeGrain.equals("DATE")) {
            dateExpression = "TO_CHAR(" + columnName + ", 'yyyy-mm-dd')";
        } else if (timeGrain.equals("DAYOFWEEK")) {
            dateExpression = "TO_CHAR(" + columnName + " , 'fmDay')";
        } else if (timeGrain.equals("DAYOFMONTH")) {
            dateExpression = "TO_CHAR(" + columnName + ", 'dd')";
        };

        return dateExpression;
    }
}
