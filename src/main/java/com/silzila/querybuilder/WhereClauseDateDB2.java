package com.silzila.querybuilder;

import com.silzila.exception.BadRequestException;
import com.silzila.helper.OptionsBuilder;
import com.silzila.helper.QueryNegator;
import com.silzila.payload.request.Filter;

import java.util.List;
import java.util.Map;

public class WhereClauseDateDB2 {
    public static String buildWhereClauseDate(Filter filter) throws BadRequestException {
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

        /*
         * EXACT MATCH - Can be single match or multiple matches
         */
        if (List.of("EQUAL_TO", "IN").contains(filter.getOperator().name())) {
            String excludeOperator = QueryNegator.makeNagateExpression(filter.getShouldExclude(),
                    filter.getOperator().name());

            // DROP DOWN - string time grain match - eg., month in (January, February)
            if (filter.getOperator().name().equals("IN")) {

                if (filter.getTimeGrain().name().equals("YEAR")) {
                    field = "EXTRACT(YEAR FROM " + filter.getTableId() + "." + filter.getFieldName() + ")::INTEGER";
                } else if (filter.getTimeGrain().name().equals("QUARTER")) {
                    field = "CONCAT('Q', EXTRACT(QUARTER FROM " + filter.getTableId() + "." + filter.getFieldName()
                            + ")::INTEGER)";
                } else if (filter.getTimeGrain().name().equals("MONTH")) {
                    field = "TRIM(TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'Month'))";
                } else if (filter.getTimeGrain().name().equals("YEARQUARTER")) {
                    field = "TO_CHAR(YEAR(" + filter.getTableId() + "." + filter.getFieldName()
                            + ")) || '-Q' || TO_CHAR(QUARTER(" + filter.getTableId() + "."
                            + filter.getFieldName() + "))";
                    field = "TO_CHAR(YEAR(" + filter.getTableId() + "." + filter.getFieldName()
                            + ")) || '-Q' || TO_CHAR(QUARTER(" + filter.getTableId() + "."
                            + filter.getFieldName() + "))";
                } else if (filter.getTimeGrain().name().equals("YEARMONTH")) {
                    field = "TO_CHAR(YEAR(" + filter.getTableId() + "." + filter.getFieldName()
                            + "))|| '-' || LPAD(TO_CHAR(YEAR(" + filter.getTableId() + "." + filter.getFieldName()
                            + ")),2,0)";
                    field = "TO_CHAR(YEAR(" + filter.getTableId() + "." + filter.getFieldName()
                            + "))|| '-' || LPAD(TO_CHAR(YEAR(" + filter.getTableId() + "." + filter.getFieldName()
                            + ")),2,0)";
                } else if (filter.getTimeGrain().name().equals("DATE")) {
                    field = "DATE(" + filter.getTableId() + "." + filter.getFieldName() + ")";
                } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
                    field = "TRIM(TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'Day'))";
                } else if (filter.getTimeGrain().name().equals("DAYOFMONTH")) {
                    field = "EXTRACT(DAY FROM " + filter.getTableId() + "." + filter.getFieldName() + ")::INTEGER";
                }

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
                    field = "EXTRACT(YEAR FROM " + filter.getTableId() + "." + filter.getFieldName() + ")::INTEGER";
                } else if (filter.getTimeGrain().name().equals("QUARTER")) {
                    field = "EXTRACT(QUARTER FROM " + filter.getTableId() + "." + filter.getFieldName() + ")::INTEGER";
                } else if (filter.getTimeGrain().name().equals("MONTH")) {
                    field = "EXTRACT(MONTH FROM " + filter.getTableId() + "." + filter.getFieldName() + ")::INTEGER";
                } else if (filter.getTimeGrain().name().equals("DATE")) {
                    field = "DATE(" + filter.getTableId() + "." + filter.getFieldName() + ")";
                } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
                    field = "EXTRACT(DOW FROM " + filter.getTableId() + "." + filter.getFieldName() + ")::INTEGER ";
                    field = "EXTRACT(DOW FROM " + filter.getTableId() + "." + filter.getFieldName() + ")::INTEGER ";
                } else if (filter.getTimeGrain().name().equals("DAYOFMONTH")) {
                    field = "EXTRACT(DAY FROM " + filter.getTableId() + "." + filter.getFieldName() + ")::INTEGER";
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
                field = "DATE(" + filter.getTableId() + "." + filter.getFieldName() + ")";
            } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
                field = "EXTRACT(DOW FROM " + filter.getTableId() + "." + filter.getFieldName() + ")::INTEGER ";
                field = "EXTRACT(DOW FROM " + filter.getTableId() + "." + filter.getFieldName() + ")::INTEGER ";
            }
            // decides if it is '=' or '!='
            String excludeOperator = QueryNegator.makeNegateCondition(filter.getShouldExclude());

            // Between requires 2 values and other operators require just 1 value
            if (List.of("GREATER_THAN", "GREATER_THAN_OR_EQUAL_TO", "LESS_THAN", "LESS_THAN_OR_EQUAL_TO")
                    .contains(filter.getOperator().name())) {
                where = excludeOperator + field + comparisonOperator.get(filter.getOperator().name()) + "'"
                        + filter.getUserSelection().get(0) + "'";
            } else if (filter.getOperator().name().equals("BETWEEN")) {
                if (filter.getUserSelection().size() > 1) {
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
        // tillDate
        if (filter.getIsTillDate()
                && List.of("MONTH", "DAYOFMONTH", "YEARMONTH", "YEAR", "DAYOFWEEK", "QUARTER", "YEARQUARTER")
                        .contains(filter.getTimeGrain().name())) {
            where = "(\n\t\t" + where + TillDate.tillDate("db2", filter) + "\n\t\t)";
            if (shouldExcludeTillDate) {
                where = " NOT " + where;
            }
        }

        return where;

    }
}
