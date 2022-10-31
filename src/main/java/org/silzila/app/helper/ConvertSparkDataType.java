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

}
