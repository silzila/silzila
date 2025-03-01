package com.silzila.querybuilder.filteroptions;

import java.util.List;
import java.util.Objects;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.ColumnFilter;
import com.silzila.payload.request.Table;

public class FilterQueryOracle {
    private static final Logger logger = LogManager.getLogger(FilterQueryMysql.class);

    public static String getFilterOptions(ColumnFilter req, Table table) throws BadRequestException {
        logger.info("=========== FilterQueryOracle fn calling...");
        /*
         * ************************************************
         * get distinct values - binary, text
         * ************************************************
         */
        String query = "";
        String fromClause = "";
        //if table is null getting information from column filter request directly
        if(table==null){
            fromClause = " FROM " + req.getSchemaName() + "." + req.getTableName() + " " + req.getTableId() + " ";
        }
        else if(req.getIsCalculatedField()){
            fromClause =" FROM " + req.getTableId() + " ";
        }
        else {
            if (!table.isCustomQuery()) {
                fromClause = " FROM " + table.getSchema() + "." + table.getTable() + " " + table.getId() + " ";
            } else {
                fromClause = " FROM (" + table.getCustomQuery() + ") " + table.getId() + " ";
            }
        }

        if (req.getWhereClause() != null) {
            fromClause = fromClause + " " + req.getWhereClause() ;
        }
        
        String selectField = req.getIsCalculatedField()?req.getFieldName():req.getTableId()+ "."  + req.getFieldName();


        if (List.of("TEXT", "BOOLEAN").contains(req.getDataType().name())) {
            query = "SELECT DISTINCT " + selectField  + fromClause + "ORDER BY 1 ASC";
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
                    query = "SELECT DISTINCT " + selectField  + fromClause + "ORDER BY 1 ASC";
                }
                // get Range values
                else if (req.getFilterOption().name().equals("MIN_MAX")) {
                    query = "SELECT MIN(" + selectField  + ") AS min, MAX("
                            + selectField  + ") AS max" + fromClause;
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
             * Date - dictinct values // as DATE alias not working
             */
            if (req.getFilterOption().name().equals("ALL_VALUES")) {
                if (req.getTimeGrain().name().equals("YEAR")) {
                    String field = "TO_CHAR(" + selectField  + ",'yyyy')";
                    query = "SELECT DISTINCT " + field + " AS Year" + fromClause + "ORDER BY 1 ASC";
                } else if (req.getTimeGrain().name().equals("QUARTER")) {
                    String field = "TO_CHAR(" + selectField  + ",'\"Q\"Q')";
                    query = "SELECT DISTINCT " + field + " AS Quarter" + fromClause + "ORDER BY 1 ASC";
                } else if (req.getTimeGrain().name().equals("MONTH")) {
                    String sortField = "TO_CHAR(" + selectField  + ",'mm')";
                    String field = "TO_CHAR(" + selectField  + ",'fmMonth')";
                    query = "SELECT " + field + " AS Month" + fromClause + "GROUP BY " + sortField + ", "
                            + field + " ORDER BY " + sortField;
                } else if (req.getTimeGrain().name().equals("YEARQUARTER")) {
                    String field = "TO_CHAR(" + selectField  + ", 'YYYY-\"Q\"Q')";
                    query = "SELECT DISTINCT " + field + " AS YearQuarter" + fromClause + "ORDER BY 1 ASC";
                } else if (req.getTimeGrain().name().equals("YEARMONTH")) {
                    String field = "TO_CHAR(" + selectField  + ", 'yyyy-mm')";
                    query = "SELECT DISTINCT " + field + " AS YearMonth" + fromClause + "ORDER BY 1 ASC";
                } else if (req.getTimeGrain().name().equals("DATE")) {
                    String field = "TO_CHAR(" + selectField  + ",'yyyy-mm-dd')";
                    query = "SELECT DISTINCT " + field + " AS \"Date\"" + fromClause + "ORDER BY 1 ASC";
                } else if (req.getTimeGrain().name().equals("DAYOFWEEK")) {
                    String sortField = "TO_CHAR(" + selectField  + ",'D')";
                    String field = "TO_CHAR(" + selectField  + ", 'fmDay')";
                    query = "SELECT " + field + " AS DayOfWeek" + fromClause + "GROUP BY " + sortField + ", "
                            + field
                            + " ORDER BY " + sortField;
                } else if (req.getTimeGrain().name().equals("DAYOFMONTH")) {
                    String field = "TO_CHAR(" + selectField  + ", 'dd')";
                    query = "SELECT DISTINCT " + field + " AS DayOfMonth" + fromClause + "ORDER BY 1 ASC";
                }

            }
            /*
             * Date - Search (Min & Max only)
             */
            else if (req.getFilterOption().name().equals("MIN_MAX")) {
                if (req.getTimeGrain().name().equals("YEAR")) {
                    String col = "TO_CHAR(" + selectField  + ",'yyyy')";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("QUARTER")) {
                    String col = "TO_CHAR(" + selectField  + ",'\"Q\"Q')";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("MONTH")) {
                    String col = "TO_CHAR(" + selectField  + ",'mm')";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("DAT")) {
                    String col = "TO_CHAR(" + selectField  + ",'yyyy-mm-dd')";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("DAYOFWEEK")) {
                    String col = "TO_CHAR(" + selectField  + ",'D')";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("DAYOFMONTH")) {
                    String col = "TO_CHAR(" + selectField  + ", 'dd')";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                }
            }
        } else {
            throw new BadRequestException("Error: Wrong combination of Data Type & Filter Option!");
        }
        return query;

    }
}
