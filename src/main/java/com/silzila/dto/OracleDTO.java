package com.silzila.dto;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OracleDTO {
    @JsonProperty("connectionName")
    private String connectionName;

    @JsonProperty("Vendor")
    private String vendor;

    @JsonProperty("host")
    private String host;

    @JsonProperty("port")
    private String port;

    @JsonProperty("serviceName")
    private String serviceName;

    @JsonProperty("keystore")
    private MultipartFile keystore;

    @JsonProperty("keystorePassword")
    private String keystorePassword;

    @JsonProperty("truststore")
    private MultipartFile truststore;

    @JsonProperty("truststorePassword")
    private String truststorePassword;

    @JsonProperty("username")
    private String username;

    @JsonProperty("password")
    private String password;

    @JsonProperty("keyStore_fileName")
    private String keyStoreStringFileName;

    @JsonProperty("trustStore_fileName")
    private String trustStoreStringFileName;
}
