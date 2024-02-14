package com.silzila.controller;

import com.silzila.payload.request.AuthenticationRequest;
import com.silzila.payload.request.SignupRequest;
import com.silzila.payload.response.AuthenticationResponse;
import com.silzila.payload.response.MessageResponse;
import com.silzila.payload.response.RefreshTokenResponse;
import com.silzila.service.AuthenticationService;

import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class AuthenticationController {

    // @Value("${jwtHeader}")
    // private String tokenHeader;

    @Autowired
    AuthenticationService authenticationService;

    @SecurityRequirements
    @PostMapping("/signin")
    ResponseEntity<?> loginUser(@RequestBody @Valid AuthenticationRequest authenticationRequest) {
        return ResponseEntity.ok(authenticationService.loginUser(authenticationRequest));

    }

    @GetMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> authenticationRequest(HttpServletRequest request) {
        return ResponseEntity.ok(authenticationService.refreshToken(request.getHeader("Authorization")));

    }

    @SecurityRequirements
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody @Valid SignupRequest signupRequest) {
        return authenticationService.registerUser(signupRequest);

    }

    @SecurityRequirements
    @GetMapping("hello")
    public ResponseEntity<?> helloWorld() {
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Hello User"));
    }
}
