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
import com.fasterxml.jackson.databind.JsonNode;

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

    // update schema for uploaded file
    public List<JsonNode> fileDataChangeSchema(FileUploadRevisedInfoRequest revisedInfoRequest, String userId)
            throws JsonMappingException, JsonProcessingException {
        String query = "";
        String alias = "";
        List<String> columnList = new ArrayList<>();

        // iterate colummns list to check if any data type or column name change
        for (int i = 0; i < revisedInfoRequest.getRevisedColumnInfos().size(); i++) {
            FileUploadRevisedColumnInfo col = revisedInfoRequest.getRevisedColumnInfos().get(i);

            String colString = "";

            /*
             * data type conversion
             */

            // if not data type change then use column as is
            if (Objects.isNull(col.getNewDataType())) {
                colString = "`" + col.getFieldName() + "`";
            }
            // when new data type is provided
            else if (!Objects.isNull(col.getNewDataType())) {
                if (col.getNewDataType().name().equals("BOOLEAN")) {
                    colString = "BOOLEAN(`" + col.getFieldName() + "`)";
                } else if (col.getNewDataType().name().equals("INTEGER")) {
                    colString = "CAST(`" + col.getFieldName() + "` AS INTEGER)";
                } else if (col.getNewDataType().name().equals("STRING")) {
                    colString = "CAST(`" + col.getFieldName() + "` AS STRING)";
                } else if (col.getNewDataType().name().equals("DECIMAL")) {
                    colString = "CAST(`" + col.getFieldName() + "` AS DOUBLE)";
                } else if (col.getNewDataType().name().equals("DATE")) {
                    // timestamp to date
                    if (col.getDataType().name().equals("TIMESTAMP")) {
                        colString = "CAST(`" + col.getFieldName() + "` AS DATE)";
                    }
                    // other types to date
                    else {
                        if (!Objects.isNull(col.getFormat())) {
                            colString = "TO_DATE(`" + col.getFieldName() + "`, '" + col.getFormat() + "')";
                        } else {
                            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                    "Error: Date conversion needs date format for the column: " + col.getFieldName()
                                            + "!");
                        }
                    }
                } else if (col.getNewDataType().name().equals("TIMESTAMP")) {
                    // date to timestamp
                    if (col.getDataType().name().equals("DATE")) {
                        colString = "CAST(`" + col.getFieldName() + "` AS TIMESTAMP)";
                    }
                    // other types to timestamp
                    else {
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
            }
            /*
             * Alias for column
             * if not alias is given then use column name as alias
             */
            if (!Objects.isNull(col.getNewFieldName())) {
                alias = "`" + col.getNewFieldName() + "`";
            } else {
                alias = "`" + col.getFieldName() + "`";
            }

            String colWithAlias = colString + " AS " + alias;
            columnList.add(colWithAlias);
        }

        query = "SELECT \n\t" + columnList.stream().collect(Collectors.joining(",\n\t"));

        // first, start spark session
        sparkService.startSparkSession();
        List<JsonNode> jsonNodes = sparkService.changeSchema(revisedInfoRequest.getFileId(), query);
        return jsonNodes;
    }
}
