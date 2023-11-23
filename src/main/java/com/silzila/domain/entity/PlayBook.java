package com.silzila.domain.entity;

import com.silzila.domain.base.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.Type;

import jakarta.persistence.Convert;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonRawValue;

import lombok.*;

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

}
