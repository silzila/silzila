package com.silzila.querybuilder.filteroptions;

import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.ColumnFilter;
import com.silzila.payload.request.Table;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;
import java.util.Objects;

public class FilterQueryDB2 {
    private static final Logger logger = LogManager.getLogger(FilterQueryPostgres.class);

    public static String getFilterOptions(ColumnFilter req, Table table) throws BadRequestException {
        logger.info("=========== FilterQueryDB2 fn calling...");
        /*
         * ************************************************
         * get distinct values - binary, text & number fields
         * ************************************************
         */
        String query = "";
        String fromClause="";
        //if table is null getting information from column filter request directly
        if(table==null){
            fromClause = " FROM " + req.getSchemaName() + "." + req.getTableName()+ " AS " + req.getTableId() + " ";
        }else {
            if (!table.isCustomQuery()) {
                fromClause = " FROM " + table.getSchema() + "." + table.getTable() + " AS " + table.getId() + " ";
            } else {
                fromClause = " FROM (" + table.getCustomQuery() + ") AS " + table.getId() + " ";
            }
        }

        if (List.of("TEXT", "BOOLEAN").contains(req.getDataType().name())) {
            query = "SELECT DISTINCT " + req.getTableId()+ "."  + req.getFieldName() + fromClause + "ORDER BY 1";
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
                    query = "SELECT DISTINCT " + req.getTableId()+ "." + req.getFieldName() + fromClause + "ORDER BY 1";
                }
                // get Range values
                else if (req.getFilterOption().name().equals("MIN_MAX")) {
                    query = "SELECT MIN("  + req.getTableId()+ "." + req.getFieldName() + ") AS min, MAX("
                            + req.getTableId()+ "." + req.getFieldName() + ") AS max" + fromClause;
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
                    String field = "EXTRACT(YEAR FROM " + req.getTableId()+ "."  + req.getFieldName()
                            + ")::INTEGER AS Year";
                    query = "SELECT DISTINCT " + field + fromClause + "ORDER BY 1";
                } else if (req.getTimeGrain().name().equals("QUARTER")) {
                    String field = "CONCAT('Q', EXTRACT(QUARTER FROM " + req.getTableId()+ "." + req.getFieldName() + ")::INTEGER) AS Quarter";
                    query = "SELECT DISTINCT " + field + fromClause + "ORDER BY 1";
                } else if (req.getTimeGrain().name().equals("MONTH")) {
                    String sortField = "EXTRACT(MONTH FROM " + req.getTableId()+ "."  + req.getFieldName()
                            + ")::INTEGER";
                    String field = "TRIM(TO_CHAR(" + req.getTableId()+ "."  + req.getFieldName() + ", 'Month'))";
                    query = "SELECT " + field + " AS Month" + fromClause + "GROUP BY " + sortField + ", " + field
                            + " ORDER BY " + sortField;
                } else if (req.getTimeGrain().name().equals("YEARQUARTER")) {
                    String field = "YEAR(" + req.getTableId()+ "." + req.getFieldName()
                            + ") ||  '-Q' || QUARTER(" + req.getTableId()+ "."  + req.getFieldName() + ")";
                    query = "SELECT DISTINCT " + field + " AS YearQuarter" + fromClause + "ORDER BY 1";
                } else if (req.getTimeGrain().name().equals("YEARMONTH")) {
                    String field = "YEAR(" + req.getTableId()+ "." + req.getFieldName() + ") || '-' || RIGHT('0' || MONTH("+ req.getTableId()+ "." + req.getFieldName() +"), 2)";
                    query = "SELECT DISTINCT " + field + " AS YearMonth" + fromClause + "ORDER BY 1";
                }
                //taking the alias as same as the column name because there is issue while converting to resultsetToJson
                else if (req.getTimeGrain().name().equals("DATE")) {
                    String field =  "DATE("+ req.getTableId()+ "." + req.getFieldName()+")" ;
                    query = "SELECT DISTINCT " + field + " AS " +req.getFieldName()+" " +fromClause + "ORDER BY 1 ";
                }
                // in postgres, dayofweek starts from 0. So we add +1 to be consistent across DB
                else if (req.getTimeGrain().name().equals("DAYOFWEEK")) {
                    String sortField = "EXTRACT(DOW FROM " + req.getTableId()+ "." + req.getFieldName()
                            + ")::INTEGER +1";
                     String field = "TRIM(TO_CHAR(" + req.getTableId()+ "." + req.getFieldName() + ", 'Day'))";
                    query = "SELECT " + field + " AS DayOfWeek" + fromClause + "GROUP BY " + sortField + ", " + field
                            + " ORDER BY " + sortField;
                } else if (req.getTimeGrain().name().equals("DAYOFMONTH")) {
                    String field = "EXTRACT(DAY FROM " + req.getTableId()+ "." + req.getFieldName()
                            + ")::INTEGER AS DayOfMonth";
                    query = "SELECT DISTINCT " + field + fromClause + "ORDER BY 1";
                }

            }
            /*
             * Date - Search (Min & Max only)
             */
            else if (req.getFilterOption().name().equals("MIN_MAX")) {
                if (req.getTimeGrain().name().equals("YEAR")) {
                    String col = "EXTRACT(YEAR FROM " + req.getTableId()+ "."  + req.getFieldName() + ")::INTEGER";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("QUARTER")) {
                    String col = "EXTRACT(QUARTER FROM " + req.getTableId()+ "." + req.getFieldName() + ")::INTEGER";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("MONTH")) {
                    String col = "EXTRACT(MONTH FROM " + req.getTableId()+ "." + req.getFieldName() + ")::INTEGER";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("DATE")) {
                    String col = "DATE(" + req.getTableId()+ "." + req.getFieldName() + ")";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("DAYOFWEEK")) {
                    String col = "EXTRACT(DOW FROM " + req.getTableId()+ "."  + req.getFieldName() + ")::INTEGER +1";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                } else if (req.getTimeGrain().name().equals("DAYOFMONTH")) {
                    String col = "EXTRACT(DAY FROM " + req.getTableId()+ "." + req.getFieldName() + ")::INTEGER";
                    query = "SELECT MIN(" + col + ") AS min, MAX(" + col + ") AS max" + fromClause;
                }
            }
        } else {
            throw new BadRequestException("Error: Wrong combination of Data Type & Filter Option!");
        }
        return query;

    }

}
