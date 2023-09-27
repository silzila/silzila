package org.silzila.app.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.simple.parser.ParseException;
import org.modelmapper.ModelMapper;
import org.silzila.app.AppApplication;
import org.silzila.app.dto.BigqueryConnectionDTO;
import org.silzila.app.dto.DBConnectionDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.ExpectationFailedException;
import org.silzila.app.exception.RecordNotFoundException;
import org.silzila.app.helper.ResultSetToJson;
import org.silzila.app.payload.request.DBConnectionRequest;
import org.silzila.app.payload.response.MessageResponse;
import org.silzila.app.payload.response.MetadataColumn;
import org.silzila.app.payload.response.MetadataTable;
import org.silzila.app.repository.DBConnectionRepository;
import org.silzila.app.service.ConnectionPoolService;
import org.silzila.app.service.DBConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
// import com.simba.googlebigquery.jdbc.DataSource;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class DBConnectionController {

    private static final Logger logger = LogManager.getLogger(DBConnectionController.class);

    @Autowired
    DBConnectionRepository dbConnectionRepository;

    @Autowired
    DBConnectionService dbConnectionService;

    @Autowired
    ConnectionPoolService connectionPoolService;

    ModelMapper mapper = new ModelMapper();

    @GetMapping("/database-connection/test")
    public ResponseEntity<?> protectedRoute(@RequestHeader Map<String, String> reqHeder) {
        return ResponseEntity.ok(new MessageResponse("test protected route!"));
    }

    @PostMapping("/database-connection")
    public ResponseEntity<?> registerDBConnection(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody DBConnectionRequest dbConnectionRequest) throws BadRequestException {
        // get the requester user id
        String userId = reqHeader.get("requesterUserId");
        // make service call to add record
        DBConnectionDTO dto = dbConnectionService.createDBConnection(dbConnectionRequest, userId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/database-connection")
    public ResponseEntity<?> getAllDBConnections(@RequestHeader Map<String, String> reqHeader) {
        // get the rquester user id
        String userId = reqHeader.get("requesterUserId");
        // service call to get list of DB connections,
        // empty list will not throw exceptions but return as empty list
        List<DBConnectionDTO> dtos = dbConnectionService.getAllDBConnections(userId);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/database-connection/{id}")
    public ResponseEntity<?> getConnectionById(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id) throws RecordNotFoundException {
        // get the rquester user id
        String userId = reqHeader.get("requesterUserId");
        // service call to get the DB Connection details
        DBConnectionDTO dto = dbConnectionService.getDBConnectionById(id, userId);
        return ResponseEntity.ok(dto);

    }

    @PutMapping("/database-connection/{id}")
    public ResponseEntity<?> updateDBConnection(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody DBConnectionRequest dbConnectionRequest, @PathVariable(value = "id") String id)
            throws RecordNotFoundException, BadRequestException {
        String userId = reqHeader.get("requesterUserId");
        // service call to update
        DBConnectionDTO dto = dbConnectionService.updateDBConnection(id, dbConnectionRequest, userId);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/database-connection/{id}")
    public ResponseEntity<?> deleteDBConnection(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id) throws RecordNotFoundException, FileNotFoundException {
        // get the rquester user id
        String userId = reqHeader.get("requesterUserId");
        // service call to delete
        dbConnectionService.deleteDBConnection(id, userId);
        return ResponseEntity.ok().body(new MessageResponse("DB Connection is deleted!"));

    }

    // test connect a given database with provided connection parameters
    @PostMapping("/database-connection-test")
    public ResponseEntity<?> testDBConnection(@Valid @RequestBody DBConnectionRequest dbConnectionRequest)
            throws SQLException, BadRequestException {
        connectionPoolService.testDBConnection(dbConnectionRequest);
        return ResponseEntity.ok().body(new MessageResponse("Connection OK!"));
    }

    // test connect a given database with provided connection parameters
    @PostMapping("/sqlserver-database-connection-test")
    public ResponseEntity<?> testSqlserverDBConnection()
            throws SQLException, BadRequestException {
        JSONArray jsonArray = connectionPoolService.testSqlserverDBConnection();
        List<String> schemaList = new ArrayList<>();
        if (jsonArray != null) {
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject rec = jsonArray.getJSONObject(i);
                String schema = rec.getString("schema_name");
                logger.info("######## " + jsonArray.get(i).toString());
                schemaList.add(schema);
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(schemaList);
    }

    // @PostMapping(value = "/run-query/{id}")
    // public ResponseEntity<String> runQuery(@RequestHeader Map<String, String>
    // reqHeader,
    // @PathVariable(value = "id") String id)
    // throws RecordNotFoundException, SQLException {
    // String userId = reqHeader.get("requesterUserId");
    // JSONArray jsonArray = connectionPoolService.runQuery(id, userId);
    // return ResponseEntity.status(HttpStatus.OK).body(jsonArray.toString());
    // }

    @PostMapping(value = "/test-sqlserver")
    public ResponseEntity<?> runSqlServer()
            throws RecordNotFoundException, SQLException {
        JSONArray jsonArray = connectionPoolService.checkSqlServer();
        return ResponseEntity.ok().body(jsonArray.toString());
    }

    // private static Connection connectViaDS() throws Exception {
    // // String token =
    // //
    // //
    // "{\"type\":\"service_account\",\"project_id\":\"stable-course-380911\",\"private_key_id\":\"0d77cb5f707bfba51930dbbf983b3f34043b6819\",\"private_key\":\"-----BEGINPRIVATEKEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCScumcevlt+fL8\\n9MgqtJ5DaZA9nA3gDs7glnIL5Sc/INDLtXMyf/tDdTljya9988qZ6tZYqNDCiLwx\\nEd1mKGJ90nC0NJc6HdbCKVFBd+Zx9Er2+WSwzfxYgAXKo5v44Qy/jIE0HxNevW3o\\nN1iv9gri4bN1/z9beuGSTjN35AXkoBrX80zX1aZ1GysoIgL5vZfvQ9lq9MCsyR5w\\ner4e60OeHcBUZaRT6KEkJToK/LQHDc3TAKaPTsZ5YXblp6eX/guofYUAaw65DBqI\\nVjmJgeUXQRkaMDIVnTJrbOD1dU1UiEzqSRdJ/zFm59ReRFdYEKPudn54DWJ3Q4U8\\nltlx75WhAgMBAAECggEAA+2/gN5HLfk6OKk/6+5dvwj4UMDMmf3HtLxweYt3lLDW\\njRp0aU7H4LDGvfuxgKdfQGcNgkIgHJHiu43DQtvzPXUdZyYwhuN5SQrm9kLHTLgN\\nIUhCOGCERCMGFMA0HVZ7OzHDnxB02nIqPkQq1cib1OeRYwlai6OVpNFCffVA57fN\\n8M8FGDC+PMnlR4wChbKCn7EBj5a3Op2AhlvZQ9ZrQIG1r7nKcpJ7dMpGdONa/hOx\\nBqX/8iUQ0MS2ES+j0H11BhnC1BU7iDX6ARg72N+aEPDL/15EVBHvcFMzslDTz9o7\\nALSqnGLY7WBH+UFKV7Y6pdAku8goD7vPsSQy/+UkAQKBgQDEJbOh1wogkEApDcab\\nsSNFAu7be3aVr3oAxPMKwETQbctcD11P3R8j+GIaoAWRc0RTRzVZ9lei32AR4OGf\\nUqlltoTS9EyAzB8X7r+ggVaU6MDGOzY4CWYtKW+dfWd+ALfPjzqb8hkLLyciBlVz\\nWcMJGq/EHQ+4pSj4skntJ+yFAQKBgQC/IvTSDOwmbItZjMhF5AAA87PpMMbV4xV4\\ncQgXmEjrSomDYoo+PfkeDFTXknP1SMoZyyYXX9SCCRC5y+/8a84MWuDOwVJbQvYw\\nSvX2XsvR/Ipqi4Dto9jh8igR1Om8FKsSJEO17OZzETC/OYRTlawSQefiPsI0YmKQ\\nVT3Znn/woQKBgEHIDx1Yu/m9xva9uvzeBGERob+UAWoj5nu5kXTqlGl+WPQv5vBw\\nzQ/ILkaVoihsit6PBBJ+rldeKJ72V1SSaWNGOfdxnPKZAliJZlTS65GXGYehtgZH\\nCLBetCMSOpIkdYCznUlNgR6iGrKrgx7jXKiB/a58vJgFM99sE6TofccBAoGASbpy\\nNZRGg4vbNO/ZURxh4/wdqhXmnRq7bXosZO2ZMynNYaDhMqE1NyIKmB0mHbe2Pbzf\\nNKUClCZrDUBdkkEDekCT9y0bV5i83mQL/L0UYivIONEXKpPJVV7Tlg1LHAHc+2KB\\nu+tl+XzoENte798MQP6rM9qBjzNkUciP0yIQuAECgYEAqWvmUHlNOLqcgl89w28Q\\nJq0e9ECuFtmARr/3FK6KpX3jd62d8vZUQJI5cIa4nqMn1V1lUNVLGQ3KlLQ5dt95\\nScCPc/oKGvZrnC1kP8VUNo+nCEuMmMDOyQLReztFQZJoD9KAeiIxfW0cd1tEwOmI\\nfJ1ToVWjHHqbHukEqyYts9A=\\n-----ENDPRIVATEKEY-----\\n\",\"client_email\":\"svc-balu@stable-course-380911.iam.gserviceaccount.com\",\"client_id\":\"101389739033240098558\",\"auth_uri\":\"https://accounts.google.com/o/oauth2/auth\",\"token_uri\":\"https://oauth2.googleapis.com/token\",\"auth_provider_x509_cert_url\":\"https://www.googleapis.com/oauth2/v1/certs\",\"client_x509_cert_url\":\"https://www.googleapis.com/robot/v1/metadata/x509/svc-balu%40stable-course-380911.iam.gserviceaccount.com\"}";
    // String token =
    // "{\"type\":\"service_account\",\"project_id\":\"stable-course-380911\",\"private_key_id\":\"0d77cb5f707bfba51930dbbf983b3f34043b6819\",\"private_key\":\"MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCScumcevlt+fL8\\n9MgqtJ5DaZA9nA3gDs7glnIL5Sc/INDLtXMyf/tDdTljya9988qZ6tZYqNDCiLwx\\nEd1mKGJ90nC0NJc6HdbCKVFBd+Zx9Er2+WSwzfxYgAXKo5v44Qy/jIE0HxNevW3o\\nN1iv9gri4bN1/z9beuGSTjN35AXkoBrX80zX1aZ1GysoIgL5vZfvQ9lq9MCsyR5w\\ner4e60OeHcBUZaRT6KEkJToK/LQHDc3TAKaPTsZ5YXblp6eX/guofYUAaw65DBqI\\nVjmJgeUXQRkaMDIVnTJrbOD1dU1UiEzqSRdJ/zFm59ReRFdYEKPudn54DWJ3Q4U8\\nltlx75WhAgMBAAECggEAA+2/gN5HLfk6OKk/6+5dvwj4UMDMmf3HtLxweYt3lLDW\\njRp0aU7H4LDGvfuxgKdfQGcNgkIgHJHiu43DQtvzPXUdZyYwhuN5SQrm9kLHTLgN\\nIUhCOGCERCMGFMA0HVZ7OzHDnxB02nIqPkQq1cib1OeRYwlai6OVpNFCffVA57fN\\n8M8FGDC+PMnlR4wChbKCn7EBj5a3Op2AhlvZQ9ZrQIG1r7nKcpJ7dMpGdONa/hOx\\nBqX/8iUQ0MS2ES+j0H11BhnC1BU7iDX6ARg72N+aEPDL/15EVBHvcFMzslDTz9o7\\nALSqnGLY7WBH+UFKV7Y6pdAku8goD7vPsSQy/+UkAQKBgQDEJbOh1wogkEApDcab\\nsSNFAu7be3aVr3oAxPMKwETQbctcD11P3R8j+GIaoAWRc0RTRzVZ9lei32AR4OGf\\nUqlltoTS9EyAzB8X7r+ggVaU6MDGOzY4CWYtKW+dfWd+ALfPjzqb8hkLLyciBlVz\\nWcMJGq/EHQ+4pSj4skntJ+yFAQKBgQC/IvTSDOwmbItZjMhF5AAA87PpMMbV4xV4\\ncQgXmEjrSomDYoo+PfkeDFTXknP1SMoZyyYXX9SCCRC5y+/8a84MWuDOwVJbQvYw\\nSvX2XsvR/Ipqi4Dto9jh8igR1Om8FKsSJEO17OZzETC/OYRTlawSQefiPsI0YmKQ\\nVT3Znn/woQKBgEHIDx1Yu/m9xva9uvzeBGERob+UAWoj5nu5kXTqlGl+WPQv5vBw\\nzQ/ILkaVoihsit6PBBJ+rldeKJ72V1SSaWNGOfdxnPKZAliJZlTS65GXGYehtgZH\\nCLBetCMSOpIkdYCznUlNgR6iGrKrgx7jXKiB/a58vJgFM99sE6TofccBAoGASbpy\\nNZRGg4vbNO/ZURxh4/wdqhXmnRq7bXosZO2ZMynNYaDhMqE1NyIKmB0mHbe2Pbzf\\nNKUClCZrDUBdkkEDekCT9y0bV5i83mQL/L0UYivIONEXKpPJVV7Tlg1LHAHc+2KB\\nu+tl+XzoENte798MQP6rM9qBjzNkUciP0yIQuAECgYEAqWvmUHlNOLqcgl89w28Q\\nJq0e9ECuFtmARr/3FK6KpX3jd62d8vZUQJI5cIa4nqMn1V1lUNVLGQ3KlLQ5dt95\\nScCPc/oKGvZrnC1kP8VUNo+nCEuMmMDOyQLReztFQZJoD9KAeiIxfW0cd1tEwOmI\\nfJ1ToVWjHHqbHukEqyYts9A=\",\"client_email\":\"svc-balu@stable-course-380911.iam.gserviceaccount.com\",\"client_id\":\"101389739033240098558\",\"auth_uri\":\"https://accounts.google.com/o/oauth2/auth\",\"token_uri\":\"https://oauth2.googleapis.com/token\",\"auth_provider_x509_cert_url\":\"https://www.googleapis.com/oauth2/v1/certs\",\"client_x509_cert_url\":\"https://www.googleapis.com/robot/v1/metadata/x509/svc-balu%40stable-course-380911.iam.gserviceaccount.com\"}";

    // // ObjectMapper mapper = new ObjectMapper();
    // // JsonNode node = mapper.readTree(token);
    // System.out.println(token);

    // // String URL =
    // //
    // //
    // "jdbc:bigquery://https://www.googleapis.com/bigquery/v2:443;ProjectId=stable-course-380911;OAuthType=0;OAuthServiceAcctEmail=svc-balu@stable-course-380911.iam.gserviceaccount.com;OAuthPvtKeyPath=/home/balu/Documents/Tokens/Big_Query_Token/stable-course-380911-0d77cb5f707b.json;";
    // String URL = "jdbc:bigquery://https://www.googleapis.com/bigquery/v2:443;";
    // Connection connection = null;
    // DataSource ds = new DataSource();
    // ds.setURL(URL);
    // ds.setProjectId("stable-course-380911");
    // ds.setOAuthType(0);
    // // ds.setOAuthPvtKey(token);
    // ds.setOAuthServiceAcctEmail("svc-balu@stable-course-380911.iam.gserviceaccount.com");
    // ds.setOAuthType(0);
    // // ds.setProjectId("stable-course-380911");
    // ds.setOAuthPvtKeyFilePath("/home/balu/Documents/Tokens/Big_Query_Token/stable-course-380911-0d77cb5f707b.json");
    // connection = ds.getConnection();
    // return connection;
    // }

    // @PostMapping(value = "/test-bigquery-original")
    // public ResponseEntity<?> testBigQueryOriginal()
    // throws Exception {
    // // JSONArray jsonArray = connectionPoolService.checkSqlServer();
    // Connection conn = connectViaDS();
    // Statement st = conn.createStatement();
    // // ResultSet rs = st.executeQuery("select * FROM
    // // `stable-course-380911`.landmark.store;");
    // ResultSet rs = st.executeQuery("select 1;");
    // // while (rs.next()) {
    // // System.out.println("**********************" + rs.getString(2));
    // // }
    // JSONArray jsonArray = ResultSetToJson.convertToJson(rs);
    // System.out.println("==================" + jsonArray.toString());
    // rs.close();
    // st.close();
    // conn.close();
    // return ResponseEntity.ok().body(jsonArray.toString());
    // }

    @PostMapping(value = "test-bigquery")
    public ResponseEntity<?> testBigQuery(@RequestParam("file") MultipartFile file)
            throws FileNotFoundException, ExpectationFailedException, IOException, ParseException, SQLException,
            BadRequestException {
        BigqueryConnectionDTO bigQryConnDTO = dbConnectionService.processBigQueryTokenFile(file, false);
        connectionPoolService.testDBConnectionBigQuery(bigQryConnDTO);
        return ResponseEntity.ok().body(new MessageResponse("Connection OK!"));
    }

    @PostMapping(value = "database-connection-bigquery")
    public ResponseEntity<?> registerDBConnectionBigquery(@RequestHeader Map<String, String> reqHeader,
            @RequestParam("file") MultipartFile file,
            @RequestParam("connectionName") String connectionName)
            throws FileNotFoundException, ExpectationFailedException, IOException, ParseException, SQLException,
            BadRequestException {
        // get connection details from uploaded token file
        BigqueryConnectionDTO bigQryConnDTO = dbConnectionService.processBigQueryTokenFile(file, true);
        // get the rquester user id
        String userId = reqHeader.get("requesterUserId");
        // make service call to add record
        DBConnectionDTO dto = dbConnectionService.createDBConnectionBigQuery(bigQryConnDTO, connectionName, userId);
        return ResponseEntity.ok(dto);
    }

    @PutMapping(value = "database-connection-bigquery/{id}")
    public ResponseEntity<?> updateDBConnectionBigquery(@RequestHeader Map<String, String> reqHeader,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "connectionName") String connectionName,
            @PathVariable(value = "id") String id)
            throws FileNotFoundException, ExpectationFailedException, IOException, ParseException, SQLException,
            BadRequestException, RecordNotFoundException {
        // get the rquester user id
        String userId = reqHeader.get("requesterUserId");
        // make service call to update record
        DBConnectionDTO dto = dbConnectionService.updateDBConnectionBigQuery(id, userId, connectionName, file);
        return ResponseEntity.ok(dto);
    }

    // Metadata discovery - get List of databases
    @GetMapping(value = "/metadata-databases/{id}")
    ResponseEntity<ArrayList<String>> getDatabase(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id)
            throws RecordNotFoundException, SQLException {
        String userId = reqHeader.get("requesterUserId");
        ArrayList<String> databases = connectionPoolService.getDatabase(id, userId);
        return ResponseEntity.status(HttpStatus.OK).body(databases);
    }

    // Metadata discovery - get List of schemas
    @GetMapping(value = "/metadata-schemas/{id}")
    ResponseEntity<List<String>> getSchema(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id,
            @RequestParam(name = "database", required = false) String databaseName)
            throws RecordNotFoundException, SQLException, BadRequestException {
        String userId = reqHeader.get("requesterUserId");
        List<String> schema = connectionPoolService.getSchema(id, userId, databaseName);
        return ResponseEntity.status(HttpStatus.OK).body(schema);
    }

    // Metadata discovery - get List of tables
    @GetMapping("/metadata-tables/{id}")
    ResponseEntity<?> getTable(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id,
            @RequestParam(name = "database", required = false) String databaseName,
            @RequestParam(name = "schema", required = false) String schemaName)
            throws RecordNotFoundException, SQLException, BadRequestException {
        String userId = reqHeader.get("requesterUserId");
        MetadataTable metadataTable = connectionPoolService.getTable(id, userId, databaseName, schemaName);
        return ResponseEntity.status(HttpStatus.OK).body(metadataTable);
    }

    // Metadata discovery - get List of fields
    @GetMapping("/metadata-columns/{id}")
    public ResponseEntity<?> getColumn(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id,
            @RequestParam(name = "database", required = false) String databaseName,
            @RequestParam(name = "schema", required = false) String schemaName,
            @RequestParam(name = "table") String tableName)
            throws RecordNotFoundException, SQLException, BadRequestException {
        String userId = reqHeader.get("requesterUserId");
        ArrayList<MetadataColumn> metadataColumns = connectionPoolService.getColumn(id, userId, databaseName,
                schemaName, tableName);
        return ResponseEntity.status(HttpStatus.OK).body(metadataColumns);
    }

    // Metadata discovery - get sample records
    @GetMapping("/sample-records/{id}/{recordCount}")
    public ResponseEntity<?> getSampleRecords(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id,
            @PathVariable(value = "recordCount") Integer recordCount,
            @RequestParam(name = "database", required = false) String databaseName,
            @RequestParam(name = "schema", required = false) String schemaName,
            @RequestParam(name = "table") String tableName)
            throws RecordNotFoundException, SQLException, BadRequestException {
        String userId = reqHeader.get("requesterUserId");
        JSONArray jsonArray = connectionPoolService.getSampleRecords(id, userId, databaseName,
                schemaName, tableName, recordCount);
        return ResponseEntity.status(HttpStatus.OK).body(jsonArray.toString());
    }

}
