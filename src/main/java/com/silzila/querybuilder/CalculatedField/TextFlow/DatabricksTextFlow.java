package com.silzila.querybuilder.CalculatedField.TextFlow;

import java.util.List;
import java.util.Map;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.CalculatedField.helper.*;

public class DatabricksTextFlow {
    private final static Map<String, String> basicTextOperations = Map.ofEntries(
    Map.entry("concat", "CONCAT"),
    Map.entry("propercase", "INITCAP"),
    Map.entry("lowercase", "LOWER"),
    Map.entry("uppercase", "UPPER"),
    Map.entry("trim", "TRIM"),
    Map.entry("ltrim", "LTRIM"),
    Map.entry("rtrim", "RTRIM"),
    Map.entry("length", "LENGTH"),
    Map.entry("replace", "REPLACE"),
    Map.entry("split", "SPLIT")
);
  public static FlowDTO databricksTextFlow(Flow firstFlow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap, String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
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

        // to process text operation - propercase,lowercase....
    private static String processTextSingleArgumentOperations(String flowType,List<String> processedSources){

            StringBuilder result = new StringBuilder();
            result.append(basicTextOperations.get(flowType)).append(" (")
                      .append(String.join(", ", processedSources))
                      .append(")");
            return result.toString();
    }
    
    private static String processTextConcatOperation(String flowType,List<String> processedSources){

        StringBuilder result = new StringBuilder();
        result.append(basicTextOperations.get(flowType)).append(" (")
                  .append(String.join(", ", processedSources))
                  .append(")");
        return result.toString();
    }
    private static String processSubStringOperations(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {
        if (flow.getSource().size() != 3 || 
            (!flow.getSourceType().get(1).equals("integer") && 
            !flow.getSource().get(1).matches("^-?\\d+$"))) {
            throw new BadRequestException("Invalid parameters: Substring operation requires exactly three parameters (field, position, include or exclude), and position should be an integer.");
        }
    
        String processedSource = processedSources.get(0); 
        String extractNumber = flow.getSource().get(1);   
        String type = flow.getSource().get(2);            
        StringBuilder result = new StringBuilder();
    
        int extractValue = Math.abs(Integer.parseInt(extractNumber)); 
    
        if ("exclude".equals(type)) {
            String substringDirection = flowType.equals("substringleft") ? "RIGHT" : "LEFT";
            result.append("CASE WHEN LENGTH(")
                  .append(processedSource)
                  .append(") < ")
                  .append(extractValue)
                  .append(" THEN '' ELSE ")
                  .append(substringDirection)
                  .append("(")
                  .append(processedSource)
                  .append(", LENGTH(")
                  .append(processedSource)
                  .append(") - ")
                  .append(extractValue)
                  .append(") END");
        } else if ("include".equals(type)) {
            if ("substringleft".equals(flowType)) {
                result.append("LEFT(")
                      .append(processedSource)
                      .append(", ")
                      .append(extractValue)
                      .append(")");
            } else if ("substringright".equals(flowType)) {
                result.append("RIGHT(")
                      .append(processedSource)
                      .append(", ")
                      .append(extractValue)
                      .append(")");
            } else {
                throw new BadRequestException("Invalid flow type: Only substringleft and substringright are supported.");
            }
        } else {
            throw new BadRequestException("Invalid type: Must be 'include' or 'exclude'.");
        }
    
        return result.toString();
    }
    private static String processTextReplaceOperation(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {
        if (flow.getSource().size() != 3) {
            throw new BadRequestException("Invalid parameters: Text replace operation requires exactly three parameters (field, search, replace).");
        }
    
        String field = processedSources.get(0); 
        String searchString = flow.getSource().get(1); 
        String replaceString = flow.getSource().get(2); 
    
        StringBuilder result = new StringBuilder();
        result.append(basicTextOperations.get(flowType)) 
              .append(" (")
              .append(field)
              .append(", '")
              .append(searchString)
              .append("', '")
              .append(replaceString)
              .append("')");
    
        return result.toString();
    }
    private static String processTextSplitOperation(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {
        if (flow.getSource() == null || flow.getSource().size() != 4) {
            throw new BadRequestException("Invalid parameters: Text split operation requires exactly four parameters (field, delimiter, position, direction).");
        }
    
        String position = flow.getSource().get(2);
        String direction = flow.getSource().get(3);
    
        if (!"integer".equals(flow.getSourceType().get(2)) && !position.matches("^-?\\d+(\\.\\d+)?$")) {
            throw new BadRequestException("Invalid position: Position must be an integer or a numeric value.");
        }
    
        int positionIndex = Integer.parseInt(position); 
        StringBuilder result = new StringBuilder();
    
        result.append("element_at(split(")
              .append(processedSources.get(0)) 
              .append(", '")
              .append(flow.getSource().get(1)) 
              .append("'), ");
    
        if ("right".equals(direction)) {
            result.append("-").append(positionIndex); 
        } else if ("left".equals(direction)) {
            result.append(positionIndex);
        } else {
            throw new BadRequestException("Invalid direction: Must be 'left' or 'right'.");
        }
    
        result.append(")"); 
    
        return result.toString();
    }
    
    


    
}
