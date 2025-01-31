package com.silzila.payload.request;

import com.databricks.client.jdbc.internal.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Flow {

    @JsonProperty("flow")
    private String flow ;
    @JsonProperty("source")
    private List<String> source;
    @JsonProperty("condition")
    private String condition;
    @JsonProperty("sourceType")
    private List<String> sourceType;
    @JsonProperty("isAggregation")
    private Boolean isAggregation ;
    @JsonProperty("aggregation")
    private List<String> aggregation;
    @JsonProperty("filter")
    private String filter;
}

