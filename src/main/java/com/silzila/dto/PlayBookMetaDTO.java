package com.silzila.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Data
public class PlayBookMetaDTO {

    private String id;
    private String userId;
    private String name;
    private Object description;

    public PlayBookMetaDTO(String id, String userId, String name, Object description) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.description = description;
    }

}
