package com.silzila.querybuilder.filteroptions;

import java.util.List;
import java.util.Objects;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.ColumnFilter;
import com.silzila.payload.request.Table;

public class FilterQuerySqlserver {

    private static final Logger logger = LogManager.getLogger(FilterQuerySqlserver.class);

    public static String getFilterOptions(ColumnFilter req, Table table) throws BadRequestException {
        logger.info("=========== FilterQuerySqlserver fn calling...");
        /*
         * ************************************************
         * get distinct values - binary, text
         * ************************************************
         */
        String query = "";
        String fromClause = " FROM " + table.getDatabase() + "." + table.getSchema() + "." + table.getTable() + " ";

        if (List.of("TEXT", "BOOLEAN").contains(req.getDataType().name())) {
            query = "SELECT DISTINCT " + req.getFieldName() + fromClause + "ORDER BY 1";
        }

        /*
         * ************************************************
         * get distinct & Range values - number fields
         * ************************************************
         */
        else if (List.of("INTEGER", "DECIMAL").contains(req.getDataType().name())) {

            if (!Objects.isNull(req.getFilterOption())) {
                // get distinct values
                if (req.getFilterOption().name().equals("ALL_VALUES")) {
                    query = "SELECT DISTINCT " + req.getFieldName() + fromClause + "ORDER BY 1";
                }
                // get Range values
                else if (req.getFilterOption().name().equals("MIN_MAX")) {
                    query = "SELECT MIN(" + req.getFieldName() + ") AS min, MAX("
                            + req.getFieldName() + ") AS max" + fromClause;
                }
                // if filter option is not provided, throw error
            } else {
                throw new BadRequestException("filterOption cannot be empty for number fields!");
            }
        }

        /*
         * ************************************************
         * DATE - dictinct values & Search
         * ************************************************
         */
        else if (List.of("DATE", "TIMESTAMP").contains(req.getDataType().name())) {
            // if Time grain is empty then throw error
            if (Objects.isNull(req.getTimeGrain())) {
                throw new BadRequestException("Error: Date/Timestamp Column should have Time Grain!");
            }
            /*
             * Date - dictinct values (May be Strings)
             */
            if (req.getFilterOption().name().equals("ALL_VALUES")) {
                if (req.getTimeGrain().name().equals("YEAR")) {
                    String field = "YEAR(" + req.getFieldName() + ")";
                    query = "SELECT DISTINCT " + field + " AS Year" + fromClause + "ORDER BY 1";
                } else if (req.getTimeGrain().name().equals("QUARTER")) {
                    String field = "CONCAT('Q', DATENAME(QUARTER," + req.getFieldName() + "))";
                    query = "SELECT DISTINCT " + field + " AS Quarter" + fromClause + "ORDER BY 1";
                } else if (req.getTimeGrain().name().equals("MONTH")) {
                    String sortField = "MONTH(" + req.getFieldName() + ")";
                    String field = "DATENAME(MONTH," + req.getFieldName() + ")";
                    query = "SELECT " + field + " AS Month" + fromClause + "GROUP BY " + sortField + ", "
                            + field + " ORDER BY " + sortField;
                } else if (req.getTimeGrain().name().equals("YEARQUARTER")) {
                    String field = "CONCAT(YEAR(" + req.getFieldName() + "), '-Q', DATENAME(QUARTER,"
                            + req.getFieldName() + "))";
                    query = "SELECT DISTINCT " + field + " AS YearQuarter" + fromClause + "ORDER BY 1";
                } else if (req.getTimeGrain().name().equals("YEARMONTH")) {
                    String field = "FORMAT(" + req.getFieldName() + ", 'yyyy-MM')";
                    query = "SELECT DISTINCT " + field + " AS YearMonth" + fromClause + "ORDER BY 1";
                } else if (req.getTimeGrain().name().equals("DATE")) {
                    String field = "CONVERT(DATE, " + req.getFieldName() + ")";
                    query = "SELECT DISTINCT " + field + " AS Date" + fromClause + "ORDER BY 1";
                } else if (req.getTimeGrain().name().equals("DAYOFWEEK")) {
                    String sortField = "DATEPART(WEEKDAY, " + req.getFieldName() + ")";
                    String field = "DATENAME(WEEKDAY, " + req.getFieldName() + ")";
                    query = "SELECT " + field + " AS DayOfWeek" + fromClause + "GROUP BY " + sortField + ", "
                            + field + " ORDER BY " + sortField;
                } else if (req.getTimeGrain().name().equals("DAYOFMONTH")) {
                    String field = "DATEPART(DAY, " + req.getFieldName() + ")";
                    query = "SELECT DISTINCT " + field + " AS DayOfMonth" + fromClause + "ORDER BY 1";
                }
            }

            /*
             * Date - Search (Min & Max only) (should be numbers or dates)
             */
            else if (req.getFilterOption().name().equals("MIN_MAX")) {
                if (req.getTimeGrain().name().equals("YEAR")) {
                    String col = "YEAR(" + req.getFieldName() + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("QUARTER")) {
                    String col = "DATEPART(QUARTER," + req.getFieldName() + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("MONTH")) {
                    String col = "MONTH(" + req.getFieldName() + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("DATE")) {
                    String col = "CONVERT(DATE," + req.getFieldName() + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("DAYOFWEEK")) {
                    String col = "DATEPART(WEEKDAY," + req.getFieldName() + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("DAYOFMONTH")) {
                    String col = "DATEPART(DAY," + req.getFieldName() + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                }
            }
        } else {
            throw new BadRequestException("Error: Wrong combination of Data Type & Filter Option!");
        }
        return query;

    }

}
