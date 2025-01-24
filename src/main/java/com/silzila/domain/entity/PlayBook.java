package com.silzila.domain.entity;

import com.silzila.domain.base.BaseEntity;

import jakarta.persistence.*;

import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonRawValue;

import lombok.*;

import java.time.OffsetDateTime;
import java.util.Set;

@Entity
// @Data
@Table(name = "playbook")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
// @TypeDef(name = "json", typeClass = JsonStringType.class)
public class PlayBook extends BaseEntity {

    @NotBlank
    @Column(name = "user_id")
    private String userId;

    @NotBlank
    @Column(name = "name")
    private String name;

    private String description;

    @NotBlank
    // @Type(JsonStringType.class)
    @JdbcTypeCode(SqlTypes.JSON)
    // @Column(columnDefinition = "json")
    // @JsonRawValue
    private Object content;

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

    @OneToMany(mappedBy = "playbook", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PlayBookLink> playbookLinks;


}
