package com.silzila.querybuilder.override;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
            List<Dimension> combinedDimensions, List<Dimension> baseDimensions, String vendorName, Measure windowMeasure) throws BadRequestException {
        
  

        String overrideQuery = "";

        // window function
       
        

        // remove last in leftover before
       combinedDimensions.remove(combinedDimensions.size() - 1);
        
        for (int k = 0; k < leftOverDimension.size(); k++) {

            Map<String, Integer> aliasNumbering = new HashMap<>();

            for (Dimension dim : combinedDimensions) {
                String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                dim.setTableId("tbl" + (tblNum - 1));
                dim.setFieldName(alias);
            }

            reqCTE.getMeasures().get(0).setTableId("tbl" + (tblNum - 1));

            reqCTE.setDimensions(combinedDimensions);

            if(k == leftOverDimension.size() - 1 && windowMeasure != null){
                reqCTE.setMeasures(Collections.singletonList(windowFnDimPartition(baseDimensions,leftOverDimension,reqCTE,windowMeasure)));
            }


            QueryClauseFieldListMap qMapOd = SelectClauseMysql.buildSelectClause(reqCTE, vendorName);

            String selectClauseOd = "\n\t"
                    + qMapOd.getSelectList().stream().collect(Collectors.joining(",\n\t"));
            String groupByClauseOd = "\n\t"
                    + qMapOd.getGroupByList().stream().distinct().collect(Collectors.joining(",\n\t"));

            overrideQuery += ", tbl" + tblNum + " AS ( SELECT " + selectClauseOd + " FROM tbl"
                    + (tblNum - 1);

            if (combinedDimensions.size() > 0) {
                overrideQuery += " GROUP BY " + groupByClauseOd + " )";
                combinedDimensions.remove(combinedDimensions.size() - 1);
            } else {
                overrideQuery += " )";
            }

            tblNum++;
        }

        return overrideQuery;
    }

    private static Measure windowFnDimPartition(List<Dimension> baseDimensions, List<Dimension> leftoverDimensions, Query reqCTE, Measure windowMeasure) {
        int rowPartition = windowMeasure.getWindowFnPartition()[0];
        int colPartition = windowMeasure.getWindowFnPartition()[1];

        List<Dimension> rowDimensions = new ArrayList<>();
        List<Dimension> columnDimensions = new ArrayList<>();
        int rowNum = 0;
        int columnNum = 0;
        
    
        if (windowMeasure != null) {
            rowNum = windowMeasure.getWindowFnMatrix()[0];
            columnNum = windowMeasure.getWindowFnMatrix()[1];
    
            for (int i = 0; i < baseDimensions.size(); i++) {
                baseDimensions.get(i).setDataType(DataType.TEXT);
                if (i < rowNum) {
                    rowDimensions.add(baseDimensions.get(i));
                } else  {
                    columnDimensions.add(baseDimensions.get(i)); 
                }
            }
            

            for (Dimension baseDim : baseDimensions) {
                for (Dimension leftDim : leftoverDimensions) {
                    if (baseDim.equals(leftDim)) {
                        if (rowDimensions.contains(baseDim)) {
                            rowNum--;
                        }
                        if (columnDimensions.contains(baseDim)) {
                            columnNum--;
                        }
                    }
                }
            }
        }

   
    
        // Calculate new windowFnMatrix
        int[] newMatrix = {rowNum, columnNum};
        windowMeasure.setWindowFnMatrix(newMatrix);
    
        // Calculate new rowPartition and colPartition
        rowPartition = calculatePartition(rowNum, rowPartition);
        colPartition = calculatePartition(columnNum, colPartition);
    
        // Update windowMeasure
        windowMeasure.setWindowFnPartition(new int[]{rowPartition, colPartition});
    
    
        if ("standing".equals(windowMeasure.getWindowFn()[0])) {
            return buildMeasure(reqCTE, windowMeasure);
        } else {
            int orderPartition =0;
            windowMeasure.setWindowFnPartition(new int[]{rowPartition, colPartition, orderPartition});
            return buildMeasure(reqCTE, windowMeasure);
        }
    }
    
    private static int calculatePartition(int num, int partition) {
        if (num < partition + 1 && partition != -1 || num == 0) {
            if (num == 0 && num <= partition) {
                return -1;
            } else {
                int value = (partition + 1) - num;
                return partition - value;
            }
        }
        return partition;
    }
    
    private static Measure buildMeasure(Query reqCTE, Measure windowMeasure) {
        Measure Meas = reqCTE.getMeasures().get(0);
        return Measure.builder()
                .tableId(Meas.getTableId())
                .fieldName(Meas.getFieldName())
                .dataType(Meas.getDataType())
                .timeGrain(Meas.getTimeGrain())
                .aggr(Meas.getAggr())
                .windowFn(windowMeasure.getWindowFn())
                .windowFnOption(windowMeasure.getWindowFnOption())
                .windowFnMatrix(windowMeasure.getWindowFnMatrix())
                .windowFnPartition(windowMeasure.getWindowFnPartition())
                .build();
    }

        public static String windowQuery(String CTEQuery, HashMap<String,Measure> windowMeasure, Query baseQuery, String vendorName) throws BadRequestException{
            String finalQuery = "";

           
            
            List<String> nonWnMeasure = new ArrayList<>();
            List<Measure> overrideMeasures = new ArrayList<>();
            Map<String, Integer> aliasNumberingM = new HashMap<>();
            for(Measure meas : baseQuery.getMeasures()){
                String alias = AilasMaker.aliasing(meas.getFieldName(),aliasNumberingM);
                nonWnMeasure.add(alias);
            }

            Map<String, Integer> aliasNumbering = new HashMap<>();
            for(Dimension dim : baseQuery.getDimensions()){
               String alias = AilasMaker.aliasing(dim.getFieldName(),aliasNumbering);
                dim.setTableId("wnCTE");
                dim.setDataType(DataType.TEXT);
                dim.setFieldName(alias);
            }
            

            for (HashMap.Entry<String,Measure> entry : windowMeasure.entrySet()) {
                String key = entry.getKey();
                if(windowMeasure.get(key).getWindowFn()[0]!=null){
                    Measure value = windowMeasure.get(key);
                    value.setTableId("wnCTE");
                    value.setFieldName(key);
                    overrideMeasures.add(value);
                }
                else{
                    nonWnMeasure.add(key);
                }
                
            }

            baseQuery.setMeasures(overrideMeasures);
            QueryClauseFieldListMap qMapOd = SelectClauseMysql.buildSelectClause(baseQuery, vendorName);

            String selectClauseOd = "\n\t"
                    + qMapOd.getSelectList().stream().collect(Collectors.joining(",\n\t"));
            String groupByClauseOd = "\n\t"
                    + qMapOd.getGroupByList().stream().distinct().collect(Collectors.joining(",\n\t"));
            String orderByClause = "\n\t" + qMapOd.getOrderByList().stream().distinct().collect(Collectors.joining(",\n\t"));

           
            
           finalQuery  += "WITH wnCTE as (" + CTEQuery ;
           finalQuery += ") SELECT ";
           finalQuery += selectClauseOd;
           if(nonWnMeasure.size()>0){
               for(String s : nonWnMeasure){
                   finalQuery += " ," + s;
               } 
           }
          

           finalQuery += " FROM wnCTE \nGROUP BY " ;
           finalQuery += groupByClauseOd;
           finalQuery += "\nORDER BY";
           finalQuery += orderByClause;

           System.out.println(finalQuery);

            return finalQuery;
        }
    
    
}