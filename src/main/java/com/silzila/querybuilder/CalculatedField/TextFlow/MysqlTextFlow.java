package com.silzila.querybuilder.CalculatedField.TextFlow;

import java.util.List;
import java.util.Map;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.CalculatedField.helper.*;

public class MysqlTextFlow {


    private final static Map<String, String> basicTextOperations = Map.ofEntries(
            Map.entry("concat", "CONCAT"),
            Map.entry("propercase", "INITCAP"),
            Map.entry("lowercase", "LOWER"),
            Map.entry("uppercase", "UPPER"),
            Map.entry("trim", "TRIM"),
            Map.entry("ltrim", "LTRIM"),
            Map.entry("rtrim", "RTRIM"),
            Map.entry("length", "CHAR_LENGTH"),
            Map.entry("substringright", "RIGHT"),
            Map.entry("substringleft", "SUBSTRING"),
            Map.entry("replace", "REPLACE"),
            Map.entry("split", "SUBSTRING_INDEX"));

    public static FlowDTO mysqlTextFlow(Flow firstFlow, Map<String, Field> fields,
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
            result.append(processConcatOperation(flowType, processedSources));
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
        result.append(basicTextOperations.get(flowType)).append("(")
                .append(String.join(",", processedSources))
                .append(")");
        return result.toString();
    }

    //concat
    private static String processConcatOperation(String flowType,List<String> processedSources){

        StringBuilder result = new StringBuilder();
        result.append(basicTextOperations.get(flowType)).append(" (")
                  .append(String.join(", ", processedSources))
                  .append(")");
        return result.toString();
    }

    private static String processSubStringOperations(Flow flow, String flowType, List<String> processedSources)
            throws BadRequestException {
        if (flow.getSource().size() != 3 ||
                (!flow.getSourceType().get(1).equals("integer") &&
                        !flow.getSource().get(1).matches("^-?\\d+$"))) {
            throw new BadRequestException(
                    "Invalid parameters: Substring operation requires exactly three parameters (field, position, include or exclude), and position should be an integer.");
        }

        String processedSource = processedSources.get(0);
        String extractNumber = flow.getSource().get(1);
        String type = flow.getSource().get(2);
        StringBuilder result = new StringBuilder();
        int extractValue = Math.abs(Integer.parseInt(extractNumber));

        if ("propercase".equals(flowType)) {
            result.append("CONCAT(UPPER(SUBSTRING(")
                    .append(processedSource)
                    .append(", 1, 1)), LOWER(SUBSTRING(")
                    .append(processedSource)
                    .append(", 2)))");
            return result.toString();
        }

        else if (type.equals("exclude")) {
            String substringDirection = flow.getFlow().equals("substringleft") ? "RIGHT" : "LEFT";
            result.append("CASE WHEN LENGTH(")
                    .append(processedSource).append(") < ").append(extractValue)
                    .append(" THEN '' ELSE ")
                    .append(substringDirection).append(" (").append(processedSource)
                    .append(", LENGTH(").append(processedSource).append(") - ").append(extractValue)
                    .append(") END");
        } else {
            if (flow.getFlow().equals("substringleft")) {
                result.append("SUBSTRING(")
                        .append(processedSource)
                        .append(", 1, ")
                        .append(extractValue)
                        .append(")");
            } else if (flow.getFlow().equals("substringright")) {
                result.append("SUBSTRING(")
                        .append(processedSource)
                        .append(", LENGTH(")
                        .append(processedSource)
                        .append(") - ")
                        .append(extractValue)
                        .append(" + 1, ")
                        .append(extractValue)
                        .append(")");
            } else {
                throw new BadRequestException(
                        "Invalid flowType: Supported types are 'substringleft' and 'substringright'.");
            }
        }

        return result.toString();
    }

    private static String processTextSplitOperation(Flow flow, String flowType, List<String> processedSources)
            throws BadRequestException {
        if (flow.getSource() == null || flow.getSource().size() != 4) {
            throw new BadRequestException(
                    "Invalid parameters: Text split operation requires exactly four parameters (field, delimiter, position, direction).");
        }

        String delimiter = flow.getSource().get(1);
        String position = flow.getSource().get(2);
        String direction = flow.getSource().get(3);

        if (!"integer".equals(flow.getSourceType().get(2)) && !position.matches("^-?\\d+(\\.\\d+)?$")) {
            throw new BadRequestException("Invalid position: Position must be an integer or a numeric value.");
        }

        int pos = Integer.parseInt(position);
        if ("right".equals(direction)) {
            pos = -pos;
        }

        StringBuilder result = new StringBuilder();

        if (pos > 0) {
        
           
                result.append(" SUBSTRING_INDEX( SUBSTRING_INDEX(")
                        .append(processedSources.get(0))
                        .append(", '")
                        .append(delimiter)
                        .append("', ")
                        .append(pos)
                        .append("),'")
                        .append(delimiter)
                        .append("', -1)");

            }

        else {
            result.append(" SUBSTRING_INDEX( SUBSTRING_INDEX(")
                    .append(processedSources.get(0))
                    .append(", '")
                    .append(delimiter)
                    .append("', ")
                    .append(pos)
                    .append("),'")
                    .append(delimiter)
                    .append("', 1)");
        }

        System.out.println(result.toString() + " - Query for specific split part");

        return result.toString();
    }

    private static String processTextReplaceOperation(Flow flow, String flowType, List<String> processedSources)
            throws BadRequestException {
        if (flow.getSource().size() != 3) {
            throw new BadRequestException(
                    "Invalid parameters: Text replace operation requires exactly three parameters (field, string, string).");
        }

        String query = basicTextOperations.get(flowType) + " ("
                + processedSources.get(0) + ", '"
                + flow.getSource().get(1) + "', '"
                + flow.getSource().get(2) + "')";

        return query;
    }

    public static int countSpecificChar(String str, String charToRemove) {
        if (str.startsWith(charToRemove)) {
            str = str.substring(1);  
        }
        if (str.endsWith(charToRemove)) {
            str = str.substring(0, str.length() - 1);  
        }

        int count = 0;
        for (int i = 0; i < str.length(); i++) {
            if (str.charAt(i) == charToRemove.charAt(0)) {
                count++;
            }
        }

        return count;
    }
}
