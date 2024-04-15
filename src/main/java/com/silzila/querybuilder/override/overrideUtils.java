package com.silzila.querybuilder.override;

import java.util.Map;

import com.silzila.payload.request.Measure;

public class overrideUtils {
    
    public static void incrementAliasNumber(Map<String, Integer> aliasNumbering, Map<String, Integer> aliasNumberingM, Measure measure) {
        if (aliasNumbering != null && aliasNumberingM != null && !aliasNumbering.isEmpty() && !aliasNumberingM.isEmpty()) {
            for (String key : aliasNumberingM.keySet()) {
                for (String key1 : aliasNumbering.keySet()) {
                    if (key.equals(measure.getFieldName()) && key.equals(key1) && aliasNumbering.get(key).equals(aliasNumberingM.get(key1))) {
                        aliasNumbering.put(key, aliasNumbering.get(key) + 1);
                    }
                }
            }
        }
    }
    
}
