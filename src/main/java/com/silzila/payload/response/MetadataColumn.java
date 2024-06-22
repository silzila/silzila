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

    public MetadataColumn(String columnName, String dataType) {
        this.columnName = columnName;
        HashSet<String> integerType = new HashSet<String>(
                Set.of("4", "5", "-5","-6","int4","INT64","INT","int","NUMBER","BIGINT"));;
        HashSet<String> decimalType = new HashSet<String>(
                Set.of("2","3","6","7","8","numeric","FLOAT64","DECIMAL","decimal","DOUBLE","FLOAT"));
        HashSet<String> textType = new HashSet<String>(
                Set.of("-1","1","12","7","8","-9","varchar","STRING","VARCHAR","nvarchar","VARCHAR2","NVARCHAR2","NVARCHAR"));
        HashSet<String> dateType = new HashSet<String>(
                Set.of("91","date","DATE"));
        HashSet<String> timestampType = new HashSet<String>(
                Set.of("92","93","timestamp","TIMESTAMP","datetime2","TIMESTAMPNTZ","DATETIME","DATETIME2","timestamptz"));
        System.out.println("###############\n"+dataType);
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
        } else if (dataType.matches("0|null|NULL")) {
            this.dataType = "null";
        }
        // else if (dataType.matches("-2|-3|-4")) {
        // this.dataType = "binary";
        // } else
        else {
            this.dataType = "unsuppoted";
        }
    }

}
