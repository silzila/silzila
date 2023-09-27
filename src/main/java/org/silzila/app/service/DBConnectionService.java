package org.silzila.app.service;

import org.silzila.app.repository.DBConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.silzila.app.AppApplication;
import org.silzila.app.dto.BigqueryConnectionDTO;

// import com.simba.googlebigquery.jdbc.DataSource;

import org.silzila.app.dto.DBConnectionDTO;
import org.silzila.app.model.DBConnection;
import org.silzila.app.payload.request.DBConnectionRequest;
import org.silzila.app.exception.RecordNotFoundException;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.ExpectationFailedException;
import org.silzila.app.security.encryption.AESEncryption;

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
        if (!dbConnection.getVendor().equals("bigquery")) {
            dbConnection
                    .setPasswordHash(AESEncryption.decrypt(dbConnection.getPasswordHash(), passwordEncryptionSecretKey,
                            dbConnection.getSalt()));
        }
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
                null,
                null,
                null);
        dbConnectionRepository.save(dbConnection);
        DBConnectionDTO dto = mapper.map(dbConnection, DBConnectionDTO.class);
        return dto;
    }

    public DBConnectionDTO createDBConnectionBigQuery(BigqueryConnectionDTO bigQryConnDTO,
            String connectionName,
            String userId)
            throws BadRequestException {
        // check if connection name is alredy used for the requester
        checkConnectionNameExists(userId, connectionName);

        // create DB Connection object and save it to DB
        // many properties are not needed for bigquery, so kept as empty
        DBConnection dbConnection = new DBConnection(
                userId,
                "bigquery",
                "",
                0,
                "",
                "",
                "",
                "",
                connectionName,
                "",
                bigQryConnDTO.getProjectId(),
                bigQryConnDTO.getClientEmail(),
                bigQryConnDTO.getTokenFileName());
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

    public DBConnectionDTO updateDBConnectionBigQuery(String id, String userId, String connectionName,
            MultipartFile file)
            throws RecordNotFoundException, BadRequestException, FileNotFoundException, ExpectationFailedException,
            IOException, ParseException, SQLException {
        // when file is not uploaded and connection name is not given then send error
        if ((file == null || file.isEmpty()) && (connectionName == null || connectionName.trim().isEmpty())) {
            throw new BadRequestException("Error: New Connection Name or new Token file must be given!");
        }

        DBConnection _dbConnection = checkDBConnectionNameAlreadyExist(id, connectionName, userId);

        // when file is given
        if (file != null && !file.isEmpty()) {
            // System.out.println("############file is not empty##########");
            BigqueryConnectionDTO bigQryConnDTO = processBigQueryTokenFile(file, true);
            // delete old token file
            final String oldFilePath = System.getProperty("user.home") + "/silzila-uploads/tokens/"
                    + _dbConnection.getFileName();
            logger.warn("file to be deleted ====== " + oldFilePath);
            try {
                logger.warn("**********TRY delete old file ***********");
                Files.delete(Paths.get(oldFilePath));
            } catch (Exception e) {
                logger.warn("**********CATCH delete old file ***********");
                throw new FileNotFoundException("old token file could not be deleted");
            }
            _dbConnection.setProjectId(bigQryConnDTO.getProjectId());
            _dbConnection.setClientEmail(bigQryConnDTO.getClientEmail());
            _dbConnection.setFileName(bigQryConnDTO.getTokenFileName());
        }
        // when new connection name is given
        if (connectionName != null && !connectionName.trim().isEmpty()) {
            _dbConnection.setConnectionName(connectionName);
        }
        // update in DB
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

        DBConnection _dbConnection = optionalDBConnection.get();
        // delete old token file for BigQuery
        if (_dbConnection.getVendor().equals("bigquery")) {
            final String oldFilePath = System.getProperty("user.home") + "/silzila-uploads/tokens/"
                    + _dbConnection.getFileName();
            try {
                Files.delete(Paths.get(oldFilePath));
            } catch (Exception e) {
                // throw new FileNotFoundException("old token file could not be deleted");
                logger.warn("Warning: old token file could not be deleted: " + e.getMessage());
            }
        }
        // delete the record from DB
        dbConnectionRepository.deleteById(id);
    }

    public BigqueryConnectionDTO processBigQueryTokenFile(MultipartFile file, Boolean isPersist)
            throws ExpectationFailedException, FileNotFoundException, IOException, ParseException, SQLException,
            BadRequestException {
        String tokenSavedFolder = "";
        if (isPersist == false) {
            tokenSavedFolder = "tmp";
        } else {
            tokenSavedFolder = "tokens";
        }
        Path path = Paths.get(SILZILA_DIR, tokenSavedFolder);

        String uploadedFileNameWithoutExtn = "";
        String savedFileName = "";

        // create tmp folder
        try {
            Files.createDirectories(path);

        } catch (Exception e) {
            throw new RuntimeException("Could not initialize folder for upload. Errorr: " + e.getMessage());
        }
        // only JSON file is allowed and throws error if otherwise
        if (!(file.getContentType() == null || file.getContentType().equals("application/json"))) {
            throw new ExpectationFailedException("Error: Only CSV file is allowed!");
        }
        // upload file
        try {
            // rename to random id while saving file
            savedFileName = UUID.randomUUID().toString().substring(0, 8) + ".json";
            // trim file name without file extension - used for naming data frame
            uploadedFileNameWithoutExtn = file.getOriginalFilename().substring(0,
                    file.getOriginalFilename().lastIndexOf("."));
            // persisting file
            Files.copy(file.getInputStream(), path.resolve(savedFileName));
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }

        final String filePath = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + tokenSavedFolder + "/"
                + savedFileName;
        // read the json token file
        Object obj = new JSONParser().parse(new FileReader(filePath));
        // typecasting obj to JSONObject
        JSONObject jo = (JSONObject) obj;
        // get email from the JSON object
        String clientEmail = (String) jo.get("client_email");
        if (clientEmail == null) {
            logger.warn("Email is null " + clientEmail);
            throw new ExpectationFailedException("JSON file does not contain the key value for client_email");
        }
        // get email from the JSON object
        String projectId = (String) jo.get("project_id");
        if (projectId == null) {
            logger.warn("Project Id is null " + projectId);
            throw new ExpectationFailedException("JSON file does not contain the key value for project_id");
        }
        // System.out.println("projectId ===================== " + projectId);

        BigqueryConnectionDTO bigQryConnDTO = new BigqueryConnectionDTO(projectId, clientEmail, savedFileName);

        // delete temp file (applicable only when testing connection)
        // if (isPersist == false) {
        // System.out.println("file to be deleted ====== " + filePath);
        // try {
        // System.out.println("**********TRY***********");
        // Files.delete(Paths.get(filePath));
        // } catch (Exception e) {
        // System.out.println("**********CATCH***********");
        // throw new FileNotFoundException("token file could not be deleted");
        // }
        // }
        return bigQryConnDTO;
    }

    public ArrayList<String> testBigQuery(MultipartFile file)
            throws ExpectationFailedException, FileNotFoundException, IOException, ParseException, SQLException,
            BadRequestException {
        Path path = Paths.get(SILZILA_DIR, "tmp");
        String uploadedFileNameWithoutExtn = "";
        String savedFileName = "";

        // create tmp folder
        try {
            Files.createDirectories(path);

        } catch (Exception e) {
            throw new RuntimeException("Could not initialize folder for upload. Errorr: " + e.getMessage());
        }
        // only JSON file is allowed and throws error if otherwise
        if (!(file.getContentType() == null || file.getContentType().equals("application/json"))) {
            throw new ExpectationFailedException("Error: Only CSV file is allowed!");
        }
        // upload file
        try {
            // rename to random id while saving file
            savedFileName = UUID.randomUUID().toString().substring(0, 8) + ".json";
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
        // read the json token file
        Object obj = new JSONParser().parse(new FileReader(filePath));
        // typecasting obj to JSONObject
        JSONObject jo = (JSONObject) obj;
        // get email from the JSON object
        String clientEmail = (String) jo.get("client_email");
        if (clientEmail == null) {
            logger.warn("EMAIL is null " + clientEmail);
            throw new ExpectationFailedException("JSON file does not contain the key value for client_email");
        }
        // get email from the JSON object
        String projectId = (String) jo.get("project_id");
        if (projectId == null) {
            logger.warn("EMAIL is null " + projectId);
            throw new ExpectationFailedException("JSON file does not contain the key value for project_id");
        }
        logger.info("projectId ===================== " + projectId);

        ArrayList<String> connectionVariableArray = new ArrayList<String>() {
            {
                add(projectId);
                add(clientEmail);
                add(filePath);
            }
        };
        return connectionVariableArray;

        // // connect to bigquery
        // String URL = "jdbc:bigquery://https://www.googleapis.com/bigquery/v2:443;";
        // Connection connection = null;
        // DataSource dataSource = new DataSource();
        // dataSource.setURL(URL);
        // dataSource.setProjectId(projectId);
        // dataSource.setOAuthType(0);
        // dataSource.setOAuthServiceAcctEmail(clientEmail);
        // dataSource.setOAuthPvtKeyFilePath(filePath);
        // connection = dataSource.getConnection();
        // try {
        // Statement statement = connection.createStatement();
        // ResultSet resultSet = statement.executeQuery("SELECT 1");
        // Integer rowCount = 0;
        // while (resultSet.next()) {
        // rowCount++;
        // }
        // // return error if no record is fetched
        // if (rowCount == 0) {
        // throw new BadRequestException("Error: Something wrong!");
        // }
        // } catch (Exception e) {
        // System.out.println("error: " + e.toString());
        // throw e;
        // } finally {
        // // resultSet.close();
        // // statement.close();
        // connection.close();
        // // dataSource.close();
        // }

    }

}
