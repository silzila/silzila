package com.silzila.payload.request;

import java.io.Serializable;
import java.util.List;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "panelName",
        "shouldAllConditionsMatch",
        "filters",
        "relativeCondition"
})
@Generated("jsonschema2pojo")
public class FilterPanel implements Serializable {

    @JsonProperty("panelName")
    private String panelName;
    @JsonProperty("shouldAllConditionsMatch")
    private Boolean shouldAllConditionsMatch = true;
    @JsonProperty("filters")
    private List<Filter> filters = null;
    @JsonProperty("relativeCondition")
    private List<RelativeCondition> relativeCondition = null; // Remove "= null"
    private final static long serialVersionUID = -2994418440697742665L;

    /**
     * No args constructor for use in serialization
     *
     */
    public FilterPanel() {
    }

    /**
     *
     * @param shouldAllConditionsMatch
     * @param filters
     * @param panelName
     * @param relativeCondition
     */
    public FilterPanel(String panelName, Boolean shouldAllConditionsMatch, List<Filter> filters, 
            List<RelativeCondition> relativeCondition) {
        super();
        this.panelName = panelName;
        this.shouldAllConditionsMatch = shouldAllConditionsMatch;
        this.filters = filters;
        this.relativeCondition = relativeCondition;
    }

    @JsonProperty("panelName")
    public String getPanelName() {
        return panelName;
    }

    @JsonProperty("panelName")
    public void setPanelName(String panelName) {
        this.panelName = panelName;
    }

    @JsonProperty("shouldAllConditionsMatch")
    public Boolean getShouldAllConditionsMatch() {
        return shouldAllConditionsMatch;
    }

    @JsonProperty("shouldAllConditionsMatch")
    public void setShouldAllConditionsMatch(Boolean shouldAllConditionsMatch) {
        this.shouldAllConditionsMatch = shouldAllConditionsMatch;
    }

    @JsonProperty("filters")
    public List<Filter> getFilters() {
        return filters;
    }

    @JsonProperty("filters")
    public void setFilters(List<Filter> filters) {
        this.filters = filters;
    }

    @JsonProperty("relativeCondition")
    public List<RelativeCondition> getRelativeCondition() {
        return relativeCondition;
    }

    @JsonProperty("relativeCondition")
    public void setRelativeCondition(List<RelativeCondition> relativeCondition) {
        this.relativeCondition = relativeCondition;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(FilterPanel.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this)))
                .append('[');
        sb.append("panelName");
        sb.append('=');
        sb.append(((this.panelName == null) ? "<null>" : this.panelName));
        sb.append(',');
        sb.append("shouldAllConditionsMatch");
        sb.append('=');
        sb.append(((this.shouldAllConditionsMatch == null) ? "<null>" : this.shouldAllConditionsMatch));
        sb.append(',');
        sb.append("filters");
        sb.append('=');
        sb.append(((this.filters == null) ? "<null>" : this.filters));
        sb.append("relativeCondition");
        sb.append('=');
        sb.append(((this.relativeCondition == null) ? "<null>" : this.relativeCondition));
        sb.append(',');
        if (sb.charAt((sb.length() - 1)) == ',') {
            sb.setCharAt((sb.length() - 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

}