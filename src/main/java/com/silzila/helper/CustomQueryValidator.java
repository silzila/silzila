package com.silzila.helper;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;


@Component
public class CustomQueryValidator {
    public static boolean customQueryValidator(String query) {
        return Pattern.compile("^SELECT\\b(?!\\s*(?:CREATE|DELETE|UPDATE)\\b).*", Pattern.CASE_INSENSITIVE).matcher(query).find();
    }
}
