package org.silzila.app.service;

import org.silzila.app.dto.FileDataDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.ExpectationFailedException;
import org.silzila.app.exception.RecordNotFoundException;
import org.silzila.app.model.FileData;
import org.silzila.app.payload.request.FileUploadRevisedColumnInfo;
import org.silzila.app.payload.request.FileUploadRevisedInfoRequest;
import org.silzila.app.payload.response.FileUploadColumnInfo;
import org.silzila.app.payload.response.FileUploadResponse;
import org.silzila.app.repository.FileDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileDataService {

    @Autowired
    SparkService sparkService;

    @Autowired
    FileDataRepository fileDataRepository;

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
        fileUploadResponse.setName(uploadedFileNameWithoutExtn);
        return fileUploadResponse;
    }

    // helper function to build query from revised columns for meta data changes
    // like change of data type or column name
    public String buildQueryWithChangeSchema(FileUploadRevisedInfoRequest revisedInfoRequest) {
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
        return query;
    }

    // update schema for uploaded file
    public List<JsonNode> fileDataChangeSchema(FileUploadRevisedInfoRequest revisedInfoRequest, String userId)
            throws JsonMappingException, JsonProcessingException {

        // construct query by using helper function
        String query = buildQueryWithChangeSchema(revisedInfoRequest);

        // first, start spark session
        sparkService.startSparkSession();
        List<JsonNode> jsonNodes = sparkService.changeSchema(revisedInfoRequest.getFileId(), query);
        return jsonNodes;
    }

    // persist uploaded file (with/witout changed schema) as parquet file to disk
    // Steps: read uploaded file + change metadata if needed
    // + save the data as Parquet file + delete uploaded file
    public FileDataDTO saveFileData(FileUploadRevisedInfoRequest revisedInfoRequest, String userId)
            throws JsonMappingException, JsonProcessingException, BadRequestException {

        // check if file data name is already taken
        List<FileData> fileDatas = fileDataRepository.findByUserIdAndName(
                userId, revisedInfoRequest.getName());
        if (!fileDatas.isEmpty()) {
            throw new BadRequestException("Error: File Data Name is already taken!");
        }

        // construct query by using helper function
        String query = buildQueryWithChangeSchema(revisedInfoRequest);

        // if not exists, create folder for user - to save file
        Path path = Paths.get(SILZILA_DIR, userId);
        try {
            Files.createDirectories(path);

        } catch (Exception e) {
            throw new RuntimeException("Could not initialize folder for upload. Errorr: " + e.getMessage());
        }

        final String readFile = System.getProperty("user.home") + "/" + "silzila-uploads"
                + "/" + "tmp" + "/" + revisedInfoRequest.getFileId();
        final String writeFile = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + userId + "/"
                + "/" + revisedInfoRequest.getFileId() + ".parquet";

        // first, start spark session
        sparkService.startSparkSession();
        // write to Parquet file
        sparkService.saveFileData(readFile, writeFile, query);

        // save metadata to DB and return as response
        String fileNameToBeSaved = revisedInfoRequest.getFileId() + ".parquet";
        FileData fileData = new FileData(
                userId,
                revisedInfoRequest.getName(),
                fileNameToBeSaved);
        fileDataRepository.save(fileData);

        FileDataDTO fileDataDTO = new FileDataDTO(
                fileData.getId(),
                fileData.getUserId(),
                fileData.getName());

        // delete the read file which was uploaded by user
        try {
            Files.deleteIfExists(Paths.get(readFile));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return fileDataDTO;

    }

    // read all file datas
    public List<FileDataDTO> getAllFileDatas(String userId) {
        // read all file data for the user from DB
        List<FileData> fileDatas = fileDataRepository.findByUserId(userId);
        // re-map to DTO list of object - (to hide file name)
        List<FileDataDTO> fDataDTOs = new ArrayList<>();
        fileDatas.forEach((fd) -> {
            FileDataDTO dto = new FileDataDTO(
                    fd.getId(),
                    fd.getUserId(),
                    fd.getName());
            fDataDTOs.add(dto);
        });
        return fDataDTOs;
    }

    // get sample records
    public List<JsonNode> getSampleRecords(String id, String userId)
            throws RecordNotFoundException, JsonMappingException, JsonProcessingException, BadRequestException {
        // if no file data inside optional wrapper, then send NOT FOUND Error
        Optional<FileData> fdOptional = fileDataRepository.findByIdAndUserId(id, userId);
        if (!fdOptional.isPresent()) {
            throw new RecordNotFoundException("Error: No such File Data Id exists!");
        }
        FileData fileData = fdOptional.get();

        // if file not exists, throw error:
        final String parquetFilePath = System.getProperty("user.home") + "/" + "silzila-uploads"
                + "/" + userId + "/" + fileData.getFileName();
        if (Files.notExists(Paths.get(parquetFilePath))) {
            throw new BadRequestException("Error: File not exists!");
        }

        // first, start spark session
        sparkService.startSparkSession();
        List<JsonNode> jsonNodes = sparkService.getSampleRecords(parquetFilePath);
        return jsonNodes;
    }

    // get sample records
    public List<FileUploadColumnInfo> getColumns(String id, String userId)
            throws RecordNotFoundException, JsonMappingException, JsonProcessingException, BadRequestException {
        // if no file data inside optional wrapper, then send NOT FOUND Error
        Optional<FileData> fdOptional = fileDataRepository.findByIdAndUserId(id, userId);
        if (!fdOptional.isPresent()) {
            throw new RecordNotFoundException("Error: No such File Data Id exists!");
        }
        FileData fileData = fdOptional.get();

        // if file not exists, throw error:
        final String parquetFilePath = System.getProperty("user.home") + "/" + "silzila-uploads"
                + "/" + userId + "/" + fileData.getFileName();
        if (Files.notExists(Paths.get(parquetFilePath))) {
            throw new BadRequestException("Error: File not exists!");
        }

        // first, start spark session
        sparkService.startSparkSession();
        List<FileUploadColumnInfo> columnInfos = sparkService.getColumns(parquetFilePath);
        return columnInfos;
    }

    // Delete File Data
    public void deleteFileData(String id, String userId) throws RecordNotFoundException {
        // if no file data inside optional wrapper, then send NOT FOUND Error
        // meaning if no file id in the DB, send error
        Optional<FileData> fdOptional = fileDataRepository.findByIdAndUserId(id, userId);
        if (!fdOptional.isPresent()) {
            throw new RecordNotFoundException("Error: No such File Data Id exists!");
        }
        FileData fileData = fdOptional.get();

        // delete the Parquet File from file system
        final String parquetFilePath = System.getProperty("user.home") + "/" + "silzila-uploads"
                + "/" + userId + "/" + fileData.getFileName();
        try {
            // if Parquet folder exists then delete contents and the folder
            if (Files.exists(Paths.get(parquetFilePath))) {
                // traverse the folder and delete
                Files.walk(Paths.get(parquetFilePath))
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        // remove the record from DB
        fileDataRepository.deleteById(id);

    }
}
