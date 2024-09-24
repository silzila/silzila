package com.silzila.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.silzila.domain.entity.Dataset;
import com.silzila.dto.DatasetDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.DataSchema;
import com.silzila.repository.DatasetRepository;

@Component
public class DatasetBuffer {

    @Autowired
    DatasetRepository datasetRepository;

    ObjectMapper objectMapper = new ObjectMapper();

    private static Map<String, DatasetDTO> datasetDetails = new HashMap<>();

    public DatasetDTO loadDatasetInBuffer(String dbConnectionId,String datasetId, String userId)
            throws RecordNotFoundException, JsonMappingException, JsonProcessingException, ClassNotFoundException, BadRequestException, SQLException {
        DatasetDTO dto;
        if (datasetDetails.containsKey(datasetId)) {
            dto = datasetDetails.get(datasetId);
        } else {
            dto = getDatasetById(datasetId, userId);
            datasetDetails.put(datasetId, dto);
        }
        return dto;
    }

    public DatasetDTO getDatasetById(String id, String userId)
            throws RecordNotFoundException, JsonMappingException, JsonProcessingException {
        Optional<Dataset> dOptional = datasetRepository.findByIdAndUserId(id, userId);
        // if no connection details inside optional warpper, then send NOT FOUND Error
        if (!dOptional.isPresent()) {
            throw new RecordNotFoundException("Error: No such Dataset Id exists!");
        }
        // get object from optional wrapper object
        Dataset dataset = dOptional.get();
        // initialize dataschema object and add put key values
        DataSchema dataSchema;
        // dto object holds final response with de-serialized data schema
        DatasetDTO dto = new DatasetDTO();
        try {
            // de-serialization
            dataSchema = objectMapper.readValue(dataset.getDataSchema(), DataSchema.class);
            // populating dto object
            dto.setId(dataset.getId());
            dto.setConnectionId(dataset.getConnectionId());
            dto.setDatasetName(dataset.getDatasetName());
            dto.setIsFlatFileData(dataset.getIsFlatFileData());
            dto.setDataSchema(dataSchema);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Error: Dataset schema could not be serialized!");
        }
        return dto;
    }

    public Map<String, DatasetDTO> getDatasetDetails() {
        return datasetDetails;
    }

    public void addDatasetInBuffer(String datasetId,DatasetDTO datasetDTO) {
       datasetDetails.put(datasetId, datasetDTO);
    }

    public DatasetDTO getDatasetDetailsById(String datasetId){
        return (datasetDetails.keySet().contains(datasetId))?datasetDetails.get(datasetId):null;
    }

    public void removeDatasetDetailsFromBuffer(String datasetId){
        datasetDetails.remove(datasetId);
    }


}

