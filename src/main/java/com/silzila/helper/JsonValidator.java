package com.silzila.helper;

import org.json.JSONArray;
import org.json.JSONObject;

import com.silzila.exception.ExpectationFailedException;

public class JsonValidator {
    public static void validate(String jsonStr) throws ExpectationFailedException {
        try {
            if (jsonStr.startsWith("[") && jsonStr.endsWith("]")) {
                //System.out.println("file");
                jsonStr = jsonStr.substring(1, jsonStr.length() - 1);
            }
            JSONObject jsonObject = new JSONObject(jsonStr);

            // Check if the JSON object contains any arrays

            for (String key : jsonObject.keySet()) {
                if (jsonObject.get(key) instanceof JSONArray || jsonObject.get(key) instanceof JSONObject) {
                    throw new ExpectationFailedException("Invalid JSON format: array found for key '" + key + "'");
                }
            }
        } catch(Exception e){
                throw new ExpectationFailedException("JSON Object not in the expected format");
            }

        }
}