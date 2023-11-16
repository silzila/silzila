package com.silzila.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;

@Getter
@Setter
public class FileUploadResponse {

    private String fileId;
    private String name;
    private List<FileUploadColumnInfo> columnInfos;
    private List<JsonNode> sampleRecords;

    public FileUploadResponse() {
    }

    public FileUploadResponse(String fileId, String name, List<FileUploadColumnInfo> columnInfos,
            List<JsonNode> sampleRecords) {
        this.fileId = fileId;
        this.name = name;
        this.columnInfos = columnInfos;
        this.sampleRecords = sampleRecords;
    }

}
