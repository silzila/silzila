package com.silzila.payload.request;

import java.io.Serializable;
import java.util.List;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "from",
        "to",
        "anchorDate"
})
@Generated("jsonschema2pojo")
public class RelativeCondition implements Serializable {

    @JsonProperty("from")
    private List<String> from;
    @JsonProperty("to")
    private List<String> to;
    @JsonProperty("anchorDate")
    private String anchorDate;
    private final static long serialVersionUID = -2291273089052560934L;

    /**
     * No args constructor for use in serialization
     *
     */
    public RelativeCondition() {
    }

    /**
     *
     * @param from
     * @param to
     * @param anchorDate
     */
    public RelativeCondition(List<String> from, List<String> to, String anchorDate) {
        super();
        this.from = from;
        this.to = to;
        this.anchorDate = anchorDate;
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
        return "RelativeCondition [from=" + from + ", to=" + to + ", anchorDate=" + anchorDate + "]";
    } 

}
