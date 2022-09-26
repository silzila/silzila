package org.silzila.app.querybuilder;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.silzila.app.domain.QueryClauseFieldListMap;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.helper.AilasMaker;
import org.silzila.app.payload.request.Dimension;
import org.silzila.app.payload.request.Measure;
import org.silzila.app.payload.request.Query;

public class SelectClauseMysql {

    /* SELECT clause for MySQL dialect */
    public static QueryClauseFieldListMap buildSelectClause(Query req) throws BadRequestException {
        System.out.println("SelectClauseMysql calling ***********");

        List<String> selectList = new ArrayList<>();
        List<String> selectDimList = new ArrayList<>();
        List<String> selectMeasureList = new ArrayList<>();
        List<String> groupByDimList = new ArrayList<>();
        List<String> orderByDimList = new ArrayList<>();

        Map<String, Integer> aliasNumbering = new HashMap<>();
        Map<String, String> timeGrainMap = Map.of("year", "YEAR", "quarter", "QUARTER",
                "month", "MONTH", "date", "DATE", "dayofweek", "DAYOFWEEK", "dayofmonth", "DAY");

        /*
         * --------------------------------------------------------
         * ---------------- Iterate List of Dim Fields ------------
         * --------------------------------------------------------
         * Dim fields are added in Group by and Order by clause. Some Dims (like month)
         * require extra index for sorting.
         * 
         * So, Group by and Order by clause are added at column level and Select clause
         * is added at the end of Dim/Measure
         */
        for (int i = 0; i < req.getDimensions().size(); i++) {
            Dimension dim = req.getDimensions().get(i);

            String field = "";

            // for non Date fields, Keep column as is
            if (List.of("text", "boolean", "integer", "decimal").contains(dim.getDataType())) {
                field = dim.getTableId() + "." + dim.getFieldName();
                groupByDimList.add(field);
                orderByDimList.add(field);
            }
            // for date fields, need to Parse as year, month, etc.. to aggreate
            else if (List.of("date", "timestamp").contains(dim.getDataType())) {
                // if time grain is null then assign default value 'year'
                if (dim.getTimeGrain() == null || dim.getTimeGrain().isBlank()) {
                    dim.setTimeGrain("year");
                }
                // checking ('year', 'quarter', 'month', 'yearmonth', 'yearquarter',
                // 'dayofweek', 'date', 'dayofmonth')
                // year -> 2015
                if (dim.getTimeGrain().equals("year")) {
                    field = "YEAR(" + dim.getTableId() + "." + dim.getFieldName() + ")";
                    groupByDimList.add(field);
                    orderByDimList.add(field);
                }
                // quarter name -> Q3
                else if (dim.getTimeGrain().equals("quarter")) {
                    field = "CONCAT('Q', QUARTER(" + dim.getTableId() + "." + dim.getFieldName() + "))";
                    groupByDimList.add(field);
                    orderByDimList.add(field);
                }
                // month name -> August
                // for month, need to give month number also for column sorting
                // which should be available in group by list but not in select list
                else if (dim.getTimeGrain().equals("month")) {
                    String sortingFfield = "MONTH(" + dim.getTableId() + "." + dim.getFieldName() + ")";
                    field = "MONTHNAME(" + dim.getTableId() + "." + dim.getFieldName() + ")";
                    groupByDimList.add(sortingFfield);
                    groupByDimList.add(field);
                    orderByDimList.add(sortingFfield);
                }
                // yearquarter name -> 2015-Q3
                else if (dim.getTimeGrain().equals("yearquarter")) {
                    field = "CONCAT(YEAR(" + dim.getTableId() + "." + dim.getFieldName()
                            + "), '-Q', QUARTER(" + dim.getTableId() + "." + dim.getFieldName() + "))";
                    groupByDimList.add(field);
                    orderByDimList.add(field);
                }
                // yearmonth name -> 2015-08
                else if (dim.getTimeGrain().equals("yearmonth")) {
                    field = "DATE_FORMAT(" + dim.getTableId() + "." + dim.getFieldName() + ", '%Y-%m')";
                    groupByDimList.add(field);
                    orderByDimList.add(field);
                }
                // date -> 2022-08-31
                else if (dim.getTimeGrain().equals("date")) {
                    field = "DATE(" + dim.getTableId() + "." + dim.getFieldName() + ")";
                    groupByDimList.add(field);
                    orderByDimList.add(field);
                }
                // day Name -> Wednesday
                // for day of week, also give day of week number for column sorting
                // which should be available in group by list but not in select list
                else if (dim.getTimeGrain().equals("dayofweek")) {
                    String sortingFfield = "DAYOFWEEK(" + dim.getTableId() + "." + dim.getFieldName() + ")";
                    field = "DAYNAME(" + dim.getTableId() + "." + dim.getFieldName() + ")";
                    groupByDimList.add(sortingFfield);
                    groupByDimList.add(field);
                    orderByDimList.add(sortingFfield);
                }
                // day of month -> 31
                else if (dim.getTimeGrain().equals("dayofmonth")) {
                    field = "DAY(" + dim.getTableId() + "." + dim.getFieldName() + ")";
                    groupByDimList.add(field);
                    orderByDimList.add(field);
                } else {
                    throw new BadRequestException("Error: Dimension " + dim.getFieldName() +
                            " should have timegrain!");
                }
            }
            String alias = AilasMaker.aliasing(dim.getFieldName(), aliasNumbering);
            selectDimList.add(field + " AS " + alias);
        }
        ;

        /*
         * --------------------------------------------------------
         * ------------- Iterate List of Measure Fields -----------
         * --------------------------------------------------------
         */
        for (int i = 0; i < req.getMeasures().size(); i++) {
            Measure meas = req.getMeasures().get(i);

            // if aggr is null then throw error
            if (meas.getAggr() == null || meas.getAggr().isBlank()) {
                throw new BadRequestException(
                        "Error: Aggregation is not specified for measure " + meas.getFieldName());
            }

            // if text field in measure then use
            // Text Aggregation Methods like COUNT
            // checking ('count', 'countnn', 'countn', 'countu')
            String field = "";
            if (List.of("text", "boolean").contains(meas.getDataType())) {
                // checking ('count', 'countnn', 'countn', 'countu')
                if (meas.getAggr().equals("count")) {
                    field = "COUNT(*)";
                } else if (meas.getAggr().equals("countnn")) {
                    field = "COUNT(" + meas.getTableId() + "." + meas.getFieldName() + ")";
                } else if (meas.getAggr().equals("countu")) {
                    field = "COUNT(DISTINCT " + meas.getTableId() + "." + meas.getFieldName() + ")";
                } else if (meas.getAggr().equals("countn")) {
                    field = "SUM(CASE WHEN " + meas.getTableId() + "." + meas.getFieldName()
                            + " IS NULL THEN 1 ELSE 0 END)";
                } else {
                    throw new BadRequestException(
                            "Error: Aggregation is not correct for measure " + meas.getFieldName());
                }
            }

            // for date fields, parse to year, month, etc.. and then
            // aggregate the field for Min & Max only
            else if (List.of("date", "timestamp").contains(meas.getDataType())) {
                List<String> aggrList = List.of("min", "max");
                List<String> timeGrainList = List.of("year", "quarter", "month", "date", "dayofmonth", "dayofweek");
                // checking Aggregations: ('min', 'max', 'count', 'countnn', 'countn', 'countu')
                // checking Time Grains: ('year', 'quarter', 'month', 'yearmonth',
                // 'yearquarter', 'dayofmonth')

                if (aggrList.contains(meas.getAggr()) && timeGrainList.contains(meas.getTimeGrain())) {
                    field = meas.getAggr().toUpperCase() + "(" + timeGrainMap.get(meas.getTimeGrain())
                            + "(" + meas.getTableId() + "." + meas.getFieldName() + "))";
                }

                /*
                 * countu is a special case & we can use time grain for this measure
                 */
                else if (meas.getAggr().equals("countu") && timeGrainList.contains(meas.getTimeGrain())) {
                    field = "COUNT(DISTINCT(" + timeGrainMap.get(meas.getTimeGrain())
                            + "(" + meas.getTableId() + "." + meas.getFieldName() + ")))";
                }
                // checking ('yearquarter')
                else if (meas.getAggr().equals("countu") && meas.getTimeGrain().equals("yearquarter")) {
                    field = "COUNT(DISTINCT(CONCAT(YEAR(" + meas.getTableId() + "." + meas.getFieldName()
                            + "), '-Q', QUARTER(" + meas.getTableId() + "." + meas.getFieldName() + "))))";
                }
                // checking ('yearmonth')
                else if (meas.getAggr().equals("countu") && meas.getTimeGrain().equals("yearmonth")) {
                    field = "COUNT(DISTINCT(DATE_FORMAT(" + meas.getTableId() + "." + meas.getFieldName()
                            + ", '%Y-%m')))";
                }

                /*
                 * for simple count & variants, time grain is not needed
                 */
                else if (meas.getAggr().equals("count")) {
                    field = "COUNT(*)";
                } else if (meas.getAggr().equals("countnn")) {
                    field = "COUNT(" + meas.getTableId() + "." + meas.getFieldName() + ")";
                } else if (meas.getAggr().equals("countn")) {
                    field = "SUM(CASE WHEN " + meas.getTableId() + "." + meas.getFieldName()
                            + " IS NULL THEN 1 ELSE 0 END)";
                } else {
                    throw new BadRequestException("Error: Measure " + meas.getFieldName() +
                            " should have timegrain!");
                }
            }
            // for number fields, do aggregation
            else if (List.of("integer", "decimal").contains(meas.getDataType())) {
                if (List.of("sum", "avg", "min", "max").contains(meas.getAggr())) {
                    field = meas.getAggr().toUpperCase() + "(" + meas.getTableId() + "." + meas.getFieldName()
                            + ")";
                } else if (meas.getAggr().equals("count")) {
                    field = "COUNT(*)";
                } else if (meas.getAggr().equals("countnn")) {
                    field = "COUNT(" + meas.getTableId() + "." + meas.getFieldName() + ")";
                } else if (meas.getAggr().equals("countu")) {
                    field = "COUNT(DISTINCT " + meas.getTableId() + "." + meas.getFieldName() + ")";
                } else if (meas.getAggr().equals("countn")) {
                    field = "SUM(CASE WHEN " + meas.getTableId() + "." + meas.getFieldName()
                            + " IS NULL THEN 1 ELSE 0 END)";
                } else {
                    throw new BadRequestException(
                            "Error: Aggregation is not correct for Numeric field " + meas.getFieldName());
                }
            }
            String alias = AilasMaker.aliasing(meas.getFieldName(), aliasNumbering);
            selectMeasureList.add(field + " AS " + alias);
        }
        ;

        selectList.addAll(selectDimList);
        selectList.addAll(selectMeasureList);
        QueryClauseFieldListMap qFieldListMap = new QueryClauseFieldListMap(selectList, groupByDimList,
                orderByDimList);
        return qFieldListMap;
    }
}
