package com.silzila.payload.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FileUploadRevisedInfoRequestForExcel {

    private String fileId;
    private String name;
    // private String timestampNTZFormat;
    // private List<String> fieldName;
    // private List<String> dataType;
   // private List<FileUploadRevisedColumnInfo> revisedColumnInfos;

}