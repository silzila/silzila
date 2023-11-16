package com.silzila.payload.response;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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

        if (dataType.matches("4|5|-5|-6")) {
            this.dataType = "integer";
        } else if (dataType.matches("2|3|6|7|8")) {
            this.dataType = "decimal";
        } else if (dataType.matches("-1|1|12|7|8|-9")) {
            this.dataType = "text";
        } else if (dataType.matches("91")) {
            this.dataType = "date";
        } else if (dataType.matches("92|93")) {
            this.dataType = "timestamp";
        } else if (dataType.matches("0")) {
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
