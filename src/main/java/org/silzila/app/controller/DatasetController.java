package org.silzila.app.controller;

import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.silzila.app.dto.DatasetDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.RecordNotFoundException;
import org.silzila.app.model.Dataset;
import org.silzila.app.payload.request.DataSchema;
import org.silzila.app.payload.request.DatasetRequest;
import org.silzila.app.payload.response.MessageResponse;
import org.silzila.app.service.DatasetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
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

    // list datasets
    @GetMapping("/dataset")
    public List<DatasetDTO> getAllDataset(@RequestHeader Map<String, String> reqHeader)
            throws JsonProcessingException, JsonMappingException {
        // get the requester user Id
        String userId = reqHeader.get("requesterUserId");
        // service call to get list of data sets,
        // empty list will not throw exceptions but return as empty list
        List<DatasetDTO> dtos = datasetService.getAllDatasets(userId);
        return dtos;
    }

    // get one dataset
    @GetMapping("/dataset/{id}")
    public ResponseEntity<?> getDatasetById(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id)
            throws RecordNotFoundException, JsonMappingException, JsonProcessingException {
        // get the requester user Id
        String userId = reqHeader.get("requesterUserId");
        // service call to get list of data sets
        DatasetDTO dto = datasetService.getDatasetById(id, userId);
        return ResponseEntity.ok(dto);

    }
}
