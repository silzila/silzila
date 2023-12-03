package com.silzila.service;

import com.silzila.repository.DBConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.silzila.dto.DBConnectionDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.silzila.domain.entity.DBConnection;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.DBConnectionRequest;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.ExpectationFailedException;
import com.silzila.security.encryption.AESEncryption;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
// import java.sql.Connection;
// import java.sql.ResultSet;
import java.sql.SQLException;
// import java.sql.Statement;
import java.util.ArrayList;
// import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.modelmapper.ModelMapper;

@Service
public class DBConnectionService {

    private static final Logger logger = LogManager.getLogger(DBConnectionService.class);
    // all uploads are initially saved in tmp
    final String SILZILA_DIR = System.getProperty("user.home") + "/" + "silzila-uploads";

    @Autowired
    DBConnectionRepository dbConnectionRepository;

    ModelMapper mapper = new ModelMapper();

    @Value("${passwordEncryptionSecretKey}")
    private String passwordEncryptionSecretKey;

    // @Value("${passwordEncryptionSecretKey}")
    // private String passwordEncryptionSaltValue;

    public List<DBConnectionDTO> getAllDBConnections(String userId) {
        // fetch all DB connections for the user
        List<DBConnection> dbConnections = dbConnectionRepository.findByUserId(userId);
        // convert to DTO object to not show Password
        List<DBConnectionDTO> dtos = new ArrayList<>();
        dbConnections.forEach(dbconnection -> dtos.add(mapper.map(dbconnection,
                DBConnectionDTO.class)));
        return dtos;
    }

    private DBConnection checkDBConnectionById(String id, String userId) throws RecordNotFoundException {
        // fetch the particular DB connection for the user
        Optional<DBConnection> optionalDBConnection = dbConnectionRepository.findByIdAndUserId(id, userId);
        // if no connection details, then send NOT FOUND Error
        if (!optionalDBConnection.isPresent()) {
            throw new RecordNotFoundException("Error: No such Connection Id exists");
        }
        DBConnection dbConnection = optionalDBConnection.get();
        return dbConnection;
    }

    public DBConnectionDTO getDBConnectionById(String id, String userId)
            throws RecordNotFoundException {
        // // fetch the particular DB connection for the user
        // Optional<DBConnection> optionalDBConnection =
        // dbConnectionRepository.findByIdAndUserId(id, userId);
        // // if no connection details, then send NOT FOUND Error
        // if (!optionalDBConnection.isPresent()) {
        // throw new RecordNotFoundException("Error: No such Connection Id exists");
        // }
        // DBConnection dbConnection = optionalDBConnection.get();

        DBConnection dbConnection = checkDBConnectionById(id, userId);
        // String decryptedPassword =
        // AESEncryption.decrypt(dbConnection.getPasswordHash(),
        // passwordEncryptionSecretKey,
        // dbConnection.getSalt());
        // System.out.println(" ========== password = " + dbConnection.getPasswordHash()
        // + " decrypted password = "
        // + decryptedPassword);
        // convert to DTO object to not show Password
        DBConnectionDTO dto = mapper.map(dbConnection, DBConnectionDTO.class);
        return dto;
    }

    public DBConnection getDBConnectionWithPasswordById(String id, String userId)
            throws RecordNotFoundException {
        // // fetch the particular DB connection for the user
        // Optional<DBConnection> optionalDBConnection =
        // dbConnectionRepository.findByIdAndUserId(id, userId);
        // // if no connection details, then send NOT FOUND Error
        // if (!optionalDBConnection.isPresent()) {
        // throw new RecordNotFoundException("Error: No such Connection Id exists");
        // }
        // DBConnection dbConnection = optionalDBConnection.get();

        // get Connection object from DB
        DBConnection dbConnection = checkDBConnectionById(id, userId);
        // Applicable for all DBs except BigQuery
        // if vendor is BigQuery then NO password to decrypt
        // if (!dbConnection.getVendor().equals("bigquery")) {
        dbConnection
                .setPasswordHash(AESEncryption.decrypt(dbConnection.getPasswordHash(), passwordEncryptionSecretKey,
                        dbConnection.getSalt()));
        // }
        return dbConnection;
    }

    // check if DB Connection Name is alredy used for the requester
    private void checkConnectionNameExists(String userId, String connectionName) throws BadRequestException {
        List<DBConnection> connections = dbConnectionRepository.findByUserIdAndConnectionName(userId,
                connectionName);
        // if connection name is alredy used, send error
        if (!connections.isEmpty()) {
            throw new BadRequestException("Error: Connection Name is already taken!");
        }
    }

    public DBConnectionDTO createDBConnection(DBConnectionRequest dbConnectionRequest, String userId)
            throws BadRequestException {
        // check if connection name is alredy used for the requester
        checkConnectionNameExists(userId, dbConnectionRequest.getConnectionName());
        // create a random string for using as Salt
        String saltString = RandomStringUtils.randomAlphanumeric(16);
        String passwordHash = AESEncryption.encrypt(dbConnectionRequest.getPassword(), passwordEncryptionSecretKey,
                saltString);
        logger.info(" ========== password = " + dbConnectionRequest.getPassword() + " encrypted password = "
                + passwordHash);
        String projectId = null;
        String clientEmail = null;
        if(dbConnectionRequest.getVendor().equals("bigquery")){
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(dbConnectionRequest.getPassword());
    
                projectId = jsonNode.get("project_id").asText();
                clientEmail = jsonNode.get("client_email").asText();
    
                if (projectId.isEmpty() || clientEmail.isEmpty()) {
                    throw new RuntimeException("Project ID or Client Email not found in the token.");
                }
    
                logger.info("Project ID: " + projectId);
                logger.info("Client Email: " + clientEmail);

            } catch (Exception e) {
                throw new RuntimeException("Error processing JSON token: " + e.getMessage());
            }
        }
        // create DB Connection object and save it to DB
        DBConnection dbConnection = new DBConnection(
                userId,
                dbConnectionRequest.getVendor(),
                dbConnectionRequest.getServer(),
                dbConnectionRequest.getPort(),
                dbConnectionRequest.getDatabase(),
                dbConnectionRequest.getUsername(),
                saltString,
                passwordHash, // dbConnectionRequest.getPassword(),
                dbConnectionRequest.getConnectionName(),
                dbConnectionRequest.getHttpPath(),
                projectId,
                clientEmail,
                null,
                dbConnectionRequest.getPassword());
        dbConnectionRepository.save(dbConnection);
        DBConnectionDTO dto = mapper.map(dbConnection, DBConnectionDTO.class);
        return dto;
    }

    private DBConnection checkDBConnectionNameAlreadyExist(String id, String connectionName,
            String userId) throws RecordNotFoundException, BadRequestException {
        // fetch the particular DB connection for the user
        Optional<DBConnection> optionalDBConnection = dbConnectionRepository.findByIdAndUserId(id, userId);
        // if no connection details, then send NOT FOUND Error
        if (!optionalDBConnection.isPresent()) {
            throw new RecordNotFoundException("Error: No such Connection Id exists");
        }
        List<DBConnection> dbConnections = dbConnectionRepository
                .findByIdNotAndUserIdAndConnectionName(
                        id, userId, connectionName);
        if (!dbConnections.isEmpty()) {
            throw new BadRequestException("Error: Connection Name is alread taken!");
        }
        DBConnection _dbConnection = optionalDBConnection.get();
        return _dbConnection;
    }

    public DBConnectionDTO updateDBConnection(String id, DBConnectionRequest dbConnectionRequest, String userId)
            throws RecordNotFoundException, BadRequestException {
        DBConnection _dbConnection = checkDBConnectionNameAlreadyExist(id, dbConnectionRequest.getConnectionName(),
                userId);
        // create a random string for using as Salt
        String saltString = RandomStringUtils.randomAlphanumeric(16);
        String passwordHash = AESEncryption.encrypt(dbConnectionRequest.getPassword(), passwordEncryptionSecretKey,
                saltString);
        logger.info(" ========== password = " + dbConnectionRequest.getPassword() + " encrypted password = "
                + passwordHash);
        _dbConnection.setConnectionName(dbConnectionRequest.getConnectionName());
        _dbConnection.setVendor(dbConnectionRequest.getVendor());
        _dbConnection.setServer(dbConnectionRequest.getServer());
        _dbConnection.setPort(dbConnectionRequest.getPort());
        _dbConnection.setDatabase(dbConnectionRequest.getDatabase());
        _dbConnection.setUsername(dbConnectionRequest.getUsername());
        _dbConnection.setSalt(saltString);
        _dbConnection.setPasswordHash(passwordHash);
        dbConnectionRepository.save(_dbConnection);
        DBConnectionDTO dto = mapper.map(_dbConnection, DBConnectionDTO.class);
        return dto;
    }

    public void deleteDBConnection(String id, String userId)
            throws RecordNotFoundException, FileNotFoundException {
        // fetch the particular DB connection for the user
        Optional<DBConnection> optionalDBConnection = dbConnectionRepository.findByIdAndUserId(id, userId);
        // if no connection details, then send NOT FOUND Error
        if (!optionalDBConnection.isPresent()) {
            throw new RecordNotFoundException("Error: No such Connection Id exists");
        }

        // DBConnection _dbConnection = optionalDBConnection.get();
        // // delete old token file for BigQuery
        // if (_dbConnection.getVendor().equals("bigquery")) {
        //     final String oldFilePath = System.getProperty("user.home") + "/silzila-uploads/tokens/"
        //             + _dbConnection.getFileName();
        //     try {
        //         Files.delete(Paths.get(oldFilePath));
        //     } catch (Exception e) {
        //         // throw new FileNotFoundException("old token file could not be deleted");
        //         logger.warn("Warning: old token file could not be deleted: " + e.getMessage());
        //     }
        // }
        // delete the record from DB
        dbConnectionRepository.deleteById(id);
    }

}
