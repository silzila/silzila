package com.silzila.payload.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class TableRelationshipResponse {

    private String table1;

    private String table2;

    private String relationship;

    private Boolean isDirect;
}
