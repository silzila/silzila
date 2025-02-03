package com.silzila.querybuilder.CalculatedField.DateFlow;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.CalculatedField.helper.CalculatedFieldProcessedSource;
import com.silzila.querybuilder.CalculatedField.helper.CalculatedFieldRequestPrecheck;
import com.silzila.querybuilder.CalculatedField.helper.DateFormatConverter;

import java.util.List;
import java.util.Map;

public class BigQueryDateFlow {
    private final static String vendor = "bigquery";

    private static Map<String, String> dateParts = Map.of("day", "DAY", "week", "WEEK", "month", "MONTH", "year",
            "YEAR");

    private static Map<String, String> dateOperations = Map.of("currentDate", "CURRENT_DATE", "currentTimestamp",
            "NOW()", "minDate", "MIN", "maxDate", "MAX");

    public static FlowDTO bigQueryDateFlow(Flow flow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,
            String flowKey, Map<String, CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
        
                return switch (flow.getFlow()) {
                    case "stringToDate" -> 
                        stringToDateConversion(flow, fields, flowStringMap, calculatedFieldMap);
                    case "addDateInterval" -> {
                        CalculatedFieldRequestPrecheck.addIntervalDateOperation(flow, fields, flowStringMap, calculatedFieldMap);
                        yield addDateInterval(flow, fields, flowStringMap, calculatedFieldMap);
                    }
                    case "dateInterval" -> {
                        CalculatedFieldRequestPrecheck.dateIntervalDateOperation(flow, fields, flowStringMap, calculatedFieldMap);
                        yield calculateDateInterval(flow, fields, flowStringMap, calculatedFieldMap);
                    }
                    case "datePartName" -> {
                        CalculatedFieldRequestPrecheck.datePartNameDateOperation(flow, fields, flowStringMap, calculatedFieldMap);
                        yield getDatePartName(flow, fields, flowStringMap, calculatedFieldMap);
                    }
                    case "datePartNumber" -> {
                        CalculatedFieldRequestPrecheck.datePartNumberDateOperation(flow, fields, flowStringMap, calculatedFieldMap);
                        yield getDatePartNumber(flow, fields, flowStringMap, calculatedFieldMap);
                    }
                    case "truncateDate" -> {
                        CalculatedFieldRequestPrecheck.dateTruncateDateOperation(flow, fields, flowStringMap, calculatedFieldMap);
                        yield getTruncateDateToPart(flow, fields, flowStringMap, calculatedFieldMap);
                    }
                    case "currentDate", "currentTimestamp" -> 
                        getCurrentDateOrTimeStamp(flow, fields, flowStringMap, calculatedFieldMap);
                    default -> 
                        getMinOrMaxOfColumn(flow, fields, flowStringMap, calculatedFieldMap);
                };
                
    }

    private static FlowDTO stringToDateConversion(Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, Map<String, CalculatedFieldDTO> calculatedFieldMap
            )
            throws BadRequestException {
        List<String> source = flow.getSource();

        String dateFormat = DateFormatConverter.stringToDateFormat(vendor, source.subList(1, source.size()));

        flow.setSource(flow.getSource().subList(0, 1));

        StringBuilder result = new StringBuilder();

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,
                calculatedFieldMap);

        result.append("PARSE_DATE('").append(processedSource.get(1)).append("', ").append(dateFormat).append("')");

        return new FlowDTO(result.toString(), "date");
    }

    private static FlowDTO addDateInterval(Flow flow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap )
            throws BadRequestException {

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,
                calculatedFieldMap);

        StringBuilder result = new StringBuilder();

        result.append("DATE_ADD(")
                .append(processedSource.get(0))
                .append(", INTERVAL ")
                .append(flow.getSource().get(1))
                .append(" ")
                .append(dateParts.get(flow.getSource().get(2)))
                .append(")");

        String finalResult = result.toString();
        if (flow.getSourceType().get(0).equals("date") || (flow.getSourceType().get(0).equals("field"))
                && fields.get(flow.getSource().get(0)).getDataType().equals(Field.DataType.fromValue("date"))) {
            finalResult = CalculatedFieldProcessedSource.castingToDate(vendor, result.toString());
        }
        return new FlowDTO(finalResult.toString(), "date");
    }

    private static FlowDTO calculateDateInterval(Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, Map<String, CalculatedFieldDTO> calculatedFieldMap
            )
            throws BadRequestException {


        // Define BigQuery-compatible SQL for date interval calculation
        String result = """
                CASE
                    WHEN '?' = 'day' THEN (DATE_DIFF(CAST(%! AS DATE), CAST(%& AS DATE), DAY))
                    WHEN '?' = 'week' THEN (DATE_DIFF(CAST(%! AS DATE), CAST(%& AS DATE), WEEK))
                    WHEN '?' = 'month' THEN (DATE_DIFF(CAST(%! AS DATE), CAST(%& AS DATE), MONTH))
                    WHEN '?' = 'year' THEN (DATE_DIFF(CAST(%! AS DATE), CAST(%& AS DATE), YEAR))
                END
                """;

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,
                calculatedFieldMap);

        // Replace placeholders with actual values
        result = result.replace("%!", processedSource.get(1))
                .replace("%&", processedSource.get(0))
                .replace("?", flow.getSource().get(2).toLowerCase());

        // Handle aggregation if required
        String aggregatedResult = !flow.getIsAggregation() ? result
                : aggregate(result, flow.getAggregation().get(0));

        // Return the result as a FlowDTO object
        return new FlowDTO(aggregatedResult, "integer");
    }

    private static FlowDTO getDatePartName(Flow flow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap )
            throws BadRequestException {


        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,
                calculatedFieldMap);

        StringBuilder result = new StringBuilder();

        if ("month".equals(flow.getSource().get(1))) {
            result.append("UPPER(FORMAT_DATE('%B', ").append(processedSource.get(0)).append("))");
        } else if ("day".equals(flow.getSource().get(1))) {
            result.append("UPPER(FORMAT_DATE('%A', ").append(processedSource.get(0)).append("))");
        }

        return new FlowDTO(result.toString(), "text");
    }

    private static FlowDTO getDatePartNumber(Flow flow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap )
            throws BadRequestException {

        String datePart = flow.getSource().get(1).toUpperCase();

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,
                calculatedFieldMap);

        StringBuilder result = new StringBuilder();
        result.append("EXTRACT(")
                .append(datePart)
                .append(" FROM ")
                .append(processedSource.get(0));

        String aggregatedResult = flow.getIsAggregation() ? aggregate(result.toString(), flow.getAggregation().get(0))
                : result.toString();

        return new FlowDTO(aggregatedResult, "INTEGER");
    }

    private static FlowDTO getTruncateDateToPart(Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, Map<String, CalculatedFieldDTO> calculatedFieldMap
            )
            throws BadRequestException {

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,
                calculatedFieldMap);

        StringBuilder result = new StringBuilder();

        String datePart = flow.getSource().get(1).toUpperCase();
        result.append("DATE_TRUNC(").append(processedSource.get(0)).append(", ").append(datePart)
                .append(")");

        String finalResult = result.toString();
        if (flow.getSourceType().get(0).equals("date") || (flow.getSourceType().get(0).equals("field"))
                && fields.get(flow.getSource().get(0)).getDataType().equals(Field.DataType.fromValue("date"))) {
            finalResult = CalculatedFieldProcessedSource.castingToDate(vendor, result.toString());
        }

        return new FlowDTO(finalResult.toString(), "datetime");
    }

    private static FlowDTO getCurrentDateOrTimeStamp(Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, Map<String, CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException{

        String sqlQuery;
        String dataType;

        if ("currentDate".equals(flow.getFlow())) {
            sqlQuery = "CURRENT_DATE()";
            dataType = "date";
        } else if ("currentTimestamp".equals(flow.getFlow())) {
            sqlQuery = "CURRENT_TIMESTAMP()";
            dataType = "timestamp";
        } else {
            throw new BadRequestException("Invalid flow type: Only 'currentDate' or 'currentTimestamp' are allowed.");
        }

        return new FlowDTO(sqlQuery, dataType);
    }

    private static FlowDTO getMinOrMaxOfColumn(Flow flow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap )
            throws BadRequestException {

        String operation = flow.getFlow();

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,
                calculatedFieldMap);

        if (List.of("minDate", "maxDate").contains(operation)) {
            String sqlQuery = dateOperations.get(operation) + "(" + processedSource.get(0) + ")";
            return new FlowDTO(sqlQuery, "date");
        }

        throw new BadRequestException("Invalid flow type: " + operation);
    }

    private static String aggregate(String flow, String aggregationType) {
        return aggregationType.toUpperCase() + "(" + flow + ")";
    }

}