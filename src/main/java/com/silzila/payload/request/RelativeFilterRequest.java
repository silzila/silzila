package com.silzila.payload.request;

import java.io.Serializable;
import java.util.List;

import javax.annotation.Generated;

import com.fasterxml.jackson.annotation.JsonProperty;

@Generated("jsonschema2pojo")
public class RelativeFilterRequest implements Serializable {

    @JsonProperty("filterTable")
    private List<Filter> filterTable;
    @JsonProperty("from")
    private List<String> from;
    @JsonProperty("to")
    private List<String> to;
    @JsonProperty("anchorDate")
    private String anchorDate;

    public RelativeFilterRequest() {
    }

    /**
     * @param filterTable
     * @param from
     * @param to
     * @param anchorDate
     */

    public RelativeFilterRequest(List<Filter> filterTable, List<String> from, List<String> to, String anchorDate) {
        super();
        this.filterTable = filterTable;
        this.from = from;
        this.to = to;
        this.anchorDate = anchorDate;
    }

    @JsonProperty("filterTable")
    public List<Filter> getFilterTable() {
        return filterTable;
    }

    @JsonProperty("filterTable")
    public void setFilterTable(List<Filter> filterTable) {
        this.filterTable = filterTable;
    }

    @JsonProperty("from")
    public List<String> getFrom() {
        return from;
    }

    @JsonProperty("from")
    public void setFrom(List<String> from) {
        this.from = from;
    }

    @JsonProperty("to")
    public List<String> getTo() {
        return to;
    }

    @JsonProperty("to")
    public void setTo(List<String> to) {
        this.to = to;
    }

    @JsonProperty("anchorDate")
    public String getAnchorDate() {
        return anchorDate;
    }
        
    @JsonProperty("anchorDate")
    public void setAnchorDate(String anchorDate) {
        this.anchorDate = anchorDate;   
    }

    @Override
    public String toString() {
        return "RelativeFilterRequest [filterTable=" + filterTable + ", from=" + from + ", to=" + to + ", anchorDate="
                + anchorDate + "]";
    }
        
}
