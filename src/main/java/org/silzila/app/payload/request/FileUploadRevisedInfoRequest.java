package org.silzila.app.payload.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;

@Getter
@Setter
public class FileUploadRevisedInfoRequest {

    private String fileId;
    private String name;
    private String dateFormat;
    private String timestampFormat;
    // private String timestampNTZFormat;
    // private List<String> fieldName;
    // private List<String> dataType;
    private List<FileUploadRevisedColumnInfo> revisedColumnInfos;

    public FileUploadRevisedInfoRequest() {
    }

    public FileUploadRevisedInfoRequest(String fileId, String name,
            String dateFormat, String timestampFormat,
            // String timestampNTZFormat,
            List<FileUploadRevisedColumnInfo> revisedColumnInfos,
            // List<JsonNode> sampleRecords,
            List<String> fieldName, List<String> dataType) {
        this.fileId = fileId;
        this.name = name;
        this.dateFormat = dateFormat;
        this.timestampFormat = timestampFormat;
        // this.timestampNTZFormat = timestampNTZFormat;
        this.revisedColumnInfos = revisedColumnInfos;
        // this.fieldName = fieldName;
        // this.dataType = dataType;
    }

}
