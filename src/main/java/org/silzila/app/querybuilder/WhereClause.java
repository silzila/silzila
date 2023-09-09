package org.silzila.app.querybuilder;

import org.silzila.app.exception.BadRequestException;
import org.silzila.app.helper.QueryNegator;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.silzila.app.payload.request.Filter;
import org.silzila.app.payload.request.FilterPanel;
// import org.silzila.app.querybuilder.WhereClauseDatePostgres;

// to build where clause in Query construction
public class WhereClause {

    /*
     * function to construct where clause of query
     * Where clause is optional - there may be Query without Where condition.
     * "WHERE" key word should be kept only if there is Where condition expression.
     * it is Dialect specific and each dialect is handled as separate sections below
     */
    public static String buildWhereClause(List<FilterPanel> filterPanels, String vendorName)
            throws BadRequestException {

        String whereClause = "";

        List<String> wherePanelList = new ArrayList<>();

        // comparsion operator name to symbol mapping
        Map<String, String> comparisonOperatorMap = Map.of("GREATER_THAN", " > ", "LESS_THAN", " < ",
                "GREATER_THAN_OR_EQUAL_TO", " >= ",
                "LESS_THAN_OR_EQUAL_TO", " <= ");

        // iterate filter panels to get individual filter panel
        for (int i = 0; i < filterPanels.size(); i++) {

            List<String> whereList = new ArrayList<>();

            // iterate filter panel to get individual filter
            for (int j = 0; j < filterPanels.get(i).getFilters().size(); j++) {

                // holds individual column filter condition
                String where = "";
                // individual filter column
                Filter filter = filterPanels.get(i).getFilters().get(j);
                // System.out.println("Filter =========== " + filter.toString());

                // check if Negative match or Positive match
                String excludeSymbol = QueryNegator.makeNagateExpression(filter.getShouldExclude(),
                        filter.getOperator().name());
                String excludeOperator = QueryNegator.makeNegateCondition(filter.getShouldExclude());

                /*
                 * TEXT Data Type
                 */
                if (filter.getDataType().name().equals("TEXT")) {
                    // single value exact match
                    if (filter.getOperator().name().equals("EQUAL_TO")) {
                        // System.out.println("----------- Text EQUAL_TO");
                        where = filter.getTableId() + "." + filter.getFieldName() + excludeSymbol + "= '"
                                + filter.getUserSelection().get(0) + "'";

                    }
                    // multiple values (any one value) exact match
                    else if (filter.getOperator().name().equals("IN")) {
                        // System.out.println("----------- Text IN");
                        String options = "";
                        options = "'" + filter.getUserSelection().stream().collect(Collectors.joining("', '")) + "'";
                        where = filter.getTableId() + "." + filter.getFieldName() + excludeSymbol + "IN (" + options
                                + ")";
                    }
                    // Wildcard - begins with a particular string
                    else if (filter.getOperator().name().equals("BEGINS_WITH")) {
                        where = excludeOperator + filter.getTableId() + "." + filter.getFieldName() + " LIKE '"
                                + filter.getUserSelection().get(0) + "%'";

                    }
                    // Wildcard - ends with a particular string
                    else if (filter.getOperator().name().equals("ENDS_WITH")) {
                        where = excludeOperator + filter.getTableId() + "." + filter.getFieldName() + " LIKE '"
                                + "%" + filter.getUserSelection().get(0) + "'";

                    }
                    // Wildcard - contains a particular string
                    else if (filter.getOperator().name().equals("CONTAINS")) {
                        where = excludeOperator + filter.getTableId() + "." + filter.getFieldName() + " LIKE '"
                                + "%" + filter.getUserSelection().get(0) + "%'";
                    }
                    // throw error for non compatable opertor for TEXT field
                    else {
                        throw new BadRequestException("Error: Operator " + filter.getOperator().name()
                                + " is not correct for the Text field! " + filter.getFieldName());
                    }

                }
                /*
                 * BOOLEAN & NUMBERS Data Type
                 */
                else if (List.of("INTEGER", "DECIMAL", "BOOLEAN").contains(filter.getDataType().name())) {
                    // single value exact match
                    if (filter.getOperator().name().equals("EQUAL_TO")) {
                        where = filter.getTableId() + "." + filter.getFieldName() + excludeSymbol + "= "
                                + filter.getUserSelection().get(0);

                    }
                    // multiple values (any one value) exact match
                    else if (filter.getOperator().name().equals("IN")) {
                        String options = "";
                        options = filter.getUserSelection().stream().collect(Collectors.joining(", "));
                        where = filter.getTableId() + "." + filter.getFieldName() + excludeSymbol + "IN (" + options
                                + ")";
                    }
                    // the following comparison matches are for NUMBERS only
                    else if (List.of("INTEGER", "DECIMAL").contains(filter.getDataType().name())) {
                        // BETWEEN
                        if (filter.getOperator().name().equals("BETWEEN")) {
                            if (filter.getUserSelection().size() > 1) {

                                where = excludeOperator + filter.getTableId() + "." + filter.getFieldName()
                                        + " BETWEEN "
                                        + filter.getUserSelection().get(0) + " AND " + filter.getUserSelection().get(1);
                            }
                            // Between requires 2 values (upperr & lower bound). otherwise throw error
                            else {
                                throw new BadRequestException(
                                        "Error: Between Operator needs more than one value for the field! "
                                                + filter.getFieldName());
                            }
                        }
                        // except BETWEEN
                        else if (List
                                .of("GREATER_THAN", "GREATER_THAN_OR_EQUAL_TO", "LESS_THAN", "LESS_THAN_OR_EQUAL_TO")
                                .contains(filter.getOperator().name())) {
                            String operatorSymbol = comparisonOperatorMap.get(filter.getOperator().name());
                            where = excludeOperator + filter.getTableId() + "." + filter.getFieldName() + operatorSymbol
                                    + filter.getUserSelection().get(0);

                        }
                        // throw error for any other operator for NUMBER fields
                        else {
                            throw new BadRequestException("Error: Operator " + filter.getOperator().name()
                                    + " is not correct for the Number field! " + filter.getFieldName());
                        }

                    }
                }

                /*
                 * DATE & TIMESTAMP Data Type
                 * Date fields filter query differs vary across SQL Dialects.
                 * Each dialect is handled at different file
                 */
                else if (List.of("DATE", "TIMESTAMP").contains(filter.getDataType().name())) {

                    // throw error if time grain is not supplied
                    if (Objects.isNull(filter.getTimeGrain())) {
                        throw new BadRequestException("Error: Time Grain is not provided for the field "
                                + filter.getFieldName() + " in Filter!");

                    }

                    // Calling Dialect specific methods
                    if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
                        where = WhereClauseDatePostgres.buildWhereClauseDate(filter);
                    } else if (vendorName.equals("mysql") || vendorName.equals("duckdb")) {
                        where = WhereClauseDateMysql.buildWhereClauseDate(filter);
                    } else if (vendorName.equals("sqlserver")) {
                        where = WhereClauseDateSqlserver.buildWhereClauseDate(filter);
                    } else if (vendorName.equals("databricks")) {
                        where = WhereClauseDateDatabricks.buildWhereClauseDate(filter);
                    }
                }

                whereList.add(where);

            }
            /*
             * one filter panel may contain multiple condtions and
             * are joined by 'AND' or 'OR' based on user preference
             */
            String panelAllConditionMatchOperator = " AND";
            if (!filterPanels.get(i).getShouldAllConditionsMatch()) {
                panelAllConditionMatchOperator = " OR";
            }
            // SINGLE PANEL Conditions
            String singlePanelWhereString = "(\n\t\t"
                    + whereList.stream().collect(Collectors.joining(panelAllConditionMatchOperator + "\n\t\t"))
                    + "\n\t)";

            wherePanelList.add(singlePanelWhereString);

        }

        // COMBINING MULTIPLE Filter Panels
        // will be always joined by AND condition
        if (wherePanelList.size() > 0) {
            whereClause = "\nWHERE\n\t" + wherePanelList.stream().collect(Collectors.joining(" AND\n\t"));
        }

        return whereClause;

    }

}
