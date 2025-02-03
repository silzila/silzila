package com.silzila.querybuilder.CalculatedField.TextFlow;

import java.util.List;
import java.util.Map;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.CalculatedField.helper.*;

public class MotherduckTextFlow {

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
            Map.entry("split", "SPLIT_PART")
        );
    
    public static FlowDTO motherduckTextFlow(Flow firstFlow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap, String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
        String flowType = firstFlow.getFlow();
        StringBuilder result = new StringBuilder();
    
        List<String> processedSources = CalculatedFieldProcessedSource.processTextSources(firstFlow, fields, flowStringMap,calculatedFieldMap);
    
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
    
        // Store the result in flowStringMap using the flowKey
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
    

    private static String processProperCaseOperation(String flowType,List<String> processedSources){

        StringBuilder result = new StringBuilder();
            result.append("CONCAT(UPPER(SUBSTRING(")
                    .append(processedSources.get(0))
                    .append(", 1, 1)), LOWER(SUBSTRING(")
                    .append(processedSources.get(0))
                    .append(", 2)))");
        
        return result.toString();
    }

    

    // to process substring operation
    //1st source - String to extract from, 2nd source - number of chars to extract 
    private static String processSubStringOperations(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {
    
        String processedSource = processedSources.get(0);
        String extractNumber = flow.getSource().get(1);
        String type = flow.getSource().get(2);
        StringBuilder result = new StringBuilder();
        int extractValue = Math.abs(Integer.parseInt(extractNumber));

    
        if (type.equals("exclude")) {
            // Negative position: Exclude characters
            String substringDirection = flow.getFlow().equals("substringleft") ? "RIGHT" : "LEFT";
            result.append("CASE WHEN LENGTH(")
                  .append(processedSource).append(") < ").append(extractValue)
                  .append(" THEN ").append( "''" ).append(" ELSE ")
                  .append(substringDirection).append(" (").append(processedSource)
                  .append(", LENGTH(").append(processedSource).append(") - ").append(extractValue)
                  .append(") END");
        } else {
            // Positive position: Include characters
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

    // to process text replace operation
    //1st source - string, 2nd source - substring to be replaced, 3rd source - replacement to the replaced substring
    private static String processTextReplaceOperation(Flow flow,String flowType,List<String> processedSources) throws BadRequestException{
        StringBuilder result = new StringBuilder();
        result.append(basicTextOperations.get(flowType)).append(" (")
                    .append(processedSources.get(0))
                    .append(", '")
                    .append(flow.getSource().get(1))
                    .append("', '")
                    .append(flow.getSource().get(2))
                    .append("')");
        return result.toString();
    }

    // to process text split operation
    //1st source - string, 2nd source - delimiter, 3rd source - position(substring to be returned)
    private static String processTextSplitOperation(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {
    
        String position = flow.getSource().get(2);
        String direction = flow.getSource().get(3);    
        // adjust position based on direction
        if ("right".equals(direction)) {
            position = "-" + position;
        }
    
        StringBuilder result = new StringBuilder();
        result.append(basicTextOperations.get(flowType))
              .append(" (")
              .append(processedSources.get(0))
              .append(", '")
              .append(flow.getSource().get(1))
              .append("', ")
              .append(position)
              .append(")");
    
        return result.toString();
    }
}
