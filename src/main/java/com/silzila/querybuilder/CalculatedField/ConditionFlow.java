package com.silzila.querybuilder.CalculatedField;

import java.util.List;
import java.util.Map;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.DatasetDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.ConditionFilter;
import com.silzila.payload.request.DataSchema;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Filter;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.WhereClause;
import com.silzila.querybuilder.CalculatedField.helper.CalculatedFieldProcessedSource;
import com.silzila.querybuilder.CalculatedField.helper.DataTypeChecker;



public class ConditionFlow {


    public static void processConditionalFlow(String vendorName,
                                        List<Flow> flows,
                                        Map<String, List<Flow>> flowMap,
                                        Map<String, FlowDTO> flowStringMap,
                                        Map<String, List<ConditionFilter>> conditionFilterMap,
                                        Map<String, String> conditionFilterStringMap,
                                        Map<String, Field> fields,
                                        String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap,DataSchema ds) throws BadRequestException {

            StringBuilder caseQuery = new StringBuilder("CASE ");

            for (Flow flow : flows) {
            if(flow.getSource().size()!=flow.getSourceType().size()){
                    throw new BadRequestException("Number of source and sourcetype should be equal");
            }
            if ("if".equals(flow.getCondition()) || "elseif".equals(flow.getCondition().toLowerCase()) ||  "ifelse".equals(flow.getCondition().toLowerCase())) {
            caseQuery.append("WHEN ").append(processConditionFilter(vendorName,conditionFilterMap, fields, flowMap, flowStringMap, conditionFilterStringMap, flow.getFilter(),calculatedFieldMap,ds)).append(" THEN ");
            appendSourceToQuery(vendorName,fields, flowStringMap, flow, caseQuery,calculatedFieldMap);
            } else if ("else".equals(flow.getCondition())) {
            caseQuery.append(" ELSE ");
            appendSourceToQuery(vendorName,fields, flowStringMap, flow, caseQuery,calculatedFieldMap);
            }
            }
            caseQuery.append(" END ");
            String result = caseQuery.toString();
            String resultDataType = DataTypeChecker.dataTypeChecker(flows, fields, flowStringMap);
            flowStringMap.put(flowKey, new FlowDTO(result,resultDataType,false));// temp - disable aggregation
    }

    // to process condition filter
    private static String processConditionFilter(String vendorName,Map<String, List<ConditionFilter>> conditionFilterMap,
                                             Map<String, Field> fields,
                                             Map<String, List<Flow>> flows,
                                             Map<String, FlowDTO> flowStringMap,
                                             Map<String, String> conditionFilterStringMap,
                                             String key,
                                             Map<String,CalculatedFieldDTO> calculatedFieldMap
                                             ,DataSchema ds) throws BadRequestException {
    if (conditionFilterMap == null || conditionFilterMap.isEmpty() || !conditionFilterMap.containsKey(key)) {
        return "";
    }

    StringBuilder conditionStringBuilder = new StringBuilder();
    List<ConditionFilter> conditionFilters = conditionFilterMap.get(key);

    for (ConditionFilter conditionFilter : conditionFilters) {
        List<Filter> filters = ConditionFilterToFilter.mapConditionFilterToFilter(
                conditionFilter.getConditions(), fields, flows, flowStringMap);

        String whereClause = WhereClause.filterPanelWhereString(
                filters, conditionFilter.getShouldAllConditionsMatch(), vendorName,ds);

        // Append this whereClause to the builder and add a separator if needed
        if (conditionStringBuilder.length() > 0) {
            conditionStringBuilder.append(" AND "); // or " OR " depending on logic
        }
        conditionStringBuilder.append(whereClause);

        // Store the computed string in the conditionFilterStringMap
        conditionFilterStringMap.put(key, conditionStringBuilder.toString());
    }

    return conditionStringBuilder.toString();
    }

    
    
    private static void appendSourceToQuery(String vendor,Map<String, Field> fields, Map<String, FlowDTO> flowStringMap, Flow flow, StringBuilder query,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
        String sourceType = flow.getSourceType().get(0);
        if ("field".equals(sourceType)) {
            Field field = fields.get(flow.getSource().get(0));
            if(field == null){
                throw new BadRequestException("No such a field with an id:" + flow.getSource().get(0));
            }
            query.append(field.getTableId()).append(".").append(field.getFieldName()).append(" ");
        } else if ("flow".equals(sourceType)) {
            String sourceFlowValue = flowStringMap.get(flow.getSource().get(0)).getFlow();
            if(sourceFlowValue == null || sourceFlowValue.isEmpty()){
                throw new BadRequestException("No such a flow with an id:" + flow.getSource().get(0));
            }
            query.append(sourceFlowValue).append(" ");
        }
        else if(sourceType.equals("text")){
            query.append("'").append(flow.getSource().get(0)).append("'").append(" ");
        }
        else if(sourceType.equals("date")){
            query.append(CalculatedFieldProcessedSource.castingToDate(vendor, flow.getSource().get(0)));
        } 
        else {
            query.append(flow.getSource().get(0)).append(" ");
        }
    }

   
    
}

