package com.silzila.controller;

import com.silzila.domain.entity.User;
import com.silzila.exception.NoUserFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("/users")
public interface IUserController {

    @GetMapping()
    ResponseEntity<List<User>> getAllUsers();

    @GetMapping("/{username}")
    ResponseEntity<User> getUserByName(@PathVariable("username") String username);
}
