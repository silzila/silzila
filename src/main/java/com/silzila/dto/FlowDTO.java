package com.silzila.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@Builder
@ToString
public class FlowDTO {

    public FlowDTO(String flow, String dataType) {
        this.flow = flow;
        this.dataType = dataType;
        this.isAggregated = false;
    }

    public FlowDTO(String flow, String dataType, Boolean isAggregated) {
        this.flow = flow;
        this.dataType = dataType;
        this.isAggregated = isAggregated;
    }

    private String flow;
    private String dataType;
    private Boolean isAggregated;
}
