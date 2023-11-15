package com.silzila.controller;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import com.silzila.dto.DatasetDTO;
import com.silzila.dto.DatasetNoSchemaDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.ColumnFilter;
import com.silzila.payload.request.DatasetRequest;
import com.silzila.payload.request.Query;
import com.silzila.payload.response.MessageResponse;
import com.silzila.service.ConnectionPoolService;
import com.silzila.service.DatasetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
            @Valid @RequestBody DatasetRequest datasetRequest) throws JsonProcessingException, BadRequestException {
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
            throws JsonProcessingException, JsonMappingException, BadRequestException, RecordNotFoundException {
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
            @Valid @RequestBody Query query,
            @RequestParam(name = "dbconnectionid", required = false) String dBConnectionId,
            @RequestParam(name = "datasetid") String datasetId,
            @RequestParam(name = "sql", required = false) Boolean isSqlOnly)
            throws RecordNotFoundException, SQLException, JsonMappingException, JsonProcessingException,
            BadRequestException, ClassNotFoundException {
        String userId = reqHeader.get("username");

        String queryResultOrQueryText = datasetService.runQuery(userId, dBConnectionId, datasetId, isSqlOnly, query);
        return ResponseEntity.status(HttpStatus.OK).body(queryResultOrQueryText);
    }

    @PostMapping("/filter-options")
    public ResponseEntity<?> filterOptions(@RequestHeader Map<String, String> reqHeader,
            @Valid @RequestBody ColumnFilter columnFilter,
            @RequestParam(name = "dbconnectionid", required = false) String dBConnectionId,
            @RequestParam(name = "datasetid") String datasetId)
            throws RecordNotFoundException, SQLException, JsonMappingException, JsonProcessingException,
            BadRequestException, ClassNotFoundException {
        String userId = reqHeader.get("username");
        Object jsonArrayOrJsonNodeList = datasetService.filterOptions(userId, dBConnectionId, datasetId, columnFilter);
        return ResponseEntity.status(HttpStatus.OK).body(jsonArrayOrJsonNodeList.toString());

    }

}
