package com.silzila.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.domain.entity.PlayBook;
import com.silzila.dto.PlayBookMetaDTO;
import com.silzila.payload.request.PlayBookRequest;
import com.silzila.payload.response.MessageResponse;
import com.silzila.payload.response.PlayBookResponse;
import com.silzila.service.PlayBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
// @RequestMapping("/api")
public class PlayBookController {

    @Autowired
    PlayBookService playBookService;

    // create playbook
    @PostMapping("/playbook")
    public ResponseEntity<?> createPlayBook(@RequestHeader Map<String, String> reqHeader,
            @RequestBody @Valid PlayBookRequest playBookRequest) throws JsonProcessingException, BadRequestException {

        // get the rquester user id
        String userId = reqHeader.get("username");
        // call service function to create
        PlayBook playBook = playBookService.createPlayBook(playBookRequest, userId);
        return ResponseEntity.ok(playBook);
    }

    // list Playbooks
    @GetMapping("/playbook")
    public List<PlayBookMetaDTO> getAllPlaybook(@RequestHeader Map<String, String> reqHeader)
            throws JsonProcessingException {
        // get the requester user Id
        String userId = reqHeader.get("username");
        List<PlayBookMetaDTO> dtos = playBookService.getAllPlayBooks(userId);
        return dtos;
    }

    // get one PlayBook
    @GetMapping("/playbook/{id}")
    public ResponseEntity<?> getPlayBookById(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id)
            throws RecordNotFoundException, JsonMappingException, JsonProcessingException {
        // get the requester user Id
        String userId = reqHeader.get("username");
        PlayBookResponse playBook = playBookService.getPlayBookById(id, userId);
        return ResponseEntity.ok(playBook);
    }

    // update PlayBook
    @PutMapping("/playbook/{id}")
    public ResponseEntity<?> updatePlayBook(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody PlayBookRequest playBookRequest, @PathVariable(value = "id") String id)
            throws JsonProcessingException, JsonMappingException, BadRequestException, RecordNotFoundException {
        // get the rquester user id
        String userId = reqHeader.get("username");
        PlayBook playBook = playBookService.updatePlayBook(playBookRequest, id, userId);
        return ResponseEntity.ok(playBook);

    }

    // delete PlayBook
    @DeleteMapping("/playbook/{id}")
    public ResponseEntity<?> deletePlayBookById(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id) throws RecordNotFoundException {
        // get the requester user Id
        String userId = reqHeader.get("username");
        // service call to delete
        playBookService.deletePlayBook(id, userId);
        return ResponseEntity.ok().body(new MessageResponse("PlayBook is deleted"));
    }

}
