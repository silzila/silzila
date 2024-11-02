package com.silzila.querybuilder;

import java.util.List;
import java.util.Map;
import com.silzila.exception.BadRequestException;
import com.silzila.helper.OptionsBuilder;
import com.silzila.helper.QueryNegator;
import com.silzila.payload.request.Filter;

public class WhereClauseDateOracle {
    public static String buildWhereClauseDate(Filter filter) throws BadRequestException {
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

        // input of number less than 10 in userSelection is should be in '01','02'
        // format not '1','2'
        if (filter.getTimeGrain().name().equals("DAYOFMONTH")) {
            filter.setUserSelection(formatNumber(filter.getUserSelection()));
        }

        // field
        if (filter.getTimeGrain().name().equals("YEAR")) {
            field = "TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'yyyy')";
        } else if (filter.getTimeGrain().name().equals("QUARTER")) {
            field = "TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ",'\"Q\"Q')";
        } else if (filter.getTimeGrain().name().equals("MONTH")) {
            field = "TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'fmMonth')";
        } else if (filter.getTimeGrain().name().equals("YEARQUARTER")) {
            field = "TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'YYYY-\"Q\"Q')";
        } else if (filter.getTimeGrain().name().equals("YEARMONTH")) {
            field = "TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'yyyy-mm')";
        } else if (filter.getTimeGrain().name().equals("DATE")) {
            field = "TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'yyyy-mm-dd')";
        } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
            field = "TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + " , 'fmDay')";
        } else if (filter.getTimeGrain().name().equals("DAYOFMONTH")) {
            field = "TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'dd')";
        }
        ;

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
                field = "TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'mm')";
            } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
                field = "TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + " , 'D')";
            }else if (filter.getTimeGrain().name().equals("QUARTER")) {
                field = "TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ",'Q')";
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

                where = excludeOperator + field + comparisonOperator.get(filter.getOperator().name()) + "'"
                        + filter.getUserSelection().get(0) + "'";
            } else if (filter.getOperator().name().equals("BETWEEN")) {
                if (filter.getUserSelection().size() > 1) {
                    String excludeOperator = QueryNegator.makeNegateCondition(filter.getShouldExclude());

                    where = excludeOperator + field + " BETWEEN '" + filter.getUserSelection().get(0) + "' AND '"
                            + filter.getUserSelection().get(1) + "'";
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
            where = "(\n\t\t" + where+ TillDate.tillDate("oracle", filter) + "\n\t\t)";
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
}
