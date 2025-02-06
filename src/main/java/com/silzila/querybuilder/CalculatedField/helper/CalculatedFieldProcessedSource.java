package com.silzila.querybuilder.CalculatedField.helper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.helper.ColumnListFromClause;
import com.silzila.payload.request.DataSchema;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.RelationshipClauseGeneric;


public class CalculatedFieldProcessedSource {

    public static String getMathProcessedSource(String source, String sourceType,
                                             Map<String, Field> fields, Map<String, FlowDTO> flowStringMap, 
                                             Flow flow, int index, String flowKey,
                                             Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
    String processedSource = "";

    String sourceKey = "";

        switch (sourceType) {
            case "field":
                Field field = fields.get(source);
                if (field == null) {
                    throw new BadRequestException("No such field with id: " + flow.getSource().get(0));
                }
                if (field.getDataType() != Field.DataType.fromValue("integer") && 
                    field.getDataType() != Field.DataType.fromValue("decimal")) {
                    throw new BadRequestException("Only integer and decimal datatypes are allowed: " + source);
                }
                processedSource = field.getTableId() + "." + field.getFieldName();
                break;

            case "flow":
                sourceKey = (flow.getSourceType().contains("field") || flow.getSourceType().contains("flow")) 
                                    && flowStringMap.get(source).getIsAggregated() ? source + "@" : source;
                String sourceFlowValue = Optional.ofNullable(flowStringMap.get(sourceKey).getFlow())
                                                .orElse(flowStringMap.get(source).getFlow());
                if (sourceFlowValue == null || sourceFlowValue.isEmpty()) {
                    throw new BadRequestException("No such flow with id: " + source);
                }
                processedSource = "(" + sourceFlowValue + ")";
                break;
            case "calculatedField":
                sourceKey = (flow.getSourceType().contains("field") || flow.getSourceType().contains("flow") || flow.getSourceType().contains("calculatedField")) 
                && calculatedFieldMap.get(source).getIsAggregated() ? source + "@" : source;
                sourceFlowValue = Optional.ofNullable(calculatedFieldMap.get(sourceKey).getQuery())
                                                .orElse(calculatedFieldMap.get(source).getQuery());
                                            
                if (sourceFlowValue == null || sourceFlowValue.isEmpty()) {
                    throw new BadRequestException("No such flow with id: " + source);
                }
                processedSource = "(" + sourceFlowValue + ")";
                break;

            case "integer":
            case "decimal":
                if (!source.matches("^-?\\d+(\\.\\d+)?$")) {
                    throw new BadRequestException("Only integer and decimal values are allowed: " + source);
                }
                processedSource = source;
                break;

            default:
                throw new BadRequestException("Unsupported source type: " + sourceType);
        }

        if (flow.getIsAggregation() && List.of("flow", "field").contains(sourceType)) {
            processedSource = CalculatedFieldAggregation.buildAggregationExpression(flow.getAggregation().get(index), processedSource);
        }

        return processedSource;
    }

    public static List<String>  processTextSources(Flow firstFlow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
        List<String> source = firstFlow.getSource();
        List<String> sourceType = firstFlow.getSourceType();
        List<String> resultString = new ArrayList<>();
    
        for (int i = 0; i < source.size(); i++) {
            String sourceElement = source.get(i);
            String type = sourceType.get(i);
    
            if ("field".equals(type)) {
                Field field = fields.get(sourceElement);
            if(field==null){
                throw new BadRequestException("No such a field with an id:" + sourceElement);
            }
                resultString.add(field.getTableId() + "." + field.getFieldName());
            } else if ("flow".equals(type)) {
                String sourceFlowValue = flowStringMap.get(sourceElement).getFlow();
            if(sourceFlowValue == null || sourceFlowValue.isEmpty()){
                throw new BadRequestException("No such a flow with an id:" + sourceElement);
            }
            resultString.add("(" + sourceFlowValue + ")");
            } 
            else if("calculatedField".equals(type)){
            String sourceFlowValue = calculatedFieldMap.get(sourceElement).getQuery();
                                        
            if (sourceFlowValue == null || sourceFlowValue.isEmpty()) {
                throw new BadRequestException("No such flow with id: " + source);
            }
            resultString.add("(" + sourceFlowValue + ")");
            break;

            }
            else {

                resultString.add("'"+sourceElement+"'");
            }
        }
    
        return resultString;
    }

    // to process a date sources
    public static List<String> processDateSources(String vendor,Flow firstFlow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
        List<String> source = firstFlow.getSource();
        List<String> sourceType = firstFlow.getSourceType();
        List<String> resultString = new ArrayList<>();
    
        for (int i = 0; i < source.size(); i++) {
            String sourceElement = source.get(i);
            String type = sourceType.get(i);

            System.out.println("sourceElement " + sourceElement);
            System.out.println("type " + type);
    
            if ("field".equals(type)) {
                Field field = fields.get(sourceElement);
                if(field==null){
                    throw new BadRequestException("No such a field with an id:" + sourceElement);
                }
                resultString.add(field.getTableId() + "." + field.getFieldName());
            } else if ("flow".equals(type)) {
                String sourceFlowValue = flowStringMap.get(sourceElement).getFlow();
                if(sourceFlowValue == null || sourceFlowValue.isEmpty()){
                    throw new BadRequestException("No such a flow with an id:" + sourceElement);
                }
                resultString.add("(" + sourceFlowValue + ")");
            } 
            else if("calculatedField".equals(type)){          
                String sourceFlowValue = calculatedFieldMap.get(sourceElement).getQuery();                         
                if (sourceFlowValue == null || sourceFlowValue.isEmpty()) {
                    throw new BadRequestException("No such flow with id: " + source);
                }
                resultString.add("(" + sourceFlowValue + ")");
                }
            else if("date".equals(type)){
                    resultString.add(castingToDate(vendor, "'"+sourceElement+"'"));
                } 
            else {
                resultString.add("'"+sourceElement+"'");
            }
        }
    
        return resultString;
    }

    // to process none flow - aggregation
    public static String processAggregation(String vendorName,DataSchema dataSchema,Flow flow, String processedSource, String sourceType, 
                                         String source, Map<String, Field> fields,Map<String,FlowDTO> flowStringMap,String flowKey, Boolean isAggregatedWithBasicMath, Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
    
    //if not basic math operation
    if(!isAggregatedWithBasicMath){
        processedSource = getMathProcessedSource(source, sourceType, fields, flowStringMap, flow, 0, flowKey, calculatedFieldMap);
        flowStringMap.put(flowKey,new FlowDTO(processedSource,"integer",true));
    }

        try {
            String fromClause = "";

            if ("field".equals(sourceType)) {
                Field field = fields.get(source);
                fromClause = RelationshipClauseGeneric.buildRelationship(
                        Collections.singletonList(field.getTableId()), 
                        dataSchema, 
                        vendorName
                );
            } else if ("flow".equals(sourceType) || isAggregatedWithBasicMath) {
                fromClause = RelationshipClauseGeneric.buildRelationship(
                        ColumnListFromClause.getColumnListFromFields(fields), 
                        dataSchema, 
                        vendorName
                );
            } 
            processedSource = "(SELECT " + processedSource + " FROM " + fromClause + ")";
        } catch (BadRequestException e) {
            System.out.println(e.getMessage());
        }
  
        flowStringMap.put(flowKey+"@", new FlowDTO(processedSource, "integer",true));

    return processedSource;
    }


    public static String castingToDate(String vendor,String processedSource){

        StringBuilder query = new StringBuilder();
        if(List.of("postgresql","databricks","mysql","sqlserver","motherduck").contains(vendor)){
            query.append("CAST(").append(processedSource).append(" AS DATE)").append(" ");
        }
        else if(List.of("bigquery","db2").contains(vendor)){
            query.append("DATE(").append(processedSource).append(")").append(" ");
        }
        else if ("oracle".equals(vendor)) {
            query.append("CAST(").append(processedSource).append(" AS DATE)").append(" ");
        }
        else if("snowflake".equals(vendor)){
            query.append("TO_DATE(").append(processedSource).append(")").append(" ");
        }        
        else if ("teradata".equals(vendor)) {
             query.append("CAST(").append(processedSource).append(" AS DATE)").append(" ");
             }
       
        
        return query.toString();

    }
    
}
