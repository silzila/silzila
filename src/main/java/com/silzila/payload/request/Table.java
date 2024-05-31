package com.silzila.payload.request;

import java.io.Serializable;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "id",
        "flatFileId",
        "database",
        "schema",
        "table",
        "alias",
        "tablePositionX",
        "tablePositionY",
        "customQuery"
})
@Generated("jsonschema2pojo")
public class Table implements Serializable {

    @JsonProperty("id")
    private String id;
    @JsonProperty("flatFileId")
    private String flatFileId;
    @JsonProperty("database")
    private String database;
    @JsonProperty("schema")
    private String schema;
    @JsonProperty("table")
    private String table;
    @JsonProperty("alias")
    private String alias;
    @JsonProperty("tablePositionX")
    private Integer tablePositionX;
    @JsonProperty("tablePositionY")
    private Integer tablePositionY;
    @JsonProperty("isCustomQuery")
    private boolean isCustomQuery;
    @JsonProperty("customQuery")
    private String customQuery;
    private final static long serialVersionUID = -2228296700900428346L;

    /**
     * No args constructor for use in serialization
     *
     */
    public Table() {
    }

    /**
     *
     * @param schema
     * @param database
     * @param flatFileId
     * @param alias
     * @param id
     * @param tablePositionX
     * @param table
     * @param tablePositionY
     * @param customQuery
     * @param customQueryId
     */
    public Table(String id, String flatFileId, String database, String schema, String table, String alias,
                 Integer tablePositionX, Integer tablePositionY, Boolean isCustomQuery, String customQuery) {
        super();
        this.id = id;
        this.flatFileId = flatFileId;
        this.database = database;
        this.schema = schema;
        this.table = table;
        this.alias = alias;
        this.tablePositionX = tablePositionX;
        this.tablePositionY = tablePositionY;
        this.isCustomQuery = isCustomQuery;
        this.customQuery = customQuery;

    }

    @JsonProperty("id")
    public String getId() {
        return id;
    }

    @JsonProperty("id")
    public void setId(String id) {
        this.id = id;
    }

    @JsonProperty("flatFileId")
    public String getFlatFileId() {
        return flatFileId;
    }

    @JsonProperty("flatFileId")
    public void setFlatFileId(String flatFileId) {
        this.flatFileId = flatFileId;
    }

    @JsonProperty("database")
    public String getDatabase() {
        return database;
    }

    @JsonProperty("database")
    public void setDatabase(String database) {
        this.database = database;
    }

    @JsonProperty("schema")
    public String getSchema() {
        return schema;
    }

    @JsonProperty("schema")
    public void setSchema(String schema) {
        this.schema = schema;
    }

    @JsonProperty("table")
    public String getTable() {
        return table;
    }

    @JsonProperty("table")
    public void setTable(String table) {
        this.table = table;
    }

    @JsonProperty("alias")
    public String getAlias() {
        return alias;
    }

    @JsonProperty("alias")
    public void setAlias(String alias) {
        this.alias = alias;
    }

    @JsonProperty("tablePositionX")
    public Integer getTablePositionX() {
        return tablePositionX;
    }

    @JsonProperty("tablePositionX")
    public void setTablePositionX(Integer tablePositionX) {
        this.tablePositionX = tablePositionX;
    }

    @JsonProperty("tablePositionY")
    public Integer getTablePositionY() {
        return tablePositionY;
    }

    @JsonProperty("tablePositionY")
    public void setTablePositionY(Integer tablePositionY) {
        this.tablePositionY = tablePositionY;
    }

    @JsonProperty("isCustomQuery")
    public boolean isCustomQuery() {
        return isCustomQuery;
    }
    @JsonProperty("isCustomQuery")
    public void setCustomQuery(boolean customQuery) {
        this.isCustomQuery = customQuery;
    }
    @JsonProperty("customQuery")
    public String getCustomQuery() {
        return customQuery;
    }
    @JsonProperty("customQuery")
    public void setCustomQuery(String customQuery) {
        this.customQuery = customQuery;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(Table.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this)))
                .append('[');
        sb.append("id");
        sb.append('=');
        sb.append(((this.id == null) ? "<null>" : this.id));
        sb.append(',');
        sb.append("flatFileId");
        sb.append('=');
        sb.append(((this.flatFileId == null) ? "<null>" : this.flatFileId));
        sb.append(',');
        sb.append("database");
        sb.append('=');
        sb.append(((this.database == null) ? "<null>" : this.database));
        sb.append(',');
        sb.append("schema");
        sb.append('=');
        sb.append(((this.schema == null) ? "<null>" : this.schema));
        sb.append(',');
        sb.append("table");
        sb.append('=');
        sb.append(((this.table == null) ? "<null>" : this.table));
        sb.append(',');
        sb.append("alias");
        sb.append('=');
        sb.append(((this.alias == null) ? "<null>" : this.alias));
        sb.append(',');
        sb.append("tablePositionX");
        sb.append('=');
        sb.append(((this.tablePositionX == null) ? "<null>" : this.tablePositionX));
        sb.append(',');
        sb.append("tablePositionY");
        sb.append('=');
        sb.append(((this.tablePositionY == null) ? "<null>" : this.tablePositionY));
        sb.append(',');
        sb.append("customQuery");
        sb.append('=');
        sb.append(((this.customQuery == null) ? "<null>" : this.customQuery));
        sb.append(',');
        sb.append("isCustomQuery");
        sb.append('=');
        sb.append(((this.isCustomQuery) ? this.isCustomQuery : "<null>" ));
        sb.append(',');
        if (sb.charAt((sb.length() - 1)) == ',') {
            sb.setCharAt((sb.length() - 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

}
