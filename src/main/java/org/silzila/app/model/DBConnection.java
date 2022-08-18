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

    @NotBlank
    @Size(max = 255)
    @Column(name = "connection_name")
    private String connectionName;

    public DBConnection() {

    }

    public DBConnection(@NotBlank String userId, @NotBlank @Size(max = 100) String vendor,
            @NotBlank @Size(max = 255) String server, Integer port, @NotBlank @Size(max = 255) String database,
            @NotBlank @Size(max = 255) String username, @NotBlank @Size(max = 255) String password,
            @NotBlank @Size(max = 255) String connectionName) {
        this.userId = userId;
        this.vendor = vendor;
        this.server = server;
        this.port = port;
        this.database = database;
        this.username = username;
        this.password = password;
        this.connectionName = connectionName;
    }

}
