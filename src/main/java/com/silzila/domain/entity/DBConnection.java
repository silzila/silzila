package com.silzila.domain.entity;

import com.silzila.domain.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "db_connection")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DBConnection extends BaseEntity {

    private static final long serialVersionUID = 2353528370345499176L;

    @Column(name = "user_id")
    private String userId;
    @Column(name = "vendor")
    private String vendor;
    @Column(name = "server")
    private String server;
    @Column(name = "port")
    private Integer port;
    @Column(name = "database")
    private String database;
    @Column(name = "username")
    private String username;
    @Column(name = "salt")
    private String salt;
    @Column(name = "password_hash", length = 5000)
    private String passwordHash;
    @Column(name = "connectionName")
    private String connectionName;
    @Column(name = "http_path")
    private String httpPath;
    @Column(name = "project_id")
    private String projectId;
    @Column(name = "client_email")
    private String clientEmail;
    @Column(name = "file_name")
    private String fileName;
    @Column(name = "token", length = 5000)
    private String token;
}
