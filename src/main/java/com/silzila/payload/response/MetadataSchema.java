package com.silzila.payload.response;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MetadataSchema {

    private String database;
    private String schema;

    public MetadataSchema() {

    }

    public MetadataSchema(String database, String schema) {
        this.database = database;
        this.schema = schema;
    }

}
