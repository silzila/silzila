package com.silzila.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONArray;

import com.silzila.helper.SaltGenerator;
import com.silzila.helper.UtilityService;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.ExpectationFailedException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.helper.ConvertDuckDbDataType;
import com.silzila.payload.request.CalculatedFieldRequest;
import com.silzila.payload.request.FileUploadRevisedColumnInfo;
import com.silzila.payload.request.FileUploadRevisedInfoRequest;
import com.silzila.payload.request.Table;
import com.silzila.payload.response.ExcelSheetResponse;
import com.silzila.payload.response.FileUploadResponseDuckDb;
import com.silzila.domain.entity.Dataset;
import com.silzila.domain.entity.FileData;
import com.silzila.domain.entity.User;
import com.silzila.domain.entity.Workspace;
import com.silzila.dto.FileDataDTO;
import com.silzila.dto.WorkspaceContentDTO;
import com.silzila.repository.DatasetRepository;
import com.silzila.repository.FileDataRepository;

@Service
public class FileDataService {

    public static HashMap<String, ArrayList<FileData>> usersFileDatas = new HashMap<String, ArrayList<FileData>>();

    @Autowired
    DuckDbService duckDbService;

    @Autowired
    FileDataRepository fileDataRepository;

    @Autowired
    DatasetRepository datasetRepository;
    @Autowired
    DatasetAndFileDataBuffer buffer;

    @Autowired
    UtilityService utilityService;

    // all uploads are initially saved in tmp
    final String SILZILA_DIR = System.getProperty("user.home") + "/" + "silzila-uploads";
    @Value("${pepperForFlatFiles}")
    private String pepper;

    @Value("${saltForFlatFiles}")
    private String salt;

    // Convert byte array to a base64 encoded string
    // generating random value to encrypt
    final String encryptPwd = "#VaNgaL#";

    // UUID.randomUUID().toString().substring(0, 32)
    // 1. upload File Data
    public FileUploadResponseDuckDb fileUpload(MultipartFile file, String sheetName) throws ExpectationFailedException,
            IOException, SQLException, ClassNotFoundException {
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
        // only CSV and JSON file is allowed and throws error if otherwise
        if (file.getContentType() == null
                || (!file.getContentType().equals("text/csv") && !file.getContentType().equals("application/json")
                        && !(file.getContentType().equals("application/vnd.ms-excel") || file.getContentType()
                                .equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")))) {
            throw new ExpectationFailedException("Error: Only CSV or JSON or Excel files are allowed!");
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
        // checking condition for csv file upload
        if (file.getContentType().equals("text/csv")) {
            FileUploadResponseDuckDb fileUploadResponseDuckDb = duckDbService.readCsv(savedFileName);

            // also pass file name & dataframe name to the response
            fileUploadResponseDuckDb.setFileId(savedFileName);
            fileUploadResponseDuckDb.setName(uploadedFileNameWithoutExtn);
            return fileUploadResponseDuckDb;
        }
        // checking condition for json file upload
        else if (file.getContentType().equals("application/json")) {
            FileUploadResponseDuckDb fileUploadResponseDuckDb = duckDbService.readJson(savedFileName);

            // also pass file name & dataframe name to the response
            fileUploadResponseDuckDb.setFileId(savedFileName);
            fileUploadResponseDuckDb.setName(uploadedFileNameWithoutExtn);
            return fileUploadResponseDuckDb;
        }
        // checking condition for excel file upload
        else if (file.getContentType().equals("application/vnd.ms-excel")
                || file.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {

            FileUploadResponseDuckDb fileUploadResponseDuckDb = duckDbService.readExcel(savedFileName, sheetName);

            // also pass file name & dataframe name to the response
            fileUploadResponseDuckDb.setFileId(savedFileName + ".csv");
            fileUploadResponseDuckDb.setName(uploadedFileNameWithoutExtn);

            // deleting the file which is there in tmp folder
            final String readFile = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp" + "/"
                    + savedFileName;
            try {
                Files.deleteIfExists(Paths.get(readFile));
            } catch (IOException e) {
                e.printStackTrace();
            }

            return fileUploadResponseDuckDb;
        }

        return null;

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
    public void isFileDataNameAlreadyTaken(String userId, String fileDataName,String workspaceId) throws BadRequestException {
        // check in DB if file data name is already taken
       boolean checkName= fileDataRepository.existsByNameAndUserIdAndWorkspaceId(fileDataName,userId, workspaceId);
        if (checkName) {
            throw new BadRequestException("Error: File Data Name is already taken!");
        }
    }

    // helper function to check if file data name is alreay taken other than self
    // used to check while editing File Data
    public void isFileDataNameTakenOtherThanSelf(String id, String userId, String fileDataName)
            throws BadRequestException {
        // check in DB if file data name is already taken
        List<FileData> fileDatas = fileDataRepository.findByIdNotAndUserIdAndName(id, userId, fileDataName);
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
    public JSONArray fileUploadChangeSchema(FileUploadRevisedInfoRequest revisedInfoRequest, String workspaceId,String userId)
            throws JsonMappingException, JsonProcessingException, BadRequestException, ClassNotFoundException,
            SQLException, ExpectationFailedException {

        // check in DB if file data name is already taken
        isFileDataNameAlreadyTaken(userId, revisedInfoRequest.getName(),workspaceId);

        // start duckdb in memory
        duckDbService.startDuckDb();

        // using condition to find the file type to do the operation
        if (revisedInfoRequest.getFileType().equalsIgnoreCase("csv")) {
            JSONArray jsonArray = duckDbService.readCsvChangeSchema(revisedInfoRequest);
            return jsonArray;
        } else if (revisedInfoRequest.getFileType().equalsIgnoreCase("json")) {
            JSONArray jsonArray = duckDbService.readJsonChangeSchema(revisedInfoRequest);
            return jsonArray;
        } else if (revisedInfoRequest.getFileType().equalsIgnoreCase("excel")) {
            JSONArray jsonArray = duckDbService.changeSchmaforExcel(revisedInfoRequest);
            return jsonArray;
        }
        return null;

    }

    // 3. persist uploaded file (with/witout changed schema) as parquet file to disk
    // Steps: read uploaded file + change metadata if needed
    // + save the data as Parquet file + delete uploaded file
    public FileDataDTO fileUploadSave(FileUploadRevisedInfoRequest revisedInfoRequest, String userId,String workspaceId)
            throws JsonMappingException, JsonProcessingException, BadRequestException, ClassNotFoundException,
            SQLException, ExpectationFailedException {

        User user = utilityService.getUserFromEmail(userId);
         Workspace workspace = utilityService.getWorkspaceById(workspaceId);
        // flatfile name can't have any spaces and special characters not more than one
        // underscore- contiuously
        if (revisedInfoRequest.getName() != null) {
            revisedInfoRequest
                    .setName(revisedInfoRequest.getName().trim().replaceAll("[^a-zA-Z0-9]", "_").replaceAll("_+", "_"));
        }
        // check in DB if file data name is already taken
        isFileDataNameAlreadyTaken(userId, revisedInfoRequest.getName(),workspaceId);

        // if not exists, create folder for user - to save file
        Path path = Paths.get(SILZILA_DIR, userId);
        try {
            Files.createDirectories(path);

        } catch (Exception e) {
            throw new RuntimeException("Could not initialize folder for upload. Errorr: " + e.getMessage());
        }

        // start duckdb in memory
        duckDbService.startDuckDb();

        // using condition to find the file type ad do the operation
        if (revisedInfoRequest.getFileType().equalsIgnoreCase("csv")) {

            // int saltLength =4; // You can adjust the length as needed
            // // Generate salt using SaltGenerator class
            // String salt = SaltGenerator.generateSalt(saltLength);

            duckDbService.writeCsvToParquet(revisedInfoRequest, userId, salt + encryptPwd + pepper);

            // save metadata to DB and return as response
            String fileNameToBeSaved = revisedInfoRequest.getFileId() + ".parquet";

            FileData fileData = new FileData();
            fileData.setUserId(userId);
            fileData.setName(revisedInfoRequest.getName());
            fileData.setFileName(fileNameToBeSaved);
            fileData.setSaltValue(salt);
            fileData.setCreatedBy(user.getFirstName());
            fileData.setWorkspace(workspace);
            fileDataRepository.save(fileData);
            buffer.removeFileDataFromBuffer(userId);
            FileDataDTO fileDataDTO = new FileDataDTO(fileData.getId(), fileData.getUserId(), fileData.getName());

            // delete the read file which was uploaded by user
            final String readFile = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp" + "/"
                    + revisedInfoRequest.getFileId();
            try {
                Files.deleteIfExists(Paths.get(readFile));
            } catch (IOException e) {
                e.printStackTrace();
            }

            return fileDataDTO;
        } else if (revisedInfoRequest.getFileType().equalsIgnoreCase("json")) {
            // int saltLength =4; // You can adjust the length as needed
            // Generate salt using SaltGenerator class
            // String salt = SaltGenerator.generateSalt(saltLength);

            duckDbService.writeJsonToParquet(revisedInfoRequest, userId, salt + encryptPwd + pepper);

            // save metadata to DB and return as response
            String fileNameToBeSaved = revisedInfoRequest.getFileId() + ".parquet";
            FileData fileData = new FileData();
            fileData.setUserId(userId);
            fileData.setName(revisedInfoRequest.getName());
            fileData.setFileName(fileNameToBeSaved);
            fileData.setSaltValue(salt);
            fileData.setCreatedBy(user.getFirstName());
            fileData.setWorkspace(workspace);
            fileDataRepository.save(fileData);
            FileData savedFileData = fileDataRepository.save(fileData);
            buffer.addFileDataUser(userId, savedFileData);
            FileDataDTO fileDataDTO = new FileDataDTO(fileData.getId(), fileData.getUserId(), fileData.getName());

            // delete the read file which was uploaded by user
            final String readFile = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp" + "/"
                    + revisedInfoRequest.getFileId();
            try {
                Files.deleteIfExists(Paths.get(readFile));
            } catch (IOException e) {
                e.printStackTrace();
            }

            return fileDataDTO;

        } else if (revisedInfoRequest.getFileType().equalsIgnoreCase("excel")) {
            int saltLength = 4; // You can adjust the length as needed
            // Generate salt using SaltGenerator class
            String salt = SaltGenerator.generateSalt(saltLength);

            duckDbService.writeExcelToParquet(revisedInfoRequest, userId, salt + encryptPwd + pepper);

            // save metadata to DB and return as response
            String fileNameToBeSaved = revisedInfoRequest.getFileId() + ".parquet";
            FileData fileData = new FileData();
            fileData.setUserId(userId);
            fileData.setName(revisedInfoRequest.getName());
            fileData.setFileName(fileNameToBeSaved);
            fileData.setSaltValue(salt);
            fileData.setCreatedBy(user.getFirstName());
            fileData.setWorkspace(workspace);
            fileDataRepository.save(fileData);
            FileData savedFileData = fileDataRepository.save(fileData);
            buffer.addFileDataUser(userId, savedFileData);

            FileDataDTO fileDataDTO = new FileDataDTO(fileData.getId(), fileData.getUserId(), fileData.getName());

            // delete the read file which was uploaded by user
            final String readFile = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp" + "/"
                    + revisedInfoRequest.getFileId() + ".csv";
            try {
                Files.deleteIfExists(Paths.get(readFile));
            } catch (IOException e) {
                e.printStackTrace();
            }

            return fileDataDTO;

        }

        return null;

    }

    // read all file data
    public List<FileDataDTO> getAllFileDatas(String userId,String workspaceId) throws BadRequestException{
        utilityService.isValidWorkspaceId(workspaceId);
        // read all file data for the user from DB
        List<FileData> fileDatas = fileDataRepository.findByUserId(userId);
        // re-map to DTO list of object - (to hide file name)
        List<FileDataDTO> fDataDTOs = new ArrayList<>();
        fileDatas.forEach((fd) -> {
            FileDataDTO dto = new FileDataDTO(fd.getId(), fd.getUserId(), fd.getName());
            fDataDTOs.add(dto);
        });
        return fDataDTOs;
    }

    // get sample records

    public JSONArray getSampleRecords(String id, String userId, String datasetId,String workspaceId, String tableName,String tableId, List<List<CalculatedFieldRequest>> calculatedFieldRequests) throws RecordNotFoundException, JsonMappingException,
            JsonProcessingException, BadRequestException, ClassNotFoundException, SQLException {
        // if no file data inside optional wrapper, then send NOT FOUND Error
        Optional<FileData> fdOptional = fileDataRepository.findByIdAndUserId(id, userId);
        if (!fdOptional.isPresent()) {
            throw new RecordNotFoundException("Error: No such File Data Id exists!");
        }
        FileData fileData = fdOptional.get();
        String salt = fileData.getSaltValue();

        // if file not exists, throw error:
        final String parquetFilePath = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + userId + "/"
                + fileData.getFileName();
        if (Files.notExists(Paths.get(parquetFilePath))) {
            throw new BadRequestException("Error: File not exists!");
        }

        // start duckdb in memory
        duckDbService.startDuckDb();
        JSONArray jsonArray = duckDbService.getSampleRecords(workspaceId,parquetFilePath,userId,datasetId,tableName,tableId, salt+encryptPwd+pepper,calculatedFieldRequests);
        return jsonArray;
    }

    // get sample records
    public List<Map<String, Object>> getColumns(String id, String userId,String workspaceId, List<List<CalculatedFieldRequest>> calculatedFieldRequests) throws RecordNotFoundException,
            JsonMappingException, JsonProcessingException, BadRequestException, ClassNotFoundException, SQLException {
        // if no file data inside optional wrapper, then send NOT FOUND Error
        Optional<FileData> fdOptional = fileDataRepository.findByIdAndUserId(id, userId);
        if (!fdOptional.isPresent()) {
            throw new RecordNotFoundException("Error: No such File Data Id exists!");
        }
        FileData fileData = fdOptional.get();
        String salt = fileData.getSaltValue();

        // if file not exists, throw error:
        final String parquetFilePath = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + userId + "/"
                + fileData.getFileName();
        if (Files.notExists(Paths.get(parquetFilePath))) {
            throw new BadRequestException("Error: File not exists!");
        }
        // start duckdb in memory
        duckDbService.startDuckDb();
        List<Map<String, Object>> metaList = duckDbService.getColumnMetaData(parquetFilePath,
                salt + encryptPwd + pepper, calculatedFieldRequests);
        return metaList;
    }

    // Delete File Data
    public void deleteFileData(String id, String userId,String workspaceId) throws RecordNotFoundException ,BadRequestException {
        // if no file data inside optional wrapper, then send NOT FOUND Error
        // meaning if no file id in the DB, send error
        // Optional<FileData> fdOptional = fileDataRepository.findByIdAndUserId(id, userId);
        Optional<FileData> fdOptional = fileDataRepository.findByIdAndWorkspaceId(id, workspaceId);
        if (!fdOptional.isPresent()) {
            throw new RecordNotFoundException("Error: No such File Data Id exists!");
        }
        FileData fileData = fdOptional.get();
         // check dependencies
        if (flatfileDependency(userId, workspaceId, id).size() != 0) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Access is forbidden for the specified flat file,it has dependencies.");
        }

        // delete the Parquet File from file system
        final String parquetFilePath = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + userId + "/"
                + fileData.getFileName();
        try {
            // if Parquet folder exists then delete contents and the folder
            if (Files.exists(Paths.get(parquetFilePath))) {
                // traverse the folder and delete
                Files.walk(Paths.get(parquetFilePath)).sorted(Comparator.reverseOrder()).map(Path::toFile)
                        .forEach(File::delete);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        // remove the record from DB
        fileDataRepository.deleteById(id);
        buffer.deleteFileDataUser(userId, id);
    }

        public List<WorkspaceContentDTO> flatfileDependency(String email, String workspaceId, String flatfileId) throws BadRequestException {

        FileData fileData = fileDataRepository.findById(flatfileId)
                .orElseThrow(() -> new BadRequestException("No such flatfileId"));

        List<Dataset> datasets = datasetRepository.findByDataSchemaContaining(fileData.getId());

        List<String> datasetIds = datasets.stream()
                .map(Dataset::getId)
                .collect(Collectors.toList());

        List<Object[]> dependentDatasets = datasetRepository.findDatasetsWithWorkspaceAndParentDetails(datasetIds);

        List<WorkspaceContentDTO> workspaceContentDTOList = dependentDatasets.stream()
                .map(result -> new WorkspaceContentDTO(
                        (String) result[0], // datasetId
                        (String) result[1], // datasetName
                        (String) result[2], // createdBy
                        (String) result[3], // workspaceId
                        (String) result[4], // workspaceName
                        (String) result[5], // parentWorkspaceId
                        (String) result[6] // parentWorkspaceName
                ))
                .collect(Collectors.toList());

        return workspaceContentDTOList;
    }
    // HELPER FUNCTION - read all file data with file name
    public void getFileNameFromFileId(String userId, List<Table> tableObjList,String workspaceId)
            throws BadRequestException, SQLException, ClassNotFoundException {
        List<FileData> fileDataList = buffer.getFileDataByUserId(userId);
        // sparkService.createDfForFlatFiles(userId, tableObjList, fileDataList);
        duckDbService.createViewForFlatFiles(userId, tableObjList, fileDataList, encryptPwd + pepper);

    }

    // // creates DF of all files used in chart data request Query
    // public void loadFilesAsDfForQuery(Query req, DatasetDTO ds) {

    // }

    public ExcelSheetResponse getAllSheetNames(MultipartFile file, String userId) throws BadRequestException {

        long fileMaxSize = 50 * 1024 * 1024;
        
        if (file.getSize() > fileMaxSize) {
        throw new IllegalArgumentException(
        "File size exceeds the allowed limit of " + (fileMaxSize / (1024 * 1024)) +
        "MB");
        }
        org.apache.poi.util.IOUtils.setByteArrayMaxOverride(200 * 1024 * 1024);
        List<String> sheets = new ArrayList<>();

        if (file.isEmpty()) {
            throw new BadRequestException("No file present");
        }

        String fileId = UUID.randomUUID().toString().substring(0, 8);

        String path = saveExcelFile(userId, file, fileId);

        try (FileInputStream fis = new FileInputStream(path)) {
            Workbook workbook = new XSSFWorkbook(fis);

            int numberOfSheets = workbook.getNumberOfSheets();

            for (int i = 0; i < numberOfSheets; i++) {
                sheets.add(workbook.getSheetName(i));
            }

        } catch (IOException e) {
            throw new RuntimeException("Error reading the Excel file: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("An unexpected error occurred while processing the file: " + e.getMessage(), e);
        }

        String fileNameWithoutExtn = file.getOriginalFilename().substring(0,
                file.getOriginalFilename().lastIndexOf("."));

        return new ExcelSheetResponse(fileId, fileNameWithoutExtn, sheets);
    }

    private String saveExcelFile(String userId, MultipartFile file, String fileId) {
        // Check if the file is an Excel file
        if (file.getContentType().equals("application/vnd.ms-excel")
                || file.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {

            // Generate a unique name for the file to avoid collisions
            String savedFileName = fileId + ".xlsx";

            // Define the directory where the file will be saved
            Path path = Paths.get(SILZILA_DIR + "/tmp");

            try {
                // Create directories if they don't exist
                Files.createDirectories(path);

                // Copy the file content to the desired path
                Files.copy(file.getInputStream(), path.resolve(savedFileName), StandardCopyOption.REPLACE_EXISTING);

            } catch (IOException e) {
                // Handle any errors during file saving
                throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
            }

            // File has been saved successfully, return the file path
            String savedFilePath = path.resolve(savedFileName).toString();

            // Now you can access the file anytime using the saved file path.
            // If you want to process the file (e.g., read using DuckDB), you can pass this
            // file path to the required method.
            System.out.println("File saved at: " + savedFilePath);

            return savedFilePath;
        }

        // If the file is not Excel, return an error message or handle accordingly
        throw new IllegalArgumentException("The uploaded file is not an Excel file.");
    }

    public FileUploadResponseDuckDb fileUploadExcel(String fileId, String fileName, String sheetName, String userId,
            Integer recordCount) throws IOException, ClassNotFoundException, ExpectationFailedException, SQLException {

        Path excelFilePath = Paths.get(SILZILA_DIR, "tmp", fileId + ".xlsx");
        MultipartFile file = getFileAsMultipartFile(excelFilePath);

        FileUploadResponseDuckDb fileUploadResponseDuckDb = fileUpload(file,sheetName);
        fileUploadResponseDuckDb.setName(fileName);
        Files.deleteIfExists(excelFilePath);

        return fileUploadResponseDuckDb;

    }

    public static MultipartFile getFileAsMultipartFile(Path filePath) throws IOException {
        File file = filePath.toFile();
        if (!file.exists() || !file.isFile()) {
            throw new IllegalArgumentException("File does not exist or is not a valid file: " + filePath);
        }

        String mimeType = "";

        String fileName = file.getName();
        if (fileName.endsWith(".xlsx")) {
            mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        } else if (fileName.endsWith(".xls")) {
            mimeType = "application/vnd.ms-excel";
        }

        try (FileInputStream inputStream = new FileInputStream(file)) {
            return new MockMultipartFile(
                    file.getName(),
                    file.getName(),
                    mimeType,
                    inputStream);
        }
    }

}
