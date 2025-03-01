package com.silzila.querybuilder.CalculatedField;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.DatasetDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.helper.ColumnListFromClause;
import com.silzila.helper.FieldNameProcessor;
import com.silzila.payload.request.CalculatedFieldRequest;
import com.silzila.payload.request.ConditionFilter;
import com.silzila.payload.request.DataSchema;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.RelationshipClauseGeneric;
import com.silzila.querybuilder.WhereClause;

@Component
public class CalculatedFieldQueryComposer {

    private final static List<String> basicMathOperations = List.of(
            "addition", "subtraction", "multiplication", "division",
            "ceiling", "floor", "absolute", "power", "min", "max",
            "log");

    private final static List<String> basicTextOperations = List.of(
            "concat", "propercase", "lowercase", "uppercase",
            "trim", "ltrim", "rtrim", "length", "substringright", "substringleft", "replace", "split");

    private final static List<String> basicDateOperations = List.of(
            "stringToDate", "addDateInterval", "dateInterval", "datePartName", "datePartNumber",
            "truncateDate", "currentDate", "currentTimestamp", "minDate", "maxDate");

    // to compose a multiple calculated fields(using of calculated field in other
    // calculated field)
    public static String calculatedFieldComposed(String vendorName, DataSchema ds,
            List<CalculatedFieldRequest> calculatedFieldRequests) throws BadRequestException {

        Map<String, CalculatedFieldDTO> calculatedFieldMap = new HashMap();

        String calculatedFieldId = "";

        for (CalculatedFieldRequest c : calculatedFieldRequests) {

            calculatedFieldId = c.getCalculatedFieldId();

            CalculatedFieldDTO calculatedField = calculatedFieldComposed(vendorName, ds, c, calculatedFieldMap);
            if (calculatedField.getIsAggregated()) {

                aggregatedCalculatedFieldQuery(ds, vendorName, c, calculatedField, calculatedFieldMap);
            }

            System.out.println("CalculatedFieldDTO " + calculatedField.toString());
            calculatedFieldMap.put(calculatedFieldId, new CalculatedFieldDTO(calculatedField.getQuery(),
                    calculatedField.getDatatype(), calculatedField.getIsAggregated()));
        }

        return calculatedFieldMap.get(calculatedFieldId).getQuery();

    }

    // if the calculated field is aggregated
    public static void aggregatedCalculatedFieldQuery(DataSchema ds, String vendorName,
            CalculatedFieldRequest calculatedFieldRequest,
            CalculatedFieldDTO calculatedFieldDTO, Map<String, CalculatedFieldDTO> calculatedFieldMap)
            throws BadRequestException {

        StringBuilder query = new StringBuilder();

        String fromClause = RelationshipClauseGeneric.buildRelationship(
                ColumnListFromClause.getColumnListFromFields(calculatedFieldRequest.getFields()),
                ds,
                vendorName);

        query.append("(SELECT ").append(calculatedFieldDTO.getQuery()).append(" FROM ").append(fromClause).append(" )");

        calculatedFieldMap.put(calculatedFieldRequest.getCalculatedFieldId() + "@",
                new CalculatedFieldDTO(query.toString(), "integer", true));
    }

    // to compose a multiple calculated fields(sample records)
    public String calculatedFieldsComposed(DataSchema ds, String vendorName,
            List<List<CalculatedFieldRequest>> calculatedFieldRequests) throws BadRequestException {
        StringBuilder calculatedFieldString = new StringBuilder();

        for (int i = 0; i < calculatedFieldRequests.size(); i++) {
            if (i > 0) {
                calculatedFieldString.append(" ,\n");
            } else {
                calculatedFieldString.append("\n");
            }
            calculatedFieldString
                    .append(calculatedFieldComposedWithAlias(vendorName, ds, calculatedFieldRequests.get(i)));
        }

        return calculatedFieldString.toString();
    }

    // to compose a calculated field without alias
    public static CalculatedFieldDTO calculatedFieldComposed(String vendorName, DataSchema ds,
            CalculatedFieldRequest calculatedFieldRequest, Map<String, CalculatedFieldDTO> calculatedFieldMap)
            throws BadRequestException {

        StringBuilder calculatedField = new StringBuilder();

        Map<String, Field> fields = calculatedFieldRequest.getFields();
        Map<String, List<ConditionFilter>> conditionFilterMap = calculatedFieldRequest.getConditionFilters() != null
                ? calculatedFieldRequest.getConditionFilters()
                : new HashMap<>();
        Map<String, List<Flow>> flowMap = calculatedFieldRequest.getFlows();

        Map<String, String> conditionFilterStringMap = new HashMap<>();
        Map<String, FlowDTO> flowStringMap = new HashMap();

        String flowKey = "";
        for (String key : flowMap.keySet()) {
            flowKey = key;
        }

        processFlows(ds, vendorName, flowMap, fields, flowStringMap, conditionFilterMap, conditionFilterStringMap,
                calculatedFieldMap);

        FlowDTO field = flowStringMap.get(flowKey);

        return new CalculatedFieldDTO(calculatedField.append(field.getFlow()).toString(), field.getDataType(),
                field.getIsAggregated());
    }

    // to compose a fields with alias
    public static String calculatedFieldComposedWithAlias(String vendorName, DataSchema ds,
            List<CalculatedFieldRequest> calculatedFieldRequests) throws BadRequestException {

        StringBuilder calculatedField = new StringBuilder();

        String formattedAliasName = FieldNameProcessor.formatFieldName(
                calculatedFieldRequests.get(calculatedFieldRequests.size() - 1).getCalculatedFieldName());

        return calculatedField.append(" (").append(calculatedFieldComposed(vendorName, ds, calculatedFieldRequests))
                .append(") AS ").append(formattedAliasName).toString();
    }

    // composing a query to get sample records of calculated field
    public static String composeSampleRecordQuery(DataSchema ds, String vendorName,
            List<CalculatedFieldRequest> calculatedFieldRequests,
            DataSchema dataSchema, Integer recordCount) throws BadRequestException {

        if (recordCount == null || recordCount == 0 || recordCount > 100) {
            recordCount = 100;
        }

        Set<String> allColumnList = new HashSet<>();

        for (CalculatedFieldRequest calculatedFieldRequest : calculatedFieldRequests) {
            if (!calculatedFieldRequest.getFields().isEmpty()) {
                List<String> fieldIds = ColumnListFromClause
                        .getColumnListFromFields(calculatedFieldRequest.getFields());
                allColumnList.addAll(fieldIds);
            }
        }

        String selectField = calculatedFieldComposedWithAlias(vendorName, ds, calculatedFieldRequests);

        QueryBuilder queryBuilder = QueryBuilderFactory.getQueryBuilder(vendorName);

        return queryBuilder.composeSampleRecordQuery(selectField, allColumnList, dataSchema, recordCount);

    }

    // to get distinct records
     public String composeFilterOptionsQuery(DataSchema ds,String vendorName, List<CalculatedFieldRequest> calculatedFieldRequests,
            DataSchema dataSchema) throws BadRequestException {
        StringBuilder query = new StringBuilder("SELECT DISTINCT \n\t");

        query.append(calculatedFieldComposedWithAlias(vendorName,ds, calculatedFieldRequests));

        Set<String> allColumnList = new HashSet<>();

        for (CalculatedFieldRequest calculatedFieldRequest : calculatedFieldRequests) {
            if (!calculatedFieldRequest.getFields().isEmpty()) {
                List<String> fieldIds = ColumnListFromClause
                        .getColumnListFromFields(calculatedFieldRequest.getFields());
                allColumnList.addAll(fieldIds);
            }
        }

        if(ds.getFilterPanels().size()>0){
            List<String> filterTableIds = ColumnListFromClause.getColumnListFromFilterPanels(ds.getFilterPanels());
            allColumnList.addAll(filterTableIds);
        }

        if (((!allColumnList.isEmpty() && allColumnList.size() != 0))) {
            String fromClause = RelationshipClauseGeneric.buildRelationship(new ArrayList<>(allColumnList), dataSchema, vendorName);
            query.append("\nFROM ").append(fromClause);
            if(dataSchema.getFilterPanels().size() > 0){ 

                String whereClause = WhereClause.buildWhereClause(dataSchema.getFilterPanels(), vendorName , dataSchema);

                query.append(whereClause);
            }
        }

        // order by the first column
        query.append(" ORDER BY 1");

        // xxplicitly specify ascending order if not Amazon Athena
        if (vendorName != null && !"amazonathena".equalsIgnoreCase(vendorName)) {
            query.append(" ASC");
        }

        return query.toString();
    }

    // to process flows
    private static void processFlows(DataSchema ds, String vendorName, Map<String, List<Flow>> flowMap,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, List<ConditionFilter>> conditionFilterMap,
            Map<String, String> conditionFilterStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
        for (Map.Entry<String, List<Flow>> entry : flowMap.entrySet()) {
            String flowKey = entry.getKey();
            List<Flow> flows = entry.getValue();
            Flow firstFlow = flows.get(0);

            if (firstFlow.getSource().size() != firstFlow.getSourceType().size()) {
                throw new BadRequestException("Number of source and sourcetype should be equal");
            }

            QueryBuilder queryBuilder = QueryBuilderFactory.getQueryBuilder(vendorName);
            System.out.println(queryBuilder);

            if (firstFlow.getCondition() != null) {
                queryBuilder.processConditionalFlow(flows, flowMap, flowStringMap, conditionFilterMap,
                        conditionFilterStringMap, fields, flowKey, calculatedFieldMap, ds);

            } else if (basicMathOperations.contains(firstFlow.getFlow())
                    || (firstFlow.getFlow().equals("none") && firstFlow.getIsAggregation())) {// aggregation only allow
                                                                                              // for math operation

                queryBuilder.processNonConditionalMathFlow(ds, firstFlow,
                        fields, flowStringMap, flowKey, calculatedFieldMap);

            } else if (basicTextOperations.contains(firstFlow.getFlow())) {
                queryBuilder.processNonConditionalTextFlow(firstFlow, fields, flowStringMap, flowKey,
                        calculatedFieldMap);

            } else if (basicDateOperations.contains(firstFlow.getFlow())) {
                queryBuilder.processNonConditionalDateFlow(firstFlow, fields, flowStringMap, flowKey,
                        calculatedFieldMap);

            } else {
                throw new BadRequestException("Invalid flow");
            }
        }
    }

}
