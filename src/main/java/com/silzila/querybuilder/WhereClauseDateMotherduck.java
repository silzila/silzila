package com.silzila.querybuilder;

import java.util.List;
import java.util.Map;
import com.silzila.payload.request.Filter;
import com.silzila.exception.BadRequestException;
import com.silzila.helper.OptionsBuilder;
import com.silzila.helper.QueryNegator;

public class WhereClauseDateMotherduck implements WhereClauseDate {

    public String buildWhereClauseDate(Filter filter) throws BadRequestException {
        // MAP of request time grain to date function parameter in Postgres
        Map<String, String> timeGrainMap = Map.of("YEAR", "YEAR", "MONTH", "MONTH", "QUARTER", "QUARTER",
                "DATE", "DATE", "DAYOFWEEK", "DAYOFWEEK", "DAYOFMONTH", "DAY");
        // MAP of request comparison operator name to symbol in Postgres
        Map<String, String> comparisonOperator = Map.of("GREATER_THAN", " > ", "GREATER_THAN_OR_EQUAL_TO", " >= ",
                "LESS_THAN", " < ", "LESS_THAN_OR_EQUAL_TO", " <= ");

        // field string holds partial field related and where holds the complete
        // condition for the field
        String field = "";
        String where = "";
        Boolean shouldExcludeTillDate = filter.getShouldExclude();

        if (filter.getIsTillDate() && filter.getShouldExclude()) {
            filter.setShouldExclude(false);
        }
        String whereField = filter.getIsCalculatedField() || !"field".equals(filter.getConditionType().getLeftOperandType())? filter.getFieldName() : filter.getTableId() + "." + filter.getFieldName();

        /*
         * EXACT MATCH - Can be single match or multiple matches
         */
        if (List.of("EQUAL_TO", "IN").contains(filter.getOperator().name())) {
            String excludeOperator = QueryNegator.makeNagateExpression(filter.getShouldExclude(),
                    filter.getOperator().name());

            // DROP DOWN - string time grain match - eg., month in (January, February)
            if (filter.getOperator().name().equals("IN")) {

                field = getDatePartExpression(filter.getTimeGrain().name(), whereField);

                String nullCondition = NullClauseGenerator.generateNullCheckQuery(filter, excludeOperator);
                String options = OptionsBuilder.buildStringOptions(filter.getUserSelection());
                where = field + excludeOperator + "IN (" + options + ")" + nullCondition;
            }

            // SLIDER - numerical time grain match - eg., year = 2018
            else if (filter.getOperator().name().equals("EQUAL_TO")) {
                // slider can't take time grains like yearquarter & yearmonth
                // in that case give error
                if (!List.of("YEAR", "MONTH", "QUARTER", "DATE", "DAYOFMONTH", "DAYOFWEEK")
                        .contains(filter.getTimeGrain().name())) {
                    throw new BadRequestException("Error: Time grain is not correct for Equal To Operator in the field "
                            + filter.getFieldName() + " in Filter!");
                }
                if (filter.getTimeGrain().name().equals("DATE")) {
                    field = "CAST(" + whereField + " AS DATE)";
                } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
                    field = timeGrainMap.get(filter.getTimeGrain().name()) + "(" + whereField + ") + 1";
                } else {
                    field = timeGrainMap.get(filter.getTimeGrain().name()) + "(" + whereField + ")";
                }
                where = field + excludeOperator + "= '" + filter.getUserSelection().get(0) + "'";
            }
        }

        /*
         * SLIDER - Numerical value - COMPARISON OPERATOR
         */
        else if (List.of("GREATER_THAN", "GREATER_THAN_OR_EQUAL_TO", "LESS_THAN", "LESS_THAN_OR_EQUAL_TO", "BETWEEN")
                .contains(filter.getOperator().name())) {

            // slider can't take time grains like yearquarter & yearmonth
            // in that case give error
            if (!List.of("YEAR", "MONTH", "QUARTER", "DATE", "DAYOFMONTH", "DAYOFWEEK")
                    .contains(filter.getTimeGrain().name())) {
                throw new BadRequestException("Error: Time grain is not correct for Comparsion Operator in the field "
                        + filter.getFieldName() + " in Filter!");
            }
            if (filter.getTimeGrain().name().equals("DATE")) {
                field = "CAST(" + whereField + " AS DATE)";
            } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
                field = timeGrainMap.get(filter.getTimeGrain().name()) + "(" + whereField + ") + 1";
            } else {
                field = timeGrainMap.get(filter.getTimeGrain().name()) + "(" + whereField + ")";
            }
            // decides if it is '=' or '!='
            String excludeOperator = QueryNegator.makeNegateCondition(filter.getShouldExclude());

            // Between requires 2 values and other operators require just 1 value
            if (List.of("GREATER_THAN", "GREATER_THAN_OR_EQUAL_TO", "LESS_THAN", "LESS_THAN_OR_EQUAL_TO")
                    .contains(filter.getOperator().name())) {
                where = OptionsBuilder.buildSingleOption(filter, excludeOperator, field, comparisonOperator);
            } else if (filter.getOperator().name().equals("BETWEEN")) {
                if (filter.getUserSelection().size() > 1) {
                    where = OptionsBuilder.buildBetweenOptions(filter, excludeOperator, field);
                }
                // for between, throw error if 2 values are not given
                else {
                    throw new BadRequestException("Error: Between Operator needs two inputs for the field "
                            + filter.getFieldName() + " in Filter!");
                }
            }
        }
        // tillDate
        if (filter.getIsTillDate()
                && List.of("MONTH", "DAYOFMONTH", "YEARMONTH", "YEAR", "DAYOFWEEK", "QUARTER", "YEARQUARTER")
                        .contains(filter.getTimeGrain().name())) {
            where = "(\n\t\t" + where + TillDate.tillDate("motherduck", filter,whereField) + "\n\t\t)";
            if (shouldExcludeTillDate) {
                where = " NOT " + where;
            }
        }

        return where;

    }

    public String getDatePartExpression(String timeGrain, String columnName){
        String dateExpression = "";
        
        if (timeGrain.equals("YEAR")) {
            dateExpression = "YEAR(" + columnName + ")";
        } else if (timeGrain.equals("QUARTER")) {
            dateExpression = "CONCAT('Q', QUARTER(" + columnName + "))";
        } else if (timeGrain.equals("MONTH")) {
            dateExpression = "MONTHNAME(" + columnName + ")";
        } else if (timeGrain.equals("YEARQUARTER")) {
            dateExpression = "CONCAT(YEAR(" + columnName + "), '-Q', QUARTER("
                    + columnName + "))";
        } else if (timeGrain.equals("YEARMONTH")) {
            dateExpression = "STRFTIME(" + columnName + ", '%Y-%m')";
        } else if (timeGrain.equals("DATE")) {
            dateExpression = "CAST(" + columnName + " AS DATE)";
        } else if (timeGrain.equals("DAYOFWEEK")) {
            dateExpression = "DAYNAME(" + columnName + ")";
        } else if (timeGrain.equals("DAYOFMONTH")) {
            dateExpression = "DAY(" + columnName + ")";
        }

        return dateExpression;
    }
}
