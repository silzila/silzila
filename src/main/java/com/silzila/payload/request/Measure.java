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

import lombok.Builder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "tableId",
        "fieldName",
        "dataType",
        "timeGrain",
        "aggr",
        "windowFn",
        "windowFnOption",
        "rowColumnMatrix",
        "windowFnPartition",
        "disableReportFilters"
})
@Builder
@Generated("jsonschema2pojo")
public class Measure implements Serializable {

    @JsonProperty("isCalculatedField")
    private Boolean isCalculatedField = false;
    @JsonProperty("calculatedField")
    private List<CalculatedFieldRequest> calculatedField;
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
    private String[] windowFn = new String[]{null};
    @JsonProperty("windowFnOption")
    private int[] windowFnOption = new int[]{};
    @JsonProperty("rowColumnMatrix")
    private int[] rowColumnMatrix = new int[]{};
    @JsonProperty("windowFnPartition")
    private int[] windowFnPartition = new int[]{};
    @JsonProperty("disableReportFilters")
    private Boolean disableReportFilters = false;
    @JsonProperty("measureOrder")
    private Integer measureOrder = 0;
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
     * @param rowColumnMatrix
     * @param windowFnPartition
     * @param disableReportFilters
     * @param isOverrideMeasure
     */
    public Measure(Boolean isCalculatedField,List<CalculatedFieldRequest> calculatedField,String tableId, String fieldName, Measure.DataType dataType, Measure.TimeGrain timeGrain, Measure.Aggr aggr,
            String[] windowFn, int[] windowFnOption, int[] rowColumnMatrix, int[] windowFnPartition, Boolean disableReportFilters,
            Integer measureOrder) {
        super();
        this.isCalculatedField = isCalculatedField;
        this.calculatedField = calculatedField;
        this.tableId = tableId;
        this.fieldName = fieldName;
        this.dataType = dataType;
        this.timeGrain = timeGrain;
        this.aggr = aggr;
        this.windowFn = windowFn;
        this.windowFnOption = windowFnOption;
        this.rowColumnMatrix = rowColumnMatrix;
        this.windowFnPartition = windowFnPartition;
        this.disableReportFilters = disableReportFilters;
        this.measureOrder = measureOrder;
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
    public void setCalculatedFieldName(List<CalculatedFieldRequest> calculatedField) {
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
    public String[] getWindowFn() {
        return windowFn;
    }
    
    @JsonProperty("windowFn")
    public void setWindowFn(String[] windowFn) {
        this.windowFn = windowFn;
    }
    
    @JsonProperty("windowFnOption")
    public int[] getWindowFnOption() {
        return windowFnOption;
    }
     
    @JsonProperty("windowFnOption")
    public void setWindowFnOption(int[] windowFnOption) {
        this.windowFnOption = windowFnOption;
    }
    
    @JsonProperty("rowColumnMatrix")
    public int[] getrowColumnMatrix() {
        return rowColumnMatrix;
    }
    
    @JsonProperty("rowColumnMatrix")
    public void setrowColumnMatrix(int[] rowColumnMatrix) {
        this.rowColumnMatrix = rowColumnMatrix;
    }

    @JsonProperty("windowFnPartition")
    public int[] getWindowFnPartition() {
        return windowFnPartition;
    }

    @JsonProperty("windowFnPartition")
    public void setWindowFnPartition(int[] windowFnPartition) {
        this.windowFnPartition = windowFnPartition;
    }

    @JsonProperty("disableReportFilters")
    public Boolean getDisableReportFilters() {
        return disableReportFilters;
    }

    @JsonProperty("disableReportFilters")
    public void setDisableReportFilters(Boolean disableReportFilters) {
        this.disableReportFilters = disableReportFilters;
    }

    @JsonProperty("measureOrder")
    public Integer getMeasureOrder() {
        return measureOrder;
    }

    @JsonProperty("measureOrder")
    public void setMeasureOrder(Integer measureOrder) {
        this.measureOrder = measureOrder;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(Measure.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this)))
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
        sb.append("rowColumnMatrix");
        sb.append('=');
        sb.append(((this.rowColumnMatrix == null) ? "<null>" : this.rowColumnMatrix));
        sb.append(',');
        sb.append("windowFnPartition");
        sb.append('=');
        sb.append(((this.windowFnPartition == null) ? "<null>" : this.windowFnPartition));
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
       
}
