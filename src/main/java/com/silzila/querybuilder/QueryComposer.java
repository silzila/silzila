package com.silzila.querybuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import com.silzila.payload.internals.QueryClauseFieldListMap;
import com.silzila.dto.DatasetDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Dimension;
import com.silzila.payload.request.Query;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

@Service
public class QueryComposer {

    private static final Logger logger = LogManager.getLogger(QueryComposer.class);

    /*
     * Builds query based on Dimensions and Measures of user selection.
     * Query building is split into many sections:
     * like Select clause, Join clause, Where clause,
     * Group By clause & Order By clause
     * Different dialects will have different syntaxes.
     */
    public String composeQuery(Query req, DatasetDTO ds, String vendorName) throws BadRequestException {

        QueryClauseFieldListMap qMap = new QueryClauseFieldListMap();
        String finalQuery = "";

        /*
         * builds JOIN Clause of SQL - same for all dialects
         */
        String fromClause = RelationshipClauseGeneric.buildRelationship(req, ds.getDataSchema(), vendorName);
        // System.out.println("from clause ================\n" + fromClause);
        /*
         * builds SELECT Clause of SQL
         * SELECT clause is the most varying of all clauses, different for each dialect
         * select_dim_list columns are used in group_by_dim_list & order_by_dim_list
         * except that
         * select_dim_list has column alias and group_by_dim_list & order_by_dim_list
         * don't have alias
         */

        if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
            // System.out.println("------ inside postges block");
            qMap = SelectClausePostgres.buildSelectClause(req);
        } else if (vendorName.equals("mysql") || vendorName.equals("duckdb")) {
            // System.out.println("------ inside mysql block");
            qMap = SelectClauseMysql.buildSelectClause(req);
        } else if (vendorName.equals("sqlserver")) {
            // System.out.println("------ inside sql server block");
            qMap = SelectClauseSqlserver.buildSelectClause(req);
        } else if (vendorName.equals("bigquery")) {
            // System.out.println("------ inside Big Query block");
            qMap = SelectClauseBigquery.buildSelectClause(req);
        } else if (vendorName.equals("databricks")) {
            // System.out.println("------ inside databricks block");
            qMap = SelectClauseDatabricks.buildSelectClause(req);
        } else {
            throw new BadRequestException("Error: DB vendor Name is wrong!");
        }

        String selectClause = "\n\t" + qMap.getSelectList().stream().collect(Collectors.joining(",\n\t"));
        // distinct in group by and order by as SQL Server will take only unique expr in
        // group by and order by. this prevents error when dropping
        // same col twice in dimension
        String groupByClause = "\n\t" + qMap.getGroupByList().stream().distinct().collect(Collectors.joining(",\n\t"));
        String orderByClause = "\n\t" + qMap.getOrderByList().stream().distinct().collect(Collectors.joining(",\n\t"));
        String whereClause = WhereClause.buildWhereClause(req.getFilterPanels(), vendorName);
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
            if (isDateOrTimestamp && isMonthOrDayOfWeek) {
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

                String filteredSelectClause = "\n\t" + filteredlist.stream().collect(Collectors.joining(",\n\t")); //convert arrayList values into String
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
            finalQuery = "SELECT " + selectClause + "\nFROM" + fromClause + whereClause + "\nGROUP BY" + groupByClause
                    + "\nORDER BY"
                    + orderByClause;
        } else if (!req.getMeasures().isEmpty()) {
            finalQuery = "SELECT " + selectClause + "\nFROM" + fromClause + whereClause;
        }

        return finalQuery;

    }
}
