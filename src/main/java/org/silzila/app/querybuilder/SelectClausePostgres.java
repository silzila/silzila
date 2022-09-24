package org.silzila.app.querybuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.silzila.app.domain.QueryClauseFieldListMap;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.helper.AilasMaker;
import org.silzila.app.payload.request.Query;

import com.mysql.cj.result.Field;

public class SelectClausePostgres {
    /* SELECT clause for Postgres dialect */
    public static QueryClauseFieldListMap buildSelectClause(Query req) throws BadRequestException {

        List<String> selectList = new ArrayList<>();
        List<String> selectDimList = new ArrayList<>();
        List<String> selectMeasureList = new ArrayList<>();
        List<String> groupByDimList = new ArrayList<>();
        List<String> orderByDimList = new ArrayList<>();

        Map<String, Integer> aliasNumbering = new HashMap<>();
        Map<String, String> timeGrainMap = Map.of("year", "YEAR", "quarter", "QUARTER",
                "month", "MONTH", "dayofweek", "DOW", "dayofmonth", "DAY");

        /*
         * --------------------------------------------------------
         * ---------------- Iterate List of Dim Fields ------------
         * --------------------------------------------------------
         */
        req.getDimensions().forEach((dim) -> {
            // for non Date fields, Keep column as is
            List<String> nonDateDataTypes = List.of("text", "boolean", "integer", "decimal");
            if (nonDateDataTypes.contains(dim.getDataType())) {
                String field = dim.getTableId() + "." + dim.getFieldName();
                String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                selectDimList.add(field + " AS " + alias);
                groupByDimList.add(field);
                orderByDimList.add(field);
            }
            // for date fields, need to Parse as year, month, etc.. to aggreate
            List<String> dateDataTypes = List.of("date", "timestamp");
            if (dateDataTypes.contains(dim.getDataType())) {
                // if time grain is null then assign default value 'year'
                if (dim.getTimeGrain() == null || dim.getTimeGrain().isBlank()) {
                    // throw new BadRequestException("Error: Dimension " + dim.getFieldName() + "
                    // should have timegrain!");
                    dim.setTimeGrain("year");
                }
                // checking ('year', 'quarter', 'month', 'yearmonth', 'yearquarter',
                // 'dayofweek', 'date', 'dayofmonth')
                // year -> 2015
                if (dim.getTimeGrain().equals("year")) {
                    String field = "EXTRACT(YEAR FROM " + dim.getTableId() + "." + dim.getFieldName() + ")::INTEGER";
                    String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                    selectDimList.add(field + " AS " + alias);
                    groupByDimList.add(field);
                    orderByDimList.add(field);
                }
                // quarter name -> Q3
                else if (dim.getTimeGrain().equals("quarter")) {
                    String field = "CONCAT('Q', EXTRACT(QUARTER FROM " + dim.getTableId() + "." + dim.getFieldName()
                            + ")::INTEGER";
                    String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                    selectDimList.add(field + " AS " + alias);
                    groupByDimList.add(field);
                    orderByDimList.add(field);
                }
                // month name -> August
                // for month, also give month number for column sorting
                // hich should be available in group by list but not in select list
                else if (dim.getTimeGrain().equals("month")) {
                    String sortingFfield = "EXTRACT(MONTH FROM " + dim.getTableId() + "." + dim.getFieldName()
                            + ")::INTEGER";
                    String field = "TRIM(TO_CHAR( " + dim.getTableId() + "." + dim.getFieldName() + ", 'Month'))";
                    String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                    selectDimList.add(field + " AS " + alias);
                    groupByDimList.add(sortingFfield);
                    groupByDimList.add(field);
                    orderByDimList.add(sortingFfield);
                }
                // yearquarter name -> 2015-Q3
                else if (dim.getTimeGrain().equals("yearquarter")) {
                    String field = "CONCAT(TO_CHAR(" + dim.getTableId() + "." + dim.getFieldName()
                            + ", 'YYYY'), '-Q', TO_CHAR(" + dim.getTableId() + "." + dim.getFieldName() + ", 'Q'))"
                            + ")::INTEGER";
                    String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                    selectDimList.add(field + " AS " + alias);
                    groupByDimList.add(field);
                    orderByDimList.add(field);
                }
                // yearmonth name -> 2015-08
                else if (dim.getTimeGrain().equals("yearmonth")) {
                    String field = "TO_CHAR(" + dim.getTableId() + "." + dim.getFieldName() + ", 'YYYY-MM')";
                    String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                    selectDimList.add(field + " AS " + alias);
                    groupByDimList.add(field);
                    orderByDimList.add(field);
                }
                // date -> 2022-08-31
                else if (dim.getTimeGrain().equals("date")) {
                    String field = "DATE(" + dim.getTableId() + "." + dim.getFieldName() + "d)";
                    String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                    selectDimList.add(field + " AS " + alias);
                    groupByDimList.add(field);
                    orderByDimList.add(field);
                }
                // day Name -> Wednesday
                // for day of week, also give day of week number for column sorting
                // which should be available in group by list but not in select list
                else if (dim.getTimeGrain().equals("dayofweek")) {
                    String sortingFfield = "EXTRACT(DOW FROM " + dim.getTableId() + "." + dim.getFieldName()
                            + ")::INTEGER +1";
                    String field = "TRIM(TO_CHAR( " + dim.getTableId() + "." + dim.getFieldName() + ", 'Day'))";
                    // alias for sorting column is not needed as it is used in GROUP BY only
                    String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                    selectDimList.add(field + " AS " + alias);
                    groupByDimList.add(sortingFfield);
                    groupByDimList.add(field);
                    orderByDimList.add(sortingFfield);
                }
                // day of month -> 31
                else if (dim.getTimeGrain().equals("dayofmonth")) {
                    String field = "EXTRACT(DAY FROM " + dim.getTableId() + "." + dim.getFieldName()
                            + ")::INTEGER";
                    String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
                    selectDimList.add(field + " AS " + alias);
                    groupByDimList.add(field);
                    orderByDimList.add(field);
                } else {
                    // throw new BadRequestException("Error: Dimension " + dim.getFieldName() +
                    // "should have timegrain!");
                }

            }
        });

        /*
         * --------------------------------------------------------
         * ------------- Iterate List of Measure Fields -----------
         * --------------------------------------------------------
         */
        req.getMeasures().forEach((meas) -> {
            // if text or boolean field in measure then use
            // Text Aggregation Methods like COUNT
            List<String> textDataTypes = List.of("text", "boolean");
            List<String> dateDataTypes = List.of("text", "boolean");

            // checking ('count', 'countnn', 'countn', 'countu')
            String field = "";
            if (textDataTypes.contains(meas.getDataType())) {
                // checking ('count', 'countnn', 'countn', 'countu')
                if (meas.getAggr().equals("count")) {
                    field = "COUNT(*) AS " + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                } else if (meas.getAggr().equals("countnn")) {
                    field = "COUNT(" + meas.getTableId() + "." + meas.getFieldName() + ") AS "
                            + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                } else if (meas.getAggr().equals("countu")) {
                    field = "COUNT(DISTINCT " + meas.getTableId() + "." + meas.getFieldName() + ") AS "
                            + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                } else if (meas.getAggr().equals("countn")) {
                    field = "SUM(CASE WHEN " + meas.getTableId() + "." + meas.getFieldName()
                            + " IS NULL THEN 1 ELSE 0 END) AS "
                            + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                } else {
                    // TODO: handle exception if any measure given outside scope
                }
                selectMeasureList.add(field);
            }

            // for date fields, parse to year, month, etc.. and then
            // aggregate the field for Min & Max only
            else if (dateDataTypes.contains(meas.getDataType())) {
                List<String> aggrList = List.of("min", "max");
                List<String> timeGrainList = List.of("year", "quarter", "month", "dayofmonth");
                // checking Aggregations: ('min', 'max', 'count', 'countnn', 'countn', 'countu')
                // checking Time Grains: ('year', 'quarter', 'month', 'yearmonth',
                // 'yearquarter', 'dayofmonth')

                if (aggrList.contains(meas.getAggr()) && timeGrainList.contains(meas.getTimeGrain())) {
                    field = meas.getAggr().toUpperCase() + "(EXTRACT(" + timeGrainMap.get(meas.getTimeGrain())
                            + " FROM "
                            + meas.getTableId() + "." + meas.getFieldName() + ")::INTEGER) AS "
                            + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                }
                // checking ('date')
                else if (aggrList.contains(meas.getAggr()) && meas.getTimeGrain().equals("date")) {
                    field = meas.getAggr().toUpperCase() + "(DATE(" + meas.getTableId() + "." + meas.getFieldName()
                            + ")) AS " + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                }
                // checking ('dayofweek')
                // In postgres, dayofweek starts at 0 not 1, so need to add 1 to the function
                else if (aggrList.contains(meas.getAggr()) && meas.getTimeGrain().equals("dayofweek")) {
                    field = meas.getAggr().toUpperCase() + "(EXTRACT(" + timeGrainMap.get(meas.getTimeGrain())
                            + " FROM "
                            + meas.getTableId() + "." + meas.getFieldName() + ")::INTEGER) +1 AS "
                            + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                }

                /*
                 * countu is a special case & we can use time grain for this measure
                 */
                else if (meas.getAggr().equals("countu") && timeGrainList.contains(meas.getTimeGrain())) {
                    field = "COUNT(DISTINCT(EXTRACT(" + timeGrainMap.get(meas.getTimeGrain())
                            + " FROM " + meas.getTableId() + "." + meas.getFieldName() + ")::INTEGER) AS "
                            + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                }
                // checking ('date')
                else if (meas.getAggr().equals("countu") && meas.getTimeGrain().equals("date")) {
                    field = "COUNT(DISTINCT(DATE(" + meas.getTableId() + "." + meas.getFieldName() + "))) AS "
                            + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                }
                // checking ('dayofweek')
                else if (meas.getAggr().equals("countu") && meas.getTimeGrain().equals("dayofweek")) {
                    field = "COUNT(DISTINCT(EXTRACT(" + timeGrainMap.get(meas.getTimeGrain())
                            + " FROM " + meas.getTableId() + "." + meas.getFieldName() + ")::INTEGER) +1) AS "
                            + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                }

                /*
                 * for simple count & variants, time grain is not needed
                 */
                else if (meas.getAggr().equals("countu")) {
                    field = "COUNT(*) AS " + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                } else if (meas.getAggr().equals("countnn")) {
                    field = "COUNT(" + meas.getTableId() + "." + meas.getFieldName() + ") AS "
                            + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                } else if (meas.getAggr().equals("countn")) {
                    field = "SUM(CASE WHEN " + meas.getTableId() + "." + meas.getFieldName()
                            + "IS NULL THEN 1 ELSE 0 END) AS "
                            + AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
                } else {
                    // TODO: handle exception if any aggregation given outside scope
                }
                selectMeasureList.add(field);
            }
        });

        selectList.addAll(selectDimList);
        selectList.addAll(selectMeasureList);
        QueryClauseFieldListMap qFieldListMap = new QueryClauseFieldListMap(selectList, groupByDimList,
                orderByDimList);
        return qFieldListMap;
    }
}
