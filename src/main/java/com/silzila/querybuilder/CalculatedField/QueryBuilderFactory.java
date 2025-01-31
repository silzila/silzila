package com.silzila.querybuilder.CalculatedField;


public class QueryBuilderFactory {

    public static QueryBuilder getQueryBuilder(String vendor){
        switch(vendor){
            case "postgresql":
            System.out.println("queryBuilder mai agya ");
                return new PostgresSQLQueryBuilder();
            case "mysql":
                return new MysqlQueryBuilder();
            case "oracle":
                return new OracleQueryBuilder();
            case "snowflake":
                return new SnowflakeQueryBuilder();
            case "db2":
                return new DB2QueryBuilder();
            case "sqlserver":
                return new SqlServerQueryBuilder();
            case "bigquery":
                return new BigQueryBuilder();
            case "databricks":
                return new DatabricksQueryBuilder();
            case "motherduck":
                return new MotherduckQueryBuilder();
            case "teradata":
                return new TeradataQueryBuilder();
            case "redshift":
                return new PostgresSQLQueryBuilder();
            case "duckdb":
                return new DuckDbQueryBuilder();
        }

        return null ;
    }
}

