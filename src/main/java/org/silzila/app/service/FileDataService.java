package org.silzila.app.service;

import org.silzila.app.exception.ExpectationFailedException;
import org.silzila.app.payload.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.time.LocalDateTime;

import org.apache.spark.sql.SparkSession;
import org.apache.spark.storage.StorageUtils;

@Service
public class FileDataService {

    @Autowired
    SparkService sparkService;

    // upload File Data
    public void uploadFileData(MultipartFile file) throws ExpectationFailedException {
        String dir = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp";
        Path path = Paths.get(dir);
        String fileName = "";

        // create tmp folder
        try {
            Files.createDirectories(path);

        } catch (Exception e) {
            throw new RuntimeException("Could not initialize folder for upload. Errorr: " + e.getMessage());
        }

        // upload file
        if (!(file.getContentType() == null || file.getContentType().equals("text/csv"))) {
            throw new ExpectationFailedException("Error: Only CSV file is allowed!");
        }
        try {
            fileName = LocalDateTime.now().toString() + "__" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), path.resolve(fileName));
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }

        System.out.println("new file name =============" + fileName);
        sparkService.startSparkSession();
        sparkService.readCsvFile(fileName);

        // System.out.println("starting spark =============");
        // SparkSession spark =
        // SparkSession.builder().master("local").appName("silzila_spark_session").getOrCreate();

        // System.out.println("stopping spark =============");
        // spark.close();
    }

}
