package com.silzila.querybuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import com.silzila.exception.BadRequestException;
import com.silzila.helper.AilasMaker;
import com.silzila.payload.internals.QueryClauseFieldListMap;
import com.silzila.payload.request.Dimension;
import com.silzila.payload.request.Measure;
import com.silzila.payload.request.Query;
//window function created to analyse ranking, sliding like running total, moving average etc., standing vs sliding like difference fom, percentage difference from etc.,  
public class SelectClauseWindowFunction {

    //retrieve datas from given database
    public static QueryClauseFieldListMap selectClauseSql(Query dim, String vendorName) throws BadRequestException {
        QueryClauseFieldListMap qMap = new QueryClauseFieldListMap();
        if ("mysql".equals(vendorName)) {
            qMap = SelectClauseMysql.buildSelectClause(dim, vendorName);
        } else if ("duckdb".equals(vendorName)) {
            qMap = SelectClauseMysql.buildSelectClause(dim, vendorName);
        } else if ("sqlserver".equals(vendorName)) {
            qMap = SelectClauseSqlserver.buildSelectClause(dim, vendorName);
        } else if ("postgresql".equals(vendorName)) {
            qMap = SelectClausePostgres.buildSelectClause(dim, vendorName);
        } else if("bigquery".equals(vendorName)){
            qMap = SelectClauseBigquery.buildSelectClause(dim, vendorName);
        } else if ("databricks".equals(vendorName)) {
            qMap = SelectClauseDatabricks.buildSelectClause(dim, vendorName);
        } else if ("redshift".equals(vendorName)) {
            qMap = SelectClausePostgres.buildSelectClause(dim, vendorName);
        } else {
            throw new BadRequestException("Unsupported vendor: " + vendorName);
        }
        return qMap;
    }
    //get all datas from given database
    public static List<String> getDimension(Query req, String vendorName) throws BadRequestException{
        Query query = new Query(req.getDimensions(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
        QueryClauseFieldListMap qMap = selectClauseSql(query, vendorName);
        List<String> dimension = qMap.getGroupByList().stream().collect(Collectors.toList());
        return dimension;
    }
    //get ordering value for analytical functions
    public static String sortingFunction(List<String> finalPartitionList, List<String> selectDimensionList, String windowFunction3) throws BadRequestException{
        String windowFunction4 = "";
        if(finalPartitionList.size() == selectDimensionList.size()){
            windowFunction4 = "";
        }
        else if(List.of("ASCENDING", "DESCENDING").contains(windowFunction3)){
            windowFunction4 = "DESCENDING".equals(windowFunction3) ? "DESC" : "ASC";
        }
        else{
        throw new BadRequestException("Error: badRequest! not mentioned standard ordering values");
        }
        return windowFunction4;
    }
    public static String windowFunction(Measure meas, Query req, String field, String vendorName) throws BadRequestException {
        String window = "";
        String partitionName = "";
        String partition = "";
        String rows = null;
        String orderByName = "";
        String orderBy = "";
        Query dim = null;
        QueryClauseFieldListMap qMap = new QueryClauseFieldListMap();
            if(meas.getWindowFn().length > 3 || meas.getWindowFn().length == 1){
                throw new BadRequestException("Error: Invalid windowFunction length");
            }
            
            List<Dimension> row = new ArrayList<>();
            List<Dimension> column = new ArrayList<>();
            List<String> rowList = new ArrayList<>();
            List<String> columnList = new ArrayList<>();
            List<Dimension> rowVsColumnList = new ArrayList<>();
            List<String> partitionList = new ArrayList<>(); 
            final List<String> finalPartitionList = new ArrayList<>();
            List<String> orderByList = new ArrayList<>();
            List<String> selectDimensionList = getDimension(req, vendorName);
  
            // for window function 
            String windowFunction1 = "";
            String windowFunction2 = "";
            String windowFunction3 = "";                
            for (int m = 0; m < meas.getWindowFn().length; m++) {
                switch (m) {
                    case 0:
                        if(List.of("STANDING", "SLIDING", "DIFFERENCEFROM", "PERCENTAGEDIFFERENCEFROM", "PERCENTAGETOTAL").contains(meas.getWindowFn()[m].toUpperCase())){
                        windowFunction1 = meas.getWindowFn()[m].toUpperCase();
                        }
                        else {
                        throw new BadRequestException("Error: windowFunction1 accepts only standard values");
                        }
                        break;
                    case 1:
                        if(List.of("DEFAULT", "DENSE", "UNIQUE", "SUM", "AVG", "MIN", "MAX", "COUNT", "FIRST", "LAST").contains(meas.getWindowFn()[m].toUpperCase())){
                        windowFunction2 = meas.getWindowFn()[m].toUpperCase();
                        }
                        else{
                            throw new BadRequestException("Error: windowFunction2 accepts only standard values");
                        }
                        break;
                    case 2:
                        windowFunction3 = meas.getWindowFn()[m].toUpperCase();
                        break;
                }
            }
            //previous, current and next values for sliding & standingvssliding
            String preceding_string = null;
            String following_string = null;
            if(meas.getWindowFnOption().length == 3){
            int preceding_value = meas.getWindowFnOption()[0];
            int current_row = meas.getWindowFnOption()[1];
            int following_value = meas.getWindowFnOption()[2];
            //for sliding & standing vs sliding 
            if(windowFunction1.equals("SLIDING") || ((windowFunction1.equals("DIFFERENCEFROM") || windowFunction1.equals("PERCENTAGEDIFFERENCEFROM") || windowFunction1.equals("PERCENTAGETOTAL")) 
            && List.of("SUM", "AVG", "MAX", "MIN").contains(windowFunction2))){
            if(preceding_value != 0 && current_row != 1 && following_value != 0){
                throw new BadRequestException("Error: current row value should be equal to 1");
            }
            if(preceding_value == 0 && current_row == 0 && following_value == 0){
                throw new BadRequestException("Error: rows betweeen frame clause values not given");
            }
            if (preceding_value == 0 && current_row == 1 && following_value == 0) {
                preceding_string = " ROWS CURRENT ROW";
                following_string = "";
            } else if (preceding_value > 0) {
                preceding_string = " ROWS BETWEEN " + preceding_value + " PRECEDING AND ";

                if (following_value > 0) {
                    following_string = following_value + " FOLLOWING";
                } else if (following_value == -1) {
                    following_string = "UNBOUNDED FOLLOWING";
                }
                // no need to check fo == 0 as it means to check only current
                else if (current_row == 0) {
                following_string = "1 PRECEDING";
                } else if (current_row == 1) {
                following_string = "CURRENT ROW";
                }
            } else if (preceding_value == 0) {
                if (current_row == 0) {
                    preceding_string = " ROWS BETWEEN 1 FOLLOWING AND ";
                } else if (current_row == 1) {
                    preceding_string = " ROWS BETWEEN CURRENT ROW AND ";
                }
                else {
                    throw new BadRequestException("Error: current row value cannot below 0 or above 1");
                }

                if (following_value > 0) {
                    following_string = following_value + " FOLLOWING";
                } else if (following_value == -1) {
                    following_string = "UNBOUNDED FOLLOWING";
                }
                else {
                    throw new BadRequestException("Error: next value cannot be less than -1");
                }
            } else if (preceding_value == -1) {
                preceding_string = " ROWS BETWEEN UNBOUNDED PRECEDING AND ";

                if (following_value > 0) {
                    following_string = following_value + " FOLLOWING";
                } else if (following_value == -1) {
                    following_string = "UNBOUNDED FOLLOWING";
                }
                // no need to check fo == 0 as it means to check only current
                else if (current_row == 0) {
                following_string = "1 PRECEDING";
                } else if (current_row == 1) {
                following_string = "CURRENT ROW";
                }
            } else {
                throw new BadRequestException("Error: previous value cannot be less than -1");
            }
            } else{
                throw new BadRequestException("Error: STANDING, FIRST AND LAST should not have any window function option values");
            }
            } else if (meas.getWindowFnOption().length != 0){
                throw new BadRequestException("Error: windowFnOption length should not be less than or greater than 3");
            }
            // if first & last rows must be between unbounded preceding and unbounded following 
            if(windowFunction2.equals("FIRST") || windowFunction2.equals("LAST")){
                rows = " ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING";
            }
            else if (!windowFunction1.equals("STANDING") && preceding_string == null && following_string == null){
                throw new BadRequestException("Error: bad request! doesn't have any window function option values");
            }
            else{
                rows = preceding_string + following_string;
            }  

            //for partition by
            if(meas.getWindowFnPartition().length < 1 || meas.getWindowFnPartition().length > 3){
                throw new BadRequestException("Error: bad request! partition length should not exceeds or fall below the limit");
            }        
            //partition values for only one dimension
            if(meas.getWindowFnPartition().length == 1){
                if(meas.getWindowFnPartition()[0] < -1 || meas.getWindowFnPartition()[0] > req.getDimensions().size() - 1){
                    throw new BadRequestException("Error: bad request! partition dimensional size is invalid");
                }//if matrix value given this condition will work
                if(meas.getWindowFnMatrix().length > 0){
                    if(meas.getWindowFnMatrix().length != 2){
                        throw new BadRequestException("Error: Invalid matrix length");
                    }
                    if((meas.getWindowFnMatrix()[0] != 0 && meas.getWindowFnMatrix()[1] != 0) || (meas.getWindowFnMatrix()[0] < 0 && meas.getWindowFnMatrix()[1] < 0)){
                        throw new BadRequestException("Error: bad request! atleast one matrix element should be zero or matrix element should not be less than -1");
                    }
                    if(req.getDimensions().size() != (meas.getWindowFnMatrix()[0] + meas.getWindowFnMatrix()[1])){
                        throw new BadRequestException("Error: invalid matrix dimensional size");
                    }
                    //split row and column
                    for(int x = 0; x < meas.getWindowFnMatrix()[0]; x++){
                        row.add(req.getDimensions().get(x));
                    }
                    for(int y = meas.getWindowFnMatrix()[0]; y < meas.getWindowFnMatrix()[0] + meas.getWindowFnMatrix()[1]; y++){
                        column.add(req.getDimensions().get(y));
                    }        
                }
                if(meas.getWindowFnPartition()[0] == -1){
                    //NO PARTITION
                }
                else if(meas.getWindowFnPartition()[0] == 0 && req.getDimensions().size() == 1){
                if(!row.isEmpty())
                    rowVsColumnList.add(row.get(0));
                else if(!column.isEmpty())
                    rowVsColumnList.add(column.get(0));
                else
                    rowVsColumnList.add(req.getDimensions().get(0));
                }
                else if(meas.getWindowFnPartition()[0] >= 0 && req.getDimensions().size() > 1){
                if(!row.isEmpty()){
                    for(int d = 0; d < meas.getWindowFnPartition()[0] + 1; d++){
                    rowVsColumnList.add(row.get(d));
                    }
                }
                else if(!column.isEmpty()){
                    for(int d = 0; d < meas.getWindowFnPartition()[0] + 1; d++){
                    rowVsColumnList.add(column.get(d));
                    }
                }
                else{
                    for(int d = 0; d < meas.getWindowFnPartition()[0] + 1; d++){
                    rowVsColumnList.add(req.getDimensions().get(d));
                    }  
                }    
                }
                //give partition dimensions in query object for getting partition values fom database
                dim = new Query(rowVsColumnList, new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
                qMap = selectClauseSql(dim, vendorName); 
                partitionList = qMap.getGroupByList().stream().collect(Collectors.toList());
                finalPartitionList.addAll(partitionList);
                partitionName = finalPartitionList.stream().collect(Collectors.joining(",\n\t"));
                partition = finalPartitionList.isEmpty()? "" : "PARTITION BY " + partitionName + " ";
                //for order by values
                if(windowFunction1.equals("STANDING")){                  
                    orderBy = (finalPartitionList.size() == selectDimensionList.size())? "ORDER BY (SELECT NULL)": "ORDER BY " + field + " " + sortingFunction(finalPartitionList, selectDimensionList, windowFunction3);
                } else if (List.of("SLIDING", "DIFFERENCEFROM", "PERCENTAGEDIFFERENCEFROM", "PERCENTAGETOTAL").contains(windowFunction1)){
                    orderByList = selectDimensionList.stream().filter(element -> !finalPartitionList.contains(element)).collect(Collectors.toList());
                    orderByName = orderByList.stream().collect(Collectors.joining(",\n\t"));
                    orderBy = (finalPartitionList.size() == selectDimensionList.size())? "ORDER BY (SELECT NULL)": "ORDER BY " + orderByName;
                }    
            } //partition value for row & column
            else if(meas.getWindowFnPartition().length == 2 || meas.getWindowFnPartition().length == 3){
            if(meas.getWindowFnMatrix().length != 2 || meas.getWindowFnMatrix()[0] < 0 || meas.getWindowFnMatrix()[1] < 0 || meas.getWindowFnPartition()[0] < -1 || meas.getWindowFnPartition()[1] < -1){
                throw new BadRequestException("Error: matrix & partition (length or value) should not exceeds or fall below the limit");
            }
            if(req.getDimensions().size() != (meas.getWindowFnMatrix()[0] + meas.getWindowFnMatrix()[1])){
                throw new BadRequestException("Error: invalid matrix dimensional size");
            }
            //get rowValue & columnValue from api
            int rowValue = meas.getWindowFnMatrix()[0];
            int columnValue = meas.getWindowFnMatrix()[1];
            //split dimensions into row and column  
            for(int x = 0; x < rowValue; x++){
                row.add(req.getDimensions().get(x));
            }
            for(int y = rowValue; y < rowValue + columnValue; y++){
                column.add(req.getDimensions().get(y));
            }
            //getting row values from database
            dim = new Query(row, new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
            qMap = selectClauseSql(dim, vendorName);
            rowList = qMap.getGroupByList().stream().collect(Collectors.toList());  
            // getting column values from database     
            dim = new Query(column, new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
            qMap = selectClauseSql(dim, vendorName);
            columnList = qMap.getGroupByList().stream().collect(Collectors.toList());

            //get rowPartition & columnPartition from api
            if(meas.getWindowFnPartition()[0] > row.size() - 1 || meas.getWindowFnPartition()[1] > column.size() -1){
                throw new BadRequestException("Error: invalid partition dimensional size");
            }
            int rowPartition =  meas.getWindowFnPartition()[0];
            int columnPartition = meas.getWindowFnPartition()[1];
            
            if(rowPartition == -1){
                if(columnPartition == -1){
                    //NO PARTITION
                } else if (columnPartition > -1){
                    for(int a = 0; a < columnPartition + 1; a++){
                        rowVsColumnList.add(column.get(a));           
                    }
                }
            } else if (rowPartition > -1){
                if(columnPartition == -1){
                    for(int c = 0; c < rowPartition + 1; c++)
                    rowVsColumnList.add(row.get(c));
                } else if (columnPartition > -1){
                    for(int c = 0; c < rowPartition + 1; c++)
                    rowVsColumnList.add(row.get(c));
                    for(int c = 0; c < columnPartition + 1; c++)
                    rowVsColumnList.add(column.get(c));
                }
            } 
            //give partition dimensions in query object for getting partition values
            dim = new Query(rowVsColumnList, new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
            qMap = selectClauseSql(dim, vendorName); 
            partitionList = qMap.getGroupByList().stream().collect(Collectors.toList());
            finalPartitionList.addAll(partitionList);
            partitionName = finalPartitionList.stream().collect(Collectors.joining(",\n\t")); 
            partition = finalPartitionList.isEmpty()? "": "PARTITION BY " + partitionName + " ";
            //rowwise & columnwise ordering
            if(windowFunction1.equals("STANDING") && meas.getWindowFnPartition().length == 2){
                    orderBy = (finalPartitionList.size() == selectDimensionList.size())? "ORDER BY (SELECT NULL)": "ORDER BY " + field + " " + sortingFunction(finalPartitionList, selectDimensionList, windowFunction3);
            } else if (List.of("SLIDING", "DIFFERENCEFROM", "PERCENTAGEDIFFERENCEFROM", "PERCENTAGETOTAL").contains(windowFunction1)){
            if(finalPartitionList.size() != selectDimensionList.size() && meas.getWindowFnPartition().length < 3){
                throw new BadRequestException("Error: slide direction not given");
            }
            if(finalPartitionList.size() == selectDimensionList.size()){
                orderBy = "ORDER BY (SELECT NULL)";                
            }
            else{
            int orderByWise = meas.getWindowFnPartition()[2];
            List<String> orderByListForRow = rowList.stream().filter(element -> !finalPartitionList.contains(element)).collect(Collectors.toList());
            List<String> orderByListForColumn = columnList.stream().filter(element -> !finalPartitionList.contains(element)).collect(Collectors.toList());
            if(rowList.stream().allMatch(finalPartitionList::contains) && orderByWise == 1){
                orderByList.addAll(orderByListForColumn);
            } else if (columnList.stream().allMatch(finalPartitionList::contains) && orderByWise == 0){
                orderByList.addAll(orderByListForRow);
            } else if (rowList.stream().anyMatch(element -> !finalPartitionList.contains(element)) && columnList.stream().anyMatch(element -> !finalPartitionList.contains(element))){
            if(orderByWise == 0){
                orderByList.addAll(orderByListForRow);
                orderByList.addAll(orderByListForColumn);
            }
            else if (orderByWise == 1){
                orderByList.addAll(orderByListForColumn);
                orderByList.addAll(orderByListForRow);
            }
            else{
                throw new BadRequestException("Error: badRequest! slide direction value " + orderByWise + " is not equal to 0 or 1");
            }
            } else{
                throw new BadRequestException("Error: slide direction doesn't match");
            }
                orderByName = orderByList.stream().collect(Collectors.joining(",\n\t"));
                orderBy = "ORDER BY " + orderByName;
            }
            } else {
                throw new BadRequestException("Error: standing doesn't accept slide direction");
            }
            }
            // using hashmap to get value for window function 2
            Map<String, String> windowOptionMap = new HashMap<>();
            windowOptionMap.put("DEFAULT", "RANK()");
            windowOptionMap.put("DENSE", "DENSE_RANK()");
            windowOptionMap.put("UNIQUE", "ROW_NUMBER()");
            windowOptionMap.put("SUM", "SUM(");
            windowOptionMap.put("AVG", "AVG(");
            windowOptionMap.put("MIN", "MIN(");
            windowOptionMap.put("MAX", "MAX(");
            windowOptionMap.put("COUNT", "COUNT(");
            windowOptionMap.put("FIRST", "FIRST_VALUE(");
            windowOptionMap.put("LAST", "LAST_VALUE(");
            
            List<String> standingList = List.of("DEFAULT", "DENSE", "UNIQUE");  
            List<String> slidingList = List.of("SUM", "AVG", "MIN", "MAX", "COUNT");
            List<String> standingVsSlidingList = List.of("SUM", "AVG", "MIN", "MAX", "FIRST", "LAST");
            if (windowFunction1.equals("STANDING") && standingList.contains(windowFunction2)) {
                String sqlFunction = windowOptionMap.get(windowFunction2);
                window = sqlFunction + " OVER(" + partition + orderBy + ")";
            } else if (windowFunction1.equals("SLIDING") && slidingList.contains(windowFunction2)) {
                String sqlFunction = windowOptionMap.get(windowFunction2);
                if(!sqlFunction.equals("COUNT(")){
                window = sqlFunction + field + ") OVER(" + partition + orderBy + rows + ")";
                }
                else{
                window = sqlFunction + "*) OVER(" + partition + orderBy + rows + ")";  
                }
            } else if (windowFunction1.equals("DIFFERENCEFROM") && standingVsSlidingList.contains(windowFunction2)) {
                String sqlFunction = windowOptionMap.get(windowFunction2);
                window = field + "-" + sqlFunction + field + ") OVER(" + partition + orderBy + rows + ")";
                
            } else if (windowFunction1.equals("PERCENTAGEDIFFERENCEFROM") && standingVsSlidingList.contains(windowFunction2)) {
                String sqlFunction = windowOptionMap.get(windowFunction2);
                window = "(CAST(" + field + " AS DECIMAL) - " + sqlFunction + field + ") OVER(" + partition + orderBy + rows + 
                         ")) / " + sqlFunction + field + ") OVER(" + partition + orderBy + rows + 
                         ")" ;
            } else if (windowFunction1.equals("PERCENTAGETOTAL") && standingVsSlidingList.contains(windowFunction2)) {
                String sqlFunction = windowOptionMap.get(windowFunction2);
                window = field + " / " + sqlFunction + field + ") OVER(" + partition + orderBy + rows + ")";
            } else{
                throw new BadRequestException("Error: bad request! accepts only matching window function");
            }

            return window;
    }    
}
