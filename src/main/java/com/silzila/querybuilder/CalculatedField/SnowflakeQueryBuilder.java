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
import com.silzila.querybuilder.CalculatedField.DateFlow.SnowflakeDateFlow;
import com.silzila.querybuilder.CalculatedField.MathFlow.SnowflakeMathFlow;
import com.silzila.querybuilder.CalculatedField.TextFlow.SnowflakeTextFlow;

public class SnowflakeQueryBuilder implements QueryBuilder{
    static final String vendor = "snowflake";
    
    @Override
   public void processConditionalFlow(List<Flow> flows,
                                        Map<String, List<Flow>> flowMap,
                                        Map<String, FlowDTO> flowStringMap,
                                        Map<String, List<ConditionFilter>> conditionFilterMap,
                                        Map<String, String> conditionFilterStringMap,
                                        Map<String, Field> fields,
                                        String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap,DataSchema ds) throws BadRequestException {

            ConditionFlow.processConditionalFlow(vendor, flows, flowMap, flowStringMap, conditionFilterMap, conditionFilterStringMap, fields, flowKey, calculatedFieldMap,ds);
    }

    @Override
    public void processNonConditionalMathFlow(DataSchema dataSchema,
                                                  Flow flow,
                                                  Map<String, Field> fields,
                                                  Map<String, FlowDTO> flowStringMap,
                                                  String flowKey,
                                                  Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
        SnowflakeMathFlow.snowflakeMathFlow(dataSchema,flow, fields, flowStringMap, flowKey, calculatedFieldMap);
    }

    @Override
    public void processNonConditionalTextFlow(Flow firstFlow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap, String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
        FlowDTO textFlow = SnowflakeTextFlow.snowflakeTextFlow(firstFlow, fields, flowStringMap, flowKey, calculatedFieldMap);
        flowStringMap.put(flowKey,textFlow);
    }

    @Override
    public void processNonConditionalDateFlow(Flow firstFlow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap, String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException{
        FlowDTO dateFlow = SnowflakeDateFlow.snowflakeDateFlow(firstFlow,fields,flowStringMap,flowKey,calculatedFieldMap);
        flowStringMap.put(flowKey, dateFlow);
    }

    @Override
    public String composeSampleRecordQuery(String selectField, Set<String> allColumnList, DataSchema dataSchema,
            Integer recordCount) throws BadRequestException {

        StringBuilder query = new StringBuilder("SELECT \n\t");
        query.append(selectField);
        
        if(((!allColumnList.isEmpty()&&allColumnList.size()!=0))) {
                                    
        String fromClause = RelationshipClauseGeneric.buildRelationship(new ArrayList<>(allColumnList),dataSchema,vendor);

        query.append("\nFROM ").append(fromClause);
        }
        query.append( "\nLIMIT ").append(recordCount);

        return query.toString();
    }
}
