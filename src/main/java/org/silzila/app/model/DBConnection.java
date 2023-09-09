package org.silzila.app.model;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import org.hibernate.annotations.GenericGenerator;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "db_connection")

public class DBConnection {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @NotBlank
    @Column(name = "user_id")
    private String userId;

    @NotBlank
    @Size(max = 100)
    private String vendor;

    @NotBlank
    @Size(max = 255)
    private String server;

    @NotBlank
    private Integer port;

    @NotBlank
    @Size(max = 255)
    private String database;

    @NotBlank
    @Size(max = 255)
    private String username;

    @NotBlank
    @Size(max = 255)
    private String salt;

    @NotBlank
    @Size(max = 255)
    @Column(name = "password_hash")
    private String passwordHash;

    @NotBlank
    @Size(max = 255)
    @Column(name = "connection_name")
    private String connectionName;

    @Size(max = 255)
    private String httpPath;

    @Size(max = 255)
    private String projectId;

    @Size(max = 255)
    private String clientEmail;

    @Size(max = 255)
    private String fileName;

    public DBConnection() {

    }

    public DBConnection(@NotBlank String userId, @NotBlank @Size(max = 100) String vendor,
            @NotBlank @Size(max = 255) String server, @NotBlank Integer port,
            @NotBlank @Size(max = 255) String database, @NotBlank @Size(max = 255) String username,
            @NotBlank @Size(max = 255) String salt, @NotBlank @Size(max = 255) String passwordHash,
            @NotBlank @Size(max = 255) String connectionName,
            @Size(max = 255) String httpPath,
            @Size(max = 255) String projectId, @Size(max = 255) String clientEmail, @Size(max = 255) String fileName) {
        this.userId = userId;
        this.vendor = vendor;
        this.server = server;
        this.port = port;
        this.database = database;
        this.username = username;
        this.salt = salt;
        this.passwordHash = passwordHash;
        this.connectionName = connectionName;
        this.httpPath = httpPath;
        this.projectId = projectId;
        this.clientEmail = clientEmail;
        this.fileName = fileName;
    }

  

}
