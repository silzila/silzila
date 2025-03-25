package com.silzila.querybuilder;

import com.silzila.exception.BadRequestException;
import com.silzila.helper.OptionsBuilder;
import com.silzila.helper.QueryNegator;
import com.silzila.payload.request.Filter;

import java.util.List;
import java.util.Map;

public class WhereClauseDateTeraData implements WhereClauseDate{

    public String buildWhereClauseDate(Filter filter) throws BadRequestException {
        // MAP of request time grain to date function parameter in Postgres
        Map<String, String> timeGrainMap = Map.of("YEAR", "YEAR", "MONTH", "MONTH", "QUARTER", "QUARTER",
                "DAYOFWEEK", "WEEKDAY", "DAYOFMONTH", "DAY");
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
                    field = "CAST(" +whereField + " AS DATE)";
                } else if (filter.getTimeGrain().name().equals("YEAR")) {
                    field = "CAST(EXTRACT(" + timeGrainMap.get(filter.getTimeGrain().name()) + " FROM "
                            + whereField + ") AS INT)";
                } else if (filter.getTimeGrain().name().equals("MONTH")) {
                    field = "CAST(EXTRACT(" + timeGrainMap.get(filter.getTimeGrain().name()) + " FROM "
                            + whereField + ") AS INT)";
                } else if (filter.getTimeGrain().name().equals("DAYOFMONTH")) {
                    field = "CAST(TD_DAY_OF_MONTH(" +whereField+ ") AS INT)";
                } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
                    field = "CAST(TD_DAY_OF_WEEK(" + whereField+ ") AS INT)";
                } else if (filter.getTimeGrain().name().equals("QUARTER")) {
                    field = "CAST(TD_QUARTER_OF_YEAR(" +whereField
                            + ") AS INT)";
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
                throw new BadRequestException("Error: Time grain is not correct for Comparison Operator in the field "
                        + filter.getFieldName() + " in Filter!");
            }

            if (filter.getTimeGrain().name().equals("DATE")) {
                field = "CAST(" + whereField + " AS DATE)";
            } else if (filter.getTimeGrain().name().equals("YEAR")) {
                field = "CAST(EXTRACT(" + timeGrainMap.get(filter.getTimeGrain().name()) + " FROM "
                        +whereField+ ") AS INT)";
            } else if (filter.getTimeGrain().name().equals("MONTH")) {
                field = "CAST(EXTRACT(" + timeGrainMap.get(filter.getTimeGrain().name()) + " FROM "
                        + whereField+ ") AS INT)";
            } else if (filter.getTimeGrain().name().equals("DAYOFMONTH")) {
                field = "CAST(TD_DAY_OF_MONTH(" +whereField + ") AS INT)";
            } else if (filter.getTimeGrain().name().equals("DAYOFWEEK")) {
                field = "CAST(TD_DAY_OF_WEEK(" + whereField+ ") AS INT)";
            } else if (filter.getTimeGrain().name().equals("QUARTER")) {
                field = "CAST(TD_QUARTER_OF_YEAR(" +whereField + ") AS INT)";
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
        where = "(\n\t\t" + where + TillDate.tillDate("teradata", filter,whereField) + "\n\t\t)";
            if(shouldExcludeTillDate){
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
            dateExpression = "CONCAT('Q', LTRIM(TD_QUARTER_OF_YEAR( " + columnName
                    + ")))";
        } else if (timeGrain.equals("MONTH")) {
            dateExpression = "case MONTH(" +columnName+ ")\n" +
                    "    when '01' then 'January'\n" +
                    "    when '02' then 'February'\n" +
                    "    when '03' then 'March'\n" +
                    "    when '04' then 'April'\n" +
                    "    when '05' then 'May'\n" +
                    "    when '06' then 'June'\n" +
                    "    when '07' then 'July'\n" +
                    "    when '08' then 'August'\n" +
                    "    when '09' then 'September'\n" +
                    "    when '10' then 'October'\n" +
                    "    when '11' then 'November'\n" +
                    "    when '12' then 'December'\n" +
                    "    else ''\n" +
                    "    end";
        } else if (timeGrain.equals("YEARQUARTER")) {
            dateExpression = "CONCAT( LTRIM(YEAR(" + columnName
                    + ")), '-Q', LTRIM(TD_QUARTER_OF_YEAR( " + columnName
                    + ")))";
        } else if (timeGrain.equals("YEARMONTH")) {
            dateExpression = "CONCAT(LTRIM(YEAR(" + columnName
                    + ")),'-',LTRIM(MONTH(" +columnName
                    + ")(format '99')))";
        } else if (timeGrain.equals("DATE")) {
            dateExpression = "(" + columnName + ")";
        } else if (timeGrain.equals("DAYOFWEEK")) {
            dateExpression = "case  TD_DAY_OF_WEEK(" + columnName + ")\n" +
                    "\t\twhen 1 then 'Sunday'\n" +
                    "\t\twhen 2 then 'Monday'\n" +
                    "\t\twhen 3 then 'Tuesday'\n" +
                    "\t\twhen 4 then 'Wednesday'\n" +
                    "\t\twhen 5 then 'Thursday'\n" +
                    "\t\twhen 6 then 'Friday'\n" +
                    "\t\twhen 7 then 'Saturday'\n" +
                    "\t\tend";
        } else if (timeGrain.equals("DAYOFMONTH")) {
            dateExpression = "MONTH(" +columnName + ")";
        }

        return dateExpression;
    }
}
