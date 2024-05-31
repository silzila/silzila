package com.silzila.domain.entity;

import com.silzila.domain.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import javax.validation.constraints.NotBlank;


@Entity
@Table(name = "custom_query_list")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CustomTable extends BaseEntity {

    @NotBlank
    @Column(name = "custom_query_id")
    private String customQueryId;

    @NotBlank
    @Column(name = "query")
    private String query;

}
