package com.silzila.dto;

import com.silzila.payload.request.DataSchema;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Data
public class DatasetDTO {

    private String id;

    private String connectionId;

    private String datasetName;

    private Boolean isFlatFileData;

    private DataSchema dataSchema;

    public DatasetDTO() {

    }

    public DatasetDTO(String id, String connectionId, String datasetName, Boolean isFlatFileData,
            DataSchema dataSchema) {
        this.id = id;
        this.connectionId = connectionId;
        this.datasetName = datasetName;
        this.isFlatFileData = isFlatFileData;
        this.dataSchema = dataSchema;
    }

}
