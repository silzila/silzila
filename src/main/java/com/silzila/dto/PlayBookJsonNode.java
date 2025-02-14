package com.silzila.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PlayBookJsonNode {


    private String id;
    
    private String userId;

    private String name;

    private String description;

    private Object content;
}
