package com.silzila.payload.request;

import java.io.Serializable;
import java.util.Arrays;
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
        "fieldName",
        "dataType",
        "timeGrain",
        "aggr",
        "windowFn",
        "windowFnOption",
        "windowFnPartition",
        "windowFnOrderByRow"
})
@Generated("jsonschema2pojo")
public class Measure implements Serializable {

    @JsonProperty("tableId")
    private String tableId;
    @JsonProperty("fieldName")
    private String fieldName;
    @JsonProperty("dataType")
    private Measure.DataType dataType;
    @JsonProperty("timeGrain")
    private Measure.TimeGrain timeGrain = Measure.TimeGrain.fromValue("year");
    @JsonProperty("aggr")
    private Measure.Aggr aggr = Measure.Aggr.fromValue("count");
    @JsonProperty("windowFn")
    private Measure.WindowFn windowFn = Measure.WindowFn.fromValue("rank");
    @JsonProperty("windowFnOption")
    private List<String> windowFnOption;
    @JsonProperty("windowFnPartition")
    private List<Integer> windowFnPartition;
    @JsonProperty("windowFnOrderByRow")
    private Boolean windowFnOrderByRow = true;
    private final static long serialVersionUID = 1754801202036436076L;
      
    /**
     * No args constructor for use in serialization
     *
     */
    public Measure() {
    }

    /**
     *
     * @param timeGrain
     * @param fieldName
     * @param dataType
     * @param tableId
     * @param aggr
     * @param windowFn
     * @param windowFnOption
     * @param windowFnPartition
     * @param windowFnOrderByRow
     */
    public Measure(String tableId, String fieldName, Measure.DataType dataType, Measure.TimeGrain timeGrain, Measure.Aggr aggr,
            Measure.WindowFn windowFn, List<String> windowFnOption, List<Integer> windowFnPartition,
            Boolean windowFnOrderByRow) {
        super();
        this.tableId = tableId;
        this.fieldName = fieldName;
        this.dataType = dataType;
        this.timeGrain = timeGrain;
        this.aggr = aggr;
        this.windowFn = windowFn;
        this.windowFnOption = windowFnOption;
        this.windowFnPartition = windowFnPartition;
        this.windowFnOrderByRow = windowFnOrderByRow;
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
    public Measure.DataType getDataType() {
        return dataType;
    }

    @JsonProperty("dataType")
    public void setDataType(Measure.DataType dataType) {
        this.dataType = dataType;
    }

    @JsonProperty("timeGrain")
    public Measure.TimeGrain getTimeGrain() {
        return timeGrain;
    }

    @JsonProperty("timeGrain")
    public void setTimeGrain(Measure.TimeGrain timeGrain) {
        this.timeGrain = timeGrain;
    }

    @JsonProperty("aggr")
    public Measure.Aggr getAggr() {
        return aggr;
    }

    @JsonProperty("aggr")
    public void setAggr(Measure.Aggr aggr) {
        this.aggr = aggr;
    }
    
    @JsonProperty("windowFn")
    public Measure.WindowFn getWindowFn() {
        return windowFn;
    }
    
    @JsonProperty("windowFn")
    public void setWindowFn(Measure.WindowFn windowFn) {
        this.windowFn = windowFn;
    }
    
    @JsonProperty("windowFnOption")
    public List<String> getWindowFnOption() {
        return windowFnOption;
    }
     
    @JsonProperty("windowFnOption")
    public void setWindowFnOption(List<String> windowFnOption) {
        this.windowFnOption = windowFnOption;
    }

    @JsonProperty("windowFnPartition")
    public List<Integer> getWindowFnPartition() {
        return windowFnPartition;
    }

    @JsonProperty("windowFnPartition")
    public void setWindowFnPartition(List<Integer> windowFnPartition) {
        this.windowFnPartition = windowFnPartition;
    }

    @JsonProperty("windowFnOrderByRow")
    public Boolean isWindowFnOrderByRow() {
        return windowFnOrderByRow;
    }
    
    @JsonProperty("windowFnOrderByRow")
    public void setWindowFnOrderByRow(Boolean windowFnOrderByRow) {
        this.windowFnOrderByRow = windowFnOrderByRow;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(Measure.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this)))
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
        sb.append("aggr");
        sb.append('=');
        sb.append(((this.aggr == null) ? "<null>" : this.aggr));
        sb.append(',');
        sb.append("windowFn");
        sb.append('=');
        sb.append(((this.windowFn == null) ? "<null>" : this.windowFn));
        sb.append(',');
        sb.append("windowFnOption");
        sb.append('=');
        sb.append(((this.windowFnOption == null) ? "<null>" : this.windowFnOption));
        sb.append(',');
        sb.append("windowFnPartition");
        sb.append('=');
        sb.append(((this.windowFnPartition == null) ? "<null>" : this.windowFnPartition));
        sb.append(',');
        sb.append("windowFnOrderByRpw");
        sb.append('=');
        sb.append(((this.windowFnOrderByRow == null) ? "<null>" : this.windowFnOrderByRow));
        sb.append(',');
        if (sb.charAt((sb.length() - 1)) == ',') {
            sb.setCharAt((sb.length() - 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

    @Generated("jsonschema2pojo")
    public enum Aggr {

        SUM("sum"),
        AVG("avg"),
        MIN("min"),
        MAX("max"),
        COUNT("count"),
        COUNTU("countu"),
        COUNTN("countn"),
        COUNTNN("countnn");

        private final String value;
        private final static Map<String, Measure.Aggr> CONSTANTS = new HashMap<String, Measure.Aggr>();

        static {
            for (Measure.Aggr c : values()) {
                CONSTANTS.put(c.value, c);
            }
        }

        Aggr(String value) {
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
        public static Measure.Aggr fromValue(String value) {
            Measure.Aggr constant = CONSTANTS.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }

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
        private final static Map<String, Measure.DataType> CONSTANTS = new HashMap<String, Measure.DataType>();

        static {
            for (Measure.DataType c : values()) {
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
        public static Measure.DataType fromValue(String value) {
            Measure.DataType constant = CONSTANTS.get(value);
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
        private final static Map<String, Measure.TimeGrain> CONSTANTS = new HashMap<String, Measure.TimeGrain>();

        static {
            for (Measure.TimeGrain c : values()) {
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
        public static Measure.TimeGrain fromValue(String value) {
            Measure.TimeGrain constant = CONSTANTS.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }

    }

    @Generated("jsonschema2pojo")
    public enum WindowFn {

        RANK("rank"),
        RUNNINGTOTAL("runningTotal"),
        PERCENTAGETOTAL("percentageTotal"),
        MOVINGAVERAGE("movingAverage");

        private final String value;
        private final static Map<String, Measure.WindowFn> CONSTANTS = new HashMap<String, Measure.WindowFn>();

        static {
            for (Measure.WindowFn c : values()) {
                CONSTANTS.put(c.value, c);
            }
        }

        WindowFn(String value) {
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
        public static Measure.WindowFn fromValue(String value) {
            Measure.WindowFn constant = CONSTANTS.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }

    }
       
}
