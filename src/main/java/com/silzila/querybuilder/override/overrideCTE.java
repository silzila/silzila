package com.silzila.querybuilder.override;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.silzila.exception.BadRequestException;
import com.silzila.helper.AilasMaker;
import com.silzila.payload.internals.QueryClauseFieldListMap;
import com.silzila.payload.request.Dimension;
import com.silzila.payload.request.Query;
import com.silzila.payload.request.Dimension.DataType;
import com.silzila.querybuilder.SelectClauseMysql;

public class overrideCTE {

    public static String joinCTE(int tblNum, List<Dimension> commonDimensions, List<String> joinValues) {

        String join = "";

        Map<String, Integer> aliasNumbering = new HashMap<>();

        if (commonDimensions.isEmpty()) {
            join = " \ncross join " + "tbl" + (tblNum);
        } else {
            join += " \nleft join " + "tbl" + (tblNum) + " on ";
            int dimensionCount = commonDimensions.size();
            for (int l = 0; l < dimensionCount; l++) {
                Dimension dim = commonDimensions.get(l);

                String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                join += "tbl1" + "." + joinValues.get(l) + " = tbl" + (tblNum) + "."
                        + alias;
                if (l < dimensionCount - 1) {
                    join += " and ";
                }
            }
        }

        return join;
    }

    public static List<String> joinValues(List<Dimension> commonDimensions, List<Dimension> baseDimensions) {

        List<String> joinValues = new ArrayList<String>();
        Map<String, Integer> aliasNumbering = new HashMap<>();

        for (Dimension dim : baseDimensions) {
            String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
            if (commonDimensions.contains(dim)) {
                joinValues.add(alias);
            }
        }

        return joinValues;

    }

    public static String overrideCTEq(int tblNum, Query reqCTE, List<Dimension> leftOverDimension,
            List<Dimension> combinedDimensions, List<Dimension> baseDimensions, String vendorName) throws BadRequestException {
        combinedDimensions.remove(combinedDimensions.size() - 1);

        String overrideQuery = "";

        // window function
        List<Dimension> rowDimensions = new ArrayList<>();

        List<Dimension> columnDimensions = new ArrayList<>();

        List<Dimension> Dimensions = reqCTE.getDimensions();

        
        for (int k = 0; k < leftOverDimension.size(); k++) {

            Map<String, Integer> aliasNumbering = new HashMap<>();

            for (Dimension dim : combinedDimensions) {
                String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                dim.setTableId("tbl" + (tblNum - 1));
                dim.setFieldName(alias);
            }

            reqCTE.getMeasures().get(0).setTableId("tbl" + (tblNum - 1));

            reqCTE.setDimensions(combinedDimensions);

            QueryClauseFieldListMap qMapOd = SelectClauseMysql.buildSelectClause(reqCTE, vendorName);

            String selectClauseOd = "\n\t"
                    + qMapOd.getSelectList().stream().collect(Collectors.joining(",\n\t"));
            String groupByClauseOd = "\n\t"
                    + qMapOd.getGroupByList().stream().distinct().collect(Collectors.joining(",\n\t"));

            overrideQuery += ", tbl" + tblNum + " AS ( SELECT " + selectClauseOd + " FROM tbl"
                    + (tblNum - 1);

            if (combinedDimensions.size() > 0) {
                overrideQuery += " GROUP BY " + groupByClauseOd + " )";
                Dimension removeItem = combinedDimensions.remove(combinedDimensions.size() - 1);
            } else {
                overrideQuery += " )";
            }

            tblNum++;
        }

        return overrideQuery;
    }
}