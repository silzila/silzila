package org.silzila.app.controller;

import org.silzila.app.model.User;
import org.silzila.app.payload.request.LoginRequest;
import org.silzila.app.payload.request.SignupRequest;
import org.silzila.app.payload.response.JwtResponse;
import org.silzila.app.payload.response.MessageResponse;
import org.silzila.app.repository.UserRepository;
import org.silzila.app.security.jwt.JwtUtils;
import org.silzila.app.security.service.UserDetailsImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("/hello")
    public ResponseEntity<?> helloUser() {
        return ResponseEntity.ok(new MessageResponse("Hello User"));
    }

    @PostMapping("/user")
    public ResponseEntity<User> save(@RequestBody User user) {
        try {
            return new ResponseEntity<User>(userRepository.save(user), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already taken!"));
        }
        // create new user account
        User user = new User(signupRequest.getName(),
                signupRequest.getEmail(),
                encoder.encode(signupRequest.getPassword()));

        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("User registered!"));

    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // if email is not present in DB send error msg
        if (!(userRepository.existsByEmail(loginRequest.getEmail()))) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Not a valid Email"));
        }

        // first get as optional object with user provided email, then change to regular
        // object
        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
        User user = new User();
        if (optionalUser.isPresent()) {
            System.out.println("*********** use is persent " + optionalUser.toString());
            user = optionalUser.get();
        }
        System.out.println("------- before authentication is called");
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        loginRequest.getPassword()));
        System.out.println("------- after authentication is called");
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetailsImpl = (UserDetailsImpl) authentication.getPrincipal();

        // on validation, return token with the information
        return ResponseEntity.ok(new JwtResponse(
                jwt,
                String.valueOf(userDetailsImpl.getId()),
                userDetailsImpl.getName(),
                userDetailsImpl.getEmail()));
    }

}