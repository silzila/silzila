package com.silzila.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.silzila.payload.request.CustomQueryRequest;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;

import com.silzila.dto.DBConnectionDTO;
import com.silzila.dto.OracleDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.ExpectationFailedException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.DBConnectionRequest;
import com.silzila.payload.response.MessageResponse;
import com.silzila.payload.response.MetadataColumn;
import com.silzila.payload.response.MetadataTable;
import com.silzila.repository.DBConnectionRepository;
import com.silzila.service.ConnectionPoolService;
import com.silzila.service.DBConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// import com.simba.googlebigquery.jdbc.DataSource;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.SQLException;

import javax.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
// @RequestMapping("/api")
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
            @RequestParam String workspaceId,
            @Valid @RequestBody DBConnectionRequest dbConnectionRequest) throws BadRequestException {
        // get the requester user id
        String userId = reqHeader.get("username");
        // make service call to add record
        DBConnectionDTO dto = dbConnectionService.createDBConnection(dbConnectionRequest, userId, workspaceId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/database-connection")
    public ResponseEntity<?> getAllDBConnections(@RequestHeader Map<String, String> reqHeader,
            @RequestParam String workspaceId) throws BadRequestException {
        // get the rquester user id
        String userId = reqHeader.get("username");
        // service call to get list of DB connections,
        // empty list will not throw exceptions but return as empty list
        List<DBConnectionDTO> dtos = dbConnectionService.getAllDBConnections(userId, workspaceId);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/database-connection/{id}")
    public ResponseEntity<?> getConnectionById(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id, @RequestParam String workspaceId) throws RecordNotFoundException {
        // get the rquester user id
        String userId = reqHeader.get("username");
        // service call to get the DB Connection details
        DBConnectionDTO dto = dbConnectionService.getDBConnectionById(id, userId, workspaceId);
        return ResponseEntity.ok(dto);

    }

    @PutMapping("/database-connection/{id}")
    public ResponseEntity<?> updateDBConnection(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody DBConnectionRequest dbConnectionRequest, @PathVariable(value = "id") String id,
            @RequestParam String workspaceId)
            throws RecordNotFoundException, BadRequestException {
        String userId = reqHeader.get("username");
        // service call to update
        DBConnectionDTO dto = dbConnectionService.updateDBConnection(id, dbConnectionRequest, userId, workspaceId);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/database-connection/{id}")
    public ResponseEntity<?> deleteDBConnection(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id, @RequestParam String workspaceId)
            throws RecordNotFoundException, FileNotFoundException, BadRequestException {
        // get the rquester user id
        String userId = reqHeader.get("username");
        // service call to delete
        dbConnectionService.deleteDBConnection(id, userId, workspaceId);
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

    @PostMapping(value = "/test-sqlserver")
    public ResponseEntity<?> runSqlServer()
            throws RecordNotFoundException, SQLException {
        JSONArray jsonArray = connectionPoolService.checkSqlServer();
        return ResponseEntity.ok().body(jsonArray.toString());
    }

    // Metadata discovery - get List of databases
    @GetMapping(value = "/metadata-databases/{id}")
    ResponseEntity<ArrayList<String>> getDatabase(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id,
            @RequestParam(name = "workspaceId", required = false) String workspaceId)
            throws RecordNotFoundException, SQLException {
        String userId = reqHeader.get("username");
        ArrayList<String> databases = connectionPoolService.getDatabase(id, userId, workspaceId);
        return ResponseEntity.status(HttpStatus.OK).body(databases);
    }

    // Metadata discovery - get List of schemas
    @GetMapping(value = "/metadata-schemas/{id}")
    ResponseEntity<List<String>> getSchema(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id,
            @RequestParam(name = "workspaceId", required = false) String workspaceId,
            @RequestParam(name = "database", required = false) String databaseName)
            throws RecordNotFoundException, SQLException, BadRequestException {
        String userId = reqHeader.get("username");
        List<String> schema = connectionPoolService.getSchema(id, userId, databaseName, workspaceId);
        return ResponseEntity.status(HttpStatus.OK).body(schema);
    }

    // Metadata discovery - get List of tables
    @GetMapping("/metadata-tables/{id}")
    ResponseEntity<?> getTable(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id,
            @RequestParam(name = "workspaceId", required = false) String workspaceId,
            @RequestParam(name = "database", required = false) String databaseName,
            @RequestParam(name = "schema", required = false) String schemaName)
            throws RecordNotFoundException, SQLException, BadRequestException {
        String userId = reqHeader.get("username");
        MetadataTable metadataTable = connectionPoolService.getTable(id, userId, databaseName, schemaName, workspaceId);
        return ResponseEntity.status(HttpStatus.OK).body(metadataTable);
    }

    // Metadata discovery - get List of fields
    @GetMapping("/metadata-columns/{id}")
    public ResponseEntity<?> getColumn(@RequestHeader Map<String, String> reqHeader,
            @RequestParam(name = "workspaceId", required = false) String workspaceId,
            @PathVariable(value = "id") String id,
            @RequestParam(name = "database", required = false) String databaseName,
            @RequestParam(name = "schema", required = false) String schemaName,
            @RequestParam(name = "table") String tableName)
            throws RecordNotFoundException, SQLException, BadRequestException {
        String userId = reqHeader.get("username");
        ArrayList<MetadataColumn> metadataColumns = connectionPoolService.getColumn(id, userId, databaseName,
                schemaName, tableName,workspaceId);
        return ResponseEntity.status(HttpStatus.OK).body(metadataColumns);
    }

    @PostMapping("/metadata-columns-customquery/{id}")
    public ResponseEntity<?> getColumnForCustomQuery(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id,
            @RequestParam(name = "workspaceId", required = false) String workspaceId,
            @RequestBody CustomQueryRequest customQueryRequest)
            throws RecordNotFoundException, SQLException, ExpectationFailedException {
        String userId = reqHeader.get("username");
        ArrayList<MetadataColumn> columnList = connectionPoolService.getColumForCustomQuery(id, userId,
                customQueryRequest.getQuery(),workspaceId);
        return ResponseEntity.status(HttpStatus.OK).body(columnList);
    }
    // Metadata discovery - get sample records
    @GetMapping("/sample-records")
    public ResponseEntity<?> getSampleRecords(@RequestHeader Map<String, String> reqHeader,
            @RequestParam(value = "databaseId") String databaseId,
            @RequestParam(value = "datasetId", required = false) String datasetId,
            @RequestParam(value = "recordCount",required = false) Integer recordCount,
            @RequestParam(name = "database", required = false) String databaseName,
            @RequestParam(name = "schema", required = false) String schemaName,
            @RequestParam(name = "workspaceId", required = false) String workspaceId,
            @RequestParam(name = "table") String tableName,
            @RequestParam(name = "tableId",required = false) String tableId)
            throws RecordNotFoundException, SQLException, BadRequestException, JsonProcessingException,
            ClassNotFoundException {
        String userId = reqHeader.get("username");
        JSONArray jsonArray = connectionPoolService.getSampleRecords(databaseId, datasetId, workspaceId,userId, databaseName,
                schemaName, tableName, recordCount,tableId);
        return ResponseEntity.status(HttpStatus.OK).body(jsonArray.toString());
    }

    @PostMapping("/sample-records-customquery/{databaseId}/{recordCount}")
    public ResponseEntity<?> getSampleRecordsCustomQuery(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "databaseId") String databaseId,
            @PathVariable(value = "recordCount") Integer recordCount,
            @RequestParam(name = "workspaceId", required = false) String workspaceId,
            @RequestBody CustomQueryRequest customQueryRequest)
            throws RecordNotFoundException, SQLException, ExpectationFailedException, JsonProcessingException {
        String userId = reqHeader.get("username");
        JSONArray jsonArray = connectionPoolService.getSampleRecordsForCustomQuery(databaseId,workspaceId, userId,
                customQueryRequest.getQuery(), recordCount);
        return ResponseEntity.status(HttpStatus.OK).body(jsonArray.toString());
    }

    @PostMapping("/testOracleConnection")
    public ResponseEntity<?> testOracleConnection(@ModelAttribute OracleDTO oracleDTO)
            throws IOException, BadRequestException {

        connectionPoolService.testOracleConnection(oracleDTO);

        return ResponseEntity.status(HttpStatus.OK).body("Test Success");
    }

    @PostMapping("/createOracleConnection")
    public ResponseEntity<?> createOracleConnection(
            @RequestHeader Map<String, String> reqHeader,
            @ModelAttribute OracleDTO oracleDTO,@RequestParam String workspaceId) throws IOException, BadRequestException {

        String userId = reqHeader.get("username");

        DBConnectionDTO dto = dbConnectionService.createOracleDBConnection(userId, oracleDTO,workspaceId);

        return ResponseEntity.ok(dto);
    }

    // update oracleDBconnection seperate

    @PutMapping("/updateOracleConnection/{id}")
    public ResponseEntity<?> updateOracleConnection(
            @RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id,
            @RequestParam String workspaceId,
            @ModelAttribute OracleDTO oracleDTO)
            throws IOException, BadRequestException, RecordNotFoundException {

        String userId = reqHeader.get("username");

        DBConnectionDTO dto = dbConnectionService.updateOracleDBConnection(id, userId, oracleDTO,workspaceId);

        return ResponseEntity.ok(dto);
    }

}
