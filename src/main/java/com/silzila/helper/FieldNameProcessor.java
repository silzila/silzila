package com.silzila.helper;


public class FieldNameProcessor {
    
    public static String formatFieldName(String name) {
 
        String result = name.replaceAll("([a-z])([A-Z]+)", "$1_$2").toLowerCase();

        result = result.replaceAll("[^a-zA-Z0-9\\s]", "_");

        result = result.replaceAll("\\s+", "_");

        return result;
    }

}

