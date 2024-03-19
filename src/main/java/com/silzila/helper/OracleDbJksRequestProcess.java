package com.silzila.helper;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.silzila.dto.OracleDTO;
import com.silzila.payload.request.DBConnectionRequest;


public class OracleDbJksRequestProcess {
    
    // all uploads are initially saved in tmp
    private static final String SILZILA_DIR = System.getProperty("user.home") + "/" +
    "silzila-uploads";
    // private static final String SILZILA_DIR = "F:\\Silzila\\Oracle DB";

    // Boolean parameter indicating whether to save the files or not.
    private static DBConnectionRequest processKeyStoreAndTrustStore(DBConnectionRequest req, MultipartFile keyStore,
            MultipartFile truststore, boolean save) throws IOException {
        Path directory = Paths.get(SILZILA_DIR, "jks_Collections", save ? "store" : "temptest");

        Files.createDirectories(directory);

        //setting the keystore and truststore file name
        req.setKeystore(writeStoreFile(keyStore, directory));

        req.setTruststore(writeStoreFile(truststore, directory));

        return req;
    }

    // create a file and save in a folder 
    private static  String writeStoreFile(MultipartFile file, Path directory) throws IOException {

        byte[] bytes = file.getBytes();

        String newFileName = UUID.randomUUID().toString().substring(0, 8) + ".jks";

        Path filePath = directory.resolve(newFileName);

        Files.write(filePath, bytes);

        return newFileName;
    }

    // Boolean parameter indicating whether to save the files or not.
    public static DBConnectionRequest parseOracleConnectionRequest(OracleDTO oracleDTO,Boolean store) throws IOException {

        DBConnectionRequest reqWithoutFileName = new DBConnectionRequest(oracleDTO.getVendor(), oracleDTO.getHost(),
                Integer.parseInt(oracleDTO.getPort()), oracleDTO.getServiceName(), oracleDTO.getUsername(),
                oracleDTO.getPassword(), null, oracleDTO.getConnectionName(), null, oracleDTO.getKeystorePassword(),
                null, oracleDTO.getTruststorePassword(), null);

        DBConnectionRequest req = processKeyStoreAndTrustStore(reqWithoutFileName,
                oracleDTO.getKeystore(), oracleDTO.getTruststore(), store);

        return req;
    }
}


