package com.silzila.querybuilder.CalculatedField;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.silzila.dto.CalculatedFieldDTO;
import com.silzila.dto.DatasetDTO;
import com.silzila.dto.FlowDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.ConditionFilter;
import com.silzila.payload.request.DataSchema;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;
import com.silzila.querybuilder.RelationshipClauseGeneric;
import com.silzila.querybuilder.CalculatedField.*;
import com.silzila.querybuilder.CalculatedField.DateFlow.DatabricksDateFlow;
import com.silzila.querybuilder.CalculatedField.MathFlow.DatabricksMathFlow;
import com.silzila.querybuilder.CalculatedField.TextFlow.DatabricksTextFlow;
public class DatabricksQueryBuilder implements QueryBuilder {

    @Override
    public String composeSampleRecordQuery(String selectField, Set<String> allColumnList, DataSchema dataSchema,
            Integer recordCount) throws BadRequestException {

        StringBuilder query = new StringBuilder("SELECT \n\t");
        query.append(selectField);
        if (!allColumnList.isEmpty()) {
            String fromClause = RelationshipClauseGeneric.buildRelationship(new ArrayList<>(allColumnList), dataSchema,
                    "databricks");

            query.append("\nFROM ").append(fromClause);
        }

        query.append("\nLIMIT ").append(recordCount);

        return query.toString();
    }

    @Override
    public void processConditionalFlow(List<Flow> flows, Map<String, List<Flow>> flowMap,
            Map<String, FlowDTO> flowStringMap, Map<String, List<ConditionFilter>> conditionFilterMap,
            Map<String, String> conditionFilterStringMap, Map<String, Field> fields, String flowKey,
            Map<String, CalculatedFieldDTO> calculatedFieldMap,DatasetDTO ds) throws BadRequestException {
        ConditionFlow.processConditionalFlow("databricks", flows, flowMap, flowStringMap, conditionFilterMap,
                conditionFilterStringMap, fields, flowKey, calculatedFieldMap,ds);

    }

    @Override
    public void processNonConditionalDateFlow(Flow firstFlow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, String flowKey, Map<String, CalculatedFieldDTO> calculatedFieldMap)
            throws BadRequestException {
        FlowDTO dateFlow = DatabricksDateFlow.databricksDateFlow(firstFlow, fields, flowStringMap, flowKey,
                calculatedFieldMap);
        flowStringMap.put(flowKey, dateFlow);
    }

    @Override
    public void processNonConditionalMathFlow(DataSchema dataschema, Flow flow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, String flowKey, Map<String, CalculatedFieldDTO> calculatedFieldMap)
            throws BadRequestException {
        DatabricksMathFlow.databricksMathFlow(dataschema, flow, fields, flowStringMap, flowKey, calculatedFieldMap);

    }

    @Override
    public void processNonConditionalTextFlow(Flow firstFlow, Map<String, Field> fields,
            Map<String, FlowDTO> flowStringMap, String flowKey, Map<String, CalculatedFieldDTO> calculatedFieldMap)
            throws BadRequestException {
        FlowDTO textFlow = DatabricksTextFlow.databricksTextFlow(firstFlow, fields, flowStringMap, flowKey,
                calculatedFieldMap);
        flowStringMap.put(flowKey, textFlow);

    }

}
