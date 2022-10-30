package org.silzila.app.service;

import org.silzila.app.exception.ExpectationFailedException;
import org.silzila.app.payload.response.FileUploadResponse;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileDataService {

    @Autowired
    SparkService sparkService;

    // upload File Data
    public FileUploadResponse uploadFileData(MultipartFile file)
            throws ExpectationFailedException, JsonMappingException, JsonProcessingException {
        // all uploads are saved in tmp
        final String dir = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp";
        Path path = Paths.get(dir);
        String uploadedFileNameNoExtn = "";
        String savedFileName = "";

        // TODO: create tmp folder - can be moved into main function as one time call.
        // create tmp folder
        try {
            Files.createDirectories(path);

        } catch (Exception e) {
            throw new RuntimeException("Could not initialize folder for upload. Errorr: " + e.getMessage());
        }
        // only CSV file is allowed and throws error if otherwise
        if (!(file.getContentType() == null || file.getContentType().equals("text/csv"))) {
            throw new ExpectationFailedException("Error: Only CSV file is allowed!");
        }
        // upload file
        try {
            // rename to random id while saving file
            savedFileName = UUID.randomUUID().toString();
            // trim file name without file extension - used for naming data frame
            uploadedFileNameNoExtn = file.getOriginalFilename().substring(0,
                    file.getOriginalFilename().lastIndexOf("."));
            // persisting file
            Files.copy(file.getInputStream(), path.resolve(savedFileName));
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }

        // Open file in spark to get metadata
        // first, start spark session
        sparkService.startSparkSession();
        // calling spark service function
        FileUploadResponse fileUploadResponse = sparkService.readCsvFile(savedFileName);

        // pass file name & dataframe name to the response
        fileUploadResponse.setFileId(savedFileName);
        fileUploadResponse.setFileDataName(uploadedFileNameNoExtn);
        return fileUploadResponse;
    }

}
