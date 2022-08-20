package org.silzila.app.controller;

import org.modelmapper.ModelMapper;
import org.silzila.app.converter.DBConnectionConverter;
import org.silzila.app.dto.DBConnectionDTO;
import org.silzila.app.model.DBConnection;
import org.silzila.app.payload.request.DBConnectionRequest;
import org.silzila.app.payload.response.MessageResponse;
import org.silzila.app.repository.DBConnectionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    DBConnectionConverter dbConnectionConverter;

    ModelMapper mapper = new ModelMapper();

    @GetMapping("/database-connection/test")
    public ResponseEntity<?> protectedRoute(@RequestHeader Map<String, String> reqHeder) {
        String userId = reqHeder.get("requesterUserId");
        // System.out.println("logged in user id ========= " + userId);
        return ResponseEntity.ok(new MessageResponse("test protected route!"));
    }

    @PostMapping("/database-connection")
    public ResponseEntity<?> registerDBConnection(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody DBConnectionRequest dbConnectionRequest) {
        // get the rquester user id
        String userId = reqHeader.get("requesterUserId");
        // check if connection name is alredy used for the requester
        List<DBConnection> connection_list = dbConnectionRepository.findByUserIdAndConnectionName(userId,
                dbConnectionRequest.getConnectionName());
        // if connection name is alredy used, send error
        if (!connection_list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new MessageResponse("Error: Connection Name is already taken!"));
        }
        // create DB Connection object and save it to DB
        DBConnection dbConnection = new DBConnection(
                userId,
                dbConnectionRequest.getVendor(),
                dbConnectionRequest.getServer(),
                dbConnectionRequest.getPort(),
                dbConnectionRequest.getDatabase(),
                dbConnectionRequest.getUsername(),
                dbConnectionRequest.getPassword(),
                dbConnectionRequest.getConnectionName());
        dbConnectionRepository.save(dbConnection);
        return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("new DB Connection registered!"));
    }

    @GetMapping("/database-connection")
    public ResponseEntity<?> getAllDBConnection(@RequestHeader Map<String, String> reqHeader) {
        // get the rquester user id
        String userId = reqHeader.get("requesterUserId");
        List<DBConnectionDTO> dtos = new ArrayList<>();
        // fetch all DB connections for the user
        List<DBConnection> dbConnections = dbConnectionRepository.findByUserId(userId);
        // convert to DTO object to not show Password
        dbConnections.forEach(dbconnection -> dtos.add(mapper.map(dbconnection,
                DBConnectionDTO.class)));
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/database-connection/{id}")
    public ResponseEntity<?> getDBConnection(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id) {
        // get the rquester user id
        String userId = reqHeader.get("requesterUserId");
        // fetch the particular DB connection for the user
        Optional<DBConnection> optionalDBConnection = dbConnectionRepository.findByIdAndUserId(id, userId);
        // if no connection details, then send NOT FOUND Error
        if (!optionalDBConnection.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Error: DB Connection Id not exists"));
        }
        DBConnection dbConnection = optionalDBConnection.get();
        // convert to DTO object to not show Password
        DBConnectionDTO dto = mapper.map(dbConnection, DBConnectionDTO.class);
        return ResponseEntity.ok(dto);

    }

    @PutMapping("/database-connection/{id}")
    public ResponseEntity<?> updateDBConnection(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody DBConnectionRequest dbConnectionRequest, @PathVariable(value = "id") String id) {
        String userId = reqHeader.get("requesterUserId");
        Optional<DBConnection> dbConnection = dbConnectionRepository.findById(id);
        if (!dbConnection.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Error: DB Connection Id not exists"));
        }
        List<DBConnection> dbConnections = dbConnectionRepository
                .findByIdNotAndUserIdAndConnectionName(
                        id, userId, dbConnectionRequest.getConnectionName());
        if (!dbConnections.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Connection Name is already taken!"));
        }
        DBConnection _dbConnection = dbConnection.get();
        _dbConnection.setConnectionName(dbConnectionRequest.getConnectionName());
        _dbConnection.setVendor(dbConnectionRequest.getVendor());
        _dbConnection.setServer(dbConnectionRequest.getServer());
        _dbConnection.setPort(dbConnectionRequest.getPort());
        _dbConnection.setDatabase(dbConnectionRequest.getDatabase());
        _dbConnection.setUsername(dbConnectionRequest.getUsername());
        _dbConnection.setPassword(dbConnectionRequest.getDatabase());
        return new ResponseEntity<>(dbConnectionRepository.save(_dbConnection), HttpStatus.OK);

    }

    @DeleteMapping("/database-connection/{id}")
    public ResponseEntity<?> deleteDBConnection(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id) {
        // get the rquester user id
        String userId = reqHeader.get("requesterUserId");
        // first check if the connection details present for the id
        Optional<DBConnection> optionalDBConnection = dbConnectionRepository.findByIdAndUserId(id, userId);
        if (!optionalDBConnection.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new MessageResponse("Error: DB Connection Id not exists"));
        }
        // delete the connection details row from database
        dbConnectionRepository.deleteById(id);
        return ResponseEntity.ok().body(new MessageResponse("DB Connection is deleted!"));
    }

}
