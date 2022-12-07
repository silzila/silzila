package org.silzila.app.helper;

public class ConvertSparkDataType {

    public static String toSilzilaDataType(String sparkDataType) {
        String silzilaDataType;
        switch (sparkDataType) {

            case "boolean":
                silzilaDataType = "boolean";
                break;

            case "integer":
            case "bigint":
            case "tinyint":
            case "smallint":
                silzilaDataType = "integer";
                break;

            case "decimal":
            case "double":
            case "float":
            case "real":
            case "numeric":
                silzilaDataType = "decimal";
                break;

            case "date":
                silzilaDataType = "date";
                break;
            case "timestamp":
                silzilaDataType = "timestamp";
                break;

            case "string":
                silzilaDataType = "text";
                break;

            default:
                silzilaDataType = "text";
                break;
        }
        return silzilaDataType;
    }

    public static String toSparkDataType(String silzilaDataType) {
        String sparkDataType;
        switch (silzilaDataType) {

            case "boolean":
                sparkDataType = "boolean";
                break;

            case "integer":
                sparkDataType = "integer";
                break;

            case "decimal":
                sparkDataType = "double";
                break;

            case "date":
                sparkDataType = "date";
                break;
            case "timestamp":
                sparkDataType = "timestamp";
                break;

            case "text":
                sparkDataType = "string";
                break;

            default:
                sparkDataType = "string";
                break;
        }
        return sparkDataType;
    }

}
