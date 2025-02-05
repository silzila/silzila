package com.silzila.querybuilder.CalculatedField.TextFlow;

import java.util.List;
import java.util.Map;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.CalculatedField.helper.*;

public class SqlServerTextFlow {

    private final static Map<String, String> basicTextOperations = Map.ofEntries(
            Map.entry("concat", "CONCAT"),
            Map.entry("lowercase", "LOWER"),
            Map.entry("uppercase", "UPPER"),
            Map.entry("trim", "TRIM"),
            Map.entry("ltrim", "LTRIM"),
            Map.entry("rtrim", "RTRIM"),
            Map.entry("length", "LEN"),
            Map.entry("substringright", "RIGHT"),
            Map.entry("substringleft", "LEFT"),
            Map.entry("replace", "REPLACE"),
            Map.entry("split", "SPLIT_PART"),
            Map.entry("propercase", "INITCAP"));

    public static FlowDTO postgresTextFlow(Flow firstFlow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, String flowKey, Map<String, CalculatedFieldDTO> calculatedFieldMap)
            throws BadRequestException {
        String flowType = firstFlow.getFlow();
        StringBuilder result = new StringBuilder();

        List<String> processedSources = CalculatedFieldProcessedSource.processTextSources(firstFlow, fields,
                flowStringMap, calculatedFieldMap);

        if(List.of("uppercase","lowercase","trim","ltrim","rtrim","length").contains(flowType)){
            CalculatedFieldRequestPrecheck.singleArgumentTextOperation(firstFlow, fields, flowStringMap, calculatedFieldMap);
            result.append(processTextSingleArgumentOperations(flowType,processedSources));
        }
        else if("concat".equals(flowType)){
            CalculatedFieldRequestPrecheck.multipleArgumentTextOperation(firstFlow, fields, flowStringMap, calculatedFieldMap);
            result.append(processTextConcatOperation(flowType, processedSources));
        }
        else if("propercase".equals(flowType)){
            CalculatedFieldRequestPrecheck.singleArgumentTextOperation(firstFlow, fields, flowStringMap, calculatedFieldMap);
            result.append(processProperCaseOperation(flowType, processedSources));
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

        String dataType = flowType.equals("length") ? "integer" : "text";
        return new FlowDTO(result.toString(), dataType);
    }

    private static String processTextSingleArgumentOperations(String flowType, List<String> processedSources) {

        StringBuilder result = new StringBuilder();
        result.append(basicTextOperations.get(flowType)).append("(")
                .append(String.join(",", processedSources))
                .append(")");
        return result.toString();
    }

    private static String processTextConcatOperation(String flowType, List<String> processedSources) {

        StringBuilder result = new StringBuilder();
        result.append(basicTextOperations.get(flowType)).append("(")
                .append(String.join(",", processedSources))
                .append(")");
        return result.toString();
    }

    private static String processSubStringOperations(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {
        if (flow.getSource() == null || flow.getSource().size() != 3 || 
            (!flow.getSourceType().get(1).equals("integer") && 
             !flow.getSource().get(1).matches("^-?\\d+$"))) {
            throw new BadRequestException("Invalid parameters: Substring operation requires exactly three parameters (field, position, include/exclude), and position should be an integer.");
        }
    
        String processedSource = processedSources.get(0); 
        String extractNumber = flow.getSource().get(1);    
        String type = flow.getSource().get(2).toLowerCase(); 
        StringBuilder result = new StringBuilder();
    
        int extractValue;
        try {
            extractValue = Integer.parseInt(extractNumber);
        } catch (NumberFormatException e) {
            throw new BadRequestException("Invalid position: Position must be an integer.");
        }
    
        int absExtractValue = Math.abs(extractValue);
    
        if (type.equals("exclude")) {
            if (flowType.equalsIgnoreCase("substringleft")) {
                result.append("CASE WHEN LEN(")
                      .append(processedSource).append(") <= ").append(absExtractValue)
                      .append(" THEN '' ELSE SUBSTRING(")
                      .append(processedSource).append(", ").append(absExtractValue + 1)
                      .append(", LEN(").append(processedSource).append(") - ").append(absExtractValue)
                      .append(") END");
            } else if (flowType.equalsIgnoreCase("substringright")) {
                result.append("CASE WHEN LEN(")
                      .append(processedSource).append(") <= ").append(absExtractValue)
                      .append(" THEN '' ELSE LEFT(")
                      .append(processedSource).append(", LEN(").append(processedSource).append(") - ").append(absExtractValue)
                      .append(") END");
            } else {
                throw new BadRequestException("Invalid flowType: Supported types are 'substringleft' and 'substringright'.");
            }
        } else if (type.equals("include")) {
            if (flowType.equalsIgnoreCase("substringleft")) {
                result.append("CASE WHEN LEN(")
                      .append(processedSource).append(") < ").append(absExtractValue)
                      .append(" THEN ").append(processedSource)
                      .append(" ELSE LEFT(")
                      .append(processedSource).append(", ").append(absExtractValue)
                      .append(") END");
            } else if (flowType.equalsIgnoreCase("substringright")) {
                result.append("CASE WHEN LEN(")
                      .append(processedSource).append(") < ").append(absExtractValue)
                      .append(" THEN ").append(processedSource)
                      .append(" ELSE RIGHT(")
                      .append(processedSource).append(", ").append(absExtractValue)
                      .append(") END");
            } else {
                throw new BadRequestException("Invalid flowType: Supported types are 'substringleft' and 'substringright'.");
            }
        } else {
            throw new BadRequestException("Invalid type: Supported types are 'include' and 'exclude'.");
        }
    
        return result.toString();
    }
    
    private static String processTextReplaceOperation(Flow flow, String flowType, List<String> processedSources)
            throws BadRequestException {
        if (flow.getSource().size() != 3) {
            throw new BadRequestException(
                    "Invalid parameters: Text replace operation requires exactly three parameters (field, old substring, new substring).");
        }

        StringBuilder result = new StringBuilder();
        if (flowType.equals("replace")) {
            result.append(basicTextOperations.get(flowType)).append(" (")
                    .append(processedSources.get(0))
                    .append(", '")
                    .append(flow.getSource().get(1))
                    .append("', '")
                    .append(flow.getSource().get(2))
                    .append("')");
        } else {
            throw new BadRequestException("Unsupported text operation type: " + flowType);
        }

        return result.toString();
    }

    private static String processTextSplitOperation(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {

        if (flow.getSource() == null || flow.getSource().size() != 4) {
            throw new BadRequestException("Invalid parameters: Text split operation requires exactly four parameters (field, delimiter, position, direction).");
        }
    
        String field = processedSources.get(0);  
        String delimiter = flow.getSource().get(1);  
        String positionStr = flow.getSource().get(2); 
        String direction = flow.getSource().get(3);  
    
        if (!positionStr.matches("^-?\\d+$")) {
            throw new BadRequestException("Invalid position: Position must be an integer.");
        }
    
        int position = Integer.parseInt(positionStr);
        if (!"left".equals(direction) && !"right".equals(direction)) {
            throw new BadRequestException("Invalid direction: Direction must be either 'left' or 'right'.");
        }
    
        if ("right".equals(direction)) {
            position = -position;  
        }
    
        StringBuilder result = new StringBuilder();
    
        result.append("SELECT value FROM (")
              .append("SELECT value, ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn ")
              .append("FROM STRING_SPLIT(").append(field).append(", '").append(delimiter).append("')) split ");
    
        // Adjust the logic for position
        if (position > 0) {
            result.append("WHERE rn = ").append(position);
        } else {
            if (position == 0) {
                throw new BadRequestException("ERROR: field position must not be zero");
            }
            result.append("WHERE rn = (SELECT COUNT(*) FROM STRING_SPLIT(")
                  .append(field).append(", '").append(delimiter).append("')) + ")
                  .append(position).append(" + 1");
        }
    
        return result.toString();
    }
    


    private static String processProperCaseOperation(String flowType,List<String> processedSources) {
        StringBuilder result = new StringBuilder();

            String fieldName = processedSources.get(0);

            result.append("UPPER(LEFT(")
                    .append(fieldName)
                    .append(", 1)) + LOWER(SUBSTRING(")
                    .append(fieldName)
                    .append(", 2, LEN(")
                    .append(fieldName)
                    .append(") - 1))");
        return result.toString();
    }

}
