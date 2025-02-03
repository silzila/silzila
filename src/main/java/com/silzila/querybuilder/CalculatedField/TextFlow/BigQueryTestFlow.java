package com.silzila.querybuilder.CalculatedField.TextFlow;

import java.util.List;
import java.util.Map;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.CalculatedField.helper.*;
public class BigQueryTestFlow {

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
        Map.entry("replace", "REPLACE"),
        Map.entry("split", "SPLIT")
    );
     public static FlowDTO bigQueryTextFlow(Flow firstFlow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap, String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
        String flowType = firstFlow.getFlow();
        StringBuilder result = new StringBuilder();
    
        List<String> processedSources = CalculatedFieldProcessedSource.processTextSources(firstFlow, fields, flowStringMap,calculatedFieldMap);
    
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
    
        String dataType = flowType.equals("length")?"integer":"text";

        return new FlowDTO(result.toString(), dataType);
    }

    private static String processTextSingleArgumentOperations(String flowType, List<String> processedSources)throws BadRequestException {
        StringBuilder result = new StringBuilder();
    
            String operation = basicTextOperations.get(flowType);
            if (operation == null) {
                throw new BadRequestException("Invalid flow type: " + flowType);
            }
            result.append(operation)
                  .append(" (")
                  .append(String.join(", ", processedSources))
                  .append(")");
    
        return result.toString();
    }

    private static String processTextConcatOperation(String flowType, List<String> processedSources) {
        StringBuilder result = new StringBuilder();

            result.append("CONCAT(")
                  .append(String.join(", ", processedSources))
                  .append(")");
    
        return result.toString();
    }

    private static String processSubStringOperations(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {
        
    
        String processedSource = processedSources.get(0);  // Field to be processed
        String extractNumber = flow.getSource().get(1);  // Position for extraction
        String type = flow.getSource().get(2);  // Include or Exclude type
        StringBuilder result = new StringBuilder();
    
        int extractValue = Math.abs(Integer.parseInt(extractNumber));  // Absolute value of position
    
        if (type.equals("exclude")) {
            if (flowType.equals("substringleft")) {
                result.append("CASE WHEN LENGTH(")
                      .append(processedSource).append(") <= ").append(extractValue)
                      .append(" THEN '' ELSE SUBSTR(")
                      .append(processedSource).append(", ").append(extractValue + 1)
                      .append(", LENGTH(").append(processedSource).append(") - ").append(extractValue).append(") END");
            } else if (flowType.equals("substringright")) {
                result.append("CASE WHEN LENGTH(")
                      .append(processedSource).append(") <= ").append(extractValue)
                      .append(" THEN '' ELSE SUBSTR(")
                      .append(processedSource).append(", 1, LENGTH(").append(processedSource).append(") - ").append(extractValue).append(") END");
            } else {
                throw new BadRequestException("Invalid flowType: Supported types are 'substringleft' and 'substringright'.");
            }
        } else if (type.equals("include")) {
            if (flowType.equals("substringleft")) {
                result.append("SUBSTR(")
                      .append(processedSource).append(", 1, ").append(extractValue).append(")");
            } else if (flowType.equals("substringright")) {
                result.append("SUBSTR(")
                      .append(processedSource).append(", LENGTH(").append(processedSource).append(") - ")
                      .append(extractValue).append(" + 1, ").append(extractValue).append(")");
            } else {
                throw new BadRequestException("Invalid flowType: Supported types are 'substringleft' and 'substringright'.");
            }
        } else {
            throw new BadRequestException("Invalid type: Supported types are 'include' and 'exclude'.");
        }
    System.out.println(result.toString());
        return result.toString();
        
    }
         
    private static String processTextReplaceOperation(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {
        
        StringBuilder result = new StringBuilder();
        result.append("REPLACE(")
              .append(processedSources.get(0)) 
              .append(", '")
              .append(flow.getSource().get(1))  
              .append("', '")
              .append(flow.getSource().get(2))  
              .append("')");
        
        return result.toString();
    }

private static String processTextSplitOperation(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {

    String delimiter = flow.getSource().get(1);  // The delimiter to split by (e.g., '-')
    String position = flow.getSource().get(2);  // The position for the split (integer)
    String direction = flow.getSource().get(3);  // Direction of split (left or right)

    Integer part = Integer.parseInt(position) - 1;  // Adjust to zero-based index
    
    // StringBuilder to build the result
    StringBuilder result = new StringBuilder();
    result.append("SPLIT(")
          .append(processedSources.get(0))  // The field to be split
          .append(", '")
          .append(delimiter)  // The delimiter
          .append("')");

    // Adjust the part index based on the direction
    if ("right".equals(direction)) {
        // For right direction, calculate the index from the right
        int arrayLength = processedSources.size();
        int rightIndex = arrayLength - part - 1; // Calculate right index

        // If the right index is invalid, throw an exception
        if (rightIndex < 0 || rightIndex >= arrayLength) {
            throw new BadRequestException("Invalid position: The index is out of bounds.");
        }

        result.append("[").append(rightIndex).append("]");  // Add the adjusted index for right split
    } else if ("left".equals(direction)) {
        // For left direction, the part index is already valid as is
        if (part < 0 || part >= processedSources.size()) {
            throw new BadRequestException("Invalid position: The index is out of bounds.");
        }

        result.append("[").append(part).append("]");  // Add the left split index
    } else {
        throw new BadRequestException("Invalid direction: Must be 'left' or 'right'.");
    }

    return result.toString();
}

        
}
