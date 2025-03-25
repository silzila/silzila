package com.silzila.querybuilder;

import com.silzila.exception.BadRequestException;
import com.silzila.helper.OptionsBuilder;
import com.silzila.helper.QueryNegator;
import com.silzila.payload.request.Filter;

import java.util.List;
import java.util.Map;
public class WhereClauseDateDB2 implements WhereClauseDate{


    public  String buildWhereClauseDate(Filter filter) throws BadRequestException {
        // MAP of request time grain to date function parameter in Postgres
        Map<String, String> timeGrainMap = Map.of("YEAR", "YEAR", "MONTH", "MONTH", "QUARTER", "QUARTER", "DAYOFWEEK",
                "DOW", "DAYOFMONTH", "DAY");
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
                // Allowable Time Grains
                if (filter.getTimeGrain().name().equals("YEAR")) {
                    field = "EXTRACT(YEAR FROM " + whereField + ")::INTEGER";
                } else if (filter.getTimeGrain().name().equals("QUARTER")) {
                    field = "EXTRACT(QUARTER FROM " + whereField + ")::INTEGER";
                } else if (filter.getTimeGrain().name().equals("MONTH")) {
                    field = "EXTRACT(MONTH FROM " + whereField + ")::INTEGER";
                } else if (filter.getTimeGrain().name().equals("DATE")) {
                    field = "DATE(" + whereField + ")";
                } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
                    field = "EXTRACT(DOW FROM " + whereField + ")::INTEGER ";
                    field = "EXTRACT(DOW FROM " + whereField + ")::INTEGER ";
                } else if (filter.getTimeGrain().name().equals("DAYOFMONTH")) {
                    field = "EXTRACT(DAY FROM " + whereField + ")::INTEGER";
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
            // Allowable Time Grins
            if (List.of("YEAR", "QUARTER", "MONTH", "DAYOFMONTH").contains(filter.getTimeGrain().name())) {
                field = "EXTRACT(" + timeGrainMap.get(filter.getTimeGrain().name()) + " FROM " + filter.getTableId()
                        + "." + filter.getFieldName() + ")::INTEGER";
            } else if (filter.getTimeGrain().name().equals("DATE")) {
                field = "DATE(" + whereField + ")";
            } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
                field = "EXTRACT(DOW FROM " + whereField + ")::INTEGER ";
                field = "EXTRACT(DOW FROM " + whereField + ")::INTEGER ";
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
            where = "(\n\t\t" + where + TillDate.tillDate("db2", filter,whereField) + "\n\t\t)";
            if (shouldExcludeTillDate) {
                where = " NOT " + where;
            }
        }

        return where;

    }

    public String getDatePartExpression(String timeGrain, String columnName){
        String dateExpression = "";
        
        if (timeGrain.equals("YEAR")) {
            dateExpression = "EXTRACT(YEAR FROM " + columnName + ")::INTEGER";
        } else if (timeGrain.equals("QUARTER")) {
            dateExpression = "CONCAT('Q', EXTRACT(QUARTER FROM " + columnName
                    + ")::INTEGER)";
        } else if (timeGrain.equals("MONTH")) {
            dateExpression = "TRIM(TO_CHAR(" + columnName + ", 'Month'))";
        } else if (timeGrain.equals("YEARQUARTER")) {
            dateExpression = "TO_CHAR(YEAR(" + columnName
                    + ")) || '-Q' || TO_CHAR(QUARTER(" + columnName + "))";
            dateExpression = "TO_CHAR(YEAR(" + columnName
                    + ")) || '-Q' || TO_CHAR(QUARTER(" + columnName + "))";
        } else if (timeGrain.equals("YEARMONTH")) {
            dateExpression = "TO_CHAR(YEAR(" + columnName
                    + "))|| '-' || LPAD(TO_CHAR(YEAR(" + columnName
                    + ")),2,0)";
            dateExpression = "TO_CHAR(YEAR(" + columnName
                    + "))|| '-' || LPAD(TO_CHAR(YEAR(" + columnName
                    + ")),2,0)";
        } else if (timeGrain.equals("DATE")) {
            dateExpression = "DATE(" + columnName + ")";
        } else if (timeGrain.equals("DAYOFWEEK")) {
            dateExpression = "TRIM(TO_CHAR(" + columnName + ", 'Day'))";
        } else if (timeGrain.equals("DAYOFMONTH")) {
            dateExpression = "EXTRACT(DAY FROM " + columnName + ")::INTEGER";
        }

        return dateExpression;
    }
}
