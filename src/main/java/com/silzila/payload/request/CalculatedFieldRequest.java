package com.silzila.payload.request;


import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CalculatedFieldRequest {
    @JsonProperty("calculatedFieldName")
    private String calculatedFieldName;
    @JsonProperty("calculatedFieldId")
    private String calculatedFieldId;
    @JsonProperty("isAggregated")
    private Boolean isAggregated = false;
    @JsonProperty("fields")
    private Map<String, Field> fields;
    @JsonProperty("conditionFilters")
    private Map<String, List<ConditionFilter>> conditionFilters;
    @JsonProperty("flows")
    private Map<String, List<Flow>> flows;

    }

