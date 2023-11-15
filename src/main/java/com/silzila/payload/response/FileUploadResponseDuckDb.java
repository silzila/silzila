package com.silzila.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

// import org.json.JSONObject;

// import com.fasterxml.jackson.databind.JsonNode;

@Getter
@Setter
public class FileUploadResponseDuckDb {

    private String fileId;
    private String name;
    private List<Map<String, Object>> columnInfos;
    private List<Map<String, Object>> sampleRecords;

    public FileUploadResponseDuckDb() {
    }

    public FileUploadResponseDuckDb(String fileId, String name, List<Map<String, Object>> columnInfos,
            List<Map<String, Object>> sampleRecords) {
        this.fileId = fileId;
        this.name = name;
        this.columnInfos = columnInfos;
        this.sampleRecords = sampleRecords;
    }
}
