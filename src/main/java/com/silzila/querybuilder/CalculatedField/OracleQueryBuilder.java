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
import com.silzila.querybuilder.CalculatedField.DateFlow.OracleDateFlow;
import com.silzila.querybuilder.CalculatedField.MathFlow.OracleMathFlow;
import com.silzila.querybuilder.CalculatedField.TextFlow.OracleTextFlow;

public class OracleQueryBuilder implements QueryBuilder{
    
   @Override
   public void processConditionalFlow(List<Flow> flows,
                                        Map<String, List<Flow>> flowMap,
                                        Map<String, FlowDTO> flowStringMap,
                                        Map<String, List<ConditionFilter>> conditionFilterMap,
                                        Map<String, String> conditionFilterStringMap,
                                        Map<String, Field> fields,
                                        String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap,DataSchema ds) throws BadRequestException {

            ConditionFlow.processConditionalFlow("oracle", flows, flowMap, flowStringMap, conditionFilterMap, conditionFilterStringMap, fields, flowKey, calculatedFieldMap,ds);
    }

    @Override
    public void processNonConditionalMathFlow(DataSchema dataSchema,
                                                  Flow flow,
                                                  Map<String, Field> fields,
                                                  Map<String, FlowDTO> flowStringMap,
                                                  String flowKey,
                                                  Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
        OracleMathFlow.oracleMathFlow(dataSchema,flow, fields, flowStringMap, flowKey, calculatedFieldMap);
    }

    @Override
    public void processNonConditionalTextFlow(Flow firstFlow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap, String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException {
        FlowDTO textFlow = OracleTextFlow.oracleTextFlow(firstFlow, fields, flowStringMap, flowKey, calculatedFieldMap);
        flowStringMap.put(flowKey,textFlow);
    }

    @Override
    public void processNonConditionalDateFlow(Flow firstFlow, Map<String, Field> fields, Map<String, FlowDTO> flowStringMap, String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException{
        FlowDTO dateFlow = OracleDateFlow.oracleDateFlow(firstFlow,fields,flowStringMap,flowKey,calculatedFieldMap);
        flowStringMap.put(flowKey, dateFlow);
    }

    @Override
    public String composeSampleRecordQuery(String selectField, Set<String> allColumnList, DataSchema dataSchema,
            Integer recordCount) throws BadRequestException {

        StringBuilder query = new StringBuilder("SELECT \n\t");
        query.append(selectField);
        
        if(((!allColumnList.isEmpty()&&allColumnList.size()!=0))) {
                                    
        String fromClause = RelationshipClauseGeneric.buildRelationship(new ArrayList<>(allColumnList),dataSchema,"oracle");

        query.append("\nFROM ").append(fromClause);
        }
        else{
            query.append("\nFROM DUAL ");
        }
        query.append( "\nFETCH FIRST ").append(recordCount).append(" ROWS ONLY");


        return query.toString();
    }
}
