package org.silzila.app.dto;

import lombok.Data;

@Data
public class DBConnectionDTO {

    private String id;

    private String userId;

    private String vendor;

    private String server;

    private Integer port;

    private String database;

    private String username;

    private String connectionName;

    // httpPath - for databricks
    private String httpPath;

    // projectId, clientEmail & fileName - for BigQuery
    private String projectId;

    private String clientEmail;

    private String fileName;

}
