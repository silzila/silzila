package com.silzila.payload.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

// import org.json.JSONObject;

// import com.fasterxml.jackson.databind.JsonNode;

@Getter
@Setter
public class FileUploadResponseDuckDb {
	@JsonProperty
    private String fileId;
	@JsonProperty
    private String name;
	@JsonProperty
    private List<Map<String, Object>> columnInfos;
	@JsonProperty
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
