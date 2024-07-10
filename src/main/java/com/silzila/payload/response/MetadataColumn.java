package com.silzila.payload.response;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@ToString
public class MetadataColumn {

    private String columnName;
    private String dataType;

    public MetadataColumn() {

    }
    // creating list for each bucket of data types
    public MetadataColumn(String columnName, String dataType) {
        this.columnName = columnName;
        HashSet<String> integerType = new HashSet<String>(
                Set.of("int4","INT64","INT","int","NUMBER","BIGINT","INTEGER","SMALLINT","LONG"));;
        HashSet<String> decimalType = new HashSet<String>(
                Set.of("numeric","FLOAT64","DECIMAL","decimal","DOUBLE","FLOAT"));
        HashSet<String> textType = new HashSet<String>(
                Set.of("varchar","STRING","VARCHAR","CHAR","CHAR2","nvarchar","VARCHAR2","NVARCHAR2","NVARCHAR","NCHAR"));
        HashSet<String> dateType = new HashSet<String>(
                Set.of("date","DATE"));
        HashSet<String> timestampType = new HashSet<String>(
                Set.of("timestamp","TIMESTAMP","datetime2","TIMESTAMPNTZ","DATETIME","DATETIME2","timestamptz"));
        // checking the DB specific datatypes with the bucket data types
        if (integerType.contains(dataType)) {
            this.dataType = "integer";
        } else if (decimalType.contains(dataType)) {
            this.dataType = "decimal";
        } else if (textType.contains(dataType)) {
            this.dataType = "text";
        } else if (dateType.contains(dataType)) {
            this.dataType = "date";
        } else if (timestampType.contains(dataType)) {
            this.dataType = "timestamp";
        } else if (dataType.matches("null|NULL")) {
            this.dataType = "null";
        }
        else {
            this.dataType = "unsuppoted";
        }
    }

}
