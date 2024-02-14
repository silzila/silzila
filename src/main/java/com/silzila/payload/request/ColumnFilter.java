package com.silzila.payload.request;

import java.io.Serializable;
import java.util.HashMap;
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
        "fieldName",
        "dataType",
        "filterOption",
        "timeGrain"
})
@Generated("jsonschema2pojo")
public class ColumnFilter implements Serializable {

    @JsonProperty("tableId")
    private String tableId;
    @JsonProperty("fieldName")
    private String fieldName;
    @JsonProperty("dataType")
    private ColumnFilter.DataType dataType;
    @JsonProperty("filterOption")
    private ColumnFilter.FilterOption filterOption;
    @JsonProperty("timeGrain")
    private ColumnFilter.TimeGrain timeGrain;
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
     */
    public ColumnFilter(String tableId, String fieldName, ColumnFilter.DataType dataType,
            ColumnFilter.FilterOption filterOption, ColumnFilter.TimeGrain timeGrain) {
        super();
        this.tableId = tableId;
        this.fieldName = fieldName;
        this.dataType = dataType;
        this.filterOption = filterOption;
        this.timeGrain = timeGrain;
    }

    @JsonProperty("tableId")
    public String getTableId() {
        return tableId;
    }

    @JsonProperty("tableId")
    public void setTableId(String tableId) {
        this.tableId = tableId;
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

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(ColumnFilter.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this)))
                .append('[');
        sb.append("tableId");
        sb.append('=');
        sb.append(((this.tableId == null) ? "<null>" : this.tableId));
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
