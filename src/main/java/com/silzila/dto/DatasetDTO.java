package com.silzila.dto;

import com.silzila.payload.request.DataSchema;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Data
public class DatasetDTO {

    private String id;

    private String connectionId;

    private String datasetName;

    private Boolean isFlatFileData;

    private DataSchema dataSchema;

}
