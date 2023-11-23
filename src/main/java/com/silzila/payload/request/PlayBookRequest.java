package com.silzila.payload.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.databind.JsonNode;

@Getter
@Setter
@ToString
public class PlayBookRequest {

    @NotBlank
    @NotNull
    @JsonProperty(value = "name", required = true)
    private String name;

    private String description;

    @NotBlank
    @NotNull
    @JsonRawValue
    @JsonProperty(value = "content", required = true)
    private JsonNode content;

}
