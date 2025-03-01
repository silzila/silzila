package com.silzila.helper;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.silzila.payload.request.Filter;

public class OptionsBuilder {

    // Method to build options for integers,decimal and boolean
    public static String buildIntegerOptions(List<String> userSelection) {
        return userSelection.stream()
                .filter(value -> value != null && !"null".equalsIgnoreCase(value)) 
                .collect(Collectors.joining(", "));
    }

    
    public static String buildStringOptions(List<String> userSelection) {
        return userSelection.stream()
                .filter(value -> value != null && !"null".equalsIgnoreCase(value)) 
                .map(value -> "'" + value + "'") 
                .collect(Collectors.joining(", "));
    }
    public static String buildSingleOption(Filter filter, String excludeOperator, String field, Map<String, String> comparisonOperator) {

        String value = filter.getUserSelection().get(0);

        String formattedValue = "static".equals(filter.getConditionType().getRightOperandType()) ? "'" + value + "'" : value;

        return excludeOperator + field + comparisonOperator.get(filter.getOperator().name()) + formattedValue;
    }

    public static String buildBetweenOptions(Filter filter, String excludeOperator, String field) {

        String lowerBound = filter.getUserSelection().get(0);
        String upperBound = filter.getUserSelection().get(1);

        String formattedLower = "static".equals(filter.getConditionType().getRightOperandType()) ? lowerBound : "'" + lowerBound + "'";
        String formattedUpper = "static".equals(filter.getConditionType().getRightOperandType()) ? upperBound : "'" + upperBound + "'";
        
        return excludeOperator + field + " BETWEEN " + formattedLower + " AND " + formattedUpper;
    }
}

