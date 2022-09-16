package org.silzila.app.payload.request;

import java.io.Serializable;
import java.util.List;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "filterType",
        "tableId",
        "fieldName",
        "dataType",
        "shouldExclude",
        "timeGrain",
        "operator",
        "userSelection"
})
@Generated("jsonschema2pojo")
public class Filter implements Serializable {

    @JsonProperty("filterType")
    private String filterType;
    @JsonProperty("tableId")
    private String tableId;
    @JsonProperty("fieldName")
    private String fieldName;
    @JsonProperty("dataType")
    private String dataType;
    @JsonProperty("shouldExclude")
    private Boolean shouldExclude;
    @JsonProperty("timeGrain")
    private String timeGrain;
    @JsonProperty("operator")
    private String operator;
    @JsonProperty("userSelection")
    private List<String> userSelection = null;
    private final static long serialVersionUID = -7373035549743445159L;

    /**
     * No args constructor for use in serialization
     *
     */
    public Filter() {
    }

    /**
     *
     * @param timeGrain
     * @param fieldName
     * @param dataType
     * @param shouldExclude
     * @param tableId
     * @param userSelection
     * @param filterType
     * @param operator
     */
    public Filter(String filterType, String tableId, String fieldName, String dataType, Boolean shouldExclude,
            String timeGrain, String operator, List<String> userSelection) {
        super();
        this.filterType = filterType;
        this.tableId = tableId;
        this.fieldName = fieldName;
        this.dataType = dataType;
        this.shouldExclude = shouldExclude;
        this.timeGrain = timeGrain;
        this.operator = operator;
        this.userSelection = userSelection;
    }

    @JsonProperty("filterType")
    public String getFilterType() {
        return filterType;
    }

    @JsonProperty("filterType")
    public void setFilterType(String filterType) {
        this.filterType = filterType;
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
    public String getDataType() {
        return dataType;
    }

    @JsonProperty("dataType")
    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    @JsonProperty("shouldExclude")
    public Boolean getShouldExclude() {
        return shouldExclude;
    }

    @JsonProperty("shouldExclude")
    public void setShouldExclude(Boolean shouldExclude) {
        this.shouldExclude = shouldExclude;
    }

    @JsonProperty("timeGrain")
    public String getTimeGrain() {
        return timeGrain;
    }

    @JsonProperty("timeGrain")
    public void setTimeGrain(String timeGrain) {
        this.timeGrain = timeGrain;
    }

    @JsonProperty("operator")
    public String getOperator() {
        return operator;
    }

    @JsonProperty("operator")
    public void setOperator(String operator) {
        this.operator = operator;
    }

    @JsonProperty("userSelection")
    public List<String> getUserSelection() {
        return userSelection;
    }

    @JsonProperty("userSelection")
    public void setUserSelection(List<String> userSelection) {
        this.userSelection = userSelection;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(Filter.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this)))
                .append('[');
        sb.append("filterType");
        sb.append('=');
        sb.append(((this.filterType == null) ? "<null>" : this.filterType));
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
        sb.append("shouldExclude");
        sb.append('=');
        sb.append(((this.shouldExclude == null) ? "<null>" : this.shouldExclude));
        sb.append(',');
        sb.append("timeGrain");
        sb.append('=');
        sb.append(((this.timeGrain == null) ? "<null>" : this.timeGrain));
        sb.append(',');
        sb.append("operator");
        sb.append('=');
        sb.append(((this.operator == null) ? "<null>" : this.operator));
        sb.append(',');
        sb.append("userSelection");
        sb.append('=');
        sb.append(((this.userSelection == null) ? "<null>" : this.userSelection));
        sb.append(',');
        if (sb.charAt((sb.length() - 1)) == ',') {
            sb.setCharAt((sb.length() - 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

}