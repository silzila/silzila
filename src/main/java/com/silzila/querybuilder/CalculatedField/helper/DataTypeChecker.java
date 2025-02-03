package com.silzila.querybuilder.CalculatedField.helper;

import java.util.List;
import java.util.Map;

import com.silzila.dto.FlowDTO;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Flow;



public class DataTypeChecker {
    

    public static String dataTypeChecker(List<Flow> flows, Map<String, Field> fields, Map<String, FlowDTO> flowMap) throws IllegalArgumentException {

        String commonDataType = null;
    
        for (Flow flow : flows) {
            String source = flow.getSource().get(0);
            String sourceType = flow.getSourceType().get(0);
    
            String currentDataType = "";
    
            if (sourceType.equals("field")) {
                currentDataType = fields.get(source).getDataType().toString();
            } else if (sourceType.equals("flow")) {
                currentDataType = flowMap.get(source).getDataType();
            } else {
                currentDataType = sourceType;
            }
    
            if (commonDataType == null) {
                commonDataType = currentDataType;
            } else if (!commonDataType.equals(currentDataType)) {
                throw new IllegalArgumentException(
                    String.format("Data type mismatch: expected '%s' but found '%s'", commonDataType, currentDataType)
                );
            }
        }
    
        return commonDataType != null ? commonDataType : "No data type found";
    }
    
}
