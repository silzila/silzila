package com.silzila.helper;

import java.util.Map;

public class AilasMaker {

    public static String aliasing(String fieldName, Map<String, Integer> aliasNumbering) {
        if (!aliasNumbering.containsKey(fieldName)) {
            aliasNumbering.put(fieldName, 1);
            return fieldName;
        } else {
            Integer count = aliasNumbering.get(fieldName);
            aliasNumbering.put(fieldName, count + 1);
            return fieldName + "_" + String.valueOf(count + 1);
        }
    }

}
