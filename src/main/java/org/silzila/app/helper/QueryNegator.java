package org.silzila.app.helper;

import java.util.List;

public class QueryNegator {

    // AT Expression level,
    // check if Negative match or Positive match when contructing WHERE Clause
    public static String makeNagateExpression(Boolean shouldExclude, List<String> userSelection) {
        String excludeString = "";
        if (shouldExclude) {
            // a. exclude single value, eg. city != 'Paris'
            if (userSelection.size() == 1) {
                excludeString = "!";
            }
            // b. exclude multiple values, eg. city NOT IN ('Paris', 'Chennai')
            else if (userSelection.size() > 1) {
                excludeString = "NOT";
            }
        }
        return excludeString;
    }

    // AT Condition level,
    // check if Negative match or Positive match when contructing WHERE Clause
    public static String makeNegateCondition(Boolean excludeFlag) {
        String excludeString = "";
        // when true string is "NOT" and when false string is empty
        if (excludeFlag.equals(true)) {
            excludeString = "NOT ";
        }
        return excludeString;

    }
}
