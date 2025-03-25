package com.silzila.helper;


import java.util.HashMap;
import java.util.Map;

import com.silzila.exception.BadRequestException;



public class TypeCastingUtil {

    private static final Map<String, String> BIGINT_CAST_MAP = new HashMap<>();
    private static final Map<String, String> INT_CAST_MAP = new HashMap<>();
    private static final Map<String, String> VARCHAR_CAST_MAP = new HashMap<>();
    private static final Map<String, String> CHAR_CAST_MAP = new HashMap<>();
    private static final Map<String, String> TEXT_CAST_MAP = new HashMap<>();
    private static final Map<String, String> FLOAT_CAST_MAP = new HashMap<>();
    private static final Map<String, String> DOUBLE_CAST_MAP = new HashMap<>();
    private static final Map<String, String> DECIMAL_CAST_MAP = new HashMap<>();
    private static final Map<String, String> DATE_CAST_MAP = new HashMap<>();
    private static final Map<String, String> TIMESTAMP_CAST_MAP = new HashMap<>();
    private static final Map<String, String> BOOLEAN_CAST_MAP = new HashMap<>();

    static {
        // BIGINT
        BIGINT_CAST_MAP.put("mysql", "CAST((%s) AS SIGNED )");
        BIGINT_CAST_MAP.put("sqlserver", "CAST((%s) AS BIGINT)");
        BIGINT_CAST_MAP.put("postgresql", "CAST((%s) AS BIGINT)");
        BIGINT_CAST_MAP.put("oracle", "CAST((%s) AS NUMBER(19,0))");
        BIGINT_CAST_MAP.put("snowflake", "CAST((%s) AS BIGINT)");
        BIGINT_CAST_MAP.put("db2", "CAST((%s) AS BIGINT)");
        BIGINT_CAST_MAP.put("motherduck", "CAST((%s) AS BIGINT)");
        BIGINT_CAST_MAP.put("duckdb", "CAST((%s) AS BIGINT)");
        BIGINT_CAST_MAP.put("bigquery", "CAST((%s) AS INT64)");
        BIGINT_CAST_MAP.put("teradata", "CAST((%s) AS BIGINT)");
        BIGINT_CAST_MAP.put("databricks", "CAST((%s) AS BIGINT)");
        BIGINT_CAST_MAP.put("amazonathena", "CAST((%s) AS BIGINT)");

        // INT
        INT_CAST_MAP.put("mysql", "CAST((%s) AS SIGNED INT)");
        INT_CAST_MAP.put("sqlserver", "CAST((%s) AS INT)");
        INT_CAST_MAP.put("postgresql", "CAST((%s) AS INTEGER)");
        INT_CAST_MAP.put("oracle", "CAST((%s) AS NUMBER(10,0))");
        INT_CAST_MAP.put("snowflake", "CAST((%s) AS INT)");
        INT_CAST_MAP.put("db2", "CAST((%s) AS INTEGER)");
        INT_CAST_MAP.put("motherduck", "CAST((%s) AS INTEGER)");
        INT_CAST_MAP.put("duckdb", "CAST((%s) AS INTEGER)");
        INT_CAST_MAP.put("bigquery", "CAST((%s) AS INT64)");
        INT_CAST_MAP.put("teradata", "CAST((%s) AS INTEGER)");
        INT_CAST_MAP.put("databricks", "CAST((%s) AS INTEGER)");
        INT_CAST_MAP.put("amazonathena", "CAST((%s) AS INTEGER)");

        // VARCHAR
        VARCHAR_CAST_MAP.put("mysql", "CAST((%s) AS  VARCHAR(255))");
        VARCHAR_CAST_MAP.put("sqlserver", "CAST((%s) AS VARCHAR(255))");
        VARCHAR_CAST_MAP.put("postgresql", "CAST((%s) AS VARCHAR)");
        VARCHAR_CAST_MAP.put("oracle", "CAST((%s) AS VARCHAR2(255))");
        VARCHAR_CAST_MAP.put("snowflake", "CAST((%s) AS VARCHAR)");
        VARCHAR_CAST_MAP.put("db2", "CAST((%s) AS VARCHAR(255))");
        VARCHAR_CAST_MAP.put("motherduck", "CAST((%s) AS VARCHAR)");
        VARCHAR_CAST_MAP.put("duckdb", "CAST((%s) AS VARCHAR)");
        VARCHAR_CAST_MAP.put("bigquery", "CAST((%s) AS STRING)");
        VARCHAR_CAST_MAP.put("teradata", "CAST((%s) AS VARCHAR(255))");
        VARCHAR_CAST_MAP.put("databricks", "CAST((%s) AS STRING)");
        VARCHAR_CAST_MAP.put("amazonathena", "CAST((%s) AS  VARCHAR(255))");

        // CHAR
        CHAR_CAST_MAP.put("mysql", "CAST((%s) AS CHAR)");
        CHAR_CAST_MAP.put("sqlserver", "CAST((%s) AS CHAR(1))");
        CHAR_CAST_MAP.put("postgresql", "CAST((%s) AS CHAR)");
        CHAR_CAST_MAP.put("oracle", "CAST((%s) AS CHAR)");
        CHAR_CAST_MAP.put("snowflake", "CAST((%s) AS CHAR)");
        CHAR_CAST_MAP.put("db2", "CAST((%s) AS CHAR(1))");
        CHAR_CAST_MAP.put("motherduck", "CAST((%s) AS CHAR)");
        CHAR_CAST_MAP.put("duckdb", "CAST((%s) AS CHAR)");
        CHAR_CAST_MAP.put("bigquery", "CAST((%s) AS STRING)");
        CHAR_CAST_MAP.put("teradata", "CAST((%s) AS CHAR(1))");
        CHAR_CAST_MAP.put("databricks", "CAST((%s) AS STRING)");
        CHAR_CAST_MAP.put("amazonathena", "CAST((%s) AS CHAR(1))");

        // TEXT
        TEXT_CAST_MAP.put("mysql", "CAST((%s) AS TEXT)");
        TEXT_CAST_MAP.put("sqlserver", "CAST((%s) AS VARCHAR(MAX))");
        TEXT_CAST_MAP.put("postgresql", "CAST((%s) AS TEXT)");
        TEXT_CAST_MAP.put("oracle", "CAST((%s) AS NCLOB)");
        TEXT_CAST_MAP.put("snowflake", "CAST((%s) AS TEXT)");
        TEXT_CAST_MAP.put("db2", "CAST((%s) AS CLOB)");
        TEXT_CAST_MAP.put("motherduck", "CAST((%s) AS TEXT)");
        TEXT_CAST_MAP.put("duckdb", "CAST((%s) AS TEXT)");
        TEXT_CAST_MAP.put("bigquery", "CAST((%s) AS STRING)");
        TEXT_CAST_MAP.put("teradata", "CAST((%s) AS CLOB)");
        TEXT_CAST_MAP.put("databricks", "CAST((%s) AS STRING)");
        TEXT_CAST_MAP.put("amazonathena", "CAST((%s) AS STRING)");

        // FLOAT
        FLOAT_CAST_MAP.put("mysql", "CAST((%s) AS FLOAT)");
        FLOAT_CAST_MAP.put("sqlserver", "CAST((%s) AS FLOAT(24))");
        FLOAT_CAST_MAP.put("postgresql", "CAST((%s) AS REAL)");
        FLOAT_CAST_MAP.put("oracle", "CAST((%s) AS BINARY_FLOAT)");
        FLOAT_CAST_MAP.put("snowflake", "CAST((%s) AS FLOAT)");
        FLOAT_CAST_MAP.put("db2", "CAST((%s) AS FLOAT)");
        FLOAT_CAST_MAP.put("motherduck", "CAST((%s) AS FLOAT)");
        FLOAT_CAST_MAP.put("duckdb", "CAST((%s) AS FLOAT)");
        FLOAT_CAST_MAP.put("bigquery", "CAST((%s) AS FLOAT64)");
        FLOAT_CAST_MAP.put("teradata", "CAST((%s) AS FLOAT)");
        FLOAT_CAST_MAP.put("databricks", "CAST((%s) AS FLOAT)");
        FLOAT_CAST_MAP.put("amazonathena", "CAST((%s) AS FLOAT)");

        // DOUBLE
        DOUBLE_CAST_MAP.put("mysql", "CAST((%s) AS DOUBLE)");
        DOUBLE_CAST_MAP.put("sqlserver", "CAST((%s) AS FLOAT(53))");
        DOUBLE_CAST_MAP.put("postgresql", "CAST((%s) AS DOUBLE PRECISION)");
        DOUBLE_CAST_MAP.put("oracle", "CAST((%s) AS BINARY_DOUBLE)");
        DOUBLE_CAST_MAP.put("snowflake", "CAST((%s) AS DOUBLE)");
        DOUBLE_CAST_MAP.put("db2", "CAST((%s) AS DOUBLE)");
        DOUBLE_CAST_MAP.put("motherduck", "CAST((%s) AS DOUBLE)");
        DOUBLE_CAST_MAP.put("duckdb", "CAST((%s) AS DOUBLE)");
        DOUBLE_CAST_MAP.put("bigquery", "CAST((%s) AS FLOAT64)");
        DOUBLE_CAST_MAP.put("teradata", "CAST((%s) AS DOUBLE PRECISION)");
        DOUBLE_CAST_MAP.put("databricks", "CAST((%s) AS DOUBLE)");
        DOUBLE_CAST_MAP.put("amazonathena", "CAST((%s) AS DOUBLE)");

        // DECIMAL
        DECIMAL_CAST_MAP.put("mysql", "CAST((%s) AS DECIMAL(10,2))");
        DECIMAL_CAST_MAP.put("sqlserver", "CAST((%s) AS DECIMAL(10,2))");
        DECIMAL_CAST_MAP.put("postgresql", "CAST((%s) AS NUMERIC(10,2))");
        DECIMAL_CAST_MAP.put("oracle", "CAST((%s) AS NUMBER(10,2))");
        DECIMAL_CAST_MAP.put("snowflake", "CAST((%s) AS DECIMAL(10,2))");
        DECIMAL_CAST_MAP.put("db2", "CAST((%s) AS DECIMAL(10,2))");
        DECIMAL_CAST_MAP.put("motherduck", "CAST((%s) AS DECIMAL(10,2))");
        DECIMAL_CAST_MAP.put("duckdb", "CAST((%s) AS DECIMAL(10,2))");
        DECIMAL_CAST_MAP.put("bigquery", "CAST((%s) AS NUMERIC)");
        DECIMAL_CAST_MAP.put("teradata", "CAST((%s) AS DECIMAL(10,2))");
        DECIMAL_CAST_MAP.put("databricks", "CAST((%s) AS DECIMAL(10,2))");
        DECIMAL_CAST_MAP.put("amazonathena", "CAST((%s) AS DECIMAL(10,2))");

        // DATE
        DATE_CAST_MAP.put("mysql", "CAST((%s) AS DATE)");
        DATE_CAST_MAP.put("sqlserver", "CAST((%s) AS DATE)");
        DATE_CAST_MAP.put("postgresql", "CAST((%s) AS DATE)");
        DATE_CAST_MAP.put("oracle", "CAST((%s) AS DATE)");
        DATE_CAST_MAP.put("snowflake", "CAST((%s) AS DATE)");
        DATE_CAST_MAP.put("db2", "CAST((%s) AS DATE)");
        DATE_CAST_MAP.put("motherduck", "CAST((%s) AS DATE)");
        DATE_CAST_MAP.put("duckdb", "CAST((%s) AS DATE)");
        DATE_CAST_MAP.put("bigquery", "CAST((%s) AS DATE)");
        DATE_CAST_MAP.put("teradata", "CAST((%s) AS DATE)");
        DATE_CAST_MAP.put("databricks", "CAST((%s) AS DATE)");
        DATE_CAST_MAP.put("amazonathena", "CAST((%s) AS DATE)");

        // TIMESTAMP
        TIMESTAMP_CAST_MAP.put("mysql", "CAST((%s) AS TIMESTAMP)");
        TIMESTAMP_CAST_MAP.put("sqlserver", "CAST((%s) AS DATETIME2)");
        TIMESTAMP_CAST_MAP.put("postgresql", "CAST((%s) AS TIMESTAMP)");
        TIMESTAMP_CAST_MAP.put("oracle", "CAST((%s) AS TIMESTAMP)");
        TIMESTAMP_CAST_MAP.put("snowflake", "CAST((%s) AS TIMESTAMP)");
        TIMESTAMP_CAST_MAP.put("db2", "CAST((%s) AS TIMESTAMP)");
        TIMESTAMP_CAST_MAP.put("motherduck", "CAST((%s) AS TIMESTAMP)");
        TIMESTAMP_CAST_MAP.put("duckdb", "CAST((%s) AS TIMESTAMP)");
        TIMESTAMP_CAST_MAP.put("bigquery", "CAST((%s) AS TIMESTAMP)");
        TIMESTAMP_CAST_MAP.put("teradata", "CAST((%s) AS TIMESTAMP)");
        TIMESTAMP_CAST_MAP.put("databricks", "CAST((%s) AS TIMESTAMP)");
        TIMESTAMP_CAST_MAP.put("amazonathena", "CAST((%s) AS TIMESTAMP)");

        // BOOLEAN
        BOOLEAN_CAST_MAP.put("mysql", "CAST((%s) AS BOOLEAN)");
        BOOLEAN_CAST_MAP.put("sqlserver", "CAST((%s) AS BIT)");
        BOOLEAN_CAST_MAP.put("postgresql", "CAST((%s) AS BOOLEAN)");
        BOOLEAN_CAST_MAP.put("oracle", "CAST((%s) AS NUMBER(1))");
        BOOLEAN_CAST_MAP.put("snowflake", "CAST((%s) AS BOOLEAN)");
        BOOLEAN_CAST_MAP.put("db2", "CAST((%s) AS BOOLEAN)");
        BOOLEAN_CAST_MAP.put("motherduck", "CAST((%s) AS BOOLEAN)");
        BOOLEAN_CAST_MAP.put("duckdb", "CAST((%s) AS BOOLEAN)");
        BOOLEAN_CAST_MAP.put("bigquery", "CAST((%s) AS BOOL)");
        BOOLEAN_CAST_MAP.put("teradata", "CAST((%s) AS BYTEINT)");
        BOOLEAN_CAST_MAP.put("databricks", "CAST((%s) AS BOOLEAN)");
        BOOLEAN_CAST_MAP.put("amazonathena", "CAST((%s) AS BOOLEAN)");
    }

    private static String getCastExpression(String selectField, String castType, Map<String, String> castMap,String vendorName ) {
        String format = castMap.get(vendorName.toLowerCase());
        if (format != null) {
            return String.format(format, selectField);
        } else {
            throw new IllegalArgumentException("Unsupported database type: " + castType);
        }
    }

    private static String castToBigInt(String selectField, String castType,String vendorName) {
        return getCastExpression(selectField, castType, BIGINT_CAST_MAP,vendorName);
    }

    private static String castToInt(String selectField, String castType,String vendorName) {
        return getCastExpression(selectField, castType, INT_CAST_MAP,vendorName);
    }

    private static String castToVarchar(String selectField, String castType,String vendorName) {
        return getCastExpression(selectField, castType, VARCHAR_CAST_MAP,vendorName);
    }

    private static String castToChar(String selectField, String castType,String vendorName) {
        return getCastExpression(selectField, castType, CHAR_CAST_MAP,vendorName);
    }

    private static String castToText(String selectField, String castType,String vendorName) {
        return getCastExpression(selectField, castType, TEXT_CAST_MAP,vendorName);
    }

    private static String castToFloat(String selectField, String castType,String vendorName) {
        return getCastExpression(selectField, castType, FLOAT_CAST_MAP,vendorName);
    }

    private static String castToDouble(String selectField, String castType,String vendorName) {
        return getCastExpression(selectField, castType, DOUBLE_CAST_MAP,vendorName);
    }

    private static String castToDecimal(String selectField, String castType,String vendorName) {
        return getCastExpression(selectField, castType, DECIMAL_CAST_MAP,vendorName);
    }

    public static String castToDate(String selectField, String castType,String vendorName) {
        return getCastExpression(selectField, castType, DATE_CAST_MAP,vendorName);
    }

    private static String castToTimestamp(String selectField, String castType,String vendorName) {
        return getCastExpression(selectField, castType, TIMESTAMP_CAST_MAP,vendorName);
    }

    private static String castToBoolean(String selectField, String castType,String vendorName) {
        return getCastExpression(selectField, castType, BOOLEAN_CAST_MAP,vendorName);
    }

    public static String castDatatype(String selectField,String vendorName,String dataType) throws BadRequestException{
        if(dataType.toUpperCase().equals("BIGINT")){
            return castToBigInt(selectField, dataType,vendorName);
            
        }else if(dataType.toUpperCase().equals("INT")){
            return castToInt(selectField, dataType,vendorName);

        }else if(dataType.toUpperCase().equals("VARCHAR")){
            return castToVarchar(selectField, dataType,vendorName);

        }else if(dataType.toUpperCase().equals("CHAR")){
            return castToChar(selectField, dataType,vendorName);

        }else if(dataType.toUpperCase().equals("TEXT")){
            return castToText(selectField, dataType,vendorName);

        }else if(dataType.toUpperCase().equals("FLOAT")){
            return castToFloat(selectField, dataType,vendorName);

        }else if(dataType.toUpperCase().equals("DOUBLE")){
            return castToDouble(selectField, dataType,vendorName);

        }else if(dataType.toUpperCase().equals("DECIMAL")){
            return castToDecimal(selectField, dataType,vendorName);

        }else if(dataType.toUpperCase().equals("DATE")){
            return castToDate(selectField, dataType,vendorName);

        }else if(dataType.toUpperCase().equals("TIMESTAMP")){
            return castToTimestamp(selectField, dataType,vendorName);

        }else if(dataType.toUpperCase().equals("BOOLEAN")){
            return castToBoolean(selectField, dataType,vendorName);
        }
        else{
            throw new BadRequestException("Mismatch datatype : Please check Cast Datatype ");
        }

    }

    public static String resolveDataTypes(String castType) {
        Map<String, String> typeMap = Map.of(
                "INT", "integer",
                "BIGINT", "integer",
                "DECIMAL", "integer",
                "FLOAT", "integer",
                "DOUBLE", "integer",
                "VARCHAR", "text",
                "CHAR", "text",
                "TEXT", "text"
        );
    
        return typeMap.getOrDefault(castType, castType != null ? castType.toLowerCase() : null);
    }

}