package com.silzila.querybuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.h2.expression.Alias;

import com.silzila.helper.AilasMaker;
import com.silzila.payload.request.Dimension;
import com.silzila.payload.request.Measure;
import com.silzila.payload.request.Query;

public class RelativeCalendarFilter {

    public static String buildRelativeCalendarFilter(Query req, String CTEquery, String relativeType) {

        Map<String, Integer> aliasNumbering = new HashMap<>();

        String CTEqueryString = "WITH CTE AS (\n" + CTEquery + "\n) \n";

        List<Dimension> dimensions = req.getDimensions();

        List<Measure> measures = req.getMeasures();

        List<String> selectWindowClause = new ArrayList<>();

        for (Measure measure : measures) {

            String alias = AilasMaker.aliasing(measure.getFieldName(), aliasNumbering);
            String field = measure.getAggr().name() + "(" + alias
                    + ") over (" + partitionBy(dimensions) + ")";
            selectWindowClause.add(field);
        }

        StringBuilder finalRelativeQuery = new StringBuilder();
        finalRelativeQuery.append(CTEqueryString);
        finalRelativeQuery.append("Select * , ");
        finalRelativeQuery.append(String.join(", ", selectWindowClause));
        finalRelativeQuery.append("\n from CTE");

        return finalRelativeQuery.toString();
    }

    public static String partitionBy(List<Dimension> dimensions) {

        String partitionQuery = "";
        List<Dimension> DimensionWithoutDate = new ArrayList<>();
        for (int i = 0; i < dimensions.size(); i++) {
            Dimension dim = dimensions.get(i);
            if (!("date".equals(dim.getDataType().toString()) || "timestamp".equals(dim.getDataType().toString()))) {
                DimensionWithoutDate.add(dim);
            }
        }
        StringBuilder partitionClause = new StringBuilder();
        for (int i = 0; i < DimensionWithoutDate.size(); i++) {
            Dimension dim = DimensionWithoutDate.get(i);
            partitionClause.append(dim.getFieldName());
            if (i < DimensionWithoutDate.size() - 1) {
                partitionClause.append(", ");
            }
        }

        if (DimensionWithoutDate.size() > 0) {
            partitionQuery = " partition by " + partitionClause.toString();
        }
        return partitionQuery;
    }
}
