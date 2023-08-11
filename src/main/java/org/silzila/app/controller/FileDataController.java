package org.silzila.app.controller;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.json.JSONArray;
import org.silzila.app.dto.FileDataDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.ExpectationFailedException;
import org.silzila.app.exception.RecordNotFoundException;
import org.silzila.app.payload.request.FileUploadRevisedInfoRequest;
import org.silzila.app.payload.response.FileUploadColumnInfo;
import org.silzila.app.payload.response.FileUploadResponse;
import org.silzila.app.payload.response.FileUploadResponseDuckDb;
import org.silzila.app.payload.response.MessageResponse;
import org.silzila.app.service.FileDataService;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class FileDataController {

    @Autowired
    FileDataService fileDataService;

    // step 1:
    // upload CSV File
    @PostMapping("/file-upload")
    public ResponseEntity<?> fileUpload(
            @RequestParam("file") MultipartFile file)
            throws ExpectationFailedException, JsonMappingException, JsonProcessingException, SQLException,
            ClassNotFoundException {
        // calling Service function
        FileUploadResponseDuckDb fileUploadResponse = fileDataService.fileUpload(file);
        return ResponseEntity.status(HttpStatus.OK).body(fileUploadResponse);

    }

    // step 2:
    // (this step can be repeated by user
    // until user is satisfied with col data types & col names)
    // edit schema of upload file
    @PostMapping("/file-upload-change-schema")
    public ResponseEntity<?> fileUploadChangeSchema(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody FileUploadRevisedInfoRequest revisedInfoRequest)
            throws JsonMappingException, JsonProcessingException, BadRequestException, ClassNotFoundException,
            SQLException {
        // get the requester user Id
        String userId = reqHeader.get("requesterUserId");
        // calling Service function
        JSONArray jsonArray = fileDataService.fileUploadChangeSchema(revisedInfoRequest, userId);
        return ResponseEntity.status(HttpStatus.OK).body(jsonArray.toString());
    }

    // step 3:
    // save file data
    @PostMapping("/file-upload-save-data")
    public ResponseEntity<?> fileUploadSaveData(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody FileUploadRevisedInfoRequest revisedInfoRequest)
            throws JsonMappingException, JsonProcessingException, BadRequestException, ClassNotFoundException,
            SQLException {
        // get the requester user Id
        String userId = reqHeader.get("requesterUserId");
        // calling Service function
        FileDataDTO fileDataDTO = fileDataService.fileUploadSave(revisedInfoRequest, userId);
        return ResponseEntity.status(HttpStatus.OK).body(fileDataDTO);
    }

    // list file datas
    @GetMapping("/file-data")
    public List<FileDataDTO> getAllFileDatas(@RequestHeader Map<String, String> reqHeader) {
        // get the requester user Id
        String userId = reqHeader.get("requesterUserId");
        List<FileDataDTO> fileDataDTOs = fileDataService.getAllFileDatas(userId);
        return fileDataDTOs;
    }

    // file data - sample records
    @GetMapping("/file-data-sample-records/{id}")
    public ResponseEntity<?> getSampleRecords(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id)
            throws JsonMappingException, JsonProcessingException, RecordNotFoundException, BadRequestException,
            ClassNotFoundException, SQLException {
        // get the requester user Id
        String userId = reqHeader.get("requesterUserId");
        JSONArray jsonArray = fileDataService.getSampleRecords(id, userId);
        return ResponseEntity.status(HttpStatus.OK).body(jsonArray.toString());
    }

    // file data - Column details
    @GetMapping("/file-data-column-details/{id}")
    public ResponseEntity<?> getColumnDetails(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id)
            throws JsonMappingException, JsonProcessingException, RecordNotFoundException, BadRequestException,
            ClassNotFoundException, SQLException {
        // get the requester user Id
        String userId = reqHeader.get("requesterUserId");
        List<Map<String, Object>> metaList = fileDataService.getColumns(id, userId);
        return ResponseEntity.status(HttpStatus.OK).body(metaList);
    }

    // Delete File Data
    @DeleteMapping("/file-data/{id}")
    public ResponseEntity<?> deleteFileData(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id) throws RecordNotFoundException {
        // get the requester user Id
        String userId = reqHeader.get("requesterUserId");
        fileDataService.deleteFileData(id, userId);
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("File Data is deleted"));

    }

}
