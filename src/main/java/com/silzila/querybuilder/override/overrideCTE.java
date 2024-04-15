package com.silzila.querybuilder.override;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.silzila.exception.BadRequestException;
import com.silzila.helper.AilasMaker;
import com.silzila.payload.internals.QueryClauseFieldListMap;
import com.silzila.payload.request.Dimension;
import com.silzila.payload.request.Measure;
import com.silzila.payload.request.Query;
import com.silzila.payload.request.Dimension.DataType;
import com.silzila.querybuilder.SelectClauseMysql;

public class overrideCTE {

public static String joinCTE(int tblNum, List<Dimension> commonDimensions, List<String> joinValues) {
    String join = "";
    // Create a map to keep track of alias numbering
    Map<String, Integer> aliasNumbering = new HashMap<>();

    if (commonDimensions.size() != joinValues.size()) {
        throw new IllegalArgumentException("Sizes of commonDimensions and joinValues must be the same");
    }

    if (commonDimensions.isEmpty()) {
        // If there are no common dimensions, use cross join
        join = " \nCROSS JOIN " + " \n\ttbl" + tblNum;
    } else {
        // If there are common dimensions, use left join
        join += " \nLEFT JOIN " + " \n\ttbl" + tblNum + " ON ";
        for (int l = 0; l < commonDimensions.size(); l++) {
            Dimension dim = commonDimensions.get(l);
            // Generate an alias for the dimension
            String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
            // Append the join condition to the join clause
            join += "tbl1" + "." + joinValues.get(l) + " = tbl" + tblNum + "." + alias;
            // Add "and" if it's not the last join condition
            if (l < commonDimensions.size() - 1) {
                join += " AND ";     
            }
        }
    }

    return join;
}


    public static List<String>  joinValues(List<Dimension> commonDimensions, List<Dimension> baseDimensions) {
        List<String> joinValues = new ArrayList<String>();
        // Create a map to keep track of alias numbering
        Map<String, Integer> aliasNumbering = new HashMap<>();
    
        // Iterate over base dimensions
        for (Dimension dim : baseDimensions) {
            // Generate an alias for the dimension
            String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
            // Check if the dimension is common and add the alias to the join values list
            if (commonDimensions.contains(dim)) {
                if (alias == null || alias.isEmpty()) {
                    throw new IllegalStateException("Alias not found for dimension: " + dim.getFieldName());
                }
                joinValues.add(alias);
            }
        }
    
        return joinValues;
    }

    public static String overrideCTEq(int tblNum, Query reqCTE, List<Dimension> leftOverDimension,
                                   List<Dimension> combinedDimensions, String vendorName) throws BadRequestException {

    StringBuilder overrideQuery = new StringBuilder();
    try{
    // Iterate over leftover dimensions
    for (Dimension leftOverDim : leftOverDimension) {
        combinedDimensions.remove(combinedDimensions.size() - 1); // Remove last dimension

        // Set tableId and fieldName for combinedDimensions
        Map<String, Integer> aliasNumbering = new HashMap<>();
            for (Dimension dim : combinedDimensions) {
                String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                dim.setTableId("tbl" + (tblNum - 1));

                //to maintain alias sequence
                String[] parts = reqCTE.getMeasures().get(0).getFieldName().split("_(?=[0-9])");
                if (parts.length == 2) {
                    String key = parts[0];
                    if (aliasNumbering.containsKey(key) && aliasNumbering.get(key).equals(Integer.parseInt(parts[1]) - 1)) {
                        aliasNumbering.put(key, aliasNumbering.get(key) + 1);
                    }
                }
                
                dim.setFieldName(alias);
            }


        // Set tableId for measures in reqCTE
        reqCTE.getMeasures().get(0).setTableId("tbl" + (tblNum - 1));

        reqCTE.setDimensions(combinedDimensions);

        QueryClauseFieldListMap qMapOd = SelectClauseMysql.buildSelectClause(reqCTE, vendorName);

        // Build SELECT and GROUP BY clauses
        String selectClauseOd = "\n\t"
                + qMapOd.getSelectList().stream().collect(Collectors.joining(",\n\t"));
        String groupByClauseOd = "\n\t"
                + qMapOd.getGroupByList().stream().distinct().collect(Collectors.joining(",\n\t"));

        // Build override query
        overrideQuery.append(", \ntbl").append(tblNum).append(" AS ( SELECT ").append(selectClauseOd)
                .append(" \nFROM tbl").append(tblNum - 1);

        if (!combinedDimensions.isEmpty()) {
            overrideQuery.append(" \nGROUP BY ").append(groupByClauseOd).append(" )");
        } else {
            overrideQuery.append(" )");
        }

        tblNum++;
    }
    } catch(Exception e) {
        throw new BadRequestException("An error occurred while overriding CTE query: " + e.getMessage());
    }
    return overrideQuery.toString();
}





public static String windowQuery(String CTEQuery, String CTEmainQuery, List<Dimension> baseDimensions, HashMap<String, Measure> windowMeasure, Query baseQuery, String vendorName) throws BadRequestException {
    StringBuilder finalQuery = new StringBuilder();

    List<String> nonWnMeasure = new ArrayList<>();
    List<Measure> overrideMeasures = new ArrayList<>();



    // Set tableId, dataType, and fieldName for dimensions
    Map<String, Integer> aliasNumbering = new HashMap<>();
    for (Dimension dim : baseQuery.getDimensions()) {
        // Generate alias for the dimension
        String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
        dim.setTableId("wnCTE");
        dim.setDataType(DataType.TEXT);
        dim.setFieldName(alias);
    }

    // Generate non-window measures
    // separate aliasNumbering for measure and dimensions --> avoid fieldname collision
    for (Measure meas : baseQuery.getMeasures()) {
        // Generate alias for the measure
        String alias = AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
        nonWnMeasure.add(alias);
    }

    // Process window measures
    for (HashMap.Entry<String, Measure> entry : windowMeasure.entrySet()) {
        String key = entry.getKey();
        Measure value = entry.getValue();
        if (value.getWindowFn()[0] != null) {
            // Set tableId and fieldName for window measures
            value.setTableId("wnCTE");
            value.setFieldName(key);
            overrideMeasures.add(value);
        } else {
            // Add non-window measures to the list
            nonWnMeasure.add(key);
        }
    }

    baseQuery.setMeasures(overrideMeasures);

    // Build SELECT and GROUP BY clauses
    QueryClauseFieldListMap qMapOd = SelectClauseMysql.buildSelectClause(baseQuery, vendorName);
    String selectClauseOd = "\n\t" + qMapOd.getSelectList().stream().collect(Collectors.joining(",\n\t"));
    String groupByClauseOd = "\n\t" + qMapOd.getGroupByList().stream().distinct().collect(Collectors.joining(",\n\t"));

    // Build final query
    finalQuery.append(CTEQuery)
              .append(" ,\nwnCTE as (")
              .append(CTEmainQuery)
              .append(") \nSELECT ")
              .append(selectClauseOd);

    // Add non-window measures to the SELECT clause
    if (!nonWnMeasure.isEmpty()) {
        nonWnMeasure.forEach(s -> finalQuery.append(", ").append("\n\t" + s));
    }

    // Add FROM and GROUP BY clauses
    finalQuery.append(" \nFROM  \n\twnCTE \nGROUP BY ").append(groupByClauseOd);

    // Add non-window measures to the GROUP BY clause
    if (!nonWnMeasure.isEmpty()) {
        nonWnMeasure.forEach(s -> finalQuery.append(", ").append("\n\t"+s));
    }

    // Add ORDER BY clause
    finalQuery.append("\nORDER BY ").append(generateOrderByClause(baseDimensions, "wnCTE"));

    return finalQuery.toString();
}



    
    
public static String generateOrderByClause(List<Dimension> baseDimensions, String cte) {
    StringBuilder orderByClause = new StringBuilder();

    Map<String, Integer> aliasNumberingOrder = new HashMap<>();
    for (int i = 0; i < baseDimensions.size(); i++) {
        String fieldName = baseDimensions.get(i).getFieldName();
        String alias = AilasMaker.aliasing(fieldName, aliasNumberingOrder);

        // Check if the dimension is of type MONTH
        if ("MONTH".equals(baseDimensions.get(i).getTimeGrain().name())) {
            orderByClause.append(" \n\tCASE ");
            orderByClause.append(cte).append(".").append(alias).append(" ");
            orderByClause.append("WHEN 'January' THEN 1 ");
            orderByClause.append("WHEN 'February' THEN 2 ");
            orderByClause.append("WHEN 'March' THEN 3 ");
            orderByClause.append("WHEN 'April' THEN 4 ");
            orderByClause.append("WHEN 'May' THEN 5 ");
            orderByClause.append("WHEN 'June' THEN 6 ");
            orderByClause.append("WHEN 'July' THEN 7 ");
            orderByClause.append("WHEN 'August' THEN 8 ");
            orderByClause.append("WHEN 'September' THEN 9 ");
            orderByClause.append("WHEN 'October' THEN 10 ");
            orderByClause.append("WHEN 'November' THEN 11 ");
            orderByClause.append("WHEN 'December' THEN 12 ");
            orderByClause.append("ELSE 0 END");
        }
        // Check if the dimension is of type DAYOFWEEK
        else if ("DAYOFWEEK".equals(baseDimensions.get(i).getTimeGrain().name())) {
            orderByClause.append(" \n\tCASE ");
            orderByClause.append(cte).append(".").append(alias).append(" ");
            orderByClause.append("WHEN 'Sunday' THEN 1 ");
            orderByClause.append("WHEN 'Monday' THEN 2 ");
            orderByClause.append("WHEN 'Tuesday' THEN 3 ");
            orderByClause.append("WHEN 'Wednesday' THEN 4 ");
            orderByClause.append("WHEN 'Thursday' THEN 5 ");
            orderByClause.append("WHEN 'Friday' THEN 6 ");
            orderByClause.append("WHEN 'Saturday' THEN 7 ");
            orderByClause.append("ELSE 0 END");
        }
        // For other types, just append the alias
        else {
            orderByClause.append("\n\t"+ cte).append(".").append(alias);
        }

        if (i < baseDimensions.size() - 1) {
            orderByClause.append(",");
        }
    }

    return orderByClause.toString();
}

}