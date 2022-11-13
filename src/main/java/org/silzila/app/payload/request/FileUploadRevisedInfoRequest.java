package org.silzila.app.payload.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;

@Getter
@Setter
public class FileUploadRevisedInfoRequest {

    private String fileId;
    private String fileDataName;
    private List<FileUploadRevisedColumnInfo> revisedColumnInfos;

    public FileUploadRevisedInfoRequest() {
    }

    public FileUploadRevisedInfoRequest(String fileId, String fileDataName,
            List<FileUploadRevisedColumnInfo> revisedColumnInfos,
            List<JsonNode> sampleRecords) {
        this.fileId = fileId;
        this.fileDataName = fileDataName;
        this.revisedColumnInfos = revisedColumnInfos;
    }

}
