package org.silzila.app.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.ExpectationFailedException;
import org.silzila.app.model.FileData;
import org.silzila.app.payload.request.FileUploadRevisedInfoRequest;
import org.silzila.app.payload.response.FileUploadResponse;
import org.silzila.app.payload.response.MessageResponse;
import org.silzila.app.service.FileDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file)
            throws ExpectationFailedException, JsonMappingException, JsonProcessingException {
        // calling Service function
        FileUploadResponse fileUploadResponse = fileDataService.uploadFile(file);
        return ResponseEntity.status(HttpStatus.OK).body(fileUploadResponse);

    }

    // step 2:
    // (this step repeats until user is satisfied with col data types & col names)
    // edit schema of upload file
    @PostMapping("/file-upload-change-schema")
    public ResponseEntity<?> changeSchema(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody FileUploadRevisedInfoRequest revisedInfoRequest)
            throws JsonMappingException, JsonProcessingException {
        // get the requester user Id
        String userId = reqHeader.get("requesterUserId");
        // calling Service function
        List<JsonNode> jsonNodes = fileDataService.fileDataChangeSchema(revisedInfoRequest, userId);
        return ResponseEntity.status(HttpStatus.OK).body(jsonNodes);
    }

    // step 3:
    // save file data
    @PostMapping("/file-upload-save-data")
    public ResponseEntity<?> saveData(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody FileUploadRevisedInfoRequest revisedInfoRequest)
            throws JsonMappingException, JsonProcessingException, BadRequestException {
        // get the requester user Id
        String userId = reqHeader.get("requesterUserId");
        // calling Service function
        FileData fileData = fileDataService.saveFileData(revisedInfoRequest, userId);
        return ResponseEntity.status(HttpStatus.OK).body(fileData);
    }

}
