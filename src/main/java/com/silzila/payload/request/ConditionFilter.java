package com.silzila.payload.request;


import com.fasterxml.jackson.annotation.JsonProperty;

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
public class ConditionFilter {
    @JsonProperty("shouldAllConditionsMatch")
    private Boolean shouldAllConditionsMatch;
    @JsonProperty("conditions")
    private List<Condition> conditions;

}
