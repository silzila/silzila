package com.silzila.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Data
public class FileDataDTO {

    private String id;

    private String userId;

    private String name;

    public FileDataDTO() {
    }

    public FileDataDTO(String id, String userId, String name) {
        this.id = id;
        this.userId = userId;
        this.name = name;
    }

}
