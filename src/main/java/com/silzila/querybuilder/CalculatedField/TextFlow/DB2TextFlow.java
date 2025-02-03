package com.silzila.querybuilder.CalculatedField.TextFlow;

import java.util.List;
import java.util.Map;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.CalculatedField.helper.*;

public class DB2TextFlow {

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

        public static FlowDTO db2TextFlow(Flow firstFlow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap, String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
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
        String dataType = flowType.equals("length")?"integer":"text";

        return new FlowDTO(result.toString(), dataType);
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

    // to process text operation - propercase,lowercase....
    private static String processTextSingleArgumentOperations(String flowType,List<String> processedSources){

            StringBuilder result = new StringBuilder();
            result.append(basicTextOperations.get(flowType)).append(" (")
                      .append(String.join(", ", processedSources))
                      .append(")");
            return result.toString();
    }

    private static String processSubStringOperations(Flow flow, String flowType, List<String> processedSources) throws BadRequestException {
    
        StringBuilder result = new StringBuilder();
        String type = flow.getSource().get(2); 
        String processedSource = processedSources.get(0);
        String length = flow.getSource().get(1);

        System.out.println("TYPE " + type);
    
        if ("include".equals(type)) {
            if ("substringright".equals(flowType)) {
                result.append("CASE \n")
                      .append("\tWHEN LENGTH(").append(processedSource).append(") < ").append(length).append(" THEN ")
                      .append(processedSource).append(" \n")
                      .append("\tELSE SUBSTR(").append(processedSource).append(", LENGTH(").append(processedSource).append(") - ")
                      .append(length).append(" + 1) \n")
                      .append("END");
            } else if ("substringleft".equals(flowType)) {
                result.append("CASE \n")
                      .append("\tWHEN LENGTH(").append(processedSource).append(") < ").append(length).append(" THEN ")
                      .append(processedSource).append(" \n").append(" \tELSE SUBSTR(").append(processedSource).append(", 1, ").append(length).append(") END");
            }
        } else {
            if ("substringright".equals(flowType)) {
                result.append("CASE \n")
                      .append("\tWHEN LENGTH(").append(processedSource).append(") < ").append(length).append(" THEN '' \n")
                      .append("\tELSE SUBSTR(").append(processedSource).append(", 1, LENGTH(").append(processedSource).append(") - ")
                      .append(length).append(") \n")
                      .append("END");
            } else if ("substringleft".equals(flowType)) {
                result.append("CASE \n")
                      .append("\tWHEN LENGTH(").append(processedSource).append(") < ").append(length).append(" THEN '' \n")
                      .append("\tELSE SUBSTR(").append(processedSource).append(", ").append(length).append(" + 1) \n")
                      .append("END");
            }
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
    
        String result = "";
        String source = processedSources.get(0);
        String delimiter = flow.getSource().get(1);
        Integer partNumber = Integer.parseInt(flow.getSource().get(2));
        String direction = flow.getSource().get(3);
    
        if (partNumber == 1) {
            // For part number 1, extract from the beginning until the first delimiter
            result = """
                TRIM(SUBSTR(source, 1, LOCATE_IN_STRING(source, 'delimiter', 1, 1) - 1))
            """;
        } else if ("left".equals(direction)) {
            // For positive part numbers, extract the corresponding part
            result = """
                TRIM(
                    SUBSTR(
                        source,
                        LOCATE_IN_STRING(source, 'delimiter', 1, part_number - 1) + 1,
                        CASE 
                            WHEN LOCATE_IN_STRING(source, 'delimiter', 1, part_number) = 0 
                                 THEN LENGTH(source) - CASE WHEN part_number = 1 THEN 0 ELSE LOCATE_IN_STRING(source, 'delimiter', 1, part_number - 1) END
                            ELSE LOCATE_IN_STRING(source, 'delimiter', 1, part_number) - 
                                 LOCATE_IN_STRING(source, 'delimiter', 1, part_number - 1) - 1
                        END
                    )
                )
            """;
        } else {
            // For negative part numbers, count delimiters from the right
            result = """
                TRIM(
                    SUBSTR(
                        source,
                        CASE 
                            WHEN LOCATE_IN_STRING(REVERSE(source), 'delimiter', 1, ABS(part_number)) = 0 
                                 THEN 1 
                            ELSE LENGTH(source) - LOCATE_IN_STRING(REVERSE(source), 'delimiter', 1, ABS(part_number)) + 2
                        END,
                        CASE 
                            WHEN LOCATE_IN_STRING(REVERSE(source), 'delimiter', 1, ABS(part_number - 1)) = 0 
                                 THEN LENGTH(source)
                            ELSE LENGTH(source) - LOCATE_IN_STRING(REVERSE(source), 'delimiter', 1, ABS(part_number - 1)) + 1
                        END -
                        CASE 
                            WHEN LOCATE_IN_STRING(REVERSE(source), 'delimiter', 1, ABS(part_number)) = 0 
                                 THEN 0 
                            ELSE LENGTH(source) - LOCATE_IN_STRING(REVERSE(source), 'delimiter', 1, ABS(part_number)) + 1
                        END
                    )
                )
            """;
        }
    
        result = result.replace("source", source)
                       .replace("delimiter", delimiter)
                       .replace("part_number", "" + partNumber);
        return result;
    }
    
    
}
