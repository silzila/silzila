package com.silzila.service;

import java.util.Date;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.silzila.domain.entity.User;
import com.silzila.payload.request.AuthenticationRequest;
import com.silzila.payload.request.SignupRequest;
import com.silzila.payload.response.AuthenticationResponse;
import com.silzila.payload.response.MessageResponse;
import com.silzila.payload.response.RefreshTokenResponse;
import com.silzila.repository.UserRepository;
import com.silzila.security.TokenUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final TokenUtils tokenUtils;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    public AuthenticationResponse loginUser(AuthenticationRequest authenticationRequest) {
        // Perform the authentication
        Authentication authentication = this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authenticationRequest.getUsername(),
                        authenticationRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Reload password post-authentication so we can generate token
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(authenticationRequest.getUsername());

        // get optional object with user provided email, then change to regular object
        Optional<User> optionalUser = userRepository.findByUsername(authenticationRequest.getUsername());
        User user = new User();
        if (optionalUser.isPresent()) {
            user = optionalUser.get();
        }

        return new AuthenticationResponse(
                user.getFirstName(), user.getLastName(), user.getUsername(), "Bearer",
                this.tokenUtils.generateAccessToken(userDetails.getUsername(), authenticationRequest.getDevice()),
                this.tokenUtils.generateRefreshToken(userDetails.getUsername(), authenticationRequest.getDevice()));
    }

    public RefreshTokenResponse refreshToken(String userName) {
        String accessToken = this.tokenUtils.generateAccessToken(userName,"web");
        return new RefreshTokenResponse(accessToken);
    }

    public ResponseEntity<?> registerUser(SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
        return ResponseEntity
        .badRequest()
        .body(new MessageResponse("Error: Email is already taken!"));
        }

        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*(\\.[a-zA-Z]{2,})$";
        // Compile the regex
        Pattern pattern = Pattern.compile(emailRegex);
        if (signupRequest.getUsername() == null || signupRequest.getUsername().trim().isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email must not be empty!"));
        }

        // Match the email with the regex
        Matcher matcher = pattern.matcher(signupRequest.getUsername());
        if (!matcher.matches()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Invalid email format!"));
        }

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(signupRequest.getPassword());
        User newUser = User.builder()
                .firstName(signupRequest.getFirstName())
                .lastName(signupRequest.getLastName())
                .username(signupRequest.getUsername())
                .password(hashedPassword)
                .lastPasswordReset(new Date())
                .authorities("ADMIN")
                .build();
        ;
        userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("User registered!"));

    }
}
