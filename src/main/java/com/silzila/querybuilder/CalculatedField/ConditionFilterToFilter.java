package com.silzila.querybuilder.CalculatedField;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Condition;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Filter;
import com.silzila.payload.request.Flow;
import com.silzila.payload.request.Filter.DataType;
import com.silzila.querybuilder.WhereClauseDateFactory;
import com.silzila.querybuilder.CalculatedField.helper.DataTypeProvider;

public class ConditionFilterToFilter {
    
    public static List<Filter>  mapConditionFilterToFilter(String vendorName,List<Condition> conditions, Map<String, Field> fields,Map<String, List<Flow>> flows,Map<String, FlowDTO> flowMap,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {

    List<Filter> filters = new ArrayList<>();

    conditions.forEach((condition) -> {
        Filter filter = new Filter();
        List<String> leftOperand = condition.getLeftOperand();
        List<String> leftOperandType = condition.getLeftOperandType();
        List<String> rightOperand = condition.getRightOperand();
        List<String> rightOperandType = condition.getRightOperandType();

        if(leftOperand.size()!=leftOperandType.size() || (rightOperand != null&&rightOperandType!=null && rightOperand.size() != rightOperandType.size())){
                    throw new BadRequestException("Number of source and sourcetype should be equal");        
        }

        if (leftOperandType.get(0).equals("field")) {
            setFieldFilter(leftOperand.get(0),condition.getTimeGrain(), filter, fields);
        } else if (leftOperandType.get(0).equals("flow")) {
            setFlowFilter(leftOperand.get(0),rightOperandType.get(0),condition.getTimeGrain(), filter, flowMap,fields,flows);
        } else if (leftOperand.get(0).equals("calculatedField")){
            setCalculatedFieldFilter(leftOperand.get(0),rightOperandType.get(0),condition.getTimeGrain(), filter, flowMap,fields,flows,calculatedFieldMap);
        }
        else {
            filter.setFieldName(leftOperand.get(0));
            filter.getConditionType().setLeftOperandType("static");
        }

        mapOperatorAndType(condition, filter);
        filter.setShouldExclude(condition.getShouldExclude());
        filter.setIsTillDate(condition.getIsTillDate());
        filter.setUserSelection(buildUserSelection(vendorName,filter,rightOperand, rightOperandType,leftOperand,leftOperandType,condition.getTimeGrain(),fields, flowMap,flows,calculatedFieldMap));

        filters.add(filter);
    });

    return filters;
}

private static void setFieldFilter(String leftOperand,String timeGrain, Filter filter, Map<String, Field> fields) {
    Field field = fields.get(leftOperand);
    filter.setTableId(field.getTableId());
    filter.setFieldName(field.getFieldName());
    filter.getConditionType().setLeftOperandType("field");
    filter.setDataType(Filter.DataType.fromValue(field.getDataType().value()));
    System.out.println("Filter timegrain  " + field.getTimeGrain());
    filter.setTimeGrain(Filter.TimeGrain.fromValue(timeGrain));
}


private static void setFlowFilter(String leftOperand,String rightOperandType,String timeGrain, Filter filter, Map<String, FlowDTO> flowMap, Map<String, Field> fields,Map<String, List<Flow>> flows) {
    String flow = rightOperandType.equals("field") && flowMap.get(leftOperand).getIsAggregated()? flowMap.get(leftOperand +"@").getFlow(): flowMap.get(leftOperand).getFlow() ;
    Flow flowType = flows.get(leftOperand).get(0);
    filter.setFieldName(flow);
    filter.setDataType(Filter.DataType.fromValue(DataTypeProvider.getDataType(flows, fields, flowType)));
    filter.setTimeGrain(Filter.TimeGrain.fromValue(timeGrain));
    filter.getConditionType().setLeftOperandType("flow");
    
}

private static void setCalculatedFieldFilter(String leftOperand,String rightOperandType,String timeGrain, Filter filter, Map<String, FlowDTO> flowMap, Map<String, Field> fields,Map<String, List<Flow>> flows,Map<String,CalculatedFieldDTO> calculatedFieldMap) {
    String calculatedField = (rightOperandType.equals("field") || rightOperandType.equals("flow")) && calculatedFieldMap.get(leftOperand).getIsAggregated()? calculatedFieldMap.get(leftOperand +"@").getQuery(): calculatedFieldMap.get(leftOperand).getQuery() ;
    CalculatedFieldDTO field = calculatedFieldMap.get(leftOperand);
    filter.setFieldName(calculatedField);
    filter.setDataType(Filter.DataType.fromValue(field.getDatatype()));
    filter.setTimeGrain(Filter.TimeGrain.fromValue(timeGrain));
    filter.getConditionType().setLeftOperandType("calculatedField");
}

private static void mapOperatorAndType(Condition condition, Filter filter) {
    String operator = condition.getOperator();
    if (operator.equals("relativeFilter")) {
        filter.setFilterType("relativeFilter");
        filter.setDataType(DataType.DATE);
        filter.setRelativeCondition(condition.getRelativeCondition());
        filter.setOperator(Filter.Operator.fromValue("between"));
    } else if (operator.equals("tillDate")) {
        filter.setFilterType("tillDate");
        filter.setDataType(DataType.DATE);
        filter.setIsTillDate(true);
        filter.setOperator(Filter.Operator.fromValue("in"));
    } else {
        filter.setFilterType("search");
        filter.setOperator(Filter.Operator.fromValue(operator));
    }
}

private static List<String> buildUserSelection(String vendorName,Filter filter,List<String> rightOperand, List<String> rightOperandType,List<String> leftOperand,List<String> leftOperAndType,String timeGrain, Map<String, Field> fields, Map<String, FlowDTO> flowMap,Map<String, List<Flow>> flows,Map<String,CalculatedFieldDTO> calculatedFieldMap) {
    List<String> userSelection = new ArrayList<>();
    if(rightOperand != null){
        for (int i = 0; i < rightOperand.size(); i++) {
            String rightOp = rightOperand.get(i);
            String rightOpType = rightOperandType.get(i);
            String selection = rightOp;
            if (rightOpType.equals("field")) {
                Field field = fields.get(rightOp);
                selection = field.getDataType().value().equals("date")?datePartExcecution(vendorName, timeGrain, field.getTableId() + "." + field.getFieldName()):field.getTableId() + "." + field.getFieldName();
                filter.getConditionType().setRightOperandType("field");
            } else if (rightOpType.equals("flow")) {
                FlowDTO flowDTO = flowMap.get(rightOp);
                String flow = leftOperAndType.get(0).equals("field") && flowDTO.getIsAggregated()
                                ? flowMap.get(rightOp + "@").getFlow()
                                : flowDTO.getFlow();
                if(leftOperAndType.get(0).equals("flow")){
                        flow = !getFieldListOfFlow(flows.get(leftOperand.get(0)).get(0), fields, flows).isEmpty() && flowDTO.getIsAggregated()  
                        ? flowMap.get(rightOp + "@").getFlow()
                        : flowDTO.getFlow();
                }
                selection = flowDTO.getDataType().equals("date")?datePartExcecution(vendorName, timeGrain, flow):flow;
                filter.getConditionType().setRightOperandType("flow");
            }
            else if (rightOpType.equals("calculatedField")) {
                CalculatedFieldDTO calculatedFieldDTO = calculatedFieldMap.get(rightOp);
                String calculatedField = List.of("field","flow").contains(leftOperAndType.get(0)) && calculatedFieldDTO.getIsAggregated() ? calculatedFieldMap.get(rightOp +"@").getQuery(): calculatedFieldDTO.getQuery();
                selection = calculatedFieldDTO.getDatatype().equals("date")?datePartExcecution(vendorName, timeGrain, calculatedField):calculatedField;
                filter.getConditionType().setRightOperandType("calculatedField");
            }         
            else {
                filter.getConditionType().setRightOperandType("static");
            }
            userSelection.add(selection);
        }
    }
    return userSelection;
}

// to get a flow id's
// private static Set<String> getTableIdsFromFlows(Map<String, List<Flow>> flowMap, Map<String, Field> fields) {
//     Set<String> tableIds = new HashSet<>();
//     Set<String> visitedFlows = new HashSet<>();

//     for (String flowKey : flowMap.keySet()) {
//         collectTableIdsFromFlow(flowKey, flowMap, tableIds, visitedFlows,fields);
//     }

//     return tableIds;
// }

// private static void collectTableIdsFromFlow(
//         String key,Map<String, List<Flow>> flowMap, 
//         Set<String> tableIds,Set<String> visitedFlows, Map<String, Field> fields) {

//     List<Flow> flows = flowMap.get(key);

//     if (flows == null || visitedFlows.contains(key)) {
//         return;
//     }

//     visitedFlows.add(key);

//     for (Flow flow : flows) {
//         for (int i = 0; i < flow.getSource().size(); i++) {
//             String sourceType = flow.getSourceType().get(i);
//             String source = flow.getSource().get(i);

//             if ("field".equals(sourceType)) {
//                 Field field = fields.get(source);
//                 tableIds.add(field.getTableId());
//             } else if ("flow".equals(sourceType)) {
//                 collectTableIdsFromFlow(source, flowMap, tableIds, visitedFlows,fields);
//             }
//         }
//     }
// }

private static List<Field> getFieldListOfFlow(Flow flow, Map<String, Field> fields, Map<String, List<Flow>> flowMap) {
    List<Field> fieldsOfFlow = new ArrayList<>();
    List<String> flowSource = flow.getSource();
    List<String> flowSourceType = flow.getSourceType();

    for (int i = 0; i < flowSource.size(); i++) {
        String sourceType = flowSourceType.get(i);
        String source = flowSource.get(i);

        if (sourceType.equals("field")) {
            Field field = fields.get(source);
            if (field != null) {
                fieldsOfFlow.add(field);
            }
        } else if (sourceType.equals("flow")) {
            List<Flow> subFlows = flowMap.get(source);
            if (subFlows != null && !subFlows.isEmpty()) {
                fieldsOfFlow.addAll(getFieldListOfFlow(subFlows.get(0), fields, flowMap));
            }
        }
    }

    return fieldsOfFlow;
}

private static String datePartExcecution(String vendorName,String timeGrain,String field){
   return WhereClauseDateFactory.buildDateExpression(vendorName).getDatePartExpression(timeGrain.toUpperCase(), field);
}

}
