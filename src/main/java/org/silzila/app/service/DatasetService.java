package org.silzila.app.service;

import java.util.List;

import org.silzila.app.dto.DatasetDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.model.Dataset;
import org.silzila.app.payload.request.DatasetRequest;
import org.silzila.app.repository.DatasetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
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

}
