package com.silzila.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Data
public class DatasetNoSchemaDTO {

    private String id;

    private String connectionId;

    private String datasetName;

    private Boolean isFlatFileData;

    public DatasetNoSchemaDTO() {

    }

    public DatasetNoSchemaDTO(String id, String connectionId, String datasetName, Boolean isFlatFileData) {
        this.id = id;
        this.connectionId = connectionId;
        this.datasetName = datasetName;
        this.isFlatFileData = isFlatFileData;

    }

}
