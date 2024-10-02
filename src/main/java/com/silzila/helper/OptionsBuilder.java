package com.silzila.helper;

import java.util.List;
import java.util.stream.Collectors;

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
}

