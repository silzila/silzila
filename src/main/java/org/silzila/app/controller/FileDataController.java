package org.silzila.app.controller;

import org.silzila.app.exception.ExpectationFailedException;
import org.silzila.app.payload.response.MessageResponse;
import org.silzila.app.service.FileDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class FileDataController {

    @Autowired
    FileDataService fileDataService;

    @PostMapping("/file-data")
    public ResponseEntity<?> uploadFileData(@RequestParam("file") MultipartFile file)
            throws ExpectationFailedException {

        fileDataService.uploadFileData(file);
        return ResponseEntity.ok().body(new MessageResponse("OKK"));

    }
}
