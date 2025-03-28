package com.silzila.querybuilder;

import com.silzila.dto.DatasetDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.helper.OptionsBuilder;
import com.silzila.helper.QueryNegator;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import com.silzila.payload.request.DataSchema;
import com.silzila.payload.request.Filter;
import com.silzila.payload.request.FilterPanel;
// import com.silzila.querybuilder.WhereClauseDatePostgres;
import com.silzila.querybuilder.CalculatedField.CalculatedFieldQueryComposer;
import com.silzila.querybuilder.CalculatedField.helper.DataTypeProvider;

// to build where clause in Query construction
public class WhereClause {

    /*
     * function to construct where clause of query
     * Where clause is optional - there may be Query without Where condition.
     * "WHERE" key word should be kept only if there is Where condition expression.
     * it is Dialect specific and each dialect is handled as separate sections below
     */
    public static String buildWhereClause(List<FilterPanel> filterPanels, String vendorName,DataSchema ds)
            throws BadRequestException {

        String whereClause = "";

        List<String> wherePanelList = new ArrayList<>();

        // iterate filter panels to get individual filter panel
        for (int i = 0; i < filterPanels.size(); i++) {

            FilterPanel filterPanel = filterPanels.get(i);

            String singlePanelWhereString = filterPanelWhereString(filterPanel.getFilters(), filterPanel.getShouldAllConditionsMatch(), vendorName,ds);

            wherePanelList.add(singlePanelWhereString);

        }

        // COMBINING MULTIPLE Filter Panels
        // will be always joined by AND condition
        if (wherePanelList.size() > 0) {
            whereClause = "\nWHERE\n\t" + wherePanelList.stream().collect(Collectors.joining(" AND\n\t"));
        }

        return whereClause;

    }
    
    // to handle each filterpanel
    public static String filterPanelWhereString (List<Filter> filters,Boolean allConditionMatch, String vendorName,DataSchema ds) throws BadRequestException{

        // comparsion operator name to symbol mapping
        Map<String, String> comparisonOperatorMap = Map.of("GREATER_THAN", " > ", "LESS_THAN", " < ",
                "GREATER_THAN_OR_EQUAL_TO", " >= ",
                "LESS_THAN_OR_EQUAL_TO", " <= ");

        List<String> whereList = new ArrayList<>();

        for (int j = 0; j < filters.size(); j++) {

            // holds individual column filter condition
            String where = "";
            // individual filter column
            Filter filter = filters.get(j);
            // System.out.println("Filter =========== " + filter.toString());

            CalculatedFieldQueryComposer calculatedFieldQueryComposer = new CalculatedFieldQueryComposer();
            String field = filter.getIsCalculatedField() 
                            ? calculatedFieldQueryComposer.calculatedFieldComposed(vendorName,ds,filter.getCalculatedField()) 
                            : ("field".equals(filter.getConditionType().getLeftOperandType())
                                ? filter.getTableId() + "." + filter.getFieldName() 
                                : filter.getFieldName());

            if (filter.getIsCalculatedField()) {
                    filter.setDataType(Filter .DataType.fromValue(
                    DataTypeProvider.getCalculatedFieldDataTypes(filter.getCalculatedField())
                ));
                }

            // check if Negative match or Positive match
            String excludeSymbol = QueryNegator.makeNagateExpression(filter.getShouldExclude(),
                    filter.getOperator().name());
            String excludeOperator = QueryNegator.makeNegateCondition(filter.getShouldExclude());

            // NUll, not to particular datatype and in user selection only null is selected
            if (filter.getOperator().name().equals("BLANK") || 
                (filter.getOperator().name().equals("IN") && 
                filter.getUserSelection().size() == 1 && 
                (filter.getUserSelection().get(0) == null || "null".equals(filter.getUserSelection().get(0))))) {
                
                where = field + " IS " + excludeOperator + "NULL";
            }

            /*
             * TEXT Data Type
             */
            else if (filter.getDataType().name().equals("TEXT")) {
                // single value exact match
                if (filter.getOperator().name().equals("EQUAL_TO") || filter.getOperator().name().equals("EXACT_MATCH") ) {
                    // System.out.println("----------- Text EQUAL_TO");
                    where = field + excludeSymbol + "= '"
                            + filter.getUserSelection().get(0) + "'" ;

                }
                // multiple values (any one value) exact match
                else if (filter.getOperator().name().equals("IN")) {
                    // System.out.println("----------- Text IN");
                    String options = "";
                    options = OptionsBuilder.buildStringOptions(filter.getUserSelection());
                    String nullCondition = NullClauseGenerator.generateNullCheckQuery(filter, excludeOperator);
                    where = field + excludeSymbol + "IN (" + options
                            + ")" + nullCondition ;
                }
                // Wildcard - begins with a particular string
                else if (filter.getOperator().name().equals("BEGINS_WITH")) {
                    where = excludeOperator + field + " LIKE '"
                            + filter.getUserSelection().get(0) + "%'" ;

                }
                // Wildcard - ends with a particular string
                else if (filter.getOperator().name().equals("ENDS_WITH")) {
                    where = excludeOperator + field + " LIKE '"
                            + "%" + filter.getUserSelection().get(0) + "'";

                }
                // Wildcard - contains a particular string
                else if (filter.getOperator().name().equals("CONTAINS")) {
                    where = excludeOperator + field + " LIKE '"
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
                    where = field + excludeSymbol + "= "
                            + filter.getUserSelection().get(0);

                }
                else if (filter.getOperator().name().equals("NOT_EQUAL_TO")) {
                    where = field + excludeSymbol + "= "
                            + filter.getUserSelection().get(0);
                }
                // multiple values (any one value) exact match
                else if (filter.getOperator().name().equals("IN")) {
                    String options = "";
                    String nullCondition = NullClauseGenerator.generateNullCheckQuery(filter,excludeOperator);
                    options = OptionsBuilder.buildIntegerOptions(filter.getUserSelection());
                    where = field + excludeSymbol + "IN (" + options
                            + ")" + nullCondition;
                }
                // the following comparison matches are for NUMBERS only
                else if (List.of("INTEGER", "DECIMAL").contains(filter.getDataType().name())) {
                    // BETWEEN
                    if (filter.getOperator().name().equals("BETWEEN")) {
                        if (filter.getUserSelection().size() > 1) {

                            where = excludeOperator + field
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
                        where = excludeOperator + field + operatorSymbol
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
                if (filter.getFilterType().equals("tillDate")) {
                    where = TillDate.tillDate(vendorName, filter,field);
                } else {
                    if(filter.getIsCalculatedField()){
                        filter.setFieldName(field);
                    }
                    where = WhereClauseDateFactory.buildDateExpression(vendorName).buildWhereClauseDate(filter);

                }
            }

            whereList.add(where);

        }
        /*
         * one filter panel may contain multiple condtions and
         * are joined by 'AND' or 'OR' based on user preference
         */
        String panelAllConditionMatchOperator = " AND";
        if (!allConditionMatch) {
            panelAllConditionMatchOperator = " OR";
        }
        // SINGLE PANEL Conditions
        String singlePanelWhereString = "(\n\t\t"
                + whereList.stream().collect(Collectors.joining(panelAllConditionMatchOperator + "\n\t\t"))
                + "\n\t)";

        System.out.println("query " + singlePanelWhereString);

        return singlePanelWhereString;
    }


}