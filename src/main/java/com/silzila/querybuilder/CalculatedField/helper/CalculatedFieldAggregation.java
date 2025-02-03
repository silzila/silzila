package com.silzila.querybuilder.CalculatedField.helper;


import java.util.List;

public class CalculatedFieldAggregation {

    public static String buildAggregationExpression(String aggr, String sourceString) {

        List<String> aggrList = List.of("SUM", "AVG", "MIN", "MAX");

        String aggregatedField = "";

        if (aggrList.contains(aggr.toUpperCase())) {
            aggregatedField = aggr.toUpperCase() + "(" + sourceString + ")";
        } else if (aggr.equals("count")) {
            aggregatedField = "COUNT(*)";
        } else if (aggr.equals("countnn")) {
            aggregatedField = "COUNT(" + sourceString + ")";
        } else if (aggr.equals("countu")) {
            aggregatedField = "COUNT(DISTINCT " + sourceString + ")";
        } else if (aggr.equals("countn")) {
            aggregatedField = "SUM(CASE WHEN " + sourceString
                    + " IS NULL THEN 1 ELSE 0 END)";
        }

        return aggregatedField;
    }
}

