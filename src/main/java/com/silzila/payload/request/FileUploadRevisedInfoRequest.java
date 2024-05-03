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
    private String timestampFormat = "";
    private String fileType;
    private String sheetName = "";
    private List<FileUploadRevisedColumnInfo> revisedColumnInfos = null;

}