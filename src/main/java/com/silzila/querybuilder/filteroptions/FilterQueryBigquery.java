package com.silzila.querybuilder.filteroptions;

import java.util.List;
import java.util.Objects;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.ColumnFilter;
import com.silzila.payload.request.Table;

public class FilterQueryBigquery {
    private static final Logger logger = LogManager.getLogger(FilterQueryBigquery.class);

    public static String getFilterOptions(ColumnFilter req, Table table) throws BadRequestException {
        logger.info("=========== FilterQueryBigquery fn calling...");
        /*
         * ************************************************
         * get distinct values - binary, text
         * ************************************************
         */
        String query = "";
        String fromClause = "";
        //if table is null getting information from column filter request directly
        if(table==null){
            fromClause = " FROM `" + req.getDBName() + "." + req.getSchemaName() + "." + req.getTableName() + "` AS " + req.getTableId() + " ";
        }
        else if (table.isCustomQuery()) { 
            fromClause = " FROM (" + table.getCustomQuery() + ") AS " + table.getId() + " ";
        } else {
            fromClause = " FROM " + req.getFromClause() + " ";
        }

        if (req.getWhereClause() != null) {
            fromClause +=  " " + req.getWhereClause() ;
        }
        
        String selectField = req.getIsCalculatedField()?req.getFieldName():req.getTableId()+ "."  + req.getFieldName();

        if (List.of("TEXT", "BOOLEAN").contains(req.getDataType().name())) {
            query = "SELECT DISTINCT " + selectField + fromClause + "ORDER BY 1 ASC";
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
                    query = "SELECT DISTINCT " + selectField + fromClause + "ORDER BY 1 ASC";
                }
                // get Range values
                else if (req.getFilterOption().name().equals("MIN_MAX")) {
                    query = "SELECT MIN(" + selectField + ") AS min, MAX("
                            + selectField + ") AS max" + fromClause;
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
             * Date - dictinct values
             */
            if (req.getFilterOption().name().equals("ALL_VALUES")) {
                if (req.getTimeGrain().name().equals("YEAR")) {
                    String field = "EXTRACT(YEAR FROM " + selectField
                            + ")";
                    query = "SELECT DISTINCT " + field + " AS Year" + fromClause + "ORDER BY 1 ASC";
                } else if (req.getTimeGrain().name().equals("QUARTER")) {
                    String field = "CONCAT('Q', EXTRACT(QUARTER FROM " + selectField + "))";
                    query = "SELECT DISTINCT " + field + " AS Quarter" + fromClause + "ORDER BY 1 ASC";
                } else if (req.getTimeGrain().name().equals("MONTH")) {
                    String sortField = "EXTRACT(MONTH FROM " + selectField
                            + ")";
                    String field = "FORMAT_DATE('%B', DATE(" + selectField + "))";
                    query = "SELECT Month_Name FROM(SELECT " + field + " AS Month_Name, " + sortField + " AS Month_Number" + fromClause + 
                    "GROUP BY Month_Name, Month_Number ORDER BY Month_Number, Month_Name)";
                } else if (req.getTimeGrain().name().equals("YEARQUARTER")) {
                    String field = "CONCAT(EXTRACT(YEAR FROM " + selectField + "), '-Q', EXTRACT(QUARTER FROM "
                            + selectField + "))";
                    query = "SELECT DISTINCT " + field + " AS YearQuarter" + fromClause + "ORDER BY 1 ASC";
                } else if (req.getTimeGrain().name().equals("YEARMONTH")) {
                    String field = "FORMAT_DATE('%Y-%m', DATE(" + selectField + "))";
                    query = "SELECT DISTINCT " + field + " AS YearMonth" + fromClause + "ORDER BY 1 ASC";
                } else if (req.getTimeGrain().name().equals("DATE")) {
                    String field = "DATE(" + selectField + ")";
                    query = "SELECT DISTINCT " + field + " AS Date" + fromClause + "ORDER BY 1 ASC";
                }
                // in postgres, dayofweek starts from 0. So we add +1 to be consistent across DB
                else if (req.getTimeGrain().name().equals("DAYOFWEEK")) {
                    String sortField = "EXTRACT(DAYOFWEEK FROM " + selectField
                            + ")";
                    String field = "FORMAT_DATE('%A', DATE(" + selectField + "))";
                    query = "SELECT Dayofweek FROM(SELECT " + field + " AS DayOfWeek, " + sortField + " AS Dayofweek_number" + fromClause + 
                    "GROUP BY Dayofweek, Dayofweek_number ORDER BY Dayofweek_number, Dayofweek)";
                } else if (req.getTimeGrain().name().equals("DAYOFMONTH")) {
                    String field = "EXTRACT(DAY FROM " + selectField
                            + ")";
                    query = "SELECT DISTINCT " + field + " AS DayOfMonth" + fromClause + "ORDER BY 1 ASC";
                }

            }
            /*
             * Date - Search (Min & Max only)
             */
            else if (req.getFilterOption().name().equals("MIN_MAX")) {
                if (req.getTimeGrain().name().equals("YEAR")) {
                    String col = "EXTRACT(YEAR FROM " + selectField + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("QUARTER")) {
                    String col = "EXTRACT(QUARTER FROM " + selectField + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("MONTH")) {
                    String col = "EXTRACT(MONTH FROM " + selectField + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("DATE")) {
                    String col = "DATE(" + selectField + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("DAYOFWEEK")) {
                    String col = "EXTRACT(DAYOFWEEK FROM " + selectField + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("DAYOFMONTH")) {
                    String col = "EXTRACT(DAY FROM " + selectField + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                }
            }
        } else {
            throw new BadRequestException("Error: Wrong combination of Data Type & Filter Option!");
        }
        return query;

    }

}


