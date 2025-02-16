package com.silzila.querybuilder.CalculatedField;


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


public interface QueryBuilder {

    //handling multiple request
    public void processConditionalFlow(List<Flow> flows,
                                        Map<String, List<Flow>> flowMap,
                                        Map<String, FlowDTO> flowStringMap,
                                        Map<String, List<ConditionFilter>> conditionFilterMap,
                                        Map<String, String> conditionFilterStringMap,
                                        Map<String, Field> fields,
                                        String flowKey,Map<String,CalculatedFieldDTO> calculatedFieldMap,DataSchema ds) throws BadRequestException;


    public void processNonConditionalMathFlow(DataSchema dataschema,
                                                Flow flow,
                                                Map<String, Field> fields,
                                                Map<String, FlowDTO> flowStringMap,
                                                String flowKey,
                                                Map<String,CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException;

    public  void processNonConditionalTextFlow(Flow firstFlow,
                                               Map<String, Field> fields, 
                                               Map<String, FlowDTO> flowStringMap, 
                                               String flowKey,Map<String,
                                               CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException;

    public void processNonConditionalDateFlow(Flow firstFlow, 
                                              Map<String, Field> fields, 
                                              Map<String, FlowDTO> flowStringMap, 
                                              String flowKey,Map<String,
                                              CalculatedFieldDTO> calculatedFieldMap) throws BadRequestException;
    
    public  String composeSampleRecordQuery(String selectField,Set<String> allColumnList,DataSchema dataSchema,Integer recordCount) throws BadRequestException;


}
