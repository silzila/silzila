package com.silzila.payload.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Getter
@Setter
@ToString
public class DBConnectionRequest {
    @NotBlank
    @Size(max = 100)
    private String vendor;

    @NotBlank
    @Size(max = 255)
    private String server;

    private Integer port;
    @NotBlank
    @Size(max = 255)

    private String database;
    @NotBlank
    @Size(max = 255)

    private String username;
    @NotBlank
    @Size(max = 255)
    private String password;

    @Size(max = 255)
    private String httpPath;

    @NotBlank
    @Size(max = 255)
    private String connectionName;
}
