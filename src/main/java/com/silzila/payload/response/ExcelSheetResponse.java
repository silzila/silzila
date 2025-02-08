package com.silzila.payload.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExcelSheetResponse {
    
    private String fileId;

    private String fileName;

    private List<String> sheetNames;
}
