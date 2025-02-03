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
public class Condition {
    @JsonProperty("leftOperand")
    private List<String> leftOperand;

    @JsonProperty("leftOperandType")
    private List<String> leftOperandType;

    @JsonProperty("operator")
    private String operator;

    @JsonProperty("rightOperand")
    private List<String> rightOperand;

    @JsonProperty("rightOperandType")
    private List<String> rightOperandType;

    @JsonProperty("shouldExclude")
    private Boolean shouldExclude = false;

    @JsonProperty("timeGrain")
    private String timeGrain;

    @JsonProperty("isTillDate")
    private Boolean isTillDate = false;

    @JsonProperty("relativeCondition")
    private RelativeCondition relativeCondition = null;

}
