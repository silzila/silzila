package com.silzila.dto;


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
public class CalculatedFieldDTO {
    
    private String query;
    private String datatype;
    private Boolean isAggregated = false;
}
