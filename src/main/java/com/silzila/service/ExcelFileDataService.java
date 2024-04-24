package com.silzila.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.silzila.domain.entity.FileData;
import com.silzila.dto.FileDataDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.ExpectationFailedException;
import com.silzila.payload.request.FileUploadRevisedInfoRequest;
import com.silzila.payload.request.FileUploadRevisedInfoRequestForExcel;
import com.silzila.payload.response.FileUploadResponseDuckDb;
import com.silzila.repository.FileDataRepository;

@Service 
public class ExcelFileDataService {
	
	public static HashMap<String, ArrayList<FileData>> usersFileDatas = new HashMap<String, ArrayList<FileData>>();

    @Autowired
    DuckDbService duckDbService;

    @Autowired
    FileDataRepository fileDataRepository;
    
    @Autowired
    FileDataService fileDataService;

    // all uploads are initially saved in tmp
    final String SILZILA_DIR = System.getProperty("user.home") + "/" + "silzila-uploads";

    // 1. upload File Data
    public FileUploadResponseDuckDb excelFileUpload(MultipartFile file,String sheetName)
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
        if (!(file.getContentType() == null || file.getContentType().equals("application/vnd.ms-excel") ||
        	    file.getContentType().equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))) {
            throw new ExpectationFailedException("Error: Only Excel file is allowed!");
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
        FileUploadResponseDuckDb fileUploadResponseDuckDb = duckDbService.readExcel(savedFileName, sheetName);

        // also pass file name & dataframe name to the response
        fileUploadResponseDuckDb.setFileId(savedFileName);
        fileUploadResponseDuckDb.setName(uploadedFileNameWithoutExtn);
        return fileUploadResponseDuckDb;
    }

    public FileDataDTO excelFileUploadSave(FileUploadRevisedInfoRequestForExcel revisedInfoRequest, String userId,String sheetName)
            throws JsonMappingException, JsonProcessingException, BadRequestException, ClassNotFoundException,
            SQLException {

        // flatfile name can't have any spaces and special characters not more than one underscore- contiuously
        if (revisedInfoRequest.getName() != null) {
            revisedInfoRequest.setName(revisedInfoRequest.getName().trim().replaceAll("[^a-zA-Z0-9]", "_").replaceAll("_+","_"));
        }
        // check in DB if file data name is already taken
        fileDataService.isFileDataNameAlreadyTaken(userId, revisedInfoRequest.getName());

        // if not exists, create folder for user - to save file
        Path path = Paths.get(SILZILA_DIR, userId);
        try {
            Files.createDirectories(path);

        } catch (Exception e) {
            throw new RuntimeException("Could not initialize folder for upload. Errorr: " + e.getMessage());
        }

        // start duckdb in memory
        duckDbService.startDuckDb();

        duckDbService.writeExcelToParquet(revisedInfoRequest, userId,sheetName);

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


}