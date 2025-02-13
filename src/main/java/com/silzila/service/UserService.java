package com.silzila.service;

import com.silzila.domain.entity.User;
import com.silzila.payload.request.UserRequest;
import com.silzila.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public ResponseEntity<?> updateUser(String userId, UserRequest request) {
        try {
            User user = userRepository.findByUsername(userId)
                    .orElseThrow(() -> new NoSuchElementException("User not found"));
                    
                    if (request.getFirstName() != null && !request.getFirstName().isEmpty()) {
                        user.setFirstName(request.getFirstName());
                    }
                    if (request.getLastName() != null && !request.getLastName().isEmpty()) {
                        user.setLastName(request.getLastName());
                    }
                    if (request.getUsername()!=null && !request.getUsername().isEmpty()&request.getUsername()!=userId){
                        user.setUsername(request.getUsername());
                        // after updateing username we need new token according to new username
                    }
            userRepository.save(user);

            return ResponseEntity.ok("User details updated successfully.");

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update user: " + e.getMessage());
        }
    }
}
