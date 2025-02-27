package com.silzila.payload.internals;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ConditionType {

    private String leftOperandType = "field";

    private String rightOperandType = "static";
}
