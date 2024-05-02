package com.silzila.helper;

import com.silzila.exception.ExpectationFailedException;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Iterator;

public class JsonValidator {
    public static void validate(String jsonStr) throws ExpectationFailedException {
        try{
            JSONArray jsonArray = new JSONArray(jsonStr);

            JSONObject jsonObject = (JSONObject)jsonArray.get(0);
            for (String key : jsonObject.keySet()) {
                if (jsonObject.get(key) instanceof JSONArray || jsonObject.get(key) instanceof JSONObject) {
                    throw new ExpectationFailedException("Invalid JSON format: array/object found for key '" + key + "'");
                }
            }

        }catch(Exception e){
            throw new ExpectationFailedException("JSON Object not in the expected format");
        }

    }
}
