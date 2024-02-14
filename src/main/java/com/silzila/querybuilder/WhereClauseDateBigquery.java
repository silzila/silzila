package com.silzila.querybuilder;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.silzila.payload.request.Filter;
import com.silzila.exception.BadRequestException;
import com.silzila.helper.QueryNegator;

public class WhereClauseDateBigquery {
        public static String buildWhereClauseDate(Filter filter) throws BadRequestException {
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

        /*
         * EXACT MATCH - Can be single match or multiple matches
         */
        if (List.of("EQUAL_TO", "IN").contains(filter.getOperator().name())) {
            String excludeOperator = QueryNegator.makeNagateExpression(filter.getShouldExclude(),
                    filter.getOperator().name());

            // DROP DOWN - string time grain match - eg., month in (January, February)
            if (filter.getOperator().name().equals("IN")) {

                if (filter.getTimeGrain().name().equals("YEAR")) {
                    field = "EXTRACT(YEAR FROM " + filter.getTableId() + "." + filter.getFieldName() + ")";
                    String options =  filter.getUserSelection().stream().collect(Collectors.joining(", "));
                    where = field + excludeOperator + "IN (" + options + ")";
                } else if (filter.getTimeGrain().name().equals("QUARTER")) {
                    field = "CONCAT('Q', EXTRACT(QUARTER FROM " + filter.getTableId() + "." + filter.getFieldName() + "))";
                    String options = "'" + filter.getUserSelection().stream().collect(Collectors.joining("', '")) + "'";
                    where = field + excludeOperator + "IN (" + options + ")";
                } else if (filter.getTimeGrain().name().equals("MONTH")) {
                    field = "FORMAT_DATE('%B', DATE(" + filter.getTableId() + "." + filter.getFieldName() + "))";
                    String options = "'" + filter.getUserSelection().stream().collect(Collectors.joining("', '")) + "'";
                    where = field + excludeOperator + "IN (" + options + ")";
                } else if (filter.getTimeGrain().name().equals("YEARQUARTER")) {
                    field = "CONCAT(EXTRACT(YEAR FROM " + filter.getTableId() + "." + filter.getFieldName() + "), '-Q', EXTRACT(QUARTER FROM "
                            + filter.getTableId() + "." + filter.getFieldName() + "))";
                    String options = "'" + filter.getUserSelection().stream().collect(Collectors.joining("', '")) + "'";
                    where = field + excludeOperator + "IN (" + options + ")";
                } else if (filter.getTimeGrain().name().equals("YEARMONTH")) {
                    field = "FORMAT_DATE('%Y-%m', DATE(" + filter.getTableId() + "." + filter.getFieldName() + "))";
                    String options = "'" + filter.getUserSelection().stream().collect(Collectors.joining("', '")) + "'";
                    where = field + excludeOperator + "IN (" + options + ")";
                } else if (filter.getTimeGrain().name().equals("DATE")) {
                    field = "DATE(" + filter.getTableId() + "." + filter.getFieldName() + ")";
                    String options = "'" + filter.getUserSelection().stream().collect(Collectors.joining("', '")) + "'";
                    where = field + excludeOperator + "IN (" + options + ")";
                } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
                    field = "FORMAT_DATE('%A', DATE(" + filter.getTableId() + "." + filter.getFieldName() + "))";
                    String options = "'" + filter.getUserSelection().stream().collect(Collectors.joining("', '")) + "'";
                    where = field + excludeOperator + "IN (" + options + ")";
                } else if (filter.getTimeGrain().name().equals("DAYOFMONTH")) {
                    field = "EXTRACT(DAY FROM " + filter.getTableId() + "." + filter.getFieldName() + ")";
                    String options =  filter.getUserSelection().stream().collect(Collectors.joining(", "));
                    where = field + excludeOperator + "IN (" + options + ")";
                }
            }

            // SLIDER - numerical time grain match - eg., year = 2018
            else if (filter.getOperator().name().equals("EQUAL_TO")) {
                // slider can't take time grains like yearquarter & yearmonth
                // in that case give error
                if (List.of("MONTH", "QUARTER", "DAYOFWEEK", "YEAR", "DAYOFMONTH")
                        .contains(filter.getTimeGrain().name())) {
                field = "EXTRACT(" + timeGrainMap.get(filter.getTimeGrain().name()) + " FROM " + filter.getTableId() + "."
                    + filter.getFieldName() + ")";
                where = field + excludeOperator + "= " + filter.getUserSelection().get(0);
                }
                else if (List.of("DATE").contains(filter.getTimeGrain().name())){
                field = timeGrainMap.get(filter.getTimeGrain().name()) + "(" + filter.getTableId() + "."
                    + filter.getFieldName() + ")";
                where = field + excludeOperator + "= '" + filter.getUserSelection().get(0) + "'";
                } else {
                throw new BadRequestException("Error: Time grain is not correct for Comparsion Operator in the field "
                        + filter.getFieldName() + " in Filter!");
                }
            }
        }

        /*
         * SLIDER - Numerical value - COMPARISON OPERATOR
         */
        else if (List.of("GREATER_THAN", "GREATER_THAN_OR_EQUAL_TO", "LESS_THAN", "LESS_THAN_OR_EQUAL_TO", "BETWEEN")
                .contains(filter.getOperator().name())) {

            // slider can't take time grains like yearquarter & yearmonth
            // in that case give error
            if (List.of("YEAR", "MONTH", "QUARTER", "DAYOFMONTH", "DAYOFWEEK")
                    .contains(filter.getTimeGrain().name())) {
                field = "EXTRACT(" + timeGrainMap.get(filter.getTimeGrain().name()) + " FROM " + filter.getTableId() + "."
                    + filter.getFieldName() + ")";

                String excludeOperator = QueryNegator.makeNegateCondition(filter.getShouldExclude());

            // Between requires 2 values and other operators require just 1 value
                if (List.of("GREATER_THAN", "GREATER_THAN_OR_EQUAL_TO", "LESS_THAN", "LESS_THAN_OR_EQUAL_TO")
                    .contains(filter.getOperator().name())) {
                where = excludeOperator + field + comparisonOperator.get(filter.getOperator().name())
                        + filter.getUserSelection().get(0);
                } else if (filter.getOperator().name().equals("BETWEEN")) {
                if (filter.getUserSelection().size() > 1) {
                    where = excludeOperator + field + " BETWEEN " + filter.getUserSelection().get(0) + " AND "
                            + filter.getUserSelection().get(1);
                }
                // for between, throw error if 2 values are not given
                else {
                    throw new BadRequestException("Error: Between Operator needs two inputs for the field "
                            + filter.getFieldName() + " in Filter!");
                }
                }
            } else if (List.of("DATE").contains(filter.getTimeGrain().name())){
                field = timeGrainMap.get(filter.getTimeGrain().name()) + "(" + filter.getTableId() + "."
                    + filter.getFieldName() + ")";

                String excludeOperator = QueryNegator.makeNegateCondition(filter.getShouldExclude());
            
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
            } else {
                throw new BadRequestException("Error: Time grain is not correct for Comparsion Operator in the field "
                        + filter.getFieldName() + " in Filter!");
            }


        }

        return where;

    }

}
