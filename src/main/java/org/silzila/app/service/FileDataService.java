package org.silzila.app.service;

import org.json.JSONArray;
import org.silzila.app.dto.FileDataDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.ExpectationFailedException;
import org.silzila.app.exception.RecordNotFoundException;
import org.silzila.app.helper.ConvertDuckDbDataType;
import org.silzila.app.model.FileData;
import org.silzila.app.payload.request.FileUploadRevisedColumnInfo;
import org.silzila.app.payload.request.FileUploadRevisedInfoRequest;
import org.silzila.app.payload.request.Table;
import org.silzila.app.payload.response.FileUploadResponseDuckDb;
import org.silzila.app.repository.FileDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class FileDataService {

    public static HashMap<String, ArrayList<FileData>> usersFileDatas = new HashMap<String, ArrayList<FileData>>();

    @Autowired
    DuckDbService duckDbService;

    @Autowired
    FileDataRepository fileDataRepository;

    // all uploads are initially saved in tmp
    final String SILZILA_DIR = System.getProperty("user.home") + "/" + "silzila-uploads";

    // 1. upload File Data
    public FileUploadResponseDuckDb fileUpload(MultipartFile file)
            throws ExpectationFailedException, JsonMappingException, JsonProcessingException, SQLException,
            ClassNotFoundException {
        Path path = Paths.get(SILZILA_DIR, "tmp");
        String uploadedFileNameWithoutExtn = "";
        String savedFileName = "";

        // TODO: creating tmp folder - can be moved into main function as one time call.
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
            savedFileName = UUID.randomUUID().toString().substring(0, 8);
            // trim file name without file extension - used for naming data frame
            uploadedFileNameWithoutExtn = file.getOriginalFilename().substring(0,
                    file.getOriginalFilename().lastIndexOf("."));
            // persisting file
            Files.copy(file.getInputStream(), path.resolve(savedFileName));
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }

        final String filePath = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp" + "/"
                + savedFileName;

        // Open file in spark to get metadata
        // first, start spark session
        // sparkService.startSparkSession();
        duckDbService.startDuckDb();
        // calling spark service function,
        // this will have sample records & column name and type
        // FileUploadResponse fileUploadResponse = sparkService.readCsv(filePath);
        FileUploadResponseDuckDb fileUploadResponseDuckDb = duckDbService.readCsv(savedFileName);

        // also pass file name & dataframe name to the response
        fileUploadResponseDuckDb.setFileId(savedFileName);
        fileUploadResponseDuckDb.setName(uploadedFileNameWithoutExtn);
        return fileUploadResponseDuckDb;
    }

    // // helper function to build query from revised columns for meta data changes
    // // like change of data type or column name
    // public String buildQueryWithChangeSchema(FileUploadRevisedInfoRequest
    // revisedInfoRequest) {
    // String query = "";
    // String alias = "";
    // List<String> columnList = new ArrayList<>();

    // // iterate colummns list to check if any data type or column name change
    // for (int i = 0; i < revisedInfoRequest.getRevisedColumnInfos().size(); i++) {
    // FileUploadRevisedColumnInfo col =
    // revisedInfoRequest.getRevisedColumnInfos().get(i);

    // String colString = "";

    // /*
    // * data type conversion
    // */

    // // if not data type change then use column as is
    // if (Objects.isNull(col.getNewDataType())) {
    // colString = "`" + col.getFieldName() + "`";
    // }
    // // when new data type is provided
    // else if (!Objects.isNull(col.getNewDataType())) {
    // if (col.getNewDataType().name().equals("BOOLEAN")) {
    // colString = "BOOLEAN(`" + col.getFieldName() + "`)";
    // } else if (col.getNewDataType().name().equals("INTEGER")) {
    // colString = "CAST(`" + col.getFieldName() + "` AS INTEGER)";
    // } else if (col.getNewDataType().name().equals("TEXT")) {
    // colString = "STRING(`" + col.getFieldName() + "`)";
    // } else if (col.getNewDataType().name().equals("DECIMAL")) {
    // colString = "CAST(`" + col.getFieldName() + "` AS DOUBLE)";
    // } else if (col.getNewDataType().name().equals("DATE")) {
    // // timestamp to date
    // if (col.getDataType().name().equals("TIMESTAMP")) {
    // colString = "CAST(`" + col.getFieldName() + "` AS DATE)";
    // }
    // // other types to date
    // else {
    // if (!Objects.isNull(col.getFormat())) {
    // colString = "TO_DATE(`" + col.getFieldName() + "`, '" + col.getFormat() +
    // "')";
    // } else {
    // throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
    // "Error: Date conversion needs date format for the column: " +
    // col.getFieldName()
    // + "!");
    // }
    // }
    // } else if (col.getNewDataType().name().equals("TIMESTAMP")) {
    // // date to timestamp
    // if (col.getDataType().name().equals("DATE")) {
    // colString = "CAST(`" + col.getFieldName() + "` AS TIMESTAMP)";
    // }
    // // other types to timestamp
    // else {
    // if (!Objects.isNull(col.getFormat())) {
    // colString = "TO_TIMESTAMP(`" + col.getFieldName() + "`, '" + col.getFormat()
    // + "')";
    // } else {
    // throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
    // "Error: Timestamp conversion needs Timestamp format for the column: "
    // + col.getFieldName()
    // + "!");
    // }
    // }
    // }
    // }
    // /*
    // * Alias for column
    // * if not alias is given then use column name as alias
    // */
    // if (!Objects.isNull(col.getNewFieldName())) {
    // alias = "`" + col.getNewFieldName() + "`";
    // } else {
    // alias = "`" + col.getFieldName() + "`";
    // }

    // String colWithAlias = colString + " AS " + alias;
    // columnList.add(colWithAlias);
    // }

    // query = "SELECT \n\t" +
    // columnList.stream().collect(Collectors.joining(",\n\t"));
    // return query;
    // }

    // helper function to check if file data name is alreay taken
    // used to check while creating new File Data
    public void isFileDataNameAlreadyTaken(String userId, String fileDataName) throws BadRequestException {
        // check in DB if file data name is already taken
        List<FileData> fileDatas = fileDataRepository.findByUserIdAndName(
                userId, fileDataName);
        if (!fileDatas.isEmpty()) {
            throw new BadRequestException("Error: File Data Name is already taken!");
        }
    }

    // helper function to check if file data name is alreay taken other than self
    // used to check while editing File Data
    public void isFileDataNameTakenOtherThanSelf(String id, String userId, String fileDataName)
            throws BadRequestException {
        // check in DB if file data name is already taken
        List<FileData> fileDatas = fileDataRepository.findByIdNotAndUserIdAndName(id,
                userId, fileDataName);
        if (!fileDatas.isEmpty()) {
            throw new BadRequestException("Error: File Data Name is already taken!");
        }
    }

    // // helper function to create Schema String for given list of columns
    // // to change data type or col name while reading CSV
    // public String makeSchemaString(FileUploadRevisedInfoRequest
    // revisedInfoRequest) {
    // List<String> schemList = new ArrayList<>();
    // String schemaString = "";
    // // iterate list of columns
    // for (int i = 0; i < revisedInfoRequest.getRevisedColumnInfos().size(); i++) {
    // FileUploadRevisedColumnInfo col =
    // revisedInfoRequest.getRevisedColumnInfos().get(i);

    // String colName = Objects.isNull(col.getNewFieldName()) ? col.getFieldName() :
    // col.getNewFieldName();
    // String silzilaDataType = Objects.isNull(col.getNewDataType()) ?
    // col.getDataType().name().toLowerCase()
    // : col.getNewDataType().name().toLowerCase();
    // String sparkDataType = ConvertSparkDataType.toSparkDataType(silzilaDataType);
    // // construct for every column. eg. "column_name data_type"
    // schemList.add("`" + colName + "` `" + sparkDataType + "`");
    // }
    // // concatenate per column schema into a comma separated string
    // schemaString = schemList.stream().collect(Collectors.joining(", "));
    // return schemaString;
    // }

    // DUCKDB helper function to create map of col name & data type
    // to change data type or col name while reading CSV
    public Map<String, String> makeColumnSchemaMap(FileUploadRevisedInfoRequest revisedInfoRequest) {
        Map<String, String> colMap = new HashMap<String, String>();
        // iterate list of columns
        for (int i = 0; i < revisedInfoRequest.getRevisedColumnInfos().size(); i++) {
            FileUploadRevisedColumnInfo col = revisedInfoRequest.getRevisedColumnInfos().get(i);

            String colName = col.getFieldName();
            String silzilaDataType = col.getDataType().name().toLowerCase();
            // String sparkDataType = ConvertSparkDataType.toSparkDataType(silzilaDataType);
            String duckDbDataType = ConvertDuckDbDataType.toDuckDbDataType(silzilaDataType);
            // construct for every column. eg. "column_name data_type"
            colMap.put(colName, duckDbDataType);
        }
        return colMap;
    }

    // 2. update schema for uploaded file
    public JSONArray fileUploadChangeSchema(FileUploadRevisedInfoRequest revisedInfoRequest, String userId)
            throws JsonMappingException, JsonProcessingException, BadRequestException, ClassNotFoundException,
            SQLException {

        // check in DB if file data name is already taken
        isFileDataNameAlreadyTaken(userId, revisedInfoRequest.getName());

        // start duckdb in memory
        duckDbService.startDuckDb();
        JSONArray jsonArray = duckDbService.readCsvChangeSchema(revisedInfoRequest);
        return jsonArray;
    }

    // 3. persist uploaded file (with/witout changed schema) as parquet file to disk
    // Steps: read uploaded file + change metadata if needed
    // + save the data as Parquet file + delete uploaded file
    public FileDataDTO fileUploadSave(FileUploadRevisedInfoRequest revisedInfoRequest, String userId)
            throws JsonMappingException, JsonProcessingException, BadRequestException, ClassNotFoundException,
            SQLException {

        // check in DB if file data name is already taken
        isFileDataNameAlreadyTaken(userId, revisedInfoRequest.getName());

        // if not exists, create folder for user - to save file
        Path path = Paths.get(SILZILA_DIR, userId);
        try {
            Files.createDirectories(path);

        } catch (Exception e) {
            throw new RuntimeException("Could not initialize folder for upload. Errorr: " + e.getMessage());
        }

        // start duckdb in memory
        duckDbService.startDuckDb();

        duckDbService.writeToParquet(revisedInfoRequest, userId);

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
        final String readFile = System.getProperty("user.home") + "/" + "silzila-uploads"
                + "/" + "tmp" + "/" + revisedInfoRequest.getFileId();
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
    public JSONArray getSampleRecords(String id, String userId)
            throws RecordNotFoundException, JsonMappingException, JsonProcessingException, BadRequestException,
            ClassNotFoundException, SQLException {
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

        // start duckdb in memory
        duckDbService.startDuckDb();
        JSONArray jsonArray = duckDbService.getSampleRecords(parquetFilePath);
        return jsonArray;
    }

    // get sample records
    public List<Map<String, Object>> getColumns(String id, String userId)
            throws RecordNotFoundException, JsonMappingException, JsonProcessingException, BadRequestException,
            ClassNotFoundException, SQLException {
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
        // start duckdb in memory
        duckDbService.startDuckDb();
        List<Map<String, Object>> metaList = duckDbService.getColumnMetaData(parquetFilePath);
        return metaList;
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

    // HELPER FUNCTION - read all file datas with file name
    public void getFileNameFromFileId(String userId, List<Table> tableObjList)
            throws BadRequestException, SQLException, ClassNotFoundException {
        List<FileData> fileDataList;
        // first try to get all file datas for a user from cache
        if (usersFileDatas.containsKey(userId)) {
            fileDataList = usersFileDatas.get(userId);
        }
        // if no cache, read all file data for the user from DB
        else {
            fileDataList = fileDataRepository.findByUserId(userId);
        }

        // sparkService.createDfForFlatFiles(userId, tableObjList, fileDataList);
        duckDbService.createViewForFlatFiles(userId, tableObjList, fileDataList);

    }

    // // creates DF of all files used in chart data request Query
    // public void loadFilesAsDfForQuery(Query req, DatasetDTO ds) {

    // }

}
