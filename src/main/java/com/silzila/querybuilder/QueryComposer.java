package com.silzila.querybuilder;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.silzila.payload.internals.QueryClauseFieldListMap;
import com.silzila.dto.DatasetDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.helper.AilasMaker;
import com.silzila.helper.ColumnListFromClause;
import com.silzila.payload.request.*;
import com.silzila.payload.request.Dimension.DataType;
import com.silzila.querybuilder.override.overrideCTE;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class QueryComposer {

    private static final Logger logger = LogManager.getLogger(QueryComposer.class);

    private Boolean queryCTE = false;
    /*
     * Builds query based on Dimensions and Measures of user selection.
     * Query building is split into many sections:
     * like Select clause, Join clause, Where clause,
     * Group By clause & Order By clause
     * Different dialects will have different syntaxes.
     */
    @SuppressWarnings("unchecked")
    public String composeQuery(List<Query> queries, DatasetDTO ds, String vendorName,Map<String,Integer>... aliasnumber) throws BadRequestException {

        QueryClauseFieldListMap qMap = new QueryClauseFieldListMap();
        String updatedQuery = "";
        String finalQuery = "";

        Query req = queries.get(0);

        // flag --> override function or not
        if (queries.size() > 1) {
            queryCTE = true;
        }

        //creating tableId list to check the filter list id which is present in query
        List<String> tableIDList = new ArrayList<String>();

        req.getMeasures().forEach(measure -> tableIDList.add(measure.getTableId()));
        req.getFields().forEach(field -> tableIDList.add(field.getTableId()));
        req.getDimensions().forEach(dimension -> tableIDList.add(dimension.getTableId()));
        for (int i = 0; i < req.getFilterPanels().size(); i++) {
            for (int j = 0; j < req.getFilterPanels().get(i).getFilters().size(); j++) {
                tableIDList.add(req.getFilterPanels().get(i).getFilters().get(j).getTableId());
            }
        }

        /*
         * builds JOIN Clause of SQL - same for all dialects
         */
        List<String> allColumnList = ColumnListFromClause.getColumnListFromQuery(req);
        String fromClause = RelationshipClauseGeneric.buildRelationship(allColumnList, ds.getDataSchema(), vendorName);

        // System.out.println("from clause ================\n" + fromClause);
        /*
         * builds SELECT Clause of SQL
         * SELECT clause is the most varying of all clauses, different for each dialect
         * select_dim_list columns are used in group_by_dim_list & order_by_dim_list
         * except that
         * select_dim_list has column alias and group_by_dim_list & order_by_dim_list
         * don't have alias
         */
        /*
         * vendorName given in buildSelectClause for windowFunction to get datas from
         * specified database,
         * because SelectClauseWindowFunction class is given common for all databases
         */
        if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
            // System.out.println("------ inside postges block");
            qMap = SelectClausePostgres.buildSelectClause(req, vendorName, aliasnumber);
        } else if (vendorName.equals("mysql")) {
            // System.out.println("------ inside mysql block");
            qMap = SelectClauseMysql.buildSelectClause(req, vendorName, aliasnumber);
        } else if (vendorName.equals("sqlserver")) {
            // System.out.println("------ inside sql server block");
            qMap = SelectClauseSqlserver.buildSelectClause(req, vendorName, aliasnumber);
        } else if (vendorName.equals("bigquery")) {
            // System.out.println("------ inside Big Query block");
            qMap = SelectClauseBigquery.buildSelectClause(req, vendorName, aliasnumber);
        } else if (vendorName.equals("databricks")) {
            // System.out.println("------ inside databricks block");
            qMap = SelectClauseDatabricks.buildSelectClause(req, vendorName, aliasnumber);
        } else if (vendorName.equals("oracle")) {
            qMap = SelectClauseOracle.buildSelectClause(req, vendorName, aliasnumber);
        } else if (vendorName.equals("snowflake")) {
            qMap = SelectClauseSnowflake.buildSelectClause(req, vendorName, aliasnumber);
        } else if (vendorName.equals("motherduck") || vendorName.equals("duckdb") ) {
            qMap = SelectClauseMotherduck.buildSelectClause(req, vendorName, aliasnumber);
        } else if (vendorName.equals("db2") ) {
            qMap = SelectClauseDB2.buildSelectClause(req, vendorName, aliasnumber);
        }else if (vendorName.equals("teradata") ) {
            qMap = SelectClauseTeraData.buildSelectClause(req, vendorName, aliasnumber);
        }
        else {
            throw new BadRequestException("Error: DB vendor Name is wrong!");
        }

        String selectClause = "\n\t" + qMap.getSelectList().stream().collect(Collectors.joining(",\n\t"));
        // distinct in group by and order by as SQL Server will take only unique expr in
        // group by and order by. this prevents error when dropping
        // same col twice in dimension
        String groupByClause = "\n\t" + qMap.getGroupByList().stream().distinct().collect(Collectors.joining(",\n\t"));
        String orderByClause = "\n\t" + qMap.getOrderByList().stream().distinct().collect(Collectors.joining(",\n\t"));
        String whereClause="";
        // checking the filter panel size to add where condition
        long countOfFilterPanels=ds.getDataSchema().getFilterPanels().size();
        if(countOfFilterPanels==0) {
             whereClause = WhereClause.buildWhereClause(req.getFilterPanels(), vendorName);
        }else {
            for(int i=0;i<countOfFilterPanels;i++) {
                for (int j = 0; j < ds.getDataSchema().getFilterPanels().get(i).getFilters().size(); j++)
                {
                    if(tableIDList.contains(ds.getDataSchema().getFilterPanels().get(i).getFilters().get(j).getTableId())) {
                        req.getFilterPanels().add(ds.getDataSchema().getFilterPanels().get(i));
                    }
                }
            }
            whereClause=WhereClause.buildWhereClause(req.getFilterPanels(), vendorName);
        }
        // for bigquery only
        if (vendorName.equals("bigquery")) {
            boolean isDateOrTimestamp = false;
            boolean isMonthOrDayOfWeek = false;
            // get each dimensions from api using for-each
            for (Dimension dim : req.getDimensions()) {
                // check whether dimension's datatype match ('date','timestamp')
                if (List.of("DATE", "TIMESTAMP").contains(dim.getDataType().name()) &&
                        (dim.getTimeGrain().name().equals("MONTH") || dim.getTimeGrain().name().equals("DAYOFWEEK"))) {
                    isDateOrTimestamp = true;
                    isMonthOrDayOfWeek = true;
                    break; // Exit the loop if any dimension meets the criteria
                }
            }
            /*
             * for window functions
             * _0 just to mention window function. if selectlist contains _0, goes inside
             * _* for mentioning measure field
             */
            if (qMap.getSelectList().stream().anyMatch(column -> column.contains("_0"))) {
                List<String> filteredlist = new ArrayList<>();
                List<String> filteredSelectList = new ArrayList<>();
                // if selectlist contains _0 it will filter window function only and then we
                // replace the _0 by ""
                String filteredWindowFunction = qMap.getSelectList().stream().filter(column -> column.contains("_0"))
                        .map(column -> column.replace("_0", "")).collect(Collectors.joining(",\n\t"));
                // filter all columns except window function and then replace _* by ""
                List<String> filteredSelect = qMap.getSelectList().stream().filter(column -> !column.contains("_0"))
                        .map(column -> column.replace("_*", "")).collect(Collectors.toList());
                String filteredSelectClause = filteredSelect.stream().collect(Collectors.joining(",\n\t"));
                if (isDateOrTimestamp && isMonthOrDayOfWeek) {
                    // filter all columns except sorting fields('__'), measure field('_*') & window
                    // function('_0')
                    filteredSelectList = qMap.getSelectList().stream().filter(
                            column -> (!column.contains("__") && !column.contains("_*") && !column.contains("_0")))
                            .collect(Collectors.toList());
                } else {
                    filteredSelectList = qMap.getSelectList().stream()
                            .filter(column -> (!column.contains("_*") && !column.contains("_0")))
                            .collect(Collectors.toList());
                }
                for (int i = 0; i < filteredSelectList.size(); i++) {
                    String regex = "\\bAS\\s+(\\w+)"; // using regex to get alias after 'AS'
                    Pattern pattern = Pattern.compile(regex);
                    Matcher matcher = pattern.matcher(filteredSelectList.get(i));
                    while (matcher.find()) {
                        String alias = matcher.group(1);
                        filteredlist.add(alias); // aliases add into filteredlist
                        logger.info("Alias: " + alias);
                    }
                }
                String filteredSelectClauseList = "\n\t" + filteredlist.stream().collect(Collectors.joining(",\n\t"));
                finalQuery = "SELECT " + filteredSelectClauseList + ",\n\t" + filteredWindowFunction + "\nFROM ("
                        + "\nSELECT " + filteredSelectClause + "\nFROM"
                        + fromClause + whereClause + "\nGROUP BY" + groupByClause
                        + "\n) AS Tbl\nORDER BY" + orderByClause;

            }
            // if time grain month or day of week
            else if (isDateOrTimestamp && isMonthOrDayOfWeek) {
                List<String> filteredlist = new ArrayList<>();
                List<String> filteredSelectList = qMap.getSelectList().stream().filter(column -> !column.contains("__"))
                        .collect(Collectors.toList()); // remove double underscore columns('__')

                logger.info(filteredSelectList);

                for (int i = 0; i < filteredSelectList.size(); i++) {
                    String regex = "\\bAS\\s+(\\w+)"; // using regex to get alias after 'AS'
                    Pattern pattern = Pattern.compile(regex);
                    Matcher matcher = pattern.matcher(filteredSelectList.get(i));
                    while (matcher.find()) {
                        String alias = matcher.group(1);
                        filteredlist.add(alias); // aliases add into filteredlist
                        logger.info("Alias: " + alias);
                    }
                }
                logger.info(filteredlist);

                String filteredSelectClause = "\n\t" + filteredlist.stream().collect(Collectors.joining(",\n\t")); // convert
                                                                                                                   // arrayList
                                                                                                                   // values
                                                                                                                   // into
                                                                                                                   // String
                logger.info(filteredSelectClause);

                finalQuery = "SELECT " + filteredSelectClause + "\nFROM (" + "\nSELECT " + selectClause + "\nFROM"
                        + fromClause + whereClause + "\nGROUP BY" + groupByClause
                        + "\nORDER BY"
                        + orderByClause + "\n) AS Tbl";
            } else if (!req.getDimensions().isEmpty()) {
                finalQuery = "SELECT " + selectClause + "\nFROM" + fromClause + whereClause + "\nGROUP BY"
                        + groupByClause
                        + "\nORDER BY"
                        + orderByClause;
            } else if (!req.getMeasures().isEmpty()) {
                finalQuery = "SELECT " + selectClause + "\nFROM" + fromClause + whereClause;
            }
        } else if (!req.getDimensions().isEmpty()) {
            finalQuery = "SELECT " + selectClause + "\nFROM" + fromClause + whereClause + "\nGROUP BY"
                    + groupByClause
                    + "\nORDER BY"
                    + orderByClause;
        } else if (!req.getMeasures().isEmpty()) {
            finalQuery = "SELECT " + selectClause + "\nFROM" + fromClause + whereClause;
        }

        // override does not require orderbyclause
        if (queryCTE && !req.getDimensions().isEmpty() && !vendorName.equals("bigquery")) {
            finalQuery = "SELECT " + selectClause + "\nFROM " + fromClause + whereClause + "\nGROUP BY " + groupByClause;
        }        

        if (queries.size() == 1) {
            updatedQuery = finalQuery;
        } else if (queries.size() > 1) {
            try {
            // aliasing measure names --> example: sales,sales_2,sales_3
            Map<String, Integer> aliasNumberingCTE = new HashMap<>();

            List<String> aliases = new ArrayList<>();

            // to get sequence of order
            List<String> aliasMeasureOrder1 = overrideCTE.aliasingMeasureOrder(queries);
            Map<Integer,Boolean> isOverrideMeasure = new HashMap<>();
            
            // base size
            Integer baseDimensionSize = queries.get(0).getDimensions().size();
            Integer baseMeasureSize = queries.get(0).getMeasures().size();
            for(Dimension dim : queries.get(0).getDimensions()){
                aliases.add(AilasMaker.aliasing(dim.getFieldName(), aliasNumberingCTE));
            }
            for(Measure meas : queries.get(0).getMeasures()){
                aliases.add(AilasMaker.aliasing(meas.getFieldName(), aliasNumberingCTE));
                isOverrideMeasure.put(meas.getMeasureOrder(), false);
            }

            // windowfn --> flag
            Boolean windowFn = false;
            HashMap<Integer, Measure> windowMeasures = new HashMap<>();
            // baseQuery
            String baseQuery = composeQuery(Collections.singletonList(queries.get(0)), ds, vendorName);

            StringBuilder overrideCTEQuery = new StringBuilder();

            List<Dimension> baseDimensions = queries.get(0).getDimensions();
            // for CTE override dimension
            List<String> allOverrideCTE = new ArrayList<>();
            // for clause
            List<String> selectMeasure = new ArrayList<>();
            // for table for joining
            List<String> joinTableQuery = new ArrayList<>();

            //initializing a CTE table number
            int tblNum = 2;
            // Loop through override Request
            for (int i = 1; i < queries.size(); i++) {
                boolean isRollupDepthEncountered = false;
                Query reqCTE = queries.get(i);

            // reportfilter is disabled or not --> it can be disabled by user 
            if (reqCTE.getMeasures().get(0).getDisableReportFilters() && reqCTE.getFilterPanels() != null) {
                    List<FilterPanel> updatedFilterPanels = new ArrayList<>();
                    for (FilterPanel panel : reqCTE.getFilterPanels()) {
                        if (!"reportFilters".equals(panel.getPanelName())) {
                            updatedFilterPanels.add(panel);
                        }
                    }
                    reqCTE.setFilterPanels(updatedFilterPanels);
            }

            // unalteredmeasure -- used for creating windowFnCTE
            Measure Meas = reqCTE.getMeasures().get(0);
            
            //required for reordering
            isOverrideMeasure.put(Meas.getMeasureOrder(),true); 
                
                List<Dimension> leftOverDimension = new ArrayList<>();
                List<Dimension> overrideDimensions = new ArrayList<>();
                List<Dimension> commonDimensions = new ArrayList<>();
                List<Dimension> combinedDimensions = new ArrayList<>();

                for (Dimension dim : baseDimensions) {
                    // Create a new Dimension object with the same properties as dim
                    Dimension newDim = new Dimension(dim.getTableId(),dim.getFieldName() , dim.getDataType(), dim.getTimeGrain(),dim.isRollupDepth());
                    commonDimensions.add(newDim);
                }

                for (Dimension dim : reqCTE.getDimensions()) {
                    if (dim.isRollupDepth()) {
                        isRollupDepthEncountered = true;
                        overrideDimensions.add(dim);
                    } else if (isRollupDepthEncountered) {
                        leftOverDimension.add(dim);
                    } else {
                        overrideDimensions.add(0, dim);
                    }
                }

                for (Dimension dim : overrideDimensions) {
                    if (!commonDimensions.contains(dim)) {
                        leftOverDimension.add(0, dim);
                    }
                }
                commonDimensions.retainAll(overrideDimensions);

                
                for (Dimension dim : leftOverDimension) {
                    // Create a new Dimension object with the same properties as dim
                    Dimension newDim = new Dimension(dim.getTableId(), dim.getFieldName(), dim.getDataType(),
                            dim.getTimeGrain(), dim.isRollupDepth());
                    combinedDimensions.add(newDim);
                }

                int j = 0;
                for (Dimension dim : commonDimensions) {
                    combinedDimensions.add(j, dim);
                    j++;
                }

                //join CTE column--> join with all common column between base and override
                List<String> joinValues = overrideCTE.joinValues(commonDimensions, baseDimensions);

                // override base CTE
                queryCTE = true;
        
                reqCTE.setDimensions(combinedDimensions);

                //setting measures -->window Function separetly in new CTE
                    if(reqCTE.getMeasures().get(0).getWindowFn()[0]!=null){
                        Measure measure = Measure.builder().tableId(Meas.getTableId()).fieldName(Meas.getFieldName())
                                                            .dataType(Meas.getDataType())
                                                            .timeGrain(Meas.getTimeGrain())
                                                            .aggr(Meas.getAggr())
                                                            .windowFn(new String[]{null})
                                                            .measureOrder(Meas.getMeasureOrder())
                                                            .build();
                        reqCTE.getMeasures().set(0,measure);
                        windowFn = true;
                        }


                // override base query
                String baseCTEquery = composeQuery(Collections.singletonList(reqCTE), ds, vendorName,aliasNumberingCTE);

                //fieldname alias
                String alias = AilasMaker.aliasing(reqCTE.getMeasures().get(0).getFieldName(), aliasNumberingCTE);
                aliases.add(alias);
                reqCTE.getMeasures().get(0).setFieldName(alias);
                
      
                // override query
                String overrideQuery = ", \ntbl" + tblNum + " AS ( " + baseCTEquery + " )";

                // setting the datatype for date and timestamp -- year(date) not required in aggregation
                for (Dimension dim : combinedDimensions) {
                    dim.setDataType(DataType.TEXT);
                }

                 // for measures--> setting the datatype for date and timestamp -- year(date) not required in aggregation
                                // --> setting the aggregation for count -- count does not need aggregation
                if (List.of("DATE", "TIMESTAMP","TEXT","BOOLEAN").contains(reqCTE.getMeasures().get(0).getDataType().name())) {
                    reqCTE.getMeasures().get(0).setDataType(com.silzila.payload.request.Measure.DataType.INTEGER);
                }
                if(List.of("COUNT", "COUNTU","COUNTN","COUNTNN").contains(reqCTE.getMeasures().get(0).getAggr().name())){
                    reqCTE.getMeasures().get(0).setAggr(com.silzila.payload.request.Measure.Aggr.SUM);
                } 

                tblNum++; // increment

                 // CTE expression
                if (!leftOverDimension.isEmpty()) {                
                    String CTEQuery = overrideCTE.overrideCTEq(tblNum, reqCTE, leftOverDimension, combinedDimensions,vendorName);
                    overrideQuery += CTEQuery;
                }

                allOverrideCTE.add(overrideQuery);

                tblNum += leftOverDimension.size();

                // window fn
                windowMeasures.put( reqCTE.getMeasures().get(0).getMeasureOrder() , Meas);
                
                selectMeasure.add(", \n\ttbl" + (tblNum -1) + "." + reqCTE.getMeasures().get(0).getFieldName() );

                // join clause
                String join = overrideCTE.joinCTE((tblNum -1), commonDimensions, joinValues);
                joinTableQuery.add(join);

            }

           List<String> aliasMeasureOrder2 = overrideCTE.reorderArray(aliasMeasureOrder1,baseDimensions.size(), isOverrideMeasure);
            
            // override query builder
            overrideCTEQuery .append("WITH tbl1 as (" + baseQuery + ") ");

            allOverrideCTE.forEach(s -> overrideCTEQuery.append(s));

            StringBuilder CTEmainQuery = new StringBuilder();

            CTEmainQuery.append(" \nSELECT  ");
            for(int i = 0; i < (baseDimensionSize+baseMeasureSize); i++){
                CTEmainQuery.append("\n\ttbl1." + aliases.get(i) + " AS " + aliasMeasureOrder2.get(i));
                if(i < (baseDimensionSize+baseMeasureSize) - 1){
                    CTEmainQuery.append(",");
                }
            }

            for(int j = 0; j < selectMeasure.size();j++){
                
                String s = selectMeasure.get(j);
                CTEmainQuery.append(s).append( " AS ").append(aliasMeasureOrder2.get((j+(baseDimensionSize+baseMeasureSize))));
            }
            CTEmainQuery.append(" \nFROM tbl1 ");
            joinTableQuery.forEach(s -> CTEmainQuery.append(s));

            if (!windowFn) {
                if (!baseDimensions.isEmpty()) {
                    CTEmainQuery.append(" \nORDER BY ");
                    CTEmainQuery.append(overrideCTE.generateOrderByClause(baseDimensions,"tbl1"));
                }
            }

            if(windowFn){
                updatedQuery = overrideCTE.windowQuery(overrideCTEQuery.toString(),CTEmainQuery.toString(),baseDimensions,windowMeasures,aliasMeasureOrder1,queries.get(0),vendorName);
            }
            else{
                overrideCTEQuery.append(CTEmainQuery.toString());
                updatedQuery = overrideCTEQuery.toString();
            }
            } catch (Exception e) {
                queryCTE = false;
                throw new BadRequestException("An error occurred while processing the override: " + e.getMessage());
            }
            
        }
        queryCTE = false;
        return updatedQuery;
    }
}