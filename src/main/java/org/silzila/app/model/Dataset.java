package org.silzila.app.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

import org.hibernate.annotations.GenericGenerator;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "dataset")
public class Dataset {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;
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

    public Dataset() {
    }

    public Dataset(String connectionId, @NotBlank String userId, @NotBlank String datasetName,
            @NotBlank Boolean isFlatFileData, @NotBlank String dataSchema) {
        this.connectionId = connectionId;
        this.userId = userId;
        this.datasetName = datasetName;
        this.isFlatFileData = isFlatFileData;
        this.dataSchema = dataSchema;
    }

}
