package com.silzila.controller.v1;

import com.silzila.controller.BaseController;
import com.silzila.domain.entity.User;
import com.silzila.dto.UserDetailsDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.NoUserFoundException;
import com.silzila.payload.request.UserRequest;
import com.silzila.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class UserControllerV1 extends BaseController {

    private final UserService userService;

    @GetMapping()
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByName(@PathVariable("username") String username) {
        User aUser = userService.getUserByUsername(username).orElseThrow(() -> new NoUserFoundException(username));
        return ResponseEntity.ok(aUser);
    }

    @PutMapping("/user/update")
    public ResponseEntity<?> updateUser(@RequestHeader Map<String, String> requestHeader,
            @RequestBody UserRequest request) {

        String userId = requestHeader.get("username");
        return userService.updateUser(userId, request);

    }
    @GetMapping("/checktoken")
    public String checkTokenValidation(){
      return "Success";
    }

    
    @GetMapping("/user-details")
    public UserDetailsDTO getUserDetails(@RequestHeader Map<String,String> requestHeader) throws BadRequestException {
      String email = requestHeader.get("username");
      return userService.getUserDetails( email);
    }

}
