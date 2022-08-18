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
        String userId = reqHeader.get("requesterUserId");
        // System.out.println("logged in user id ========= " + userId);
        List<DBConnection> connection_list = dbConnectionRepository.findByUserIdAndConnectionName(userId,
                dbConnectionRequest.getConnectionName());
        if (!connection_list.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Connection Name is already taken!");
        }

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
        return ResponseEntity.ok(new MessageResponse("new DB Connection registered!"));
    }

    @GetMapping("/database-connections")
    public List<DBConnectionDTO> getAllDBConnection(@RequestHeader Map<String, String> reqHeader) {
        String userId = reqHeader.get("requesterUserId");
        List<DBConnectionDTO> dtos = new ArrayList<>();
        List<DBConnection> dbConnections = dbConnectionRepository.findByUserId(userId);
        dbConnections.forEach(dbconnection -> dtos.add(mapper.map(dbconnection,
                DBConnectionDTO.class)));

        return dtos;
    }

    @GetMapping("/database-connection")
    public ResponseEntity<?> getDBConnection(@RequestHeader Map<String, String> reqHeader,
            @RequestParam(name = "id") String id) {
        Optional<DBConnection> optionalDBConnection = dbConnectionRepository.findById(id);
        if (!optionalDBConnection.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: No such Id Aavailable!"));
        }
        DBConnection dbConnection = optionalDBConnection.get();
        DBConnectionDTO dto = mapper.map(dbConnection, DBConnectionDTO.class);
        return ResponseEntity.ok(dto);

    }

}
