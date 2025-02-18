package com.silzila.payload.request;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonValue;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "tableId",
        "tableName",
        "schemaName",
        "dbName",
        "fieldName",
        "dataType",
        "filterOption",
        "timeGrain"
})
@Generated("jsonschema2pojo")
public class ColumnFilter implements Serializable {

    @JsonProperty("isCalculatedField")
    private Boolean isCalculatedField = false;
    @JsonProperty("calculatedField")
    private List<CalculatedFieldRequest> calculatedField;
    @JsonProperty("tableId")
    private String tableId;
    @JsonProperty("tableName")
    private String tableName = null;
    @JsonProperty("schemaName")
    private String schemaName = null;
    @JsonProperty("dbName")
    private String dbName = null;
    @JsonProperty("flatFileId")
    private String flatFileId = null;
    @JsonProperty("fieldName")
    private String fieldName;
    @JsonProperty("dataType")
    private ColumnFilter.DataType dataType;
    @JsonProperty("filterOption")
    private ColumnFilter.FilterOption filterOption;
    @JsonProperty("timeGrain")
    private ColumnFilter.TimeGrain timeGrain;
    @JsonProperty("whereClause")
    private String whereClause = null;
    @JsonProperty("fromClause")
    private String fromClause = null;
    private final static long serialVersionUID = -2628722783214042914L;

    /**
     * No args constructor for use in serialization
     *
     */
    public ColumnFilter() {
    }

    /**
     *
     * @param filterOption
     * @param timeGrain
     * @param fieldName
     * @param dataType
     * @param tableId
     * @param tableName
     * @param schemaName
     * @param dbName
     */
    public ColumnFilter(Boolean isCalculatedField, List<CalculatedFieldRequest> calculatedField, String tableId,
            String tableName, String schemaName, String dbName,
            String fieldName, String flatFileId, ColumnFilter.DataType dataType,
            ColumnFilter.FilterOption filterOption, ColumnFilter.TimeGrain timeGrain, String whereClause,
            String fromClause) {
        super();
        this.tableId = tableId;
        this.tableName = tableName;
        this.schemaName = schemaName;
        this.dbName = dbName;
        this.flatFileId = flatFileId;
        this.fieldName = fieldName;
        this.dataType = dataType;
        this.filterOption = filterOption;
        this.timeGrain = timeGrain;
        this.isCalculatedField = isCalculatedField;
        this.whereClause = whereClause;
        this.calculatedField = calculatedField;
        this.fromClause = fromClause;

    }

    @JsonProperty("isCalculatedField")
    public Boolean getIsCalculatedField() {
        return isCalculatedField;
    }

    @JsonProperty("isCalculatedField")
    public void setIsCalculatedField(Boolean calculatedField) {
        isCalculatedField = calculatedField;
    }

    @JsonProperty("calculatedField")
    public List<CalculatedFieldRequest> getCalculatedField() {
        return calculatedField;
    }

    @JsonProperty("calculatedField")
    public void setCalculatedField(List<CalculatedFieldRequest> calculatedField) {
        this.calculatedField = calculatedField;
    }

    @JsonProperty("tableId")
    public String getTableId() {
        return tableId;
    }

    @JsonProperty("tableId")
    public void setTableId(String tableId) {
        this.tableId = tableId;
    }

    @JsonProperty("tableName")
    public String getTableName() {
        return tableName;
    }

    @JsonProperty("tableName")
    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    @JsonProperty("schemaName")
    public String getSchemaName() {
        return schemaName;
    }

    @JsonProperty("schemaName")
    public void setSchemaName(String schemaName) {
        this.schemaName = schemaName;
    }

    @JsonProperty("dbName")
    public String getDBName() {
        return dbName;
    }

    @JsonProperty("dbName")
    public void setDBName(String dbName) {
        this.dbName = dbName;
    }

    @JsonProperty("flatFileId")
    public String getFlatFileId() {
        return flatFileId;
    }

    @JsonProperty("flatFileId")
    public void setFlatFileId(String flatFileId) {
        this.flatFileId = flatFileId;
    }

    @JsonProperty("fieldName")
    public String getFieldName() {
        return fieldName;
    }

    @JsonProperty("fieldName")
    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    @JsonProperty("dataType")
    public ColumnFilter.DataType getDataType() {
        return dataType;
    }

    @JsonProperty("dataType")
    public void setDataType(ColumnFilter.DataType dataType) {
        this.dataType = dataType;
    }

    @JsonProperty("filterOption")
    public ColumnFilter.FilterOption getFilterOption() {
        return filterOption;
    }

    @JsonProperty("filterOption")
    public void setFilterOption(ColumnFilter.FilterOption filterOption) {
        this.filterOption = filterOption;
    }

    @JsonProperty("timeGrain")
    public ColumnFilter.TimeGrain getTimeGrain() {
        return timeGrain;
    }

    @JsonProperty("timeGrain")
    public void setTimeGrain(ColumnFilter.TimeGrain timeGrain) {
        this.timeGrain = timeGrain;
    }

    @JsonProperty("whereClause")
    public String getWhereClause() {
        return whereClause;
    }

    @JsonProperty("whereClause")
    public void setWhereClause(String whereClause) {
        this.whereClause = whereClause;
    }
    
    @JsonProperty("fromClause")
    public String getFromClause() {
        return fromClause;
    }

    @JsonProperty("fromClause")
    public void setFromClause(String fromClause) {
        this.fromClause = fromClause;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(ColumnFilter.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this)))
                .append('[');
        sb.append("isCalculatedField");
        sb.append('=');
        sb.append((this.isCalculatedField));
        sb.append(',');
        sb.append("calculatedFieldName");
        sb.append('=');
        sb.append(((this.calculatedField == null) ? "<null>" : this.calculatedField));
        sb.append(',');
        sb.append("tableId");
        sb.append('=');
        sb.append(((this.tableId == null) ? "<null>" : this.tableId));
        sb.append(',');
        sb.append("tableName");
        sb.append('=');
        sb.append(((this.tableName == null) ? "<null>" : this.tableName));
        sb.append(',');
        sb.append("schemaName");
        sb.append('=');
        sb.append(((this.schemaName == null) ? "<null>" : this.schemaName));
        sb.append(',');
        sb.append("dbName");
        sb.append('=');
        sb.append(((this.dbName == null) ? "<null>" : this.dbName));
        sb.append(',');
        sb.append("flatFileId");
        sb.append('=');
        sb.append(((this.flatFileId == null) ? "<null>" : this.flatFileId));
        sb.append(',');
        sb.append("fieldName");
        sb.append('=');
        sb.append(((this.fieldName == null) ? "<null>" : this.fieldName));
        sb.append(',');
        sb.append("dataType");
        sb.append('=');
        sb.append(((this.dataType == null) ? "<null>" : this.dataType));
        sb.append(',');
        sb.append("filterOption");
        sb.append('=');
        sb.append(((this.filterOption == null) ? "<null>" : this.filterOption));
        sb.append(',');
        sb.append("timeGrain");
        sb.append('=');
        sb.append(((this.timeGrain == null) ? "<null>" : this.timeGrain));
        sb.append(',');
        if (sb.charAt((sb.length() - 1)) == ',') {
            sb.setCharAt((sb.length() - 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

    @Generated("jsonschema2pojo")
    public enum DataType {

        TEXT("text"),
        INTEGER("integer"),
        DECIMAL("decimal"),
        BOOLEAN("boolean"),
        DATE("date"),
        TIMESTAMP("timestamp");

        private final String value;
        private final static Map<String, ColumnFilter.DataType> CONSTANTS = new HashMap<String, ColumnFilter.DataType>();

        static {
            for (ColumnFilter.DataType c : values()) {
                CONSTANTS.put(c.value, c);
            }
        }

        DataType(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return this.value;
        }

        @JsonValue
        public String value() {
            return this.value;
        }

        @JsonCreator
        public static ColumnFilter.DataType fromValue(String value) {
            ColumnFilter.DataType constant = CONSTANTS.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }

    }

    @Generated("jsonschema2pojo")
    public enum FilterOption {

        ALL_VALUES("allValues"),
        MIN_MAX("minMax");

        private final String value;
        private final static Map<String, ColumnFilter.FilterOption> CONSTANTS = new HashMap<String, ColumnFilter.FilterOption>();

        static {
            for (ColumnFilter.FilterOption c : values()) {
                CONSTANTS.put(c.value, c);
            }
        }

        FilterOption(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return this.value;
        }

        @JsonValue
        public String value() {
            return this.value;
        }

        @JsonCreator
        public static ColumnFilter.FilterOption fromValue(String value) {
            ColumnFilter.FilterOption constant = CONSTANTS.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }

    }

    @Generated("jsonschema2pojo")
    public enum TimeGrain {

        YEAR("year"),
        QUARTER("quarter"),
        MONTH("month"),
        YEARQUARTER("yearquarter"),
        YEARMONTH("yearmonth"),
        DATE("date"),
        DAYOFMONTH("dayofmonth"),
        DAYOFWEEK("dayofweek");

        private final String value;
        private final static Map<String, ColumnFilter.TimeGrain> CONSTANTS = new HashMap<String, ColumnFilter.TimeGrain>();

        static {
            for (ColumnFilter.TimeGrain c : values()) {
                CONSTANTS.put(c.value, c);
            }
        }

        TimeGrain(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return this.value;
        }

        @JsonValue
        public String value() {
            return this.value;
        }

        @JsonCreator
        public static ColumnFilter.TimeGrain fromValue(String value) {
            ColumnFilter.TimeGrain constant = CONSTANTS.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }

    }

}
