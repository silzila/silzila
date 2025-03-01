package com.silzila.querybuilder;

public class WhereClauseDateFactory {
    
    public static WhereClauseDate buildDateExpression(String vendorName){
        switch(vendorName){
            case "postgresql":
            case "redshift":
                return new WhereClauseDatePostgres();
            case "mysql":
                return new WhereClauseDateMysql();
            case "oracle":
                return new WhereClauseDateOracle();
            case "snowflake":
                return new WhereClauseDateSnowflake();
            case "db2":
                return new WhereClauseDateDB2();
            case "sqlserver":
                return new WhereClauseDateSqlserver();
            case "bigquery":
                return new WhereClauseDateBigquery();
            case "databricks":
                return new WhereClauseDateDatabricks();
            case "motherduck":
            case "duckdb":
                return new WhereClauseDateMotherduck();
            case "teradata":
                return new WhereClauseDateTeraData();
        }

        return null ;
    }
}
