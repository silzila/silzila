package com.silzila.querybuilder.CalculatedField.TextFlow;

import java.util.List;
import java.util.Map;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.CalculatedField.helper.*;

public class OracleTextFlow {
    private final static Map<String, String> basicTextOperations = Map.ofEntries(
        Map.entry("concat", "||"),
        Map.entry("propercase", "INITCAP"),
        Map.entry("lowercase", "LOWER"),
        Map.entry("uppercase", "UPPER"),
        Map.entry("trim", "TRIM"),
        Map.entry("ltrim", "LTRIM"),
        Map.entry("rtrim", "RTRIM"),
        Map.entry("length", "LENGTH"),
        Map.entry("substringright", "SUBSTR"),
        Map.entry("substringleft", "SUBSTR"),
        Map.entry("replace", "REPLACE"),
        Map.entry("split", "REGEXP_SUBSTR")
);

public static FlowDTO oracleTextFlow(Flow firstFlow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap, String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
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
    
        // Store the result in flowStringMap using the flowKey
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

    // to process text operation - concat
    private static String processTextConcatOperation(String flowType,List<String> processedSources){

        StringBuilder result = new StringBuilder();

        for (int i = 0; i < processedSources.size(); i++) {

            result.append(processedSources.get(i));
            if (i < processedSources.size() - 1) {
                result.append(" || ");
            }
        }

        return result.toString();
    }

    private static String processSubStringOperations(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {
        if (flow.getSource().size() != 2 || 
            (!flow.getSourceType().get(1).equals("integer") && 
            !flow.getSource().get(1).matches("^-?\\d+(\\.\\d+)?$"))) {
            throw new BadRequestException("Invalid parameters: Substring operation requires exactly two parameters (field and position), and position should be an integer.");
        }
    
        String processedSource = processedSources.get(0);
        String extractNumber = flow.getSource().get(1);
        int extractValue = Math.abs(Integer.parseInt(extractNumber));
        boolean isNegative = extractNumber.startsWith("-");
        
        StringBuilder result = new StringBuilder("CASE \n\tWHEN LENGTH(")
                .append(processedSource)
                .append(") < ")
                .append(extractValue)
                .append(" THEN '' \n\tELSE ");
    
        if (isNegative) {
            if (flowType.equals("substringright")) {
                result.append("SUBSTR(")
                      .append(processedSource)
                      .append(", 0, LENGTH(")
                      .append(processedSource)
                      .append(") - ")
                      .append(extractValue)
                      .append(")");
            } else {
                result.append("SUBSTR(")
                      .append(processedSource)
                      .append(", ")
                      .append(extractValue + 1)
                      .append(")");
            }
        } else {
            if (flowType.equals("substringleft")) {
                result.append("SUBSTR(")
                      .append(processedSource)
                      .append(", 0, ")
                      .append(extractValue)
                      .append(")");
            } else {
                result.append("SUBSTR(")
                      .append(processedSource)
                      .append(", -")
                      .append(extractValue)
                      .append(")");
            }
        }
    
        result.append(" END");
        return result.toString();
    }
    

    // to process text replace operation
    //1st source - string, 2nd source - substring to be replaced, 3rd source - replacement to the replaced substring
    private static String processTextReplaceOperation(Flow flow,String flowType,List<String> processedSources) throws BadRequestException{
        if (flow.getSource().size() != 3) {
            throw new BadRequestException("Invalid parameters: Text split operation requires exactly three parameters (field,delimiter,position )");
        }
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

    private static String processTextSplitOperation(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {
        if (flow.getSource().size() != 3) {
            throw new BadRequestException("Invalid parameters: Text split operation requires exactly three parameters (field, delimiter, position).");
        }
    
        String processedSource = processedSources.get(0);
        String delimiter = flow.getSource().get(1);
        String extractNumber = flow.getSource().get(2);
        
        int extractPart = Math.abs(Integer.parseInt(extractNumber));
        boolean getFromReverse = extractNumber.startsWith("-");
    
        StringBuilder result = new StringBuilder();
    
        if (getFromReverse) {
            result.append("REVERSE(REGEXP_SUBSTR(REVERSE(")
                  .append(processedSource)
                  .append("), '[^")
                  .append(delimiter)
                  .append("]+', 1, ")
                  .append(extractPart)
                  .append("))");
        } else {
            result.append("REGEXP_SUBSTR(")
                  .append(processedSource)
                  .append(", '[^")
                  .append(delimiter)
                  .append("]+', 1, ")
                  .append(extractPart)
                  .append(")");
        }
    
        return result.toString();
    }
    
}
