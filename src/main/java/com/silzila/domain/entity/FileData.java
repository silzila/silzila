package com.silzila.domain.entity;

import com.silzila.domain.base.BaseEntity;
import jakarta.persistence.*;

import javax.validation.constraints.NotBlank;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "file_data")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileData extends BaseEntity {

    @NotBlank
    @Column(name = "user_id")
    private String userId;
    @NotBlank
    @Column(name = "name")
    private String name;
    @NotBlank
    @Column(name = "file_name")
    private String fileName;
    @NotBlank
    @Column(name = "salt")
    private String saltValue;

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