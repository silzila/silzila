package org.silzila.app.service;

import org.silzila.app.exception.ExpectationFailedException;
import org.silzila.app.payload.request.FileUploadRevisedColumnInfo;
import org.silzila.app.payload.request.FileUploadRevisedInfoRequest;
import org.silzila.app.payload.response.FileUploadResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileDataService {

    @Autowired
    SparkService sparkService;

    // all uploads are initially saved in tmp
    final String SILZILA_DIR = System.getProperty("user.home") + "/" + "silzila-uploads";

    // upload File Data
    public FileUploadResponse uploadFile(MultipartFile file)
            throws ExpectationFailedException, JsonMappingException, JsonProcessingException {
        Path path = Paths.get(SILZILA_DIR, "tmp");
        String uploadedFileNameWithoutExtn = "";
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
            uploadedFileNameWithoutExtn = file.getOriginalFilename().substring(0,
                    file.getOriginalFilename().lastIndexOf("."));
            // persisting file
            Files.copy(file.getInputStream(), path.resolve(savedFileName));
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }

        // Open file in spark to get metadata
        // first, start spark session
        sparkService.startSparkSession();
        // calling spark service function,
        // this will have sample records & column name and type
        FileUploadResponse fileUploadResponse = sparkService.readFile(savedFileName);

        // also pass file name & dataframe name to the response
        fileUploadResponse.setFileId(savedFileName);
        fileUploadResponse.setFileDataName(uploadedFileNameWithoutExtn);
        return fileUploadResponse;
    }

    // set schema for uploaded file
    public void fileDataSave(FileUploadRevisedInfoRequest revisedInfoRequest, String userId) {
        String filePath = SILZILA_DIR + "/tmp/" + revisedInfoRequest.getFileId();
        String query = "";
        String alias = "";
        List<String> columnList = new ArrayList<>();

        for (int i = 0; i < revisedInfoRequest.getRevisedColumnInfos().size(); i++) {
            FileUploadRevisedColumnInfo col = revisedInfoRequest.getRevisedColumnInfos().get(i);

            String colString = "";

            // data type conversion
            if (Objects.isNull(col.getNewDataType())) {
                colString = "`" + col.getFieldName() + "`";
            } else if (!Objects.isNull(col.getNewDataType())) {
                System.out.println("------ " + col.getNewDataType().name());
                if (col.getNewDataType().name().equals("BOOLEAN")) {
                    colString = "BOOLEAN(`" + col.getFieldName() + "`)";
                } else if (col.getNewDataType().name().equals("INTEGER")) {
                    colString = "INTEGER(`" + col.getFieldName() + "`)";
                } else if (col.getNewDataType().name().equals("STRING")) {
                    colString = "STRING(`" + col.getFieldName() + "`)";
                } else if (col.getNewDataType().name().equals("DECIMAL")) {
                    colString = "DECIMAL(`" + col.getFieldName() + "`)";
                } else if (col.getNewDataType().name().equals("DATE")) {
                    if (!Objects.isNull(col.getFormat())) {
                        colString = "TO_DATE(`" + col.getFieldName() + "`, '" + col.getFormat() + "')";
                    } else {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Error: Date conversion needs date format for the column: " + col.getFieldName() + "!");
                    }
                } else if (col.getNewDataType().name().equals("TIMESTAMP")) {
                    if (!Objects.isNull(col.getFormat())) {
                        colString = "TO_TIMESTAMP(`" + col.getFieldName() + "`, '" + col.getFormat() + "')";
                    } else {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Error: Timestamp conversion needs Timestamp format for the column: "
                                        + col.getFieldName()
                                        + "!");
                    }
                }
            }

            // Alias
            if (!Objects.isNull(col.getNewFieldName())) {
                alias = "`" + col.getNewFieldName() + "`";
            } else {
                alias = "`" + col.getFieldName() + "`";
            }

            String colWithAlias = colString + " AS " + alias;
            columnList.add(colWithAlias);
        }

        query = "SELECT \n\t" + columnList.stream().collect(Collectors.joining(",\n\t"));
        System.out.println("Query ========================== \n" + query);
        // first, start spark session
        sparkService.startSparkSession();
        sparkService.savefileData();

    }

}
