package com.silzila.querybuilder.CalculatedField.MathFlow;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.*;
import com.silzila.querybuilder.CalculatedField.helper.*;

public class SqlServerMathFlow {

    private final static String vendor = "sqlserver";

    private final static Map<String, String> basicMathOperations = Map.ofEntries(
            Map.entry("addition", "+"),
            Map.entry("subtraction", "-"),
            Map.entry("multiplication", "*"),
            Map.entry("division", "/"),
            Map.entry("ceiling", "CEILING"),
            Map.entry("floor", "FLOOR"),
            Map.entry("absolute", "ABS"),
            Map.entry("power", "POWER"),
            Map.entry("min", "LEAST"),
            Map.entry("max", "GREATEST"),
            Map.entry("log", "LOG"));

    public static void sqlServerMathFlow(DataSchema dataschema, Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            String flowKey,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {

        List<String> result = new ArrayList<>();
        List<String> source = flow.getSource();
        List<String> sourceType = flow.getSourceType();
        String flowType = flow.getFlow();
        if (basicMathOperations.containsKey(flowType)) {
            if (List.of("addition", "subtraction", "multiplication", "division").contains(flowType)) {
                CalculatedFieldRequestPrecheck.multipleArgumentMathOperation(flow, fields, flowStringMap, calculatedFieldMap);
                processMathBasicOperations(dataschema, flow, fields, flowStringMap, result, flowKey, source, sourceType,
                        calculatedFieldMap);
            } else if (List.of("ceiling", "floor", "absolute").contains(flowType)) {
                CalculatedFieldRequestPrecheck.singleArgumentMathOperation(flow, fields, flowStringMap, calculatedFieldMap);
                processMathSingleArgumentOperations(dataschema, flow, fields, flowStringMap, flowKey, source, sourceType,
                        calculatedFieldMap);
            } else if (List.of("min", "max").contains(flowType)) {
                CalculatedFieldRequestPrecheck.multipleArgumentMathOperation(flow, fields, flowStringMap, calculatedFieldMap);
                processMultipleArgumentOperations(flow, fields, flowStringMap, flowKey, result, source, sourceType,
                        calculatedFieldMap);
            } else if ("power".equals(flowType)) {
                CalculatedFieldRequestPrecheck.twoArgumentMathOperation(flow, fields, flowStringMap, calculatedFieldMap);
                processPowerOperation(flow, fields, flowStringMap, flowKey, source, sourceType, calculatedFieldMap);
            } else if ("log".equals(flowType)) {
                CalculatedFieldRequestPrecheck.twoArgumentMathOperation(flow, fields, flowStringMap, calculatedFieldMap);
                processLogOperation(flow, fields, flowStringMap, flowKey, source, sourceType, calculatedFieldMap);
            }
        } else if (!basicMathOperations.containsKey(flowType) && flow.getIsAggregation()) {
            CalculatedFieldProcessedSource
                    .processAggregation(vendor, dataschema, flow, "", sourceType.get(0), source.get(0), fields,
                            flowStringMap, flowKey, false, calculatedFieldMap);
        }
    }

    // to process math basic operations - addition, subtraction, multiplicattion,
    // division
    private static void processMathBasicOperations(DataSchema dataschema, Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            List<String> result, String flowKey, List<String> source, List<String> sourceType,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {


        for (int i = 0; i < source.size(); i++) {
            String processedSource = CalculatedFieldProcessedSource.getMathProcessedSource(source.get(i),
                    sourceType.get(i), fields, flowStringMap, flow, i, flowKey, calculatedFieldMap);
            result.add(processedSource);

            if (i < source.size() - 1) {
                result.add(basicMathOperations.get(flow.getFlow()));
            }
        }

        String mathematicalExpression = String.join(" ", result);

        flowStringMap.put(flowKey, new FlowDTO(mathematicalExpression, "integer", flow.getIsAggregation()));

        if (flow.getIsAggregation()) {
            mathematicalExpression = CalculatedFieldProcessedSource.processAggregation(
                    vendor, dataschema, flow, mathematicalExpression, "agg", null, fields, flowStringMap, flowKey,
                    true, calculatedFieldMap);
        }
    }

    private static void processMathSingleArgumentOperations(
            DataSchema dataschema ,
            Flow flow,
            Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap,
            String flowKey,
            List<String> source,
            List<String> sourceType,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
        

        String processedSource = CalculatedFieldProcessedSource.getMathProcessedSource(source.get(0), sourceType.get(0),
                fields, flowStringMap, flow, 0, flowKey, calculatedFieldMap);
        String processedExpression = basicMathOperations.get(flow.getFlow()) + "(" + processedSource + ")";

        flowStringMap.put(flowKey, new FlowDTO(processedExpression,"integer", flow.getIsAggregation()));

        if (flow.getIsAggregation()) {
                        processedExpression = CalculatedFieldProcessedSource
                                .processAggregation(vendor, dataschema, flow, processedExpression, "agg", null, fields,
                                        flowStringMap, flowKey, true, calculatedFieldMap);
        }
    }

    private static void processMultipleArgumentOperations(Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, String flowKey, List<String> result, List<String> source,
            List<String> sourceType, Map<String, CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {


        for (int i = 0; i < source.size(); i++) {
            String processedSource = CalculatedFieldProcessedSource.getMathProcessedSource(
                    source.get(i),
                    sourceType.get(i),
                    fields,
                    flowStringMap,
                    flow,
                    i,
                    flowKey,
                    calculatedFieldMap);
            result.add(processedSource);
            if (i < source.size() - 1) {
                result.add(",");
            }
        }

        String mathExpression = basicMathOperations.get(flow.getFlow()) + "(" + String.join(" ", result) + ")";

        flowStringMap.put(flowKey, new FlowDTO(mathExpression, "integer", flow.getIsAggregation()));
    }

    private static void processPowerOperation(Flow flow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap,
            String flowKey, List<String> source, List<String> sourceType,
            Map<String, CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {


        String processedBase = CalculatedFieldProcessedSource.getMathProcessedSource(source.get(0), sourceType.get(0),
                fields, flowStringMap, flow, 0, flowKey, calculatedFieldMap);

        String exponent = source.get(1);
        String powerExpression = "POWER(" + processedBase + ", " + exponent + ")";

        flowStringMap.put(flowKey, new FlowDTO(powerExpression, "integer", flow.getIsAggregation()));
    }

    private static void processLogOperation(
        Flow flow,
        Map<String, Field> fields,
        Map<String, FlowDTO> flowStringMap,
        String flowKey,
        List<String> source,
        List<String> sourceType,
        Map<String, CalculatedFieldDTO> calculatedFieldMap
    ) throws BadRequestException {


    String processedNumber = CalculatedFieldProcessedSource.getMathProcessedSource(
            source.get(0), sourceType.get(0), fields, flowStringMap, flow, 0, flowKey, calculatedFieldMap);
    String processedBase = CalculatedFieldProcessedSource.getMathProcessedSource(
            source.get(1), sourceType.get(1), fields, flowStringMap, flow, 1, flowKey, calculatedFieldMap);

    String logExpression = "LOG(" + processedNumber + ", " + processedBase + ")";

    flowStringMap.put(flowKey, new FlowDTO(logExpression, "integer", flow.getIsAggregation()));
}

}
