package com.silzila.helper;

public class ConvertDuckDbDataType {

    public static String toSilzilaDataType(String duckDbDataType) {
        String silzilaDataType;
        switch (duckDbDataType) {

            case "BOOLEAN":
                silzilaDataType = "boolean";
                break;

            case "BIGINT":
            case "INTEGER":
            case "SMALLINT":
            case "TINYINT":
            case "UINTEGER":
            case "UBIGINT":
            case "USMALLINT":
            case "UTINYINT":
                silzilaDataType = "integer";
                break;

            case "DECIMAL":
            case "REAL":
            case "DOUBLE":
                silzilaDataType = "decimal";
                break;

            case "DATE":
                silzilaDataType = "date";
                break;
            case "TIMESTAMP":
            case "TIME":
                silzilaDataType = "timestamp";
                break;

            case "VARCHAR":
                silzilaDataType = "text";
                break;

            default:
                silzilaDataType = "text";
                break;
        }
        return silzilaDataType;
    }

    public static String toDuckDbDataType(String silzilaDataType) {
        String duckDbDataType;
        switch (silzilaDataType) {

            case "boolean":
                duckDbDataType = "BOOLEAN";
                break;

            case "integer":
                duckDbDataType = "INTEGER";
                break;

            case "decimal":
                duckDbDataType = "DOUBLE";
                break;

            case "date":
                duckDbDataType = "DATE";
                break;
            case "timestamp":
                duckDbDataType = "TIMESTAMP";
                break;

            case "text":
                duckDbDataType = "VARCHAR";
                break;

            default:
                duckDbDataType = "STRING";
                break;
        }
        return duckDbDataType;
    }
}
