package org.silzila.app.controller;

import org.modelmapper.ModelMapper;
// import org.silzila.app.converter.DBConnectionConverter;
import org.silzila.app.dto.DBConnectionDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.RecordNotFoundException;
import org.silzila.app.model.DBConnection;
import org.silzila.app.payload.request.DBConnectionRequest;
import org.silzila.app.payload.response.MessageResponse;
import org.silzila.app.repository.DBConnectionRepository;
import org.silzila.app.security.service.ConnectionPoolService;
import org.silzila.app.security.service.DBConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
        String userId = reqHeder.get("requesterUserId");
        // System.out.println("logged in user id ========= " + userId);
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

    // test connect a given database connection parameters
    @PostMapping("/database-connection-test")
    public ResponseEntity<?> testDBConnection(@Valid @RequestBody DBConnectionRequest dbConnectionRequest)
            throws SQLException, BadRequestException {
        connectionPoolService.testDBConnection(dbConnectionRequest);
        return ResponseEntity.ok().body(new MessageResponse("Connection OK!"));

    }

}
