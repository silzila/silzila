package com.silzila.querybuilder;

import com.silzila.payload.request.Filter;

public class NullClauseGenerator {
    
    public static String generateNullCheckQuery(Filter filter,  String nullExclusionOperator) {

        String nullCondition = "";
        if (filter.getUserSelection().contains("null")) {
            String logicalOperator = filter.getShouldExclude() ? " AND " : " OR ";
            nullCondition = logicalOperator + filter.getTableId() + "." + filter.getFieldName() + " IS " + nullExclusionOperator + "NULL";
        }
    
        return nullCondition;
    }
    
}
