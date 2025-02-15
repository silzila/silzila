package com.silzila.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import org.json.JSONArray;


import com.silzila.payload.response.FileUploadResponseDuckDb;
import com.silzila.payload.response.MessageResponse;
import com.silzila.service.FileDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.ibm.db2.jcc.am.ca;
import com.silzila.dto.FileDataDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.ExpectationFailedException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.CalculatedFieldRequest;
import com.silzila.payload.request.FileUploadRevisedInfoRequest;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
// @RequestMapping("/api")
public class FileDataController {

    @Autowired
    FileDataService fileDataService;


    @GetMapping("/file-upload-test")
    public ResponseEntity<?> protectedRoute(@RequestHeader Map<String, String> reqHeder) {
        return ResponseEntity.ok(new MessageResponse("file upload test protected route!"));
    }

    // step 1:
    // upload CSV File
    @PostMapping("/file-upload")
    public ResponseEntity<?> fileUpload(@RequestParam("file") MultipartFile file,
            @RequestParam(name = "sheetName", required = false) String sheetName) throws ExpectationFailedException,
            IOException, SQLException, ClassNotFoundException {
        // calling Service function

        FileUploadResponseDuckDb fileUploadResponse = fileDataService.fileUpload(file, sheetName);
        return ResponseEntity.status(HttpStatus.OK).body(fileUploadResponse);

    }

    // step 2:
    // (this step can be repeated by user
    // until user is satisfied with col data types & col names)
    // edit schema of upload file
    @PostMapping("/file-upload-change-schema")
    public ResponseEntity<?> fileUploadChangeSchema(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody FileUploadRevisedInfoRequest revisedInfoRequest,@RequestParam String workspaceId)
            throws JsonMappingException, JsonProcessingException, BadRequestException, ClassNotFoundException,
            SQLException, ExpectationFailedException {
        // get the requester user Id
        String userId = reqHeader.get("username");
        // calling Service function
        JSONArray jsonArray = fileDataService.fileUploadChangeSchema(revisedInfoRequest,workspaceId, userId);
        return ResponseEntity.status(HttpStatus.OK).body(jsonArray.toString());
    }

    // step 3:
    // save file data
    @PostMapping("/file-upload-save-data")
    public ResponseEntity<?> fileUploadSaveData(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody FileUploadRevisedInfoRequest revisedInfoRequest,@RequestParam String workspaceId)
            throws JsonMappingException, JsonProcessingException, BadRequestException, ClassNotFoundException,
            SQLException, ExpectationFailedException {
        // get the requester user Id
        String userId = reqHeader.get("username");
        // calling Service function
        FileDataDTO fileDataDTO = fileDataService.fileUploadSave(revisedInfoRequest, userId,workspaceId);
        return ResponseEntity.status(HttpStatus.OK).body(fileDataDTO);
    }

    // list file datas
    @GetMapping("/file-data")
    public List<FileDataDTO> getAllFileDatas(@RequestHeader Map<String, String> reqHeader
    ,@RequestParam String workspaceId)throws BadRequestException {
        // get the requester user Id
        String userId = reqHeader.get("username");
        List<FileDataDTO> fileDataDTOs = fileDataService.getAllFileDatas(userId,workspaceId);
        return fileDataDTOs;
    }

    // file data - sample records
    @PostMapping("/file-data-sample-records")
    public ResponseEntity<?> getSampleRecords(@RequestHeader Map<String, String> reqHeader,
                                              @RequestParam(value = "flatfileId",required = false) String flatfileId,
                                              @RequestParam(value = "datasetId",required = false) String datasetId,
                                              @RequestParam String workspaceId,
                                              @RequestParam(name = "tableId",required = false) String tableId,
                                              @RequestParam(name = "table",required = false) String tableName,
                                               @RequestBody(required = false) List<List<CalculatedFieldRequest>> calculatedFieldRequests
            )
            throws JsonMappingException, JsonProcessingException,
            RecordNotFoundException, BadRequestException, ClassNotFoundException, SQLException {
        // get the requester user Id
        String userId = reqHeader.get("username");
        JSONArray jsonArray = fileDataService.getSampleRecords(flatfileId, userId,datasetId,workspaceId,tableName,tableId,calculatedFieldRequests);
        return ResponseEntity.status(HttpStatus.OK).body(jsonArray.toString());
    }

    // file data - Column details
    @GetMapping("/file-data-column-details/{id}")
    public ResponseEntity<?> getColumnDetails(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id,@RequestParam String workspaceId) throws JsonMappingException, JsonProcessingException,
            RecordNotFoundException, BadRequestException, ClassNotFoundException, SQLException {
        // get the requester user Id
        String userId = reqHeader.get("username");
        List<Map<String, Object>> metaList = fileDataService.getColumns(id, userId,workspaceId);
        return ResponseEntity.status(HttpStatus.OK).body(metaList);
    }

    // Delete File Data
    @DeleteMapping("/file-data/{id}")
    public ResponseEntity<?> deleteFileData(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id, @RequestParam(required = false) String workspaceId) throws RecordNotFoundException ,BadRequestException {
        // get the requester user Id
        String userId = reqHeader.get("username");
        fileDataService.deleteFileData(id, userId,workspaceId);
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("File Data is deleted"));

    }

    @PostMapping("/file-upload-excel-sheetname")
    public ResponseEntity<?> allSheets(@RequestParam("file") MultipartFile file,
    @RequestHeader Map<String, String> reqHeader)throws BadRequestException {
        String userId = reqHeader.get("username");
        return ResponseEntity.status(HttpStatus.OK).body(fileDataService.getAllSheetNames(file,userId));
    }

    @PostMapping("/file-upload-excel")
    public ResponseEntity<?> fileUploadExcel(@RequestHeader Map<String, String> reqHeader,
    @RequestParam(name = "fileId", required = true) String fileId,
    @RequestParam(name = "fileName", required = true) String fileName,
    @RequestParam(name = "sheetName", required = true) String sheetName,
    @RequestParam(name = "limit", required = false) Integer recordCount) throws ClassNotFoundException, IOException, ExpectationFailedException, SQLException {
        String userId = reqHeader.get("username");
        return ResponseEntity.status(HttpStatus.OK).body(fileDataService.fileUploadExcel(fileId,fileName, sheetName, userId, recordCount));
    }

}
