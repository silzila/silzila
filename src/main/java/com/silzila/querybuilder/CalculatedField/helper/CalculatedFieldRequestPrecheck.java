package com.silzila.querybuilder.CalculatedField.helper;


import java.util.List;
import java.util.Map;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.payload.request.Field.DataType;

public class CalculatedFieldRequestPrecheck {

    // addition,subtraction,multiplication,min and max
    public static void multipleArgumentMathOperation(Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, Map<String, CalculatedFieldDTO> calculatedFieldMap)throws BadRequestException {

        List<String> sources = flow.getSource();
        List<String> sourceTypes = flow.getSourceType();

        if (sources.size() != sourceTypes.size()) {
            throw new IllegalArgumentException("Source names and source types arrays must have the same length.");
        }

        if (sources.size() < 2) {
            throw new BadRequestException("Insufficient parameters: at least two values are required for basic math operations.");
        }

        for (int i = 0; i < sources.size(); i++) {
            String sourceName = sources.get(i);
            String sourceType = sourceTypes.get(i);

            validateMathSource(sourceName, sourceType, fields, flowStringMap, calculatedFieldMap);

        }

    }

    // abs,ceil,floor
    public static void singleArgumentMathOperation(Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, Map<String, CalculatedFieldDTO> calculatedFieldMap) {

        List<String> sources = flow.getSource();
        List<String> sourceTypes = flow.getSourceType();

        if (sources.size() != 1 || sourceTypes.size() != 1) {
            throw new IllegalArgumentException(
                    "SingleArgumentMathOperation requires exactly one source and source type.");
        }

        String sourceName = sources.get(0);
        String sourceType = sourceTypes.get(0);

        validateMathSource(sourceName, sourceType, fields, flowStringMap, calculatedFieldMap);

    }

    // log,power
    public static void twoArgumentMathOperation(
            Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) {

        List<String> sources = flow.getSource();
        List<String> sourceTypes = flow.getSourceType();

        if (sources.size() != 2 || sourceTypes.size() != 2) {
            throw new IllegalArgumentException(
                    "TwoArgumentMathOperation requires exactly two sources and source types.");
        }

        String firstSourceName = sources.get(0);
        String firstSourceType = sourceTypes.get(0);

        String secondSourceName = sources.get(1);
        String secondSourceType = sourceTypes.get(1);

        // Validate the first source
        validateMathSource(firstSourceName, firstSourceType, fields, flowStringMap, calculatedFieldMap);

        // Validate the second source
        validateMathSource(secondSourceName, secondSourceType, fields, flowStringMap, calculatedFieldMap);

    }

    // propercase,lowercase,uppercase,trim,rtrim,ltrim,length
    public static void singleArgumentTextOperation(
            Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) {

        List<String> sources = flow.getSource();
        List<String> sourceTypes = flow.getSourceType();

        if (sources.size() != 1 || sourceTypes.size() != 1) {
            throw new IllegalArgumentException(
                    "TextSingleArgumentOperation requires exactly one source and source type.");
        }

        String sourceName = sources.get(0);
        String sourceType = sourceTypes.get(0);

        validateTextSource(sourceName, sourceType, fields, flowStringMap, calculatedFieldMap);

    }

    public static void multipleArgumentTextOperation(Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, Map<String, CalculatedFieldDTO> calculatedFieldMap)throws BadRequestException {

        List<String> sources = flow.getSource();
        List<String> sourceTypes = flow.getSourceType();

        if (sources.size() != sourceTypes.size()) {
            throw new IllegalArgumentException("Source names and source types arrays must have the same length.");
        }

        if (sources.size() < 2) {
            throw new BadRequestException("Insufficient parameters: at least two values are required for basic math operations.");
        }

        for (int i = 0; i < sources.size(); i++) {
            String sourceName = sources.get(i);
            String sourceType = sourceTypes.get(i);

            validateTextSource(sourceName, sourceType, fields, flowStringMap, calculatedFieldMap);

        }

    }

    // subString
    public static void substringTextOperation(
            Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap)throws BadRequestException  {

        if (flow.getSource().size() != 3 || flow.getSourceType().size() != 3) {
            throw new BadRequestException(
                    "Substring operation requires exactly three parameters: String to extract from, number of characters to extract, and include/exclude.");
        }

        String stringSource = flow.getSource().get(0);
        String stringSourceType = flow.getSourceType().get(0);

        String charCountSource = flow.getSource().get(1);
        String charCountSourceType = flow.getSourceType().get(1);

        String includeExcludeSource = flow.getSource().get(2);
        String includeExcludeSourceType = flow.getSourceType().get(2);

        // first source
        validateTextSource(stringSource, stringSourceType, fields, flowStringMap, calculatedFieldMap);

        // validate the second source (Number of characters to extract)
        if (!charCountSourceType.equals("integer") && !charCountSource.matches("^-?\\d+$")) {
            throw new BadRequestException("The second parameter (number of characters to extract) must be an integer.");
        }

        // validate the third source (Include/Exclude flag)
        if (!includeExcludeSourceType.equalsIgnoreCase("text") &&
                !List.of("include", "exclude").contains(includeExcludeSource)) {
            throw new BadRequestException(
                    "The third parameter (include/exclude flag) must be a text or string value, and the value must be either 'include' or 'exclude'.");
        }
    }

    // replace
    public static void replaceTextOperation(
            Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {

        List<String> sources = flow.getSource();
        List<String> sourceTypes = flow.getSourceType();

        if (sources.size() != 3 || sourceTypes.size() != 3) {
            throw new BadRequestException(
                    "Text replace operation requires exactly three parameters: String to extract from, number of characters to extract, and include/exclude.");
        }

        for (int i = 0; i < sources.size(); i++) {
            String sourceName = sources.get(i);
            String sourceType = sourceTypes.get(i);

            validateTextSource(sourceName, sourceType, fields, flowStringMap, calculatedFieldMap);

        }

    }

    // split
    public static void splitTextOperation(
            Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap)throws BadRequestException  {

        if (flow.getSource().size() != 4 || flow.getSourceType().size() != 4) {
            throw new BadRequestException(
                    "Split operation requires exactly four parameters: String to split, delimiter, position, and direction (left or right).");
        }

        // Extract parameters
        String stringSource = flow.getSource().get(0);
        String stringSourceType = flow.getSourceType().get(0);

        String delimiterSource = flow.getSource().get(1);
        String delimiterSourceType = flow.getSourceType().get(1);

        String positionSource = flow.getSource().get(2);
        String positionSourceType = flow.getSourceType().get(2);

        String directionSource = flow.getSource().get(3);
        String directionSourceType = flow.getSourceType().get(3);

        // validate the first source (String to split)
        validateTextSource(stringSource, stringSourceType, fields, flowStringMap, calculatedFieldMap);

        // validate the second source (Delimiter)
        validateTextSource(delimiterSource, delimiterSourceType, fields, flowStringMap, calculatedFieldMap);

        // validate the third source (Position)
        if (!positionSourceType.equals("integer") && !positionSource.matches("^-?\\d+$")) {
            throw new BadRequestException("The third parameter (position) must be an integer.");
        }

        // validate the fourth source (Direction)
        if (!directionSourceType.equalsIgnoreCase("text") &&
                !List.of("left", "right").contains(directionSource)) {
            throw new BadRequestException(
                    "The fourth parameter (direction) must be a text value, and the value must be either 'left' or 'right'.");
        }
    }

    // date-operation
    public static void addIntervalDateOperation(
            Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap)throws BadRequestException  {

        // Validate source size and types
        if (flow.getSource().size() != 3 || flow.getSourceType().size() != 3) {
            throw new BadRequestException(
                    "Add interval operation requires exactly three parameters: date, number of date parts, and date part.");
        }

        // Extract parameters
        String dateSource = flow.getSource().get(0);
        String dateSourceType = flow.getSourceType().get(0);

        String numberOfUnitsSource = flow.getSource().get(1);
        String numberOfUnitsSourceType = flow.getSourceType().get(1);

        String datePartSource = flow.getSource().get(2);

        // validate the first source (Date or Field)
        validateDateSource(dateSource, dateSourceType, fields, flowStringMap, calculatedFieldMap);

        // validate the second source (Number of units)
        if (!numberOfUnitsSourceType.equalsIgnoreCase("integer") &&
                !numberOfUnitsSource.matches("^-?\\d+(\\.\\d+)?$")) {
            throw new BadRequestException(
                    "The second parameter (number of units) must be an integer or decimal value.");
        }

        // validate the third source (Date part)
        if (!List.of("year", "month", "day", "week").contains(datePartSource.toLowerCase())) {
            throw new BadRequestException(
                    "The third parameter (date part) must be one of: 'year', 'month', 'day', or 'week'.");
        }
    }

    public static void dateIntervalDateOperation(
            Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap)throws BadRequestException  {

        // validate source size and types
        if (flow.getSource().size() != 3 || flow.getSourceType().size() != 3) {
            throw new BadRequestException(
                    "Date difference operation requires exactly three parameters: first date, second date, and date part.");
        }

        // Extract parameters
        String firstDateSource = flow.getSource().get(0);
        String firstDateSourceType = flow.getSourceType().get(0);

        String secondDateSource = flow.getSource().get(1);
        String secondDateSourceType = flow.getSourceType().get(1);

        String datePartSource = flow.getSource().get(2);
        // validate the first date source (Date or Field)
        validateDateSource(firstDateSource, firstDateSourceType, fields, flowStringMap, calculatedFieldMap);

        // validate the second date source (Date or Field)
        validateDateSource(secondDateSource, secondDateSourceType, fields, flowStringMap, calculatedFieldMap);

        // validate the third source (Date part)
        if (!List.of("year", "month", "day", "week").contains(datePartSource.toLowerCase())) {
            throw new BadRequestException(
                    "The third parameter (date part) must be one of: 'year', 'month', 'day', or 'week'.");
        }
    }

    public static void datePartNameDateOperation(
            Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap)throws BadRequestException  {

        // Validate source size and types
        if (flow.getSource().size() != 2 || flow.getSourceType().size() != 2) {
            throw new BadRequestException(
                    "Date part retrieval operation requires exactly two parameters: date field and date part.");
        }

        // Extract parameters
        String dateSource = flow.getSource().get(0);
        String dateSourceType = flow.getSourceType().get(0);

        String datePartSource = flow.getSource().get(1);

        // Validate the first source (Date or Field)
        validateDateSource(dateSource, dateSourceType, fields, flowStringMap, calculatedFieldMap);

        // Validate the second source (Date part)
        if (!List.of("month", "day").contains(datePartSource.toLowerCase())) {
            throw new BadRequestException("The second parameter (date part) must be one of: 'month' or 'day'.");
        }
    }

    public static void datePartNumberDateOperation(
            Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {

        // Validate source size and types
        if (flow.getSource().size() != 2 || flow.getSourceType().size() != 2) {
            throw new BadRequestException(
                    "Date part number retrieval operation requires exactly two parameters: date field and date part.");
        }

        // Extract parameters
        String dateSource = flow.getSource().get(0);
        String dateSourceType = flow.getSourceType().get(0);

        String datePartSource = flow.getSource().get(1);

        // Validate the first source (Date or Field)
        validateDateSource(dateSource, dateSourceType, fields, flowStringMap, calculatedFieldMap);

        // Validate the second source (Date part)
        if (!List.of("year", "month", "day").contains(datePartSource.toLowerCase())) {
            throw new BadRequestException(
                    "The second parameter (date part) must be one of: 'year', 'month', or 'day'.");
        }
    }

    public static void dateTruncateDateOperation(
            Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap)throws BadRequestException  {

        // Validate source size and types
        if (flow.getSource().size() != 2 || flow.getSourceType().size() != 2) {
            throw new BadRequestException(
                    "Date truncation operation requires exactly two parameters: date field and date part.");
        }

        // Extract parameters
        String dateSource = flow.getSource().get(0);
        String dateSourceType = flow.getSourceType().get(0);

        String datePartSource = flow.getSource().get(1);

        // Validate the first source (Date or Field)
        validateDateSource(dateSource, dateSourceType, fields, flowStringMap, calculatedFieldMap);

        // Validate the second source (Date part)
        if (!List.of("year", "month", "week").contains(datePartSource.toLowerCase())) {
            throw new BadRequestException(
                    "The second parameter (date part) must be one of: 'year', 'month', or 'week'.");
        }
    }

    private static void validateMathSource(
            String sourceName,
            String sourceType,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) {


        
        switch (sourceType.toLowerCase()) {
            case "integer":
            case "decimal":
                break;
            case "field":
                Field field = fields.get(sourceName);
                if (field == null) {
                    throw new IllegalArgumentException("Field not found: " + sourceName);
                }
                if (!isIntegerOrDecimal(field.getDataType())) {
                    throw new IllegalArgumentException("Field data type must be Integer or Decimal: " + sourceName);
                }
                break;

            case "flow":
                FlowDTO flowDTO = flowStringMap.get(sourceName);
                if (flowDTO == null) {
                    throw new IllegalArgumentException("Flow not found: " + sourceName);
                }
                if (!isIntegerOrDecimal(Field.DataType.fromValue(flowDTO.getDataType()))) {
                    throw new IllegalArgumentException("Flow data type must be Integer or Decimal: " + sourceName);
                }
                break;

            case "calculatedfield":
                CalculatedFieldDTO calculatedField = calculatedFieldMap.get(sourceName);
                if (calculatedField == null) {
                    throw new IllegalArgumentException("Calculated field not found: " + sourceName);
                }
                if (!isIntegerOrDecimal(Field.DataType.fromValue(calculatedField.getDatatype()))) {
                    throw new IllegalArgumentException(
                            "Calculated field data type must be Integer or Decimal: " + sourceName);
                }
                break;

            default:
                throw new IllegalArgumentException("Unsupported source type: " + sourceType);

        }
    }

    private static void validateTextSource(
            String sourceName,
            String sourceType,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) {

        switch (sourceType.toLowerCase()) {
            case "text":
                break;
            case "field":
                Field field = fields.get(sourceName);
                if (field == null) {
                    throw new IllegalArgumentException("Field not found: " + sourceName);
                }
                if (!isText(field.getDataType())) {
                    throw new IllegalArgumentException("Field data type must be Integer or Decimal: " + sourceName);
                }
                break;

            case "flow":
                FlowDTO flowDTO = flowStringMap.get(sourceName);
                if (flowDTO == null) {
                    throw new IllegalArgumentException("Flow not found: " + sourceName);
                }
                if (!isText(Field.DataType.fromValue(flowDTO.getDataType()))) {
                    throw new IllegalArgumentException("Flow data type must be Integer or Decimal: " + sourceName);
                }
                break;

            case "calculatedfield":
                CalculatedFieldDTO calculatedField = calculatedFieldMap.get(sourceName);
                if (calculatedField == null) {
                    throw new IllegalArgumentException("Calculated field not found: " + sourceName);
                }
                if (!isText(Field.DataType.fromValue(calculatedField.getDatatype()))) {
                    throw new IllegalArgumentException(
                            "Calculated field data type must be Integer or Decimal: " + sourceName);
                }
                break;

            default:
                throw new IllegalArgumentException("Unsupported source type: " + sourceType);

        }
    }

    private static void validateDateSource(
            String sourceName,
            String sourceType,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) {

        switch (sourceType.toLowerCase()) {
            case "date":
            case "timestamp":
                break;
            case "field":
                Field field = fields.get(sourceName);
                if (field == null) {
                    throw new IllegalArgumentException("Field not found: " + sourceName);
                }
                if (!isDateOrTimestamp(field.getDataType())) {
                    throw new IllegalArgumentException("Field data type must be Integer or Decimal: " + sourceName);
                }
                break;

            case "flow":
                FlowDTO flowDTO = flowStringMap.get(sourceName);
                if (flowDTO == null) {
                    throw new IllegalArgumentException("Flow not found: " + sourceName);
                }
                if (!isDateOrTimestamp(Field.DataType.fromValue(flowDTO.getDataType()))) {
                    throw new IllegalArgumentException("Flow data type must be Integer or Decimal: " + sourceName);
                }
                break;

            case "calculatedfield":
                CalculatedFieldDTO calculatedField = calculatedFieldMap.get(sourceName);
                if (calculatedField == null) {
                    throw new IllegalArgumentException("Calculated field not found: " + sourceName);
                }
                if (!isDateOrTimestamp(Field.DataType.fromValue(calculatedField.getDatatype()))) {
                    throw new IllegalArgumentException(
                            "Calculated field data type must be Integer or Decimal: " + sourceName);
                }
                break;

            default:
                throw new IllegalArgumentException("Unsupported source type: " + sourceType);

        }
    }

    private static boolean isIntegerOrDecimal(DataType dataType) {
        return dataType == DataType.INTEGER || dataType == DataType.DECIMAL;
    }

    private static boolean isText(DataType dataType) {
        return dataType == DataType.TEXT;
    }

    private static boolean isDateOrTimestamp(DataType dataType) {
        return dataType == DataType.DATE || dataType == DataType.TIMESTAMP;
    }
}

