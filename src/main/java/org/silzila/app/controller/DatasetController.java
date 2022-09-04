package org.silzila.app.controller;

import java.util.Map;

import javax.validation.Valid;

import org.silzila.app.dto.DatasetDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.payload.request.DataSchema;
import org.silzila.app.payload.request.DatasetRequest;
import org.silzila.app.payload.response.MessageResponse;
import org.silzila.app.service.DatasetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class DatasetController {

    @Autowired
    DatasetService datasetService;

    // create dataset
    @PostMapping("/dataset")
    public ResponseEntity<?> registerDataset(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody DatasetRequest datasetRequest) throws JsonProcessingException, BadRequestException {
        // get the rquester user id
        String userId = reqHeader.get("requesterUserId");

        // System.out.println("-------------- Schema Object toString");
        // System.out.println(datasetRequest.getDataSchema().toString());
        // ObjectMapper objectMapper = new ObjectMapper();

        // String jsonString =
        // objectMapper.writeValueAsString(datasetRequest.getDataSchema());
        // System.out.println("-------------- SERIALIZE");
        // System.out.println(jsonString);

        // DataSchema dataSchema = objectMapper.readValue(jsonString, DataSchema.class);
        // System.out.println("-------------- DE SERIALIZE");
        // System.out.println(dataSchema.toString());

        DatasetDTO dto = datasetService.registerDataset(datasetRequest, userId);
        return ResponseEntity.ok(dto);

    }
}
