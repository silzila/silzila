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
        "timeGrain"
})
@Generated("jsonschema2pojo")
public class Dimension implements Serializable {

    @JsonProperty("tableId")
    private String tableId;
    @JsonProperty("fieldName")
    private String fieldName;
    @JsonProperty("dataType")
    private Dimension.DataType dataType;
    @JsonProperty("timeGrain")
    private Dimension.TimeGrain timeGrain = Dimension.TimeGrain.fromValue("year");
    private final static long serialVersionUID = -6693625304963309989L;

    /**
     * No args constructor for use in serialization
     *
     */
    public Dimension() {
    }

    /**
     *
     * @param timeGrain
     * @param fieldName
     * @param dataType
     * @param tableId
     */
    public Dimension(String tableId, String fieldName, Dimension.DataType dataType, Dimension.TimeGrain timeGrain) {
        super();
        this.tableId = tableId;
        this.fieldName = fieldName;
        this.dataType = dataType;
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
    public Dimension.DataType getDataType() {
        return dataType;
    }

    @JsonProperty("dataType")
    public void setDataType(Dimension.DataType dataType) {
        this.dataType = dataType;
    }

    @JsonProperty("timeGrain")
    public Dimension.TimeGrain getTimeGrain() {
        return timeGrain;
    }

    @JsonProperty("timeGrain")
    public void setTimeGrain(Dimension.TimeGrain timeGrain) {
        this.timeGrain = timeGrain;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(Dimension.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this)))
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
        private final static Map<String, Dimension.DataType> CONSTANTS = new HashMap<String, Dimension.DataType>();

        static {
            for (Dimension.DataType c : values()) {
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
        public static Dimension.DataType fromValue(String value) {
            Dimension.DataType constant = CONSTANTS.get(value);
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
        private final static Map<String, Dimension.TimeGrain> CONSTANTS = new HashMap<String, Dimension.TimeGrain>();

        static {
            for (Dimension.TimeGrain c : values()) {
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
        public static Dimension.TimeGrain fromValue(String value) {
            Dimension.TimeGrain constant = CONSTANTS.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }

    }

}