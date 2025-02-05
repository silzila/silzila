package com.silzila.querybuilder.CalculatedField.TextFlow;

import java.util.List;
import java.util.Map;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.CalculatedField.helper.*;

public class TeradataTextFlow {
    private final static Map<String, String> basicTextOperations = Map.ofEntries(
            Map.entry("concat", "CONCAT"),
            Map.entry("propercase", "INITCAP"),
            Map.entry("lowercase", "LOWER"),
            Map.entry("uppercase", "UPPER"),
            Map.entry("trim", "TRIM"),
            Map.entry("ltrim", "LTRIM"),
            Map.entry("rtrim", "RTRIM"),
            Map.entry("length", "LENGTH"),
            Map.entry("substringright", "RIGHT"),
            Map.entry("substringleft", "LEFT"),
            Map.entry("replace", "OREPLACE"),
            Map.entry("split", "STRTOK"));

    public static FlowDTO teradataTextFlow(Flow firstFlow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, String flowKey, Map<String, CalculatedFieldDTO> calculatedFieldMap)
            throws BadRequestException {
        String flowType = firstFlow.getFlow();
        StringBuilder result = new StringBuilder();

        List<String> processedSources = CalculatedFieldProcessedSource.processTextSources(firstFlow, fields,
                flowStringMap, calculatedFieldMap);

        if(List.of("propercase","uppercase","lowercase","trim","ltrim","rtrim","length").contains(flowType)){
            CalculatedFieldRequestPrecheck.singleArgumentTextOperation(firstFlow, fields, flowStringMap, calculatedFieldMap);
            result.append(processTextSingleArgumentOperations(flowType,processedSources));
        }
        else if("concat".equals(flowType)){
            CalculatedFieldRequestPrecheck.multipleArgumentTextOperation(firstFlow, fields, flowStringMap, calculatedFieldMap);
            result.append(processTextConcatOperation(flowType, processedSources));
        }
        else if(List.of("substringright","substringleft").contains(flowType)){
            CalculatedFieldRequestPrecheck.substringTextOperation(firstFlow, fields, flowStringMap, calculatedFieldMap);
            result.append(processSubStringOperations(firstFlow,flowType,processedSources));
        }
        else if ("replace".equals(flowType)){
            CalculatedFieldRequestPrecheck.replaceTextOperation(firstFlow, fields, flowStringMap, calculatedFieldMap);
            result.append(processTextReplaceOperation(firstFlow,flowType,processedSources));
        }
        else if ("split".equals(flowType)){
            CalculatedFieldRequestPrecheck.splitTextOperation(firstFlow, fields, flowStringMap, calculatedFieldMap);
            result.append(processTextSplitOperation(firstFlow,flowType,processedSources));
        }

        // Store the result in flowStringMap using the flowKey
        String dataType = flowType.equals("length") ? "integer" : "text";

        return new FlowDTO(result.toString(), dataType);
    }

    private static String processTextSingleArgumentOperations(String flowType, List<String> processedSources) {

        StringBuilder result = new StringBuilder();
        result.append(basicTextOperations.get(flowType)).append(" (")
                .append(String.join(", ", processedSources))
                .append(")");
        return result.toString();
    }

    private static String processTextConcatOperation(String flowType, List<String> processedSources) {

        StringBuilder result = new StringBuilder();
        result.append(basicTextOperations.get(flowType)).append(" (")
                .append(String.join(", ", processedSources))
                .append(")");
        return result.toString();
    }

    private static String processSubStringOperations(Flow flow, String flowType, List<String> processedSources)
            throws BadRequestException {

        String processedSource = processedSources.get(0);
        String extractNumber = flow.getSource().get(1);
        String type = flow.getSource().get(2);
        StringBuilder result = new StringBuilder();
        int extractValue = Math.abs(Integer.parseInt(extractNumber));

        if (type.equals("exclude")) {
            if (flow.getFlow().equals("substringleft")) {
                result.append("SELECT LEFT(")
                        .append(processedSource).append(", CHARACTER_LENGTH(").append(processedSource)
                        .append(") - ").append(extractValue).append(")");
            } else {
                result.append("SELECT RIGHT(")
                        .append(processedSource).append(", CHARACTER_LENGTH(").append(processedSource)
                        .append(") - ").append(extractValue).append(")");
            }
        } else {
            String operation = basicTextOperations.get(flowType);
            result.append(operation)
                    .append(" (")
                    .append(processedSource)
                    .append(", ")
                    .append(extractNumber)
                    .append(")");
        }

        return result.toString();
    }

    private static String processTextReplaceOperation(Flow flow, String flowType, List<String> processedSources)
            throws BadRequestException {

        StringBuilder result = new StringBuilder();

        result.append(basicTextOperations.get(flowType))
                .append("(")
                .append(processedSources.get(0))
                .append(", '")
                .append(flow.getSource().get(1))
                .append("', '")
                .append(flow.getSource().get(2))
                .append("')");

        return result.toString();
    }
    private static String processTextSplitOperation(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {
    
        String position = flow.getSource().get(2);
        String direction = flow.getSource().get(3);
    
        if (!"integer".equals(flow.getSourceType().get(2)) && !position.matches("^-?\\d+(\\.\\d+)?$")) {
            throw new BadRequestException("Invalid position: Position must be an integer or a numeric value.");
        }
    
        if ("right".equals(direction)) {
            position = "-" + position;
        }
    
        StringBuilder result = new StringBuilder();
        
        result.append("CAST(SUBSTRING(")
              .append(processedSources.get(0)) 
              .append(" FROM ")
              .append(position) 
              .append(" FOR ")
              .append("CHARACTER_LENGTH(").append(processedSources.get(0)).append(")) AS VARCHAR(255))");
    
        return result.toString();
    }
    

}
