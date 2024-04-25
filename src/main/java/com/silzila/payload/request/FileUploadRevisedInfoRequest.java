package com.silzila.payload.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FileUploadRevisedInfoRequest {

    private String fileId;
    private String name;
    private String dateFormat = "";
    private String timestampFormat="";
    private String fileType;
    private String sheetName="";
    // private String timestampNTZFormat;
    // private List<String> fieldName;
    // private List<String> dataType;
    private List<FileUploadRevisedColumnInfo> revisedColumnInfos = null;

//    public FileUploadRevisedInfoRequest() {
//    }
//
//    public FileUploadRevisedInfoRequest(String fileId, String name,
//            String dateFormat, String timestampFormat,
//            // String timestampNTZFormat,
//            List<FileUploadRevisedColumnInfo> revisedColumnInfos,
//            // List<JsonNode> sampleRecords,
//            List<String> fieldName, List<String> dataType) {
//        this.fileId = fileId;
//        this.name = name;
//        this.dateFormat = dateFormat;
//        this.timestampFormat = timestampFormat;
//        // this.timestampNTZFormat = timestampNTZFormat;
//        this.revisedColumnInfos = revisedColumnInfos;
//        // this.fieldName = fieldName;
//        // this.dataType = dataType;
//    }

}
