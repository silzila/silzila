package com.silzila.domain.entity;

import com.silzila.domain.base.BaseEntity;
import jakarta.persistence.*;

import javax.validation.constraints.NotBlank;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "dataset")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dataset extends BaseEntity {

    @NotBlank
    @Column(name = "connection_id")
    private String connectionId;

    @NotBlank
    @Column(name = "user_id")
    private String userId;

    @NotBlank
    private String datasetName;

    @NotBlank
    private Boolean isFlatFileData;

    @NotBlank
    @Column(length = 100000)
    private String dataSchema;

    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    @Column(name = "created_by")
    private String createdBy;

    @CreationTimestamp
    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @Column(name = "updated_by")
    private String updatedBy;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}

