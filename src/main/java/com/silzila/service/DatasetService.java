package com.silzila.service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;

import com.silzila.dto.DatasetDTO;
import com.silzila.dto.DatasetNoSchemaDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.domain.entity.Dataset;
import com.silzila.payload.request.ColumnFilter;
import com.silzila.payload.request.DataSchema;
import com.silzila.payload.request.DatasetRequest;
import com.silzila.payload.request.Query;
import com.silzila.payload.request.Table;
import com.silzila.querybuilder.QueryComposer;
import com.silzila.querybuilder.filteroptions.FilterOptionsQueryComposer;
import com.silzila.repository.DatasetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class DatasetService {

    private static final Logger logger = LogManager.getLogger(DatasetService.class);

    private static Map<String, DatasetDTO> datasetDetails = new HashMap<>();

    @Autowired
    DatasetRepository datasetRepository;

    @Autowired
    ConnectionPoolService connectionPoolService;

    @Autowired
    QueryComposer queryComposer;

    @Autowired
    FilterOptionsQueryComposer filterOptionsQueryComposer;

    @Autowired
    FileDataService fileDataService;

    @Autowired
    DuckDbService duckDbService;

    ObjectMapper objectMapper = new ObjectMapper();

    // HELPER FUNCTION
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
            // split alias name to list. eg. sub_category will be split into ['sub',
            // 'category']
            // split by underscore or space
            String[] splitStrings = table.getAlias().toLowerCase().split("_| ");
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

    // CREATE DATASET
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
        // repackage request object + dataset Id (from saved object) to return response
        DatasetDTO dto = new DatasetDTO(
                dataset.getId(),
                datasetRequest.getConnectionId(),
                datasetRequest.getDatasetName(),
                datasetRequest.getIsFlatFileData(),
                dataSchema);
        return dto;
    }

    // UPDATE DATASET
    public DatasetDTO updateDataset(DatasetRequest datasetRequest, String id, String userId)
            throws RecordNotFoundException, JsonProcessingException, JsonMappingException, BadRequestException {

        Optional<Dataset> dOptional = datasetRepository.findByIdAndUserId(id, userId);
        // if no connection details inside optional warpper, then send NOT FOUND Error
        if (!dOptional.isPresent()) {
            throw new RecordNotFoundException("Error: No such Dataset Id exists!");
        }
        // if dataset name already exists, send error
        List<Dataset> datasets = datasetRepository.findByIdNotAndUserIdAndDatasetName(id, userId,
                datasetRequest.getDatasetName());
        if (!datasets.isEmpty()) {
            throw new BadRequestException("Error: Dataset Name is already taken!");
        }
        // rename id to table alias (short name)
        DataSchema dataSchema = createTableAliasName(datasetRequest.getDataSchema());
        // stringify dataschema (table + relationship section of API) to save in DB
        String jsonString = objectMapper.writeValueAsString(dataSchema);

        Dataset _dataset = dOptional.get();
        _dataset.setDatasetName(datasetRequest.getDatasetName());
        _dataset.setDataSchema(jsonString);
        datasetRepository.save(_dataset);
        // repackage request object + dataset Id (from saved object) to return response
        DatasetDTO dto = new DatasetDTO(
                _dataset.getId(),
                _dataset.getConnectionId(),
                _dataset.getDatasetName(),
                _dataset.getIsFlatFileData(),
                dataSchema);
        return dto;
    }

    // READ ALL DATASETS
    public List<DatasetNoSchemaDTO> getAllDatasets(String userId)
            throws JsonProcessingException {
        List<Dataset> datasets = datasetRepository.findByUserId(userId);
        List<DatasetNoSchemaDTO> dsDtos = new ArrayList<>();
        datasets.forEach(ds -> {
            DatasetNoSchemaDTO dto = new DatasetNoSchemaDTO(
                    ds.getId(), ds.getConnectionId(), ds.getDatasetName(), ds.getIsFlatFileData());
            dsDtos.add(dto);
        });
        return dsDtos;
    }

    // READ ONE DATASET
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

    // DELETE DATASET
    public void deleteDataset(String id, String userId) throws RecordNotFoundException {
        // fetch the specific Dataset for the user
        Optional<Dataset> datasetOptional = datasetRepository.findByIdAndUserId(id, userId);
        // if no Dataset details, then send NOT FOUND Error
        if (!datasetOptional.isPresent()) {
            throw new RecordNotFoundException("Error: No such Dataset Id exists!");
        }
        // delete the record from DB
        datasetRepository.deleteById(id);
    }

    // load dataset details in buffer. This helps faster query execution.
    public DatasetDTO loadDatasetInBuffer(String datasetId, String userId)
            throws RecordNotFoundException, JsonMappingException, JsonProcessingException {
        DatasetDTO dto;
        if (datasetDetails.containsKey(datasetId)) {
            dto = datasetDetails.get(datasetId);
        } else {
            dto = getDatasetById(datasetId, userId);
            datasetDetails.put(datasetId, dto);
        }
        return dto;
    }

    // RUN QUERY
    public String runQuery(String userId, String dBConnectionId, String datasetId, Boolean isSqlOnly,
            Query req)
            throws RecordNotFoundException, SQLException, JsonMappingException, JsonProcessingException,
            BadRequestException, ClassNotFoundException {
        // need at least one dim or measure or field for query execution
        if (req.getDimensions().isEmpty() && req.getMeasures().isEmpty() && req.getFields().isEmpty()) {

            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Error: At least one Dimension/Measure/Field should be there!");
        }
        // get dataset details in buffer
        DatasetDTO ds = loadDatasetInBuffer(datasetId, userId);
        // System.out.println("*****************" + ds.toString());

        String vendorName = "";
        // for DB based datasets, connection id is must
        if (ds.getIsFlatFileData() == false) {
            if (dBConnectionId == null || dBConnectionId.isEmpty()) {
                throw new BadRequestException("Error: DB Connection Id can't be empty!");
            }
            /*
             * load connection details in buffer.
             * create connection pool (if not) and then get vendor name.
             * SQL Dialect will be different based on vendor name
             */
            vendorName = connectionPoolService.getVendorNameFromConnectionPool(dBConnectionId, userId);
            // System.out.println("Dialect *****************" + vendorName);
        }

        /* DB based Dataset */
        if (ds.getIsFlatFileData() == false) {

            String query = queryComposer.composeQuery(req, ds, vendorName);
            logger.info("\n******* QUERY **********\n" + query);
            // when the request is just Raw SQL query Text
            if (isSqlOnly != null && isSqlOnly) {
                return query;
            }
            // when the request is for query result
            else {
                JSONArray jsonArray = connectionPoolService.runQuery(dBConnectionId, userId, query);
                return jsonArray.toString();
            }
        }

        /* Flat file based dataset, create DFs for necessary files used in query */
        // get table Id -> file Id -> file name
        else {

            // get all the table ids used in query
            List<String> tableIds = new ArrayList<String>();
            for (int i = 0; i < req.getDimensions().size(); i++) {
                tableIds.add(req.getDimensions().get(i).getTableId());
            }
            for (int i = 0; i < req.getMeasures().size(); i++) {
                tableIds.add(req.getMeasures().get(i).getTableId());
            }
            for (int i = 0; i < req.getFields().size(); i++) {
                tableIds.add(req.getFields().get(i).getTableId());
            }
            for (int i = 0; i < req.getFilterPanels().size(); i++) {
                for (int j = 0; j < req.getFilterPanels().get(i).getFilters().size(); j++) {
                    tableIds.add(req.getFilterPanels().get(i).getFilters().get(j).getTableId());
                }
            }
            // get distinct table ids
            final List<String> uniqueTableIds = tableIds.stream().distinct().collect(Collectors.toList());

            // get all file Ids (which is inside table obj)
            List<Table> tableObjList = ds.getDataSchema().getTables().stream()
                    .filter(table -> uniqueTableIds.contains(table.getId()))
                    .collect(Collectors.toList());

            logger.info("unique table id =======\n" + uniqueTableIds.toString() +
                    "\n\tableObjectList ======== \n" + tableObjList.toString());
            // throw error when any requested table id is not in dataset
            if (uniqueTableIds.size() != tableObjList.size()) {
                throw new BadRequestException("Error: some table id is not present in Dataset!");
            }

            // get files names from file ids and load the files as Views
            fileDataService.getFileNameFromFileId(userId, tableObjList);
            String query = queryComposer.composeQuery(req, ds, "duckdb");
            logger.info("\n******* QUERY **********\n" + query);

            // when the request is just Raw SQL query Text
            if (isSqlOnly != null && isSqlOnly) {
                return query;
            }
            // when the request is for query result
            else {
                // List<JsonNode> jsonNodes = sparkService.runQuery(query);
                JSONArray jsonArray = duckDbService.runQuery(query);
                return jsonArray.toString();
            }
        }

    }

    // Populate filter Options
    public Object filterOptions(String userId, String dBConnectionId, String datasetId, ColumnFilter columnFilter)
            throws RecordNotFoundException, SQLException, JsonMappingException, JsonProcessingException,
            BadRequestException, ClassNotFoundException {

        String vendorName = "";
        DatasetDTO ds = loadDatasetInBuffer(datasetId, userId);
        // for DB based datasets, connection id is must
        if (ds.getIsFlatFileData() == false) {
            if (dBConnectionId == null || dBConnectionId.isEmpty()) {
                throw new BadRequestException("Error: DB Connection Id can't be empty!");
            }
            /*
             * load connection details in buffer.
             * create connection pool (if not) and then get vendor name.
             * SQL Dialect will be different based on vendor name
             */
            vendorName = connectionPoolService.getVendorNameFromConnectionPool(dBConnectionId, userId);
            // System.out.println("Dialect *****************" + vendorName);
            String query = filterOptionsQueryComposer.composeQuery(columnFilter, ds, vendorName);
            logger.info("\n******* QUERY **********\n" + query);
            JSONArray jsonArray = connectionPoolService.runQuery(dBConnectionId, userId, query);
            return jsonArray;
        }

        /* Flat file based dataset, create DFs for necessary files used in query */
        // get table Id -> file Id -> file name
        else {

            String tableId = columnFilter.getTableId();

            // get all file Ids (which is inside table obj)
            List<Table> tableObjList = ds.getDataSchema().getTables().stream()
                    .filter(table -> table.getId().equals(tableId))
                    .collect(Collectors.toList());

            // throw error when requested table id is not in dataset
            if (tableObjList.size() != 1) {
                throw new BadRequestException("Error: table id is not present in Dataset!");
            }

            // get files names from file ids and load the files as Views
            fileDataService.getFileNameFromFileId(userId, tableObjList);
            // build query
            String query = filterOptionsQueryComposer.composeQuery(columnFilter, ds, "duckdb");
            logger.info("\n******* QUERY **********\n" + query);
            // List<JsonNode> jsonNodes = sparkService.runQuery(query);
            // return jsonNodes;
            JSONArray jsonArray = duckDbService.runQuery(query);
            return jsonArray.toString();
        }

    }

}
