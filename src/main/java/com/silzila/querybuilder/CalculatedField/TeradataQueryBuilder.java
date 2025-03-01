package com.silzila.querybuilder.CalculatedField;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.DatasetDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.ConditionFilter;
import com.silzila.payload.request.DataSchema;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.RelationshipClauseGeneric;
import com.silzila.querybuilder.CalculatedField.DateFlow.TeradataDateFlow;
import com.silzila.querybuilder.CalculatedField.MathFlow.TeradataMathFlow;
import com.silzila.querybuilder.CalculatedField.TextFlow.TeradataTextFlow;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class TeradataQueryBuilder implements QueryBuilder {
    static final String vendor = "teradata";

    @Override
    public String composeSampleRecordQuery(String selectField, Set<String> allColumnList, DataSchema dataSchema,
            Integer recordCount) throws BadRequestException {

        StringBuilder query = new StringBuilder();

        if (recordCount != null && recordCount > 0 && recordCount <= 100) {
            query.append("SELECT TOP ").append(recordCount).append(" ");
        } else {
            query.append("SELECT ");
        }

        query.append(selectField);

        if (!allColumnList.isEmpty()) {
            String fromClause = RelationshipClauseGeneric.buildRelationship(new ArrayList<>(allColumnList), dataSchema,
                    vendor);
            query.append("\nFROM ").append(fromClause);
        }

        return query.toString();
    }

    @Override
    public void processConditionalFlow(List<Flow> flows, Map<String, List<Flow>> flowMap,
            Map<String, FlowDTO> flowStringMap, Map<String, List<ConditionFilter>> conditionFilterMap,
            Map<String, String> conditionFilterStringMap, Map<String, Field> fields, String flowKey,
            Map<String, CalculatedFieldDTO> calculatedFieldMap,DataSchema ds) throws BadRequestException {
            ConditionFlow.processConditionalFlow(vendor, flows, flowMap, flowStringMap, conditionFilterMap, conditionFilterStringMap, fields, flowKey, calculatedFieldMap,ds);

    }

    @Override
    public void processNonConditionalDateFlow(Flow firstFlow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, String flowKey, Map<String, CalculatedFieldDTO> calculatedFieldMap)
            throws BadRequestException {
                FlowDTO dateFlow = TeradataDateFlow.teradataDateFlow(firstFlow,fields,flowStringMap,flowKey,calculatedFieldMap);
        flowStringMap.put(flowKey, dateFlow);

    }

    @Override
    public void processNonConditionalMathFlow(DataSchema dataschema, Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, String flowKey, Map<String, CalculatedFieldDTO> calculatedFieldMap)
            throws BadRequestException {
                TeradataMathFlow.teraDataMathFlow(dataschema, flow, fields, flowStringMap, flowKey, calculatedFieldMap);    

    }

    @Override
    public void processNonConditionalTextFlow(Flow firstFlow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, String flowKey, Map<String, CalculatedFieldDTO> calculatedFieldMap)
            throws BadRequestException {
                FlowDTO textFlow = TeradataTextFlow.teradataTextFlow(firstFlow, fields, flowStringMap, flowKey, calculatedFieldMap);
        flowStringMap.put(flowKey,textFlow);

    }

}
