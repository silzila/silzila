package com.silzila.service;

import java.util.Date;
import java.util.Optional;

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

import com.silzila.domain.entity.User;
import com.silzila.model.security.SecurityUser;
import com.silzila.payload.request.AuthenticationRequest;
import com.silzila.payload.request.SignupRequest;
import com.silzila.payload.response.AuthenticationResponse;
import com.silzila.payload.response.MessageResponse;
import com.silzila.payload.response.RefreshTokenResponse;
import com.silzila.repository.UserRepository;
import com.silzila.security.TokenUtils;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

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
                user.getName(), user.getUsername(), "Bearer",
                this.tokenUtils.generateToken(userDetails, authenticationRequest.getDevice()));
    }

    public RefreshTokenResponse refreshToken(String token) {
        // get token from "Bearer <token>"
        String _token = token.substring(7, token.length());
        String username = this.tokenUtils.getUsernameFromToken(_token);
        SecurityUser user = (SecurityUser) this.userDetailsService.loadUserByUsername(username);
        if (this.tokenUtils.canTokenBeRefreshed(_token, user.getLastPasswordReset())) {
            return new RefreshTokenResponse(this.tokenUtils.refreshToken(_token));
        }
        return new RefreshTokenResponse();
    }

    public ResponseEntity<?> registerUser(SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already taken!"));
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(signupRequest.getPassword());
        User newUser = User.builder()
                .name(signupRequest.getName())
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
