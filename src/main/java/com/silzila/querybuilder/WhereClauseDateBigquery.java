package com.silzila.querybuilder;

import java.util.List;
import java.util.Map;


import com.silzila.payload.request.Filter;
import com.silzila.exception.BadRequestException;
import com.silzila.helper.OptionsBuilder;
import com.silzila.helper.QueryNegator;

public class WhereClauseDateBigquery implements WhereClauseDate {
    public  String buildWhereClauseDate(Filter filter) throws BadRequestException {
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

        if(filter.getIsTillDate() && filter.getShouldExclude()){
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

                String options = List.of("YEAR","DAYOFMONTH").contains(filter.getTimeGrain().name())?
                OptionsBuilder.buildIntegerOptions(filter.getUserSelection()):
                OptionsBuilder.buildStringOptions(filter.getUserSelection()); 


            field = getDatePartExpression(filter.getTimeGrain().name(), whereField);
                
                String nullCondition = NullClauseGenerator.generateNullCheckQuery(filter, excludeOperator);
                where = field + excludeOperator + "IN (" + options + ")" + nullCondition;
                
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
                where = OptionsBuilder.buildSingleOption(filter, excludeOperator, field, comparisonOperator);
                } else if (filter.getOperator().name().equals("BETWEEN")) {
                if (filter.getUserSelection().size() > 1) {
                    where = OptionsBuilder.buildSingleOption(filter, excludeOperator, field, comparisonOperator);
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
        //tillDate
        if(filter.getIsTillDate() && List.of("MONTH","DAYOFMONTH","YEARMONTH","YEAR","DAYOFWEEK","QUARTER","YEARQUARTER").contains(filter.getTimeGrain().name())){
            where = "(\n\t\t" + where + TillDate.tillDate("bigquery", filter,whereField) + "\n\t\t)";
            if(shouldExcludeTillDate){
                where = " NOT " + where;
            }
        }
        return where;

    }
    public String getDatePartExpression(String timeGrain, String columnName){
        String dateExpression = "";
        
        if (timeGrain.equals("YEAR")) {
            dateExpression = "EXTRACT(YEAR FROM " +columnName + ")";                    
        } else if (timeGrain.equals("QUARTER")) {
            dateExpression = "CONCAT('Q', EXTRACT(QUARTER FROM " +columnName + "))";                   
        } else if (timeGrain.equals("MONTH")) {
            dateExpression = "FORMAT_DATE('%B', DATE(" + columnName + "))";  
        } else if (timeGrain.equals("YEARQUARTER")) {
            dateExpression = "CONCAT(EXTRACT(YEAR FROM " + columnName+ "), '-Q', EXTRACT(QUARTER FROM "
                    +columnName + "))"; 
        } else if (timeGrain.equals("YEARMONTH")) {
            dateExpression = "FORMAT_DATE('%Y-%m', DATE(" +columnName + "))"; 
        } else if (timeGrain.equals("DATE")) {
            dateExpression = "DATE(" + columnName + ")";                  
        } else if (timeGrain.equals("DAYOFWEEK")) {
            dateExpression = "FORMAT_DATE('%A', DATE(" +columnName + "))";   
        }else if (timeGrain.equals("DAYOFMONTH")) {
            dateExpression = "EXTRACT(DAY FROM " + columnName+ ")"; 
        }

        return dateExpression;
    }


}
