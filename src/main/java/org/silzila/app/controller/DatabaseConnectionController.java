package org.silzila.app.controller;

import org.silzila.app.payload.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/database-connection")
public class DatabaseConnectionController {

    @GetMapping("/protected")
    public ResponseEntity<?> protectedRoute() {
        return ResponseEntity.ok(new MessageResponse("protected route!"));
    }

}
