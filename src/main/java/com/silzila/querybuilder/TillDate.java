package com.silzila.querybuilder;

import java.util.List;


import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Filter;

public class TillDate {
    
    public static String tillDate(String vendorName, Filter filter) throws BadRequestException{
        String where = " AND \n\t\t";

        if(List.of("MONTH","DAYOFMONTH","YEARMONTH").contains(filter.getTimeGrain().name())){
            if (vendorName.equals("mysql")) {
                where += "DAY(" + filter.getTableId() + "." + filter.getFieldName() + ") <= DAY(CURRENT_DATE())";
            } else if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
                where += "EXTRACT(DAY FROM " + filter.getTableId() + "." + filter.getFieldName() + ")::INTEGER <= EXTRACT(DAY FROM CURRENT_DATE)";
            } else if (vendorName.equals("sqlserver")) {
                where += "DAY(" + filter.getTableId() + "." + filter.getFieldName() + ") <= DAY(GETDATE())";
            } else if (vendorName.equals("bigquery")) {
                where += "EXTRACT(DAY FROM " + filter.getTableId() + "." + filter.getFieldName() + ") <= EXTRACT(DAY FROM CURRENT_DATE())";
            } else if (vendorName.equals("databricks")) {
                where += "DAYOFMONTH(" + filter.getTableId() + "." + filter.getFieldName() + ") <= DAY(CURRENT_DATE())";
            } else if (vendorName.equals("oracle")) {
                where += "TO_NUMBER(TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'DD')) <= TO_NUMBER(TO_CHAR(CURRENT_DATE, 'DD'))";
            } else if (vendorName.equals("snowflake")) {
                where += "DAYOFMONTH(" + filter.getTableId() + "." + filter.getFieldName() + ") <= DAYOFMONTH(CURRENT_DATE())";
            } else if (vendorName.equals("duckdb")) {
                where += "EXTRACT(day FROM " + filter.getTableId() + "." + filter.getFieldName() + ") <= EXTRACT(day FROM CURRENT_DATE())";
            } 
            else {
                throw new BadRequestException("Error: DB vendor Name is wrong!");
            }
        }
        else if(filter.getTimeGrain().name().equals("YEAR")){

            if (vendorName.equals("mysql")) {
                where += "DATE(" + filter.getTableId() + "." + filter.getFieldName() + ") BETWEEN CONCAT(YEAR(" + filter.getTableId() + "." + filter.getFieldName() + "), '-01-01') AND \n\t\tCONCAT(YEAR(" + filter.getTableId() + "." + filter.getFieldName() + "), '-', LPAD(MONTH(CURRENT_DATE()), 2, '0'), \n\t\t'-', LPAD(DAY(CURRENT_DATE()), 2, '0'))";
            } else if (vendorName.equals("postgresql") || vendorName.equals("redshift")|| vendorName.equals("db2")) {
                where += filter.getTableId() + "." + filter.getFieldName() + " :: date  BETWEEN (DATE_TRUNC('year'," + filter.getTableId() + "." + filter.getFieldName() + ")::date) AND \n\t\t(( extract(YEAR from " + filter.getTableId() + "." + filter.getFieldName() + ") || '-' || EXTRACT(MONTH FROM CURRENT_DATE) \n\t\t|| '-' || EXTRACT(DAY FROM CURRENT_DATE))::date)";
            } else if (vendorName.equals("sqlserver")) {
                where +="CONVERT(date," + filter.getTableId() + "." + filter.getFieldName() + ") BETWEEN CONVERT(DATE,DATETRUNC(year," + filter.getTableId() + "." + filter.getFieldName() + ")) AND \n\t\tCONCAT(year(convert(date," + filter.getTableId() + "." + filter.getFieldName() + ")) , '-', FORMAT(GETDATE(), 'MM') , \n\t\t'-', FORMAT(GETDATE(), 'dd'))";
            } else if (vendorName.equals("bigquery")) {
                where += "DATE(" + filter.getTableId() + "." + filter.getFieldName() + ") BETWEEN DATE_TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ", YEAR) AND \n\t\tDATE(CONCAT(EXTRACT(YEAR FROM " + filter.getTableId() + "." + filter.getFieldName() + "), '-', EXTRACT(MONTH FROM CURRENT_DATE()), \n\t\t'-', EXTRACT(DAY FROM CURRENT_DATE())))";
            } else if (vendorName.equals("databricks")) {
                where += "TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ", 'YEAR') BETWEEN TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ") AND \n\t\tTO_DATE(CONCAT(EXTRACT(YEAR FROM " + filter.getTableId() + "." + filter.getFieldName() + "), '-', EXTRACT(MONTH FROM CURRENT_DATE()), \n\t\t'-', EXTRACT(DAY FROM CURRENT_DATE())), 'YYYY-MM-DD')";
            } else if (vendorName.equals("oracle")) {
                where += "TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ") BETWEEN TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ",'YEAR') AND \n\t\tTO_DATE(TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'YYYY') || '-' || TO_CHAR(SYSDATE, 'MM-DD'), 'YYYY-MM-DD')";
            } else if (vendorName.equals("snowflake")) {
                where += "DATE(" + filter.getTableId() + "." + filter.getFieldName() + ") BETWEEN DATE_TRUNC('YEAR'," + filter.getTableId() + "." + filter.getFieldName() + ") AND \n\t\t(TO_VARCHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'YYYY') || '-' || TO_VARCHAR(CURRENT_DATE(), 'MM-DD'))::DATE";
            } else if (vendorName.equals("duckdb")) {
                where += "CAST(" + filter.getTableId() + "." + filter.getFieldName() + " AS DATE) BETWEEN DATE_TRUNC('year', " + filter.getTableId() + "." + filter.getFieldName() + ") AND \n\t\tCAST(EXTRACT('year' FROM " + filter.getTableId() + "." + filter.getFieldName() + ") || '-' || extract('month' from current_date())||'-'||extract('day' from current_date()) AS DATE)"; 
            } else {
                throw new BadRequestException("Error: DB vendor Name is wrong!");
            }
            
        }
        else if(filter.getTimeGrain().name().equals("DAYOFWEEK")){
            if (vendorName.equals("mysql")) {
                where += "DAYOFWEEK(" + filter.getTableId() + "." + filter.getFieldName() + ") <= DAYOFWEEK(CURRENT_DATE())";
            } else if (vendorName.equals("postgresql") || vendorName.equals("redshift") || vendorName.equals("db2")) {
                where += "EXTRACT(DOW FROM " + filter.getTableId() + "." + filter.getFieldName() + ") <= EXTRACT(DOW FROM CURRENT_DATE)";
            } else if (vendorName.equals("sqlserver")) {
                where += "DATEPART(WEEKDAY, " + filter.getTableId() + "." + filter.getFieldName() + ") <= DATEPART(WEEKDAY, GETDATE())";
            } else if (vendorName.equals("bigquery")) {
                where += "EXTRACT(DAYOFWEEK FROM " + filter.getTableId() + "." + filter.getFieldName() + ") <= EXTRACT(DAYOFWEEK FROM CURRENT_DATE())";
            } else if (vendorName.equals("databricks")) {
                where += "DAYOFWEEK(" + filter.getTableId() + "." + filter.getFieldName() + ") <= DAYOFWEEK(CURRENT_DATE())";
            } else if (vendorName.equals("oracle")) {
                where += "TO_NUMBER(TO_CHAR(" + filter.getTableId() + "." + filter.getFieldName() + ", 'D')) <= TO_NUMBER(TO_CHAR(CURRENT_DATE, 'D'))";
            } else if (vendorName.equals("snowflake")) {
                where += "DAYOFWEEK(" + filter.getTableId() + "." + filter.getFieldName() + ") <= DAYOFWEEK(CURRENT_DATE())";
            }else if (vendorName.equals("duckdb")) {
                where += "DAYOFWEEK(" + filter.getTableId() + "." + filter.getFieldName() + ") <= DAYOFWEEK(CURRENT_DATE())";
            } else {
                throw new BadRequestException("Error: DB vendor Name is wrong!");
            }
        }

        else if(List.of("QUARTER","YEARQUARTER").contains(filter.getTimeGrain().name())){
            if(vendorName.equals("mysql")){
                where+="DATE(" + filter.getTableId() + "." + filter.getFieldName() + ") BETWEEN CONCAT(YEAR(" + filter.getTableId() + "." + filter.getFieldName() +
                 "), '-', LPAD(1 + (QUARTER(" + filter.getTableId() + "." + filter.getFieldName() + ") - 1) * 3, 2, '0'), '-01')AND \n\t\tCONCAT(YEAR("
                + filter.getTableId() + "." + filter.getFieldName() + "), '-'\n\t\t,LPAD(1 + (((QUARTER(" + filter.getTableId() + "." + filter.getFieldName() + 
                ")) - 1) * 3 + \n\t\t(TIMESTAMPDIFF(MONTH, CONCAT(YEAR(current_date()), '-',LPAD(1 + (QUARTER(current_date()) - 1) * 3, 2, '0'), '-01'), \n\t\tcurrent_date()))), 2, '0'), '-'\n\t\t,LPAD(case WHEN (DAY(current_date()) in (30,31) AND LPAD(1 + (((QUARTER("
                + filter.getTableId() + "." + filter.getFieldName() + 
                ")) - 1) * 3 + \n\t\t(TIMESTAMPDIFF(MONTH, CONCAT(YEAR(current_date()), '-'\n\t\t, LPAD(1 + (QUARTER(current_date()) - 1) * 3, 2, '0'), '-01'), current_date()))), 2, '0') = \"02\") \n\t\tTHEN IF(YEAR(current_date()) % 4 = 0 AND \n\t\t(YEAR(current_date()) % 100 != 0 OR \n\t\tYEAR(current_date()) % 400 = 0), 29, 28) WHEN (DAY(current_date()) = 31 AND \n\t\tLPAD(1 + (((QUARTER("
                + filter.getTableId() + "." + filter.getFieldName() + 
                ")) - 1) * 3 + (TIMESTAMPDIFF(MONTH, CONCAT(YEAR(current_date()), '-',\n\t\t LPAD(1 + (QUARTER(current_date()) - 1) * 3, 2, '0'), '-01'), current_date()))), 2, '0') IN (\"04\", \"06\", \"09\", \"11\"))\n\t\t THEN 30 ELSE DAY(current_date()) END, 2, '0'))";
            } else if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
                where += " "+filter.getTableId() + "." + filter.getFieldName() + "::date BETWEEN DATE_TRUNC('quarter', " + filter.getTableId() + "." + filter.getFieldName() + ")::date AND \n\t\t" +
                "to_date( " +
                "extract(year from " + filter.getTableId() + "." + filter.getFieldName() + ") || '-'|| \n\t\t((date_part('month', DATE_TRUNC('quarter', " + filter.getTableId() + "." + filter.getFieldName() + "))::int) + \n\t\t" +
                "(extract(month from age(CURRENT_DATE::date, DATE_TRUNC('quarter', CURRENT_DATE)::date)))::int) || '-' || \n\t\t" +
                "CASE " +
                "WHEN (EXTRACT(DAY FROM CURRENT_DATE) IN (30, 31) AND ((date_part('month', DATE_TRUNC('quarter', " + filter.getTableId() + "." + filter.getFieldName() + "))::int) + \n\t\t" +
                "(extract(month from age(CURRENT_DATE::date, DATE_TRUNC('quarter', CURRENT_DATE)::date)))::int) = 2) " +
                "THEN " +
                "CASE \n\t\t" +
                "WHEN EXTRACT(YEAR FROM CURRENT_DATE) % 4 = 0 AND (EXTRACT(YEAR FROM CURRENT_DATE) % 100 != 0 OR \n\t\tEXTRACT(YEAR FROM CURRENT_DATE) % 400 = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN (EXTRACT(DAY FROM CURRENT_DATE) = 31 AND ((date_part('month', DATE_TRUNC('quarter', " + filter.getTableId() + "." + filter.getFieldName() + "))::int) + \n\t\t" +
                "(extract(month from age(CURRENT_DATE::date, DATE_TRUNC('quarter', CURRENT_DATE)::date)))::int) IN (4,6,9,11)) \n\t\t" +
                "THEN '30' ELSE TO_CHAR(EXTRACT(DAY FROM CURRENT_DATE), 'FM00') " +
                "END,  'YYYY-MM-DD' )";
            } else if (vendorName.equals("sqlserver")) {
                where += "CONVERT (DATE, " + filter.getTableId() + "." + filter.getFieldName() + ") BETWEEN DATETRUNC(quarter, " + filter.getTableId() + "." + filter.getFieldName() + ") " +
                "AND \n\t\t" +
                "CAST(" +
                "CONCAT(" +
                "YEAR(" + filter.getTableId() + "." + filter.getFieldName() + "), '-', " +
                "((MONTH(DATETRUNC(quarter, " + filter.getTableId() + "." + filter.getFieldName() + "))) + \n\t\t" +
                "(DATEDIFF(month, DATETRUNC(quarter, GETDATE()), GETDATE()))),'-', \n\t\t" +
                "CASE " +
                "WHEN DAY(GETDATE()) IN (30, 31) AND ((MONTH(DATETRUNC(quarter, " + filter.getTableId() + "." + filter.getFieldName() + "))) + \n\t\t" +
                "(DATEDIFF(month, DATETRUNC(quarter, GETDATE()), GETDATE())) = 2) " +
                "THEN " +
                "CASE \n\t\t" +
                "WHEN YEAR(GETDATE()) % 4 = 0 AND (YEAR(GETDATE()) % 100 != 0 OR YEAR(GETDATE()) % 400 = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN DAY(GETDATE()) = 31 AND ((MONTH(DATETRUNC(quarter, " + filter.getTableId() + "." + filter.getFieldName() + "))) + \n\t\t" +
                "(DATEDIFF(month, DATETRUNC(quarter, GETDATE()), GETDATE())) IN (4,6,9,11)) " +
                "THEN '30' \n\t\t" +
                "ELSE CAST(DAY(GETDATE()) AS VARCHAR) " +
                "END) AS DATE)";
            } else if (vendorName.equals("bigquery")) {
                where += "DATE(" + filter.getTableId() + "." + filter.getFieldName() + ") BETWEEN DATE_TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ", QUARTER) AND \n\t\t" +
                "CAST(" +
                "CONCAT(" +
                "EXTRACT(YEAR FROM " + filter.getTableId() + "." + filter.getFieldName() + ")," +
                "'-', \n\t\t" +
                "CAST(" +
                "EXTRACT(MONTH FROM DATE_TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ", QUARTER))\n\t\t" +
                "+ DATE_DIFF(CURRENT_DATE(), DATE_TRUNC(CURRENT_DATE(), QUARTER), MONTH)" +
                "AS STRING)" +
                ",'-', \n\t\t" +
                "CASE " +
                "WHEN EXTRACT(DAY FROM CURRENT_DATE()) IN (30, 31) AND (EXTRACT(MONTH FROM DATE_TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ", QUARTER)) + \n\t\tDATE_DIFF(CURRENT_DATE(), DATE_TRUNC(CURRENT_DATE(), QUARTER), MONTH)) = 2 THEN " +
                "CASE \n\t\t" +
                "WHEN MOD(EXTRACT(YEAR FROM CURRENT_DATE()), 4) = 0 AND (MOD(EXTRACT(YEAR FROM CURRENT_DATE()), 100) != 0 OR \n\t\tMOD(EXTRACT(YEAR FROM CURRENT_DATE()), 400) = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN EXTRACT(DAY FROM CURRENT_DATE()) = 31 AND (EXTRACT(MONTH FROM DATE_TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ", QUARTER)) + \n\t\tDATE_DIFF(CURRENT_DATE(), DATE_TRUNC(CURRENT_DATE(), QUARTER), MONTH)) IN (4, 6, 9, 11) THEN '30'\n\t\t " +
                "ELSE CAST(EXTRACT(DAY FROM CURRENT_DATE()) AS STRING) \n\t\t" +
                "END) AS DATE)";
            } else if (vendorName.equals("databricks")) {
                where += "DATE(" + filter.getTableId() + "." + filter.getFieldName() + ") BETWEEN DATE_TRUNC('QUARTER', " + filter.getTableId() + "." + filter.getFieldName() + ") AND \n\t\t" +
                "TO_DATE(CAST(EXTRACT(YEAR FROM " + filter.getTableId() + "." + filter.getFieldName() + ") AS STRING) || '-' || \n\t\t" +
                "LPAD(CAST(EXTRACT(MONTH FROM DATE_TRUNC('QUARTER', " + filter.getTableId() + "." + filter.getFieldName() + ")) + \n\t\t" +
                "MONTHS_BETWEEN(CURRENT_DATE(), DATE_TRUNC(CURRENT_DATE(), 'QUARTER')) AS STRING), 2, '0') || '-' || \n\t\t" +
                "CASE " +
                "WHEN DAY(CURRENT_DATE()) IN (30, 31) AND EXTRACT(MONTH FROM " + filter.getTableId() + "." + filter.getFieldName() + ") + \n\t\t" +
                "MONTHS_BETWEEN(CURRENT_DATE(), DATE_TRUNC(CURRENT_DATE(), 'QUARTER')) = 2 THEN " +
                "CASE \n\t\t" +
                "WHEN YEAR(CURRENT_DATE()) % 4 = 0 AND (YEAR(CURRENT_DATE()) % 100 != 0 OR \n\t\tYEAR(CURRENT_DATE()) % 400 = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN DAY(CURRENT_DATE()) = 31 AND EXTRACT(MONTH FROM " + filter.getTableId() + "." + filter.getFieldName() + ") + \n\t\t" +
                "MONTHS_BETWEEN(CURRENT_DATE(), DATE_TRUNC(CURRENT_DATE(), 'QUARTER')) IN (4, 6, 9, 11) THEN '30' " +
                "ELSE LPAD(CAST(DAY(CURRENT_DATE()) AS STRING), 2, '0') \n\t\t" +
                "END)"; 
            } else if (vendorName.equals("oracle")) {
                where += "TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ") BETWEEN TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ", 'Q') AND \n\t\t" +
                "TO_DATE(" +
                "TO_CHAR(EXTRACT(YEAR FROM " + filter.getTableId() + "." + filter.getFieldName() + ")) || '-' || \n\t\t" +
                "LPAD(TO_NUMBER(EXTRACT(MONTH FROM TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ", 'Q'))) + \n\t\tTO_NUMBER(TO_CHAR(" +
                "(MONTHS_BETWEEN(SYSDATE, TRUNC(SYSDATE, 'Q'))-1), " +
                "'FM00'" +
                ")), 2, '0') || '-' || \n\t\t" +
                "CASE " +
                "WHEN TO_NUMBER(TO_CHAR(SYSDATE , 'DD')) IN (30, 31) AND LPAD(TO_NUMBER(EXTRACT(MONTH FROM TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ", 'Q'))) + \n\t\tTO_NUMBER(TO_CHAR(" +
                "(MONTHS_BETWEEN(SYSDATE, TRUNC(SYSDATE, 'Q'))), " +
                "'FM00'" +
                ")), 2, '0') = '02' " +
                "THEN " +
                "CASE \n\t\t" +
                "WHEN MOD(TO_NUMBER(TO_CHAR(SYSDATE, 'YYYY')), 4) = 0 AND (MOD(TO_NUMBER(TO_CHAR(SYSDATE, 'YYYY')), 100) != 0 OR \n\t\tMOD(TO_NUMBER(TO_CHAR(SYSDATE, 'YYYY')), 400) = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN TO_NUMBER(TO_CHAR(SYSDATE, 'DD')) = 31 AND LPAD(TO_NUMBER(EXTRACT(MONTH FROM TRUNC(" + filter.getTableId() + "." + filter.getFieldName() + ", 'Q'))) + \n\t\tTO_NUMBER(TO_CHAR(" +
                "(MONTHS_BETWEEN(SYSDATE, TRUNC(SYSDATE, 'Q'))), \n\t\t" +
                "'FM00'" +
                ")), 2, '0')IN ('04', '06', '09','11') \n\t\t" +
                "THEN '30' " +
                "ELSE TO_CHAR(SYSDATE, 'DD') END , 'YYYY-MM-DD')";            
            } else if (vendorName.equals("snowflake")) {
                where += "DATE(" + filter.getTableId() + "." + filter.getFieldName() + ") BETWEEN DATE_TRUNC('QUARTER', " + filter.getTableId() + "." + filter.getFieldName() + ") AND \n\t\t" +
                "TO_DATE(EXTRACT(YEAR FROM " + filter.getTableId() + "." + filter.getFieldName() + ")::STRING || '-' || \n\t\t" +
                "LPAD(CAST(EXTRACT(MONTH FROM DATE_TRUNC('QUARTER', " + filter.getTableId() + "." + filter.getFieldName() + ")) + \n\t\t" +
                "DATEDIFF(MONTH, DATE_TRUNC('QUARTER', CURRENT_DATE()), CURRENT_DATE()) AS STRING), 2, '0') || '-' || \n\t\t" +
                "CASE " +
                "WHEN DAY(CURRENT_DATE()) IN (30, 31) AND EXTRACT(MONTH FROM " + filter.getTableId() + "." + filter.getFieldName() + ") + \n\t\t" +
                "DATEDIFF(MONTH, DATE_TRUNC('QUARTER', CURRENT_DATE()), CURRENT_DATE()) = 2 THEN \n\t\t" +
                "CASE " +
                "WHEN YEAR(CURRENT_DATE()) % 4 = 0 AND (YEAR(CURRENT_DATE()) % 100 != 0 OR \n\t\tYEAR(CURRENT_DATE()) % 400 = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN DAY(CURRENT_DATE()) = 31 AND EXTRACT(MONTH FROM " + filter.getTableId() + "." + filter.getFieldName() + ") + \n\t\t" +
                "DATEDIFF(MONTH, DATE_TRUNC('QUARTER', CURRENT_DATE()), CURRENT_DATE()) IN (4, 6, 9, 11) THEN '30' \n\t\t" +
                "ELSE LPAD(CAST(DAY(CURRENT_DATE()) AS STRING), 2, '0') " +
                "END, 'YYYY-MM-DD')";
            }
            else if (vendorName.equals("duckdb")) {
                where +="CAST(" + filter.getTableId() + "." + filter.getFieldName() + " AS DATE) BETWEEN DATE_TRUNC('QUARTER', " + filter.getTableId() + "." + filter.getFieldName() + ") AND \n\t\t" +
                "CAST(CAST(EXTRACT('year' FROM " + filter.getTableId() + "." + filter.getFieldName() + ") AS VARCHAR)|| '-' || \n\t\t" +
                "CAST(EXTRACT('MONTH' FROM DATE_TRUNC('QUARTER', " + filter.getTableId() + "." + filter.getFieldName() + ")) + \n\t\t" +
                "DATEDIFF('MONTH', DATE_TRUNC('QUARTER', CURRENT_DATE()), CURRENT_DATE()) AS VARCHAR) || '-' || \n\t\t" +
                "CASE " +
                "WHEN DAY(CURRENT_DATE()) IN (30, 31) AND EXTRACT('MONTH' FROM " + filter.getTableId() + "." + filter.getFieldName() + ") + \n\t\t" +
                "DATEDIFF('MONTH', DATE_TRUNC('QUARTER', CURRENT_DATE()), CURRENT_DATE()) = 2 THEN \n\t\t" +
                "CASE " +
                "WHEN YEAR(CURRENT_DATE()) % 4 = 0 AND (YEAR(CURRENT_DATE()) % 100 != 0 OR \n\t\tYEAR(CURRENT_DATE()) % 400 = 0) THEN '29' " +
                "ELSE '28' " +
                "END \n\t\t" +
                "WHEN DAY(CURRENT_DATE()) = 31 AND EXTRACT('MONTH' FROM " + filter.getTableId() + "." + filter.getFieldName() + ") + \n\t\t" +
                "DATEDIFF('MONTH', DATE_TRUNC('QUARTER', CURRENT_DATE()), CURRENT_DATE()) IN (4, 6, 9, 11) THEN '30' \n\t\t" +
                "ELSE CAST(DAY(CURRENT_DATE()) AS VARCHAR)" +
                "END AS DATE) ";
            }
             else {
                throw new BadRequestException("Error: DB vendor Name is wrong!");
            }
        }

        return where;
        
    } 
}
