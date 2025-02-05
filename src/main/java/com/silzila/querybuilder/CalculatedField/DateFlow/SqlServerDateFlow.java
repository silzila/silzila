package com.silzila.querybuilder.CalculatedField.DateFlow;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.CalculatedField.helper.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SqlServerDateFlow {

    private final static String vendor = "sqlserver";

    private static Map<String, String> dateParts = Map.of("day", "DAY", "week", "WEEK", "month", "MONTH", "year",
            "YEAR");
    private static Map<String, String> dateOperations = Map.of("currentDate", "CAST(GETDATE() AS DATE)", "currentTimestamp",
            "GETDATE()","time","CAST(GETDATE() AS TIME)", "minDate", "MIN", "maxDate", "MAX");

    public static FlowDTO sqlServerDateFlow(Flow flow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,
            String flowKey, Map<String, CalculatedFieldDTO> calculatedFieldMap)throws BadRequestException {

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

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,calculatedFieldMap);

        result.append("CONVERT(DATETIME, ").append(processedSource.get(0)).append(", ").append(dateFormat).append("')");

        return new FlowDTO(result.toString(), "date");
    }

    // add a interval to a date
    // 1st source -> field or date, 2nd source -> number of date part , 3rd source
    // -> date part(year,month,week,day)
    private static FlowDTO addDateInterval(Flow flow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap )
            throws BadRequestException {


        String datePart = dateParts.get(flow.getSource().get(2).toLowerCase());

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,calculatedFieldMap);

        String dateAddSql = "DATEADD(" + datePart + ", " + flow.getSource().get(1) + ", " + processedSource.get(0)
                + ")";

        String finalResult = "";
        if (flow.getSourceType().get(0).equals("date") || (flow.getSourceType().get(0).equals("field"))
                && fields.get(flow.getSource().get(0)).getDataType().equals(Field.DataType.fromValue("date"))) {
            finalResult = CalculatedFieldProcessedSource.castingToDate(vendor, dateAddSql.toString());
        }
        return new FlowDTO(finalResult.toString(), "date");

    }

    // difference between two dates
    // 1st source -> field or date, 2nd source -> field or date , 3rd source ->
    private static FlowDTO calculateDateInterval(Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, Map<String, CalculatedFieldDTO> calculatedFieldMap
            )
            throws BadRequestException {
        String result = """
                CASE
                    WHEN '?' = 'day' THEN (DATEDIFF(DAY, %&, %!))
                    WHEN '?' = 'week' THEN (DATEDIFF(WEEK, %&, %!))
                    WHEN '?' = 'month' THEN (DATEDIFF(MONTH, %&, %!))
                    WHEN '?' = 'year' THEN (DATEDIFF(YEAR, %&, %!))
                END
                """;

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,calculatedFieldMap);

        result = result.replace("%!", processedSource.get(1))
                .replace("%&", processedSource.get(0))
                .replace("?", flow.getSource().get(2).toLowerCase());
        String aggregatedResult = !flow.getIsAggregation() ? result.toString()
                : aggregate(result.toString(), flow.getAggregation().get(0));

        return new FlowDTO(aggregatedResult, "integer");
    }

    // to get the name of the date part
    // 1st source -> field or date, 2nd source -> date part(month,day)
    private static FlowDTO getDatePartName(Flow flow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap )
            throws BadRequestException {

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,calculatedFieldMap);

        String dateField = processedSource.get(0);
        String result;
        if ("month".equalsIgnoreCase(flow.getSource().get(1))) {
            result = "MONTH(" + dateField + ")";
        } else if ("day".equalsIgnoreCase(flow.getSource().get(1))) {
            result = "UPPER(DATENAME(WEEKDAY, " + dateField + "))";
        } else {
            throw new BadRequestException("Invalid date part specified. Expected 'month' or 'day'.");
        }

        return new FlowDTO(result.toString(), "text");
    }

    // to get the number of the date part
    // 1st source -> field or date, 2nd source -> date part(year,month,day)
    private static FlowDTO getDatePartNumber(Flow flow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap )
            throws BadRequestException {

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,calculatedFieldMap);

        String dateField = processedSource.get(0);

        StringBuilder result  = new StringBuilder();

        result.append(dateParts.get(flow.getSource().get(1))).append("(").append(dateField).append(")");
        
        String aggregatedResult = !flow.getIsAggregation() ? result.toString()
                : aggregate(result.toString(), flow.getAggregation().get(0));
        return new FlowDTO(aggregatedResult, "integer");
    }

    // to truncate a date to a desired date part
    // 1st source -> field or date, 2nd source -> date part(year,month,week)
    private static FlowDTO getTruncateDateToPart(Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, Map<String, CalculatedFieldDTO> calculatedFieldMap
            )
            throws BadRequestException {

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,calculatedFieldMap);

        String dateSource = processedSource.get(0);
        String datePart = flow.getSource().get(1).toLowerCase();
        StringBuilder result = new StringBuilder();

        switch (datePart) {
            case "year":
                result.append("YEAR(").append(dateSource).append(")");
                break;
            case "month":
                result.append("CONCAT(YEAR(").append(dateSource).append("), '-', RIGHT('0' + CAST(MONTH(")
                        .append(dateSource).append(") AS VARCHAR), 2), '-01')");
                break;
            case "week":
                result.append("DATEADD(WEEK, DATEDIFF(WEEK, 0, ").append(dateSource).append("), 0)");
                break;
            default:
                throw new BadRequestException("Unsupported date part");
        }

        // If the source type is date, cast the result to date using castingToDate
        // function
        String finalResult = "";
        if (flow.getSourceType().get(0).equals("date") ||
                (flow.getSourceType().get(0).equals("field") &&
                        fields.get(flow.getSource().get(0)).getDataType().equals(Field.DataType.fromValue("date")))) {
            finalResult = CalculatedFieldProcessedSource.castingToDate(vendor, result.toString());
        }

        // Return the FlowDTO with the final date result
        return new FlowDTO(finalResult, "date");
    }

    // To get the current date or timestamp
    private static FlowDTO getCurrentDateOrTimeStamp(Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) {

        String operation = flow.getFlow().toLowerCase();

        Map<String, String> dateOperations = new HashMap<>();
        dateOperations.put("current_date", "CAST(GETDATE() AS DATE)");
        dateOperations.put("current_timestamp", "GETDATE()");
        dateOperations.put("current_time", "CAST(GETDATE() AS TIME)");

        if (dateOperations.get(operation) == null) {
            throw new IllegalArgumentException("Invalid date operation: " + operation);
        }

        String dataType = flow.getFlow().equals("currentDate")?"date":"timestamp";

        return new FlowDTO(dateOperations.get(operation),dataType);
    }

    // to get a min or max
    private static FlowDTO getMinOrMaxOfColumn(Flow flow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,
            Map<String, CalculatedFieldDTO> calculatedFieldMap )
            throws BadRequestException {

        List<String> processedSource = CalculatedFieldProcessedSource.processDateSources(vendor,flow, fields, flowStringMap,calculatedFieldMap);

        if (processedSource.isEmpty()) {
            throw new BadRequestException("No valid column source found.");
        }

        String operation = dateOperations.get(flow.getFlow());

        return new FlowDTO(operation + "(" + processedSource.get(0) + ")", "date");
    }

    private static String aggregate(String flow, String aggregationType) {
        return aggregationType.toUpperCase() + "(" + flow + ")";
    }
}
