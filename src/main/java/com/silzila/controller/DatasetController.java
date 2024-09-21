package com.silzila.controller;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import com.silzila.dto.DatasetDTO;
import com.silzila.dto.DatasetNoSchemaDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.ExpectationFailedException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.*;
import com.silzila.payload.response.MessageResponse;
import com.silzila.service.ConnectionPoolService;
import com.silzila.service.DatasetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
// @RequestMapping("/api")
public class DatasetController {

    @Autowired
    DatasetService datasetService;

    @Autowired
    ConnectionPoolService connectionPoolService;

    // create dataset
    @PostMapping("/dataset")
    public ResponseEntity<?> registerDataset(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody DatasetRequest datasetRequest) throws JsonProcessingException, BadRequestException, ExpectationFailedException {
        // get the rquester user id
        String userId = reqHeader.get("username");

        DatasetDTO dto = datasetService.registerDataset(datasetRequest, userId);
        return ResponseEntity.ok(dto);
    }

    // update dataset
    @PutMapping("/dataset/{id}")
    public ResponseEntity<?> updateDataset(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody DatasetRequest datasetRequest,
            @PathVariable(value = "id") String id)
            throws JsonProcessingException, JsonMappingException, BadRequestException, RecordNotFoundException, ExpectationFailedException {
        // get the rquester user id
        String userId = reqHeader.get("username");
        DatasetDTO dto = datasetService.updateDataset(datasetRequest, id, userId);
        return ResponseEntity.ok(dto);
    }

    // list datasets
    @GetMapping("/dataset")
    public List<DatasetNoSchemaDTO> getAllDataset(@RequestHeader Map<String, String> reqHeader)
            throws JsonProcessingException {
        // get the requester user Id
        String userId = reqHeader.get("username");
        // service call to get list of data sets,
        // empty list will not throw exceptions but return as empty list
        List<DatasetNoSchemaDTO> dtos = datasetService.getAllDatasets(userId);
        return dtos;
    }

    // get one dataset
    @GetMapping("/dataset/{id}")
    public ResponseEntity<?> getDatasetById(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id)
            throws RecordNotFoundException, JsonMappingException, JsonProcessingException {
        // get the requester user Id
        String userId = reqHeader.get("username");
        // service call to get list of data sets
        DatasetDTO dto = datasetService.getDatasetById(id, userId);
        return ResponseEntity.ok(dto);

    }

    // delete dataset
    @DeleteMapping("/dataset/{id}")
    public ResponseEntity<?> deleteDatasetById(@RequestHeader Map<String, String> reqHeader,
            @PathVariable(value = "id") String id)
            throws RecordNotFoundException {
        // get the requester user Id
        String userId = reqHeader.get("username");
        // service call to delete
        datasetService.deleteDataset(id, userId);
        return ResponseEntity.ok().body(new MessageResponse("Dataset is deleted"));
    }

    @PostMapping("/query")
    public ResponseEntity<?> runQuery(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody List<Query> query,
            @RequestParam(name = "dbconnectionid", required = false) String dBConnectionId,
            @RequestParam(name = "datasetid") String datasetId,
            @RequestParam(name = "sql", required = false) Boolean isSqlOnly)
            throws RecordNotFoundException, SQLException, JsonMappingException, JsonProcessingException,
            BadRequestException, ClassNotFoundException, ParseException {
        String userId = reqHeader.get("username");
        String queryResultOrQueryText = datasetService.runQuery(userId, dBConnectionId, datasetId, isSqlOnly, query);
        return ResponseEntity.status(HttpStatus.OK).body(queryResultOrQueryText);
    }

    @PostMapping("/filter-options")
    public ResponseEntity<?> filterOptions(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody ColumnFilter columnFilter,
            @RequestParam(name = "dbconnectionid", required = false) String dBConnectionId,
            @RequestParam(name = "datasetid", required = false) String datasetId)
            throws RecordNotFoundException, SQLException, JsonMappingException, JsonProcessingException,
            BadRequestException, ClassNotFoundException {
        String userId = reqHeader.get("username");
        Object jsonArrayOrJsonNodeList = datasetService.filterOptions(userId, dBConnectionId, datasetId, columnFilter);
        return ResponseEntity.status(HttpStatus.OK).body(jsonArrayOrJsonNodeList.toString());

    }

    @PostMapping("/relative-filter")
    public ResponseEntity<?> relativeFilter(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody RelativeFilterRequest relativeFilter,
            @RequestParam(name = "dbconnectionid", required = false) String dBConnectionId,
            @RequestParam(name = "datasetid", required = false) String datasetId) throws JsonMappingException, JsonProcessingException, RecordNotFoundException, BadRequestException, SQLException, ClassNotFoundException {       
        String userId = reqHeader.get("username");
        Object jsonArray = datasetService.relativeFilter(userId, dBConnectionId, datasetId, relativeFilter);
        return (ResponseEntity<?>) ResponseEntity.status(HttpStatus.OK).body(jsonArray.toString());
            }


   }
