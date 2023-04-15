package org.silzila.app.service;

import org.silzila.app.repository.DBConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.silzila.app.dto.DBConnectionDTO;
import org.silzila.app.model.DBConnection;
import org.silzila.app.payload.request.DBConnectionRequest;
import org.silzila.app.exception.RecordNotFoundException;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.security.encryption.AESEncryption;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.RandomStringUtils;
import org.modelmapper.ModelMapper;

@Service
public class DBConnectionService {

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

    public DBConnectionDTO getDBConnectionById(String id, String userId)
            throws RecordNotFoundException {
        // fetch the particular DB connection for the user
        Optional<DBConnection> optionalDBConnection = dbConnectionRepository.findByIdAndUserId(id, userId);
        // if no connection details, then send NOT FOUND Error
        if (!optionalDBConnection.isPresent()) {
            throw new RecordNotFoundException("Error: No such Connection Id exists");
        }
        DBConnection dbConnection = optionalDBConnection.get();
        String decryptedPassword = AESEncryption.decrypt(dbConnection.getPasswordHash(), passwordEncryptionSecretKey,
                dbConnection.getSalt());
        System.out.println(" ========== password = " + dbConnection.getPasswordHash() + " decrypted password = "
                + decryptedPassword);
        // convert to DTO object to not show Password
        DBConnectionDTO dto = mapper.map(dbConnection, DBConnectionDTO.class);
        return dto;
    }

    public DBConnection getDBConnectionWithPasswordById(String id, String userId)
            throws RecordNotFoundException {
        // fetch the particular DB connection for the user
        Optional<DBConnection> optionalDBConnection = dbConnectionRepository.findByIdAndUserId(id, userId);
        // if no connection details, then send NOT FOUND Error
        if (!optionalDBConnection.isPresent()) {
            throw new RecordNotFoundException("Error: No such Connection Id exists");
        }
        DBConnection dbConnection = optionalDBConnection.get();
        dbConnection.setPasswordHash(AESEncryption.decrypt(dbConnection.getPasswordHash(), passwordEncryptionSecretKey,
                dbConnection.getSalt()));
        return dbConnection;
    }

    public DBConnectionDTO createDBConnection(DBConnectionRequest dbConnectionRequest, String userId)
            throws BadRequestException {
        // check if connection name is alredy used for the requester
        List<DBConnection> connections = dbConnectionRepository.findByUserIdAndConnectionName(userId,
                dbConnectionRequest.getConnectionName());
        // if connection name is alredy used, send error
        if (!connections.isEmpty()) {
            throw new BadRequestException("Error: Connection Name is already taken!");
        }
        // create a random string for using as Salt
        String saltString = RandomStringUtils.randomAlphanumeric(16);
        String passwordHash = AESEncryption.encrypt(dbConnectionRequest.getPassword(), passwordEncryptionSecretKey,
                saltString);
        System.out.println(" ========== password = " + dbConnectionRequest.getPassword() + " encrypted password = "
                + passwordHash);
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
                dbConnectionRequest.getConnectionName());
        dbConnectionRepository.save(dbConnection);
        DBConnectionDTO dto = mapper.map(dbConnection, DBConnectionDTO.class);
        return dto;
    }

    public DBConnectionDTO updateDBConnection(String id, DBConnectionRequest dbConnectionRequest, String userId)
            throws RecordNotFoundException, BadRequestException {
        // fetch the particular DB connection for the user
        Optional<DBConnection> optionalDBConnection = dbConnectionRepository.findByIdAndUserId(id, userId);
        // if no connection details, then send NOT FOUND Error
        if (!optionalDBConnection.isPresent()) {
            throw new RecordNotFoundException("Error: No such Connection Id exists");
        }
        List<DBConnection> dbConnections = dbConnectionRepository
                .findByIdNotAndUserIdAndConnectionName(
                        id, userId, dbConnectionRequest.getConnectionName());
        if (!dbConnections.isEmpty()) {
            throw new BadRequestException("Error: Connection Name is alread taken!");
        }
        DBConnection _dbConnection = optionalDBConnection.get();
        // create a random string for using as Salt
        String saltString = RandomStringUtils.randomAlphanumeric(16);
        String passwordHash = AESEncryption.encrypt(dbConnectionRequest.getPassword(), passwordEncryptionSecretKey,
                saltString);
        System.out.println(" ========== password = " + dbConnectionRequest.getPassword() + " encrypted password = "
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
            throws RecordNotFoundException {
        // fetch the particular DB connection for the user
        Optional<DBConnection> optionalDBConnection = dbConnectionRepository.findByIdAndUserId(id, userId);
        // if no connection details, then send NOT FOUND Error
        if (!optionalDBConnection.isPresent()) {
            throw new RecordNotFoundException("Error: No such Connection Id exists");
        }
        // delete the record from DB
        dbConnectionRepository.deleteById(id);
    }

}
