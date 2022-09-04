package org.silzila.app.dto;

import org.silzila.app.payload.request.DataSchema;

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

    private String dataSetName;

    private Boolean isFlatFileData;

    private DataSchema dataSchema;

    public DatasetDTO(String id, String connectionId, String dataSetName, Boolean isFlatFileData,
            DataSchema dataSchema) {
        this.id = id;
        this.connectionId = connectionId;
        this.dataSetName = dataSetName;
        this.isFlatFileData = isFlatFileData;
        this.dataSchema = dataSchema;
    }

}
