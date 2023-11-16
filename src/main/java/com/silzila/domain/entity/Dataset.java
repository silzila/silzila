package com.silzila.domain.entity;

import com.silzila.domain.base.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import javax.validation.constraints.NotBlank;

import lombok.*;

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

}
