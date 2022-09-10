package org.silzila.app.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.silzila.app.dto.DatasetDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.RecordNotFoundException;
import org.silzila.app.model.Dataset;
import org.silzila.app.payload.request.DataSchema;
import org.silzila.app.payload.request.DatasetRequest;
import org.silzila.app.payload.request.Table;
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

    // In Data Set, each table is given short, meaningful & unique alias name.
    // This alias is used in query building. eg. product AS p, sub_category as sc
    // single word table names gets first letter. If multiple tables start with
    // the same letter then numbers are suffixed.
    // eg. product AS p, process AS p2, pointofsales as p3
    // if table names have hyphen symbol, then first letters are combined
    // eg. point_of_sales AS pos, sub_category AS sc
    public DataSchema createTableAliasName(DataSchema dataSchema) {

        // create list of existing table names
        List<String> tableNameList = new ArrayList<String>();
        dataSchema.getTables().forEach(table -> tableNameList.add(table.getId()));
        // create list of alias (short name for) table names
        List<String> aliasNameList = new ArrayList<String>();
        // this suffix number helps track of how many times same alias names come and
        // appends +1 to alias name
        HashMap<String, Integer> aliasNamesWithoutSuffixNumber = new HashMap<>();

        dataSchema.getTables().forEach(table -> {
            // split table name to list. eg. sub_category will be split into ['sub',
            // 'category']
            String[] splitStrings = table.getTable().split("_");
            String aliasName = "";

            // ################ To take one or multiple letters #################
            // if the split list has one word, get first letter of the word
            if (splitStrings.length == 1) {
                aliasName = Character.toString(splitStrings[0].charAt(0));
            }
            // for >1 word in list, get first letter of only first three words
            else {
                Integer maxLength = splitStrings.length > 3 ? 3 : splitStrings.length;
                for (int i = 0; i < maxLength; i++) {
                    aliasName += Character.toString(splitStrings[i].charAt(0));
                }
            }
            // ################ To add number suffix or not #################
            // first time an alias name comes
            if (!aliasNamesWithoutSuffixNumber.containsKey(aliasName)) {
                aliasNamesWithoutSuffixNumber.put(aliasName, 1);
                aliasNameList.add(aliasName);
            }
            // from alias_names_without_suffix_number, check how many times already there
            // and add one number
            else if (aliasNameList.contains(aliasName)) {
                aliasNamesWithoutSuffixNumber.put(aliasName, aliasNamesWithoutSuffixNumber.get(aliasName) + 1);
                aliasName = aliasName + aliasNamesWithoutSuffixNumber.get(aliasName);
                aliasNameList.add(aliasName);
            }
        });
        // change table1 & table2 to alias name in every relationship
        dataSchema.getRelationships().forEach(relationship -> {
            String table1Alias = aliasNameList.get(tableNameList.indexOf(relationship.getTable1()));
            String table2Alias = aliasNameList.get(tableNameList.indexOf(relationship.getTable2()));
            relationship.setTable1(table1Alias);
            relationship.setTable2(table2Alias);
        });
        // chane id to alias name in every table
        for (int i = 0; i < dataSchema.getTables().size(); i++) {
            dataSchema.getTables().get(i).setId(aliasNameList.get(i));
        }
        return dataSchema;
    }

    // create dataset
    public DatasetDTO registerDataset(DatasetRequest datasetRequest, String userId)
            throws JsonProcessingException, BadRequestException {

        // if dataset name already exists, send error
        List<Dataset> datasets = datasetRepository.findByUserIdAndDatasetName(userId, datasetRequest.getDatasetName());
        if (!datasets.isEmpty()) {
            throw new BadRequestException("Error: Dataset Name is already taken!");
        }
        DataSchema dataSchema = createTableAliasName(datasetRequest.getDataSchema());
        // datasetRequest.setDataSchema(dataSchema);
        // stringify dataschema (table + relationship section of API) to save in DB
        String jsonString = objectMapper.writeValueAsString(dataSchema);
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
                dataSchema);
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
