package org.silzila.app.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.silzila.app.dto.DatasetDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.RecordNotFoundException;
import org.silzila.app.model.Dataset;
import org.silzila.app.payload.request.DataSchema;
import org.silzila.app.payload.request.DatasetRequest;
import org.silzila.app.payload.response.MessageResponse;
import org.silzila.app.repository.DatasetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DatasetService {

    @Autowired
    DatasetRepository datasetRepository;

    ObjectMapper objectMapper = new ObjectMapper();

    // create dataset
    public DatasetDTO registerDataset(DatasetRequest datasetRequest, String userId)
            throws JsonProcessingException, BadRequestException {

        // if dataset name already exists, send error
        List<Dataset> datasets = datasetRepository.findByUserIdAndDatasetName(userId, datasetRequest.getDatasetName());
        if (!datasets.isEmpty()) {
            throw new BadRequestException("Error: Dataset Name is already taken!");
        }
        // stringify dataschema (table + relationship section of API) to save in DB
        String jsonString = objectMapper.writeValueAsString(datasetRequest.getDataSchema());
        // crete dataset object and save in DB
        Dataset dataset = new Dataset(
                datasetRequest.getConnectionId(),
                userId,
                datasetRequest.getDatasetName(),
                datasetRequest.getIsFlatFileData(),
                jsonString);
        datasetRepository.save(dataset);
        // repackage request object + dataset Id (from saved object) to return the
        // response
        DatasetDTO dto = new DatasetDTO(
                dataset.getId(),
                datasetRequest.getConnectionId(),
                datasetRequest.getDatasetName(),
                datasetRequest.getIsFlatFileData(),
                datasetRequest.getDataSchema());
        return dto;
    }

    // get list of datasets
    public List<DatasetDTO> getAllDatasets(String userId)
            throws JsonProcessingException, JsonMappingException {
        List<Dataset> datasets = datasetRepository.findByUserId(userId);
        List<DatasetDTO> datasetDTOs = new ArrayList<>();
        datasets.forEach(ds -> {
            DataSchema dataSchema;
            try {
                dataSchema = objectMapper.readValue(ds.getDataSchema(), DataSchema.class);
                DatasetDTO dto = new DatasetDTO(
                        ds.getId(), ds.getConnectionId(), ds.getDatasetName(), ds.getIsFlatFileData(), dataSchema);
                datasetDTOs.add(dto);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Error: Dataset schema could not be serialized!");
            }
        });
        return datasetDTOs;
    }

    // get one dataset
    public DatasetDTO getDatasetById(String id, String userId)
            throws RecordNotFoundException, JsonMappingException, JsonProcessingException {
        Optional<Dataset> dOptional = datasetRepository.findByIdAndUserId(id, userId);
        // if no connection details inside optional warpper, then send NOT FOUND Error
        if (!dOptional.isPresent()) {
            throw new RecordNotFoundException("Error: No such Dataset Id exists");
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

}
