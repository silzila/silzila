package com.silzila.helper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.silzila.exception.ExpectationFailedException;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Iterator;

public class JsonValidator {
    public static void validate(String jsonStr) throws ExpectationFailedException {
        try {

            // JSONArray jsonArray = new JSONArray(jsonStr);
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


            }catch(Exception e){
                throw new ExpectationFailedException("JSON Object not in the expected format");
            }

        }
        }