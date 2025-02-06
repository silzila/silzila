package com.silzila.querybuilder.CalculatedField.helper;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class DateFormatConverter {

    // Map for PostgreSQL format tokens
    private static final Map<String, String> POSTGRES_FORMAT_MAP = Map.of(
            "%Y", "YYYY", // Four-digit year
            "%y", "YY", // Two-digit year
            "%M", "FMMonth", // Full month name
            "%b", "Mon", // Abbreviated month name
            "%c", "MM", // Numeric month (0–12)
            "%m", "MM", // Padded numeric month (01–12)
            "%e", "FMDD", // Day of month as numeric value
            "%d", "DD", // Padded day of the month
            "%D", "DDth" // Day with suffix (1st, 2nd, ...)
    );

    private static final Map<String, String> MYSQL_FORMAT_MAP = Map.of(
            "%Y", "%Y", // Four-digit year
            "%y", "%y", // Two-digit year
            "%M", "%M", // Full month name
            "%b", "%b", // Abbreviated month name
            "%c", "%c", // Numeric month (1–12)
            "%m", "%m", // Padded numeric month (01–12)
            "%e", "%e", // Day of month as numeric value (1–31)
            "%d", "%d", // Padded day of the month (01–31)
            "%D", "%D"
    );

    private static final Map<String, String> BIGQUERY_FORMAT_MAP = Map.of(
            "%Y", "%Y", // Four-digit year
            "%y", "%y", // Two-digit year
            "%M", "%B", // Full month name (e.g., January)
            "%b", "%b", // Abbreviated month name (e.g., Jan)
            "%c", "%m", // Numeric month (1–12)
            "%m", "%m", // Padded numeric month (01–12)
            "%e", "%d", // Day of month as numeric value (1–31)
            "%d", "%d", // Padded day of the month (01–31)
            "%D", "%d"// AM/PM (uppercase)
    );

    private static final Map<String, String> SQLSERVER_FORMAT_MAP = Map.of(
            "%Y", "yyyy", 
            "%y", "yy", 
            "%M", "MMMM", 
            "%b", "MMM", 
            "%m", "MM", 
            "%e", "d", 
            "%d", "dd",
            "%D", "dd"
            
    );

    private static final Map<String, String> ORACLE_FORMAT_MAP = Map.of(
            "%Y", "YYYY",
            "%y", "YY",
            "%M", "Month",
            "%b", "Mon",
            "%c", "FMMonth",
            "%m", "MM",
            "%e", "FMDD",
            "%d", "DD",
            "%D", "DDth");
    
    private static final Map<String, String> SNOWFLAKE_FORMAT_MAP = Map.of(
                "%Y", "YYYY",
                "%y", "YY",
                "%M", "Month",
                "%b", "Mon",
                "%c", "MM",
                "%m", "MM",
                "%e", "DD",
                "%d", "DD",
                "%D", "DDth"
        );
    
    private static final Map<String, String> DB2_FORMAT_MAP = Map.of(
            "%Y", "YYYY",
            "%y", "YY",
            "%M", "Month",
            "%b", "Mon",
            "%c", "MM",
            "%m", "MM",
            "%e", "D",
            "%d", "DD",
            "%D", "Dth"
    );
    
    private static final Map<String, String> DATABRICKS_FORMAT_MAP = Map.of(
        "%Y", "yyyy",     
        "%y", "yy",       
        "%M", "MMMM",     
        "%b", "MMM",      
        "%c", "MM",       
        "%m", "MM",       
        "%d", "dd",       
        "%D", "d",        
        "%A", "EEEE",     
        "%a", "EEE"       
);
private static final Map<String, String> TERADATA_FORMAT_MAP = Map.of(
        "%Y", "YYYY",  
        "%y", "YY",     
        "%M", "MMMM",  
        "%b", "MMM",   
        "%c", "MM",
        "%m", "MM",
        "%e", "DD",     
        "%d", "DD",     
        "%D", "DD"     
);


    public static String stringToDateFormat(String vendorName, List<String> formats) {
        if (vendorName == null || formats == null || formats.isEmpty()) {
            throw new IllegalArgumentException("Vendor name and formats must not be null or empty");
        }

        // Get the format map for the specified vendor
        Map<String, String> formatMap = getFormatMapForVendor(vendorName);
        return formats.stream()
                .map(token -> formatMap.getOrDefault(token, token)) // Pass through separators as-is
                .collect(Collectors.joining());
    }

    private static Map<String, String> getFormatMapForVendor(String vendorName) {
        switch (vendorName.toLowerCase()) {
            case "postgresql":
                return POSTGRES_FORMAT_MAP;
            case "oracle":
                return ORACLE_FORMAT_MAP;
            case "mysql":
                return MYSQL_FORMAT_MAP;
            case "bigquery":
                return BIGQUERY_FORMAT_MAP;
            case "sqlserver":
                return SQLSERVER_FORMAT_MAP;
            case "snowflake":
                return SNOWFLAKE_FORMAT_MAP;
            case "db2":
                return DB2_FORMAT_MAP;
            case "databricks":
                return DATABRICKS_FORMAT_MAP;
             case "teradata":
                return TERADATA_FORMAT_MAP;                
            default:
                throw new UnsupportedOperationException("Vendor not supported: " + vendorName);
        }
    }

}