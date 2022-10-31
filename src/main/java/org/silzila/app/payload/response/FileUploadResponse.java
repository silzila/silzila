package org.silzila.app.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;

@Getter
@Setter
public class FileUploadResponse {

    private String fileId;
    private String fileDataName;
    private Map<String, String> columnDataType;
    private List<JsonNode> sampleRecords;

    public FileUploadResponse() {
    }

    public FileUploadResponse(String fileId, String fileDataName, Map<String, String> columnDataType,
            List<JsonNode> sampleRecords) {
        this.fileId = fileId;
        this.fileDataName = fileDataName;
        this.columnDataType = columnDataType;
        this.sampleRecords = sampleRecords;
    }

}
