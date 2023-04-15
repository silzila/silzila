package org.silzila.app.controller;

import org.json.JSONArray;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.silzila.app.dto.DBConnectionDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.RecordNotFoundException;
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

import java.sql.SQLException;
import javax.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class DBConnectionController {

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
        // get the rquester user id
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
            @PathVariable(value = "id") String id) throws RecordNotFoundException {
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
                System.out.println("######## " + jsonArray.get(i).toString());
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
