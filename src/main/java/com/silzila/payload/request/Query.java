package com.silzila.payload.request;

import java.io.Serializable;
import java.util.List;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "dimensions",
        "measures",
        "fields",
        "filterPanels"
})
@Generated("jsonschema2pojo")
public class Query implements Serializable {

    @JsonProperty("dimensions")
    private List<Dimension> dimensions = null;
    @JsonProperty("measures")
    private List<Measure> measures = null;
    @JsonProperty("fields")
    private List<Field> fields = null;
    @JsonProperty("filterPanels")
    private List<FilterPanel> filterPanels = null;
    private final static long serialVersionUID = -1318578558235982102L;

    /**
     * No args constructor for use in serialization
     *
     */
    public Query() {
    }

    /**
     *
     * @param measures
     * @param filterPanels
     * @param fields
     * @param dimensions
     */
    public Query(List<Dimension> dimensions, List<Measure> measures, List<Field> fields,
            List<FilterPanel> filterPanels) {
        super();
        this.dimensions = dimensions;
        this.measures = measures;
        this.fields = fields;
        this.filterPanels = filterPanels;
    }

    @JsonProperty("dimensions")
    public List<Dimension> getDimensions() {
        return dimensions;
    }

    @JsonProperty("dimensions")
    public void setDimensions(List<Dimension> dimensions) {
        this.dimensions = dimensions;
    }

    @JsonProperty("measures")
    public List<Measure> getMeasures() {
        return measures;
    }

    @JsonProperty("measures")
    public void setMeasures(List<Measure> measures) {
        this.measures = measures;
    }

    @JsonProperty("fields")
    public List<Field> getFields() {
        return fields;
    }

    @JsonProperty("fields")
    public void setFields(List<Field> fields) {
        this.fields = fields;
    }

    @JsonProperty("filterPanels")
    public List<FilterPanel> getFilterPanels() {
        return filterPanels;
    }

    @JsonProperty("filterPanels")
    public void setFilterPanels(List<FilterPanel> filterPanels) {
        this.filterPanels = filterPanels;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(Query.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this)))
                .append('[');
        sb.append("dimensions");
        sb.append('=');
        sb.append(((this.dimensions == null) ? "<null>" : this.dimensions));
        sb.append(',');
        sb.append("measures");
        sb.append('=');
        sb.append(((this.measures == null) ? "<null>" : this.measures));
        sb.append(',');
        sb.append("fields");
        sb.append('=');
        sb.append(((this.fields == null) ? "<null>" : this.fields));
        sb.append(',');
        sb.append("filterPanels");
        sb.append('=');
        sb.append(((this.filterPanels == null) ? "<null>" : this.filterPanels));
        sb.append(',');
        if (sb.charAt((sb.length() - 1)) == ',') {
            sb.setCharAt((sb.length() - 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

}
