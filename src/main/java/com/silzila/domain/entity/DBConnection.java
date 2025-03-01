package com.silzila.domain.entity;

import com.silzila.domain.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
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
    @Column(name = "keystore_fileName")
    private String keystoreFileName;
    @Column(name = "keystore_password")
    private String keystorePassword;
    @Column(name = "truststore_fileName")
    private String truststoreFileName;
    @Column(name = "truststore_password")
    private String truststorePassword;
    @Column(name = "warehouse")
    private String warehouse;
    @Column(name = "region")
    private String region;
    @Column(name = "s3Location")
    private String s3Location;

    @ManyToOne
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Column(name = "created_by")
    private String createdBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_by")
    private String updatedBy;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;


}
