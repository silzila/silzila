package com.silzila.payload.response;

import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.databind.JsonNode;

@Getter
@Setter
public class PlayBookResponse {

    private String id;

    private String userId;

    private String name;

    private String description;

    private JsonNode content;

    public PlayBookResponse(String id, String userId, String name, String description, JsonNode content) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.content = content;
    }

}
