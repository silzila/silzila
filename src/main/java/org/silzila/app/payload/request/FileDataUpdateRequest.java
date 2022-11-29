package org.silzila.app.payload.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;

@Getter
@Setter
public class FileDataUpdateRequest {

    private String id;
    private String name;
    private List<FileUploadRevisedColumnInfo> revisedColumnInfos;

    public FileDataUpdateRequest() {
    }

    public FileDataUpdateRequest(String id, String name,
            List<FileUploadRevisedColumnInfo> revisedColumnInfos,
            List<JsonNode> sampleRecords) {
        this.id = id;
        this.name = name;
        this.revisedColumnInfos = revisedColumnInfos;
    }

}
