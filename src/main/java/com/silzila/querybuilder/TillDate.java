package com.silzila.querybuilder;

import java.util.List;

import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Filter;

public class TillDate {

    public static String tillDate(String vendorName, Filter filter, String field) throws BadRequestException{
        String where = "";

        Boolean shouldExclude = filter.getFilterType().equals("tillDate") && filter.getShouldExclude();

        if(!filter.getFilterType().equals("tillDate")){
             where += " AND \n\t\t";
        }

        if(List.of("MONTH","DAYOFMONTH","YEARMONTH").contains(filter.getTimeGrain().name())){
            String operator = shouldExclude ? ">" : "<=";
            if (vendorName.equals("mysql")) {
                where += "DAY(" + field + ")"+ operator + " DAY(CURRENT_DATE())";
            } else if (vendorName.equals("postgresql") || vendorName.equals("redshift")  ) {
                where += "EXTRACT(DAY FROM " + field + ")::INTEGER "+ operator + " EXTRACT(DAY FROM CURRENT_DATE)";
            } else if (vendorName.equals("sqlserver")) {
                where += "DAY(" + field + ") "+ operator + " DAY(GETDATE())";
            } else if (vendorName.equals("bigquery")) {
                where += "EXTRACT(DAY FROM " + field + ") "+ operator + " EXTRACT(DAY FROM CURRENT_DATE())";
            } else if (vendorName.equals("databricks")) {
                where += "DAYOFMONTH(" + field + ") "+ operator + " DAY(CURRENT_DATE())";
            } else if (vendorName.equals("oracle")) {
                where += "TO_NUMBER(TO_CHAR(" + field + ", 'DD')) "+ operator + " TO_NUMBER(TO_CHAR(CURRENT_DATE, 'DD'))";
            } else if (vendorName.equals("snowflake")) {
                where += "DAYOFMONTH(" + field + ") "+ operator + " DAYOFMONTH(CURRENT_DATE())";
            } else if (vendorName.equals("duckdb") || vendorName.equals("motherduck")) {
                where += "EXTRACT(day FROM " + field + ") "+ operator + " EXTRACT(day FROM CURRENT_DATE())";
            }else if (vendorName.equals("db2")) {
                where += "EXTRACT(DAY FROM " + field + ")::INTEGER "+ operator + " EXTRACT(DAY FROM CURRENT_DATE)";
            }else if (vendorName.equals("teradata")) {
                where += "EXTRACT(day FROM " + field + ") "+ operator + " EXTRACT(day FROM CURRENT_DATE)";
            }else if (vendorName.equals("amazonathena")) {
                where += "EXTRACT(DAY FROM " + field + ") " + operator + " EXTRACT(DAY FROM CURRENT_DATE)";
            }
            else {
                throw new BadRequestException("Error: DB vendor Name is wrong!");
            }
        }
        else if(filter.getTimeGrain().name().equals("YEAR")){
            String operator = shouldExclude ? "NOT" : "";
            if (vendorName.equals("mysql")) {
                where += "DATE(" + field + ") "+ operator + " BETWEEN CONCAT(YEAR(" + field + "), '-01-01') AND \n\t\tCONCAT(YEAR(" + field + "), '-', LPAD(MONTH(CURRENT_DATE()), 2, '0'), \n\t\t'-', LPAD(DAY(CURRENT_DATE()), 2, '0'))";
            } else if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
                where += field + " :: date "+ operator + " BETWEEN (DATE_TRUNC('year'," + field + ")::date) AND \n\t\t(( extract(YEAR from " + field + ") || '-' || EXTRACT(MONTH FROM CURRENT_DATE) \n\t\t|| '-' || EXTRACT(DAY FROM CURRENT_DATE))::date)";
            } else if (vendorName.equals("sqlserver")) {
                where +="CONVERT(date," + field + ") "+ operator + " BETWEEN CONVERT(DATE,DATETRUNC(year," + field + ")) AND \n\t\tCONCAT(year(convert(date," + field + ")) , '-', FORMAT(GETDATE(), 'MM') , \n\t\t'-', FORMAT(GETDATE(), 'dd'))";
            } else if (vendorName.equals("bigquery")) {
                where += "DATE(" + field + ") "+ operator + " BETWEEN DATE_TRUNC(" + field + ", YEAR) AND \n\t\tDATE(CONCAT(EXTRACT(YEAR FROM " + field + "), '-', EXTRACT(MONTH FROM CURRENT_DATE()), \n\t\t'-', EXTRACT(DAY FROM CURRENT_DATE())))";
            } else if (vendorName.equals("databricks")) {
                where += "DATE(" + field + ") "+ operator + " BETWEEN TRUNC(" + field + ", 'YEAR') AND \n\t\tTO_DATE(CONCAT(YEAR( " + field + "), '-', MONTH( CURRENT_DATE()), \n\t\t'-', DAY( CURRENT_DATE())))";
            } else if (vendorName.equals("oracle")) {
                where += "TRUNC(" + field + ") "+ operator + " BETWEEN TRUNC(" + field + ",'YEAR') AND \n\t\tTO_DATE(TO_CHAR(" + field + ", 'YYYY') || '-' || TO_CHAR(SYSDATE, 'MM-DD'), 'YYYY-MM-DD')";
            } else if (vendorName.equals("snowflake")) {
                where += "DATE(" + field + ") "+ operator + " BETWEEN DATE_TRUNC('YEAR'," + field + ") AND \n\t\t(TO_VARCHAR(" + field + ", 'YYYY') || '-' || TO_VARCHAR(CURRENT_DATE(), 'MM-DD'))::DATE";
            } else if (vendorName.equals("duckdb")||vendorName.equals("motherduck")) {
                where += "CAST(" + field + " AS DATE) "+ operator + " BETWEEN DATE_TRUNC('year', " + field + ") AND \n\t\tCAST(EXTRACT('year' FROM " + field + ") || '-' || extract('month' from current_date())||'-'||extract('day' from current_date()) AS DATE)"; 
            } else if (vendorName.equals("db2")) {
                where += field + " :: date "+ operator + " BETWEEN (DATE_TRUNC('year'," + field + ")::date) AND \n\t\t(( extract(YEAR from " + field + ") || '-' || EXTRACT(MONTH FROM CURRENT_DATE) \n\t\t|| '-' || EXTRACT(DAY FROM CURRENT_DATE))::date)";
            }else if (vendorName.equals("teradata")) {
                where += "CAST(" + field + " AS DATE) "+ operator + " BETWEEN \nCAST(CONCAT(YEAR(" + field + "), '-01-01') AS DATE)  AND \nCAST(CONCAT(YEAR(" + field + "), '-', LTRIM(MONTH(CURRENT_DATE())(format '99')),'-', LTRIM(EXTRACT(DAY from CURRENT_DATE()))) AS DATE)";
            }else if (vendorName.equals("amazonathena")) {
                where += field + " " + operator + 
                         " BETWEEN CAST(DATE_TRUNC('year', " + field + ") AS DATE) AND " +
                         "CAST(CONCAT(" +
                            "CAST(EXTRACT(YEAR FROM " + field + ") AS VARCHAR), '-', " +
                            "CAST(EXTRACT(MONTH FROM CURRENT_DATE) AS VARCHAR), '-', " +
                            "CAST(EXTRACT(DAY FROM CURRENT_DATE) AS VARCHAR)" +
                         ") AS DATE)";
            }
            
            else {
                throw new BadRequestException("Error: DB vendor Name is wrong!" + vendorName);
            }
            
        }
        else if(filter.getTimeGrain().name().equals("DAYOFWEEK")){
            String operator = shouldExclude ? ">" : "<=";
            if (vendorName.equals("mysql")) {
                where += "DAYOFWEEK(" + field + ") "+ operator + " DAYOFWEEK(CURRENT_DATE())";
            } else if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
                where += "EXTRACT(DOW FROM " + field + ") "+ operator + " EXTRACT(DOW FROM CURRENT_DATE)";
            } else if (vendorName.equals("sqlserver")) {
                where += "DATEPART(WEEKDAY, " + field + ") "+ operator + " DATEPART(WEEKDAY, GETDATE())";
            } else if (vendorName.equals("bigquery")) {
                where += "EXTRACT(DAYOFWEEK FROM " + field + ") "+ operator + " EXTRACT(DAYOFWEEK FROM CURRENT_DATE())";
            } else if (vendorName.equals("databricks")) {
                where += "DAYOFWEEK(" + field + ") "+ operator + " DAYOFWEEK(CURRENT_DATE())";
            } else if (vendorName.equals("oracle")) {
                where += "TO_NUMBER(TO_CHAR(" + field + ", 'D')) "+ operator + " TO_NUMBER(TO_CHAR(CURRENT_DATE, 'D'))";
            } else if (vendorName.equals("snowflake")) {
                where += "DAYOFWEEK(" + field + ") "+ operator + " DAYOFWEEK(CURRENT_DATE())";
            }else if (vendorName.equals("duckdb")||vendorName.equals("motherduck")) {
                where += "DAYOFWEEK(" + field + ") "+ operator + " DAYOFWEEK(CURRENT_DATE())";
            } else if (vendorName.equals("db2")) {
                where += "EXTRACT(DOW FROM " + field + ") "+ operator + " EXTRACT(DOW FROM CURRENT_DATE)";
            }else if (vendorName.equals("teradata")) {
                where += "TD_DAY_OF_WEEK(" + field + ") "+ operator + " TD_DAY_OF_WEEK(CURRENT_DATE)";
            }else if (vendorName.equals("amazonathena")) {
                where += "EXTRACT(DAY_OF_WEEK FROM " + field + ") " + operator + " EXTRACT(DAY_OF_WEEK FROM CURRENT_DATE)";
            }
            else {
                throw new BadRequestException("Error: DB vendor Name is wrong!");
            }
        }

        else if(List.of("QUARTER","YEARQUARTER").contains(filter.getTimeGrain().name())){
            String operator = shouldExclude ? "NOT" : "";
            if(vendorName.equals("mysql")){
                where+="DATE(" + field + ") "+ operator + " BETWEEN CONCAT(YEAR(" + field +
                 "), '-', LPAD(1 + (QUARTER(" + field + ") - 1) * 3, 2, '0'), '-01')AND \n\t\tCONCAT(YEAR("
                + field + "), '-'\n\t\t,LPAD(1 + (((QUARTER(" + field + 
                ")) - 1) * 3 + \n\t\t(TIMESTAMPDIFF(MONTH, CONCAT(YEAR(current_date()), '-',LPAD(1 + (QUARTER(current_date()) - 1) * 3, 2, '0'), '-01'), \n\t\tcurrent_date()))), 2, '0'), '-'\n\t\t,LPAD(case WHEN (DAY(current_date()) in (29,30,31) AND LPAD(1 + (((QUARTER("
                + field + 
                ")) - 1) * 3 + \n\t\t(TIMESTAMPDIFF(MONTH, CONCAT(YEAR(current_date()), '-'\n\t\t, LPAD(1 + (QUARTER(current_date()) - 1) * 3, 2, '0'), '-01'), current_date()))), 2, '0') = \"02\") \n\t\tTHEN IF(YEAR("+ field +") % 4 = 0 AND \n\t\t(YEAR("+ field +") % 100 != 0 OR \n\t\tYEAR("+ field +") % 400 = 0), 29, 28) WHEN (DAY(current_date()) = 31 AND \n\t\tLPAD(1 + (((QUARTER("
                + field + 
                ")) - 1) * 3 + (TIMESTAMPDIFF(MONTH, CONCAT(YEAR(current_date()), '-',\n\t\t LPAD(1 + (QUARTER(current_date()) - 1) * 3, 2, '0'), '-01'), current_date()))), 2, '0') IN (\"04\", \"06\", \"09\", \"11\"))\n\t\t THEN 30 ELSE DAY(current_date()) END, 2, '0'))";
            } else if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
                where += " "+field + "::date "+ operator + " BETWEEN DATE_TRUNC('quarter', " + field + ")::date AND \n\t\t" +
                "to_date( " +
                "extract(year from " + field + ") || '-'|| \n\t\t((date_part('month', DATE_TRUNC('quarter', " + field + "))::int) + \n\t\t" +
                "(extract(month from age(CURRENT_DATE::date, DATE_TRUNC('quarter', CURRENT_DATE)::date)))::int) || '-' || \n\t\t" +
                "CASE " +
                "WHEN (EXTRACT(DAY FROM CURRENT_DATE) IN (29,30, 31) AND ((date_part('month', DATE_TRUNC('quarter', " + field + "))::int) + \n\t\t" +
                "(extract(month from age(CURRENT_DATE::date, DATE_TRUNC('quarter', CURRENT_DATE)::date)))::int) = 2) " +
                "THEN " +
                "CASE \n\t\t" +
                "WHEN EXTRACT(YEAR FROM "+ field +") % 4 = 0 AND (EXTRACT(YEAR FROM "+ field +") % 100 != 0 OR \n\t\tEXTRACT(YEAR FROM "+ field +") % 400 = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN (EXTRACT(DAY FROM CURRENT_DATE) = 31 AND ((date_part('month', DATE_TRUNC('quarter', " + field + "))::int) + \n\t\t" +
                "(extract(month from age(CURRENT_DATE::date, DATE_TRUNC('quarter', CURRENT_DATE)::date)))::int) IN (4,6,9,11)) \n\t\t" +
                "THEN '30' ELSE TO_CHAR(EXTRACT(DAY FROM CURRENT_DATE), 'FM00') " +
                "END,  'YYYY-MM-DD' )";

            } else if (vendorName.equals("sqlserver")) {
                where += "CONVERT (DATE, " + field + ") "+ operator + " BETWEEN DATETRUNC(quarter, " + field + ") " +
                "AND \n\t\t" +
                "CAST(" +
                "CONCAT(" +
                "YEAR(" + field + "), '-', " +
                "((MONTH(DATETRUNC(quarter, " + field + "))) + \n\t\t" +
                "(DATEDIFF(month, DATETRUNC(quarter, GETDATE()), GETDATE()))),'-', \n\t\t" +
                "CASE " +
                "WHEN DAY(GETDATE()) IN (29,30, 31) AND ((MONTH(DATETRUNC(quarter, " + field + "))) + \n\t\t" +
                "(DATEDIFF(month, DATETRUNC(quarter, GETDATE()), GETDATE())) = 2) " +
                "THEN " +
                "CASE \n\t\t" +
                "WHEN YEAR("+ field +") % 4 = 0 AND (YEAR("+ field +") % 100 != 0 OR YEAR("+ field +") % 400 = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN DAY(GETDATE()) = 31 AND ((MONTH(DATETRUNC(quarter, " + field + "))) + \n\t\t" +
                "(DATEDIFF(month, DATETRUNC(quarter, GETDATE()), GETDATE())) IN (4,6,9,11)) " +
                "THEN '30' \n\t\t" +
                "ELSE CAST(DAY(GETDATE()) AS VARCHAR) " +
                "END) AS DATE)";
            } else if (vendorName.equals("bigquery")) {
                where += "DATE(" + field + ") "+ operator + " BETWEEN DATE_TRUNC(" + field + ", QUARTER) AND \n\t\t" +
                "CAST(" +
                "CONCAT(" +
                "EXTRACT(YEAR FROM " + field + ")," +
                "'-', \n\t\t" +
                "CAST(" +
                "EXTRACT(MONTH FROM DATE_TRUNC(" + field + ", QUARTER))\n\t\t" +
                "+ DATE_DIFF(CURRENT_DATE(), DATE_TRUNC(CURRENT_DATE(), QUARTER), MONTH)" +
                "AS STRING)" +
                ",'-', \n\t\t" +
                "CASE " +
                "WHEN EXTRACT(DAY FROM CURRENT_DATE()) IN (29,30, 31) AND (EXTRACT(MONTH FROM DATE_TRUNC(" + field + ", QUARTER)) + \n\t\tDATE_DIFF(CURRENT_DATE(), DATE_TRUNC(CURRENT_DATE(), QUARTER), MONTH)) = 2 THEN " +
                "CASE \n\t\t" +
                "WHEN MOD(EXTRACT(YEAR FROM "+ field +"), 4) = 0 AND (MOD(EXTRACT(YEAR FROM "+ field +"), 100) != 0 OR \n\t\tMOD(EXTRACT(YEAR FROM "+ field +"), 400) = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN EXTRACT(DAY FROM CURRENT_DATE()) = 31 AND (EXTRACT(MONTH FROM DATE_TRUNC(" + field + ", QUARTER)) + \n\t\tDATE_DIFF(CURRENT_DATE(), DATE_TRUNC(CURRENT_DATE(), QUARTER), MONTH)) IN (4, 6, 9, 11) THEN '30'\n\t\t " +
                "ELSE CAST(EXTRACT(DAY FROM CURRENT_DATE()) AS STRING) \n\t\t" +
                "END) AS DATE)";
            } else if (vendorName.equals("databricks")) {
                where += "DATE(" + field + ") "+ operator + " BETWEEN TRUNC( " + field + ",'QUARTER') AND \n\t\t" +
                "TO_DATE(YEAR( " + field + ")  || '-' || \n\t\t" +
                "(MONTH(TRUNC( " + field + ", 'QUARTER')) + \n\t\t" +
                "FLOOR(MONTHS_BETWEEN(CURRENT_DATE(), TRUNC(CURRENT_DATE(), 'QUARTER')))) || '-' || \n\t\t" +
                "CASE " +
                "WHEN DAY(CURRENT_DATE()) IN (29,30, 31) AND (MONTH(" + field + ") + \n\t\t" +
                "FLOOR(MONTHS_BETWEEN(CURRENT_DATE(), TRUNC(CURRENT_DATE(), 'QUARTER')))) = 2 THEN " +
                "CASE \n\t\t" +
                "WHEN YEAR("+ field +") % 4 = 0 AND (YEAR("+ field +") % 100 != 0 OR \n\t\tYEAR("+ field +") % 400 = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN DAY(CURRENT_DATE()) = 31 AND (MONTH( " + field + ") + \n\t\t" +
                "FLOOR(MONTHS_BETWEEN(CURRENT_DATE(), TRUNC(CURRENT_DATE(), 'QUARTER')))) IN (4, 6, 9, 11) THEN '30' " +
                "ELSE DAY(CURRENT_DATE()) \n\t\t" +
                "END)"; 
            } else if (vendorName.equals("oracle")) {
                where += "TRUNC(" + field + ") "+ operator + " BETWEEN TRUNC(" + field + ", 'Q') AND \n\t\t" +
                "TO_DATE(" +
                "TO_CHAR(EXTRACT(YEAR FROM " + field + ")) || '-' || \n\t\t" +
                "LPAD(TO_NUMBER(EXTRACT(MONTH FROM TRUNC(" + field + ", 'Q'))) + \n\t\tTO_NUMBER(TO_CHAR(" +
                "(MONTHS_BETWEEN(SYSDATE, TRUNC(SYSDATE, 'Q'))), " +
                "'FM00'" +
                ")), 2, '0') || '-' || \n\t\t" +
                "CASE " +
                "WHEN TO_NUMBER(TO_CHAR(SYSDATE , 'DD')) IN (29,30, 31) AND LPAD(TO_NUMBER(EXTRACT(MONTH FROM TRUNC(" + field + ", 'Q'))) + \n\t\tTO_NUMBER(TO_CHAR(" +
                "(MONTHS_BETWEEN(SYSDATE, TRUNC(SYSDATE, 'Q'))), " +
                "'FM00'" +
                ")), 2, '0') = '02' " +
                "THEN " +
                "CASE \n\t\t" +
                "WHEN MOD(TO_NUMBER(TO_CHAR("+ field +", 'YYYY')), 4) = 0 AND (MOD(TO_NUMBER(TO_CHAR("+ field +", 'YYYY')), 100) != 0 OR \n\t\tMOD(TO_NUMBER(TO_CHAR("+ field +", 'YYYY')), 400) = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN TO_NUMBER(TO_CHAR(SYSDATE, 'DD')) = 31 AND LPAD(TO_NUMBER(EXTRACT(MONTH FROM TRUNC(" + field + ", 'Q'))) + \n\t\tTO_NUMBER(TO_CHAR(" +
                "(MONTHS_BETWEEN(SYSDATE, TRUNC(SYSDATE, 'Q'))), \n\t\t" +
                "'FM00'" +
                ")), 2, '0')IN ('04', '06', '09','11') \n\t\t" +
                "THEN '30' " +
                "ELSE TO_CHAR(SYSDATE, 'DD') END , 'YYYY-MM-DD')";            
            } else if (vendorName.equals("snowflake")) {
                where += "DATE(" + field + ") "+ operator + " BETWEEN DATE_TRUNC('QUARTER', " + field + ") AND \n\t\t" +
                "TO_DATE(EXTRACT(YEAR FROM " + field + ")::STRING || '-' || \n\t\t" +
                "LPAD(CAST(EXTRACT(MONTH FROM DATE_TRUNC('QUARTER', " + field + ")) + \n\t\t" +
                "DATEDIFF(MONTH, DATE_TRUNC('QUARTER', CURRENT_DATE()), CURRENT_DATE()) AS STRING), 2, '0') || '-' || \n\t\t" +
                "CASE " +
                "WHEN DAY(CURRENT_DATE()) IN ( 29,30, 31) AND EXTRACT(MONTH FROM DATE_TRUNC('QUARTER', " + field + ")) + \n\t\t" +
                "DATEDIFF(MONTH, DATE_TRUNC('QUARTER', CURRENT_DATE()), CURRENT_DATE()) = 2 THEN \n\t\t" +
                "CASE " +
                "WHEN YEAR("+ field +") % 4 = 0 AND (YEAR("+ field +") % 100 != 0 OR \n\t\tYEAR("+ field +") % 400 = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN DAY(CURRENT_DATE()) = 31 AND EXTRACT(MONTH FROM " + field + ") + \n\t\t" +
                "DATEDIFF(MONTH, DATE_TRUNC('QUARTER', CURRENT_DATE()), CURRENT_DATE()) IN (4, 6, 9, 11) THEN '30' \n\t\t" +
                "ELSE LPAD(CAST(DAY(CURRENT_DATE()) AS STRING), 2, '0') " +
                "END, 'YYYY-MM-DD')";
            }
            else if (vendorName.equals("duckdb")||vendorName.equals("motherduck")) {
                where +="CAST(" + field + " AS DATE) "+ operator + " BETWEEN DATE_TRUNC('QUARTER', " + field + ") AND \n\t\t" +
                "CAST(CAST(EXTRACT('year' FROM " + field + ") AS VARCHAR)|| '-' || \n\t\t" +
                "CAST(EXTRACT('MONTH' FROM DATE_TRUNC('QUARTER', " + field + ")) + \n\t\t" +
                "DATEDIFF('MONTH', DATE_TRUNC('QUARTER', CURRENT_DATE()), CURRENT_DATE()) AS VARCHAR) || '-' || \n\t\t" +
                "CASE " +
                "WHEN DAY(CURRENT_DATE()) IN (29,30, 31) AND EXTRACT('MONTH' FROM DATE_TRUNC('QUARTER', " + field + ")) + \n\t\t" +
                "DATEDIFF('MONTH', DATE_TRUNC('QUARTER', CURRENT_DATE()), CURRENT_DATE()) = 2 THEN \n\t\t" +
                "CASE " +
                "WHEN YEAR("+ field +") % 4 = 0 AND (YEAR("+ field +") % 100 != 0 OR \n\t\tYEAR("+ field +") % 400 = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN DAY(CURRENT_DATE()) = 31 AND EXTRACT('MONTH' FROM " + field + ") + \n\t\t" +
                "DATEDIFF('MONTH', DATE_TRUNC('QUARTER', CURRENT_DATE()), CURRENT_DATE()) IN (4, 6, 9, 11) THEN '30' \n\t\t" +
                "ELSE CAST(DAY(CURRENT_DATE()) AS VARCHAR)" +
                "END AS DATE) ";
            }else if (vendorName.equals("db2")) {
                where += " " + field + "::date "+ operator + " BETWEEN DATE_TRUNC('quarter', " + field + ")::date AND \n\t\t" +
                        "( extract(year from " + field + "::date) || '-'|| \n" +
                        "\t\tLPAD(\n" +
                        "           CAST((date_part('month', DATE_TRUNC('quarter', " + field + "::date))::integer) + \n" +
                        "                (MONTHS_BETWEEN(CURRENT date , DATE_TRUNC('quarter', CURRENT date)::date)::integer) AS VARCHAR(2)),\n" +
                        "           2, '0') || '-' || \n" +
                        "\t\tCASE WHEN EXTRACT(DAY FROM CURRENT DATE) IN (29,30, 31) AND (((date_part('month', DATE_TRUNC('quarter', " + field + "::date))::integer) + \n" +
                        "\t\t(MONTHS_BETWEEN(CURRENT date , DATE_TRUNC('quarter', CURRENT date)::date)::integer)) = 2) \n" +
                        "\t\tTHEN CASE \n" +
                        "\t\t\t\tWHEN EXTRACT(YEAR FROM "+ field +") % 4 = 0 AND (EXTRACT(YEAR FROM "+ field +") % 100 != 0 OR \n" +
                        "\t\t\t\t\t\tEXTRACT(YEAR FROM "+ field +") % 400 = 0) \n" +
                        "\t\t\t\tTHEN '29' \n" +
                        "\t\t\t\tELSE '28' \n" +
                        "\t\t\t\tEND \n" +
                        "\t\tWHEN EXTRACT(DAY FROM CURRENT DATE) = 31 AND ((date_part('month', DATE_TRUNC('quarter', " + field + "::date))::integer) + \n" +
                        "\t\t(MONTHS_BETWEEN(CURRENT date , DATE_TRUNC('quarter', CURRENT date)::date)::integer)) IN (4,6,9,11) \n" +
                        "\t\tTHEN '30' ELSE LPAD(TO_CHAR(EXTRACT(DAY FROM CURRENT DATE)), 2, '0') END )::date";
            }else if(vendorName.equals("teradata")){
                where+="CAST(" + field + " AS DATE) "+ operator + " BETWEEN \nCAST(Trunc(" + field + " , 'Q') AS DATE) AND CAST(YEAR(" + field + ") || '-'|| TRIM(MONTH( Trunc(" + field + ", 'Q')) +\n"+
                       "\tmonth(current_date)- MONTH( Trunc(current_date, 'Q'))(format '99'))\n\t || '-' || \n CASE\n"+
                       "WHEN EXTRACT(DAY FROM CURRENT_DATE) IN (29, 30, 31)\n"+
                        "AND (MONTH(Trunc(" + field + ", 'Q')) + MONTH(CURRENT_DATE) - MONTH(Trunc(CURRENT_DATE, 'Q')) = 2)\n"+
                        "THEN\n\t\tCASE\n\t\t\t"+
                        "WHEN MOD(YEAR("+ field +"), 4) = 0 AND (MOD(YEAR("+ field +"), 100) <> 0 OR MOD(YEAR("+ field +"), 400) = 0)\n\t\t\t\t"+
                        "THEN '29'\n\t\t\t\tELSE '28'\n\t\t\t\tEND\n"+ "WHEN EXTRACT(DAY FROM CURRENT_DATE) = 31 "+
                        "AND (MONTH(Trunc(" + field + ", 'Q')) + MONTH(CURRENT_DATE) - MONTH(Trunc(CURRENT_DATE, 'Q'))) IN (4, 6, 9, 11)\n\t"+
                        "THEN '30'\n\t"+
                        "ELSE (TRIM(EXTRACT(DAY FROM CURRENT_DATE)(format '99')))\n\t"+
                        "END\n AS DATE)";
            }else if(vendorName.equals("amazonathena")){
                where += " cast(" + field + " as date) " 
                + operator + " BETWEEN DATE_TRUNC('quarter', " + field + ") "
                + "AND cast( concat( cast(extract(year from " + field + ") as varchar), '-', "
                + "lpad(cast((cast(date_format(date_trunc('quarter', " + field + "), '%m') as integer) + date_diff('month', date_trunc('quarter', current_date), current_date)) as varchar), 2, '0'), '-', "
                + "CASE WHEN (cast(date_format(current_date, '%d') as integer) in (29,30,31) and (cast(date_format(date_trunc('quarter', " + field + "), '%m') as integer) + date_diff('month', date_trunc('quarter', current_date), current_date)) = 2) THEN "
                + "(CASE WHEN (mod(cast(date_format(" + field + ", '%Y') as integer), 4) = 0 and (mod(cast(date_format(" + field + ", '%Y') as integer), 100) != 0 or mod(cast(date_format(" + field + ", '%Y') as integer), 400) = 0)) THEN '29' ELSE '28' END) "
                + "WHEN (cast(date_format(current_date, '%d') as integer) = 31 and (cast(date_format(date_trunc('quarter', " + field + "), '%m') as integer) + date_diff('month', date_trunc('quarter', current_date), current_date)) in (4,6,9,11)) THEN '30' "
                + "ELSE lpad(date_format(current_date, '%d'), 2, '0') END ) as date)";




            }

            else {
                throw new BadRequestException("Error: DB vendor Name is wrong!");
            }
        }

        return where;
    } 
}
