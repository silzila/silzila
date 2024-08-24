package com.silzila.service;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;
import javax.validation.Valid;

import com.silzila.exception.ExpectationFailedException;
import com.silzila.payload.request.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.silzila.dto.DatasetDTO;
import com.silzila.dto.DatasetNoSchemaDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.domain.entity.Dataset;
import com.silzila.querybuilder.QueryComposer;
import com.silzila.querybuilder.filteroptions.FilterOptionsQueryComposer;
import com.silzila.querybuilder.relativefilter.RelativeFilterQueryComposer;
import com.silzila.repository.DatasetRepository;
import com.silzila.helper.CustomQueryValidator;


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
    RelativeFilterQueryComposer relativeFilterQueryComposer;

    @Autowired
    FileDataService fileDataService;

    @Autowired
    DuckDbService duckDbService;

    @Autowired
    CustomQueryValidator customQueryValidator;

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
        if(dataSchema.getFilterPanels().size()!=0) {
            Map<String, String> aliasMap = new HashMap<>();
            for (int i = 0; i < tableNameList.size(); i++) {
                aliasMap.put(tableNameList.get(i), aliasNameList.get(i));
            }

            // changing tableId in every filters
            for (int i = 0; i < dataSchema.getFilterPanels().size(); i++) {
                for (int j = 0; j < dataSchema.getFilterPanels().get(i).getFilters().size(); j++) {
                    String tableId = dataSchema.getFilterPanels().get(i).getFilters().get(j).getTableId();
                    dataSchema.getFilterPanels().get(i).getFilters().get(j).setTableId(aliasMap.get(tableId));
                }
            }
        }


        // change id to alias name in every table
        for (int i = 0; i < dataSchema.getTables().size(); i++) {
            dataSchema.getTables().get(i).setId(aliasNameList.get(i));
        }

        return dataSchema;
    }

    // CREATE DATASET
    public DatasetDTO registerDataset(DatasetRequest datasetRequest, String userId)
            throws JsonProcessingException, BadRequestException, ExpectationFailedException {
        // if dataset name already exists, send error
        List<Dataset> datasets = datasetRepository.findByUserIdAndDatasetName(userId, datasetRequest.getDatasetName());
        if (!datasets.isEmpty()) {
            throw new BadRequestException("Error: Dataset Name is already taken!");
        }
        //checking whether the dataset is having custom query
        long count = datasetRequest.getDataSchema().getTables().stream().filter(table -> table.isCustomQuery()).count();
        if(count==0) {
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
                    jsonString
            );
            datasetRepository.save(dataset);
            // repackage request object + dataset Id (from saved object) to return response
            DatasetDTO dto = new DatasetDTO(
                    dataset.getId(),
                    datasetRequest.getConnectionId(),
                    datasetRequest.getDatasetName(),
                    datasetRequest.getIsFlatFileData(),
                    dataSchema
            );
            return dto;
        }
        //if the data set contains custom query, validating the query
        else {
            Boolean isProperQuery=false;
            List<Table> tables=datasetRequest.getDataSchema().getTables();
            for (int i = 0; i < tables.size(); i++) {
                if(tables.get(i).isCustomQuery()) {
                    if (customQueryValidator.customQueryValidator(datasetRequest.getDataSchema().getTables().get(i).getCustomQuery())) {
                        isProperQuery = true;
                    } else {
                       throw new ExpectationFailedException("Cannot proceed with dataset creation,CustomQuery is only allowed with SELECT clause");
                    }
                }
            }
            if(isProperQuery){
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
                        jsonString
                );
                datasetRepository.save(dataset);
                // repackage request object + dataset Id (from saved object) to return response
                DatasetDTO dto = new DatasetDTO(
                        dataset.getId(),
                        datasetRequest.getConnectionId(),
                        datasetRequest.getDatasetName(),
                        datasetRequest.getIsFlatFileData(),
                        dataSchema
                );
                return dto;

            }else {
                throw new ExpectationFailedException("Cannot proceed with dataset creation, CustomQuery is only allowed with SELECT clause");
            }
        }
    }




    // UPDATE DATASET
    public DatasetDTO updateDataset(DatasetRequest datasetRequest, String id, String userId)
            throws RecordNotFoundException, JsonProcessingException, JsonMappingException, BadRequestException, ExpectationFailedException
    {

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
        long count = datasetRequest.getDataSchema().getTables().stream().filter(table -> table.isCustomQuery()).count();
        System.out.println(count);
        if (count == 0) {
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
                    dataSchema
            );
            return dto;
        } else {
            Boolean isProperQuery = null;
            List<Table> tables = datasetRequest.getDataSchema().getTables();
            for (int i = 0; i < tables.size(); i++) {
                if (tables.get(i).isCustomQuery()) {
                    if (customQueryValidator.customQueryValidator(datasetRequest.getDataSchema().getTables().get(i).getCustomQuery())) {
                        isProperQuery = true;
                    } else {
                        throw new ExpectationFailedException("Cannot proceed with dataset updation,CustomQuery is only allowed with SELECT");
                    }
                }
            }
            if (isProperQuery) {
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
                        dataSchema
                );
                return dto;
            } else {
                throw new ExpectationFailedException("Cannot proceed with dataset updation,CustomQuery is only allowed with SELECT");
            }

        }
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
            List<Query> queries)
            throws RecordNotFoundException, SQLException, JsonMappingException, JsonProcessingException,
            BadRequestException, ClassNotFoundException, ParseException {
        
        

        // get dataset details in buffer
        DatasetDTO ds = loadDatasetInBuffer(datasetId, userId);

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

        for (Query req : queries) {
            // need at least one dim or measure or field for query execution
            if (req.getDimensions().isEmpty() && req.getMeasures().isEmpty() && req.getFields().isEmpty()) {

                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Error: At least one Dimension/Measure/Field should be there!");
            }
            // relative Date filter
            // Get the first filter panel from the request
            // Assuming req.getFilterPanels() returns a list of FilterPanel objects
            List<FilterPanel> filterPanels = req.getFilterPanels();
            if (filterPanels != null) {
                // Loop through each FilterPanel
                for (FilterPanel filterPanel : filterPanels) {
                    // Get the list of filters from the filter panel
                    List<Filter> filters = filterPanel.getFilters();
                    if (filters != null) {
                        // Iterate over each filter in the list
                        for (Filter filter : filters) {
                            // Check if the filter is of type 'relative_filter'
                            if ("relativeFilter".equals(filter.getFilterType())) {
                                // Get the relative condition associated with the filter
                                RelativeCondition relativeCondition = filter.getRelativeCondition();
                                if (relativeCondition != null) {

                                    // Create a new RelativeFilterRequest object with the relative condition and
                                    // filter
                                    RelativeFilterRequest relativeFilter = new RelativeFilterRequest();

                                    relativeFilter.setAnchorDate(relativeCondition.getAnchorDate());
                                    relativeFilter.setFrom(relativeCondition.getFrom());
                                    relativeFilter.setTo(relativeCondition.getTo());
                                    relativeFilter.setFilterTable(filter);

                                    // Call a method to get the relative date range
                                    JSONArray relativeDateJson = relativeFilter(userId, dBConnectionId, datasetId,
                                            relativeFilter);

                                    // Extract the 'fromdate' and 'todate' values from the JSON response
                                    String fromDate = "";
                                    String toDate = "";

                                    if(relativeDateJson.getJSONObject(0).has("FROMDATE")) {
                                         fromDate = String.valueOf(relativeDateJson.getJSONObject(0).get("FROMDATE"));
                                    }else{
                                         fromDate = String.valueOf(relativeDateJson.getJSONObject(0).get("fromdate"));
                                    }
                                    if(relativeDateJson.getJSONObject(0).has("TODATE")) {
                                         toDate = String.valueOf(relativeDateJson.getJSONObject(0).get("TODATE"));
                                    }else{
                                         toDate = String.valueOf(relativeDateJson.getJSONObject(0).get("todate"));
                                    }

                                    // Ensure fromDate is before toDate
                                    if (fromDate.compareTo(toDate) > 0) {
                                        String tempDate = fromDate;
                                        fromDate = toDate;
                                        toDate = tempDate;
                                    }

                                    // Set the user selection - date range
                                    filter.setUserSelection(Arrays.asList(fromDate, toDate));
                                } else {
                                    throw new BadRequestException("Error: There is no relative filter condition");
                                }
                            }
                        }
                    }
                }
            }

        }
        /* DB based Dataset */
        if (ds.getIsFlatFileData() == false) {
            String query = queryComposer.composeQuery(queries, ds, vendorName);

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
            for (Query req : queries) {
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
            }
            // get distinct table ids
            final List<String> uniqueTableIds = tableIds.stream().distinct().collect(Collectors.toList());
            // get all file Ids (which is inside table obj)
            List<Table> tableObjList = ds.getDataSchema().getTables().stream()
                     .filter(table -> uniqueTableIds.contains(table.getId()))
                    .collect(Collectors.toList());

            logger.info("unique table id =======\n" + uniqueTableIds.toString() +
                    "\ntableObjectList ======== \n" + tableObjList.toString() );
            // throw error when any requested table id is not in dataset
            if (uniqueTableIds.size() != tableObjList.size()) {
                throw new BadRequestException("Error: some table id is not present in Dataset!");
            }

            // get files names from file ids and load the files as Views
            fileDataService.getFileNameFromFileId(userId, tableObjList);
            // come here
            String query = queryComposer.composeQuery(queries, ds, "duckdb");
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
            throws RecordNotFoundException, SQLException, JsonProcessingException,
            BadRequestException, ClassNotFoundException {
        //checking for datasetId to perform filter options for dataset filter
        if(datasetId==null || datasetId.isEmpty()){
            String vendorName = "";
            String query ="";
            JSONArray jsonArray=null;
            if(dBConnectionId == null || dBConnectionId.isEmpty()) {
                 query = filterOptionsQueryComposer.composeQuery(columnFilter, null, "duckdb");
                logger.info("\n******* QUERY **********\n" + query);
                //creating table object to send it to create a view with the fileId
                Table table = new Table(columnFilter.getTableId(), columnFilter.getFlatFileId(), null, null, null, columnFilter.getTableId()  , null, null, false, null);
                List<Table> tableObjects = new ArrayList<>();
                tableObjects.add(table);
                // calling this to crete a view to run on top of that
                fileDataService.getFileNameFromFileId(userId, tableObjects);
                jsonArray = duckDbService.runQuery(query);
            }else{
                 vendorName = connectionPoolService.getVendorNameFromConnectionPool(dBConnectionId, userId);
                 query = filterOptionsQueryComposer.composeQuery(columnFilter, null, vendorName);
                 logger.info("\n******* QUERY **********\n" + query);
                 jsonArray = connectionPoolService.runQuery(dBConnectionId, userId, query);
            }
            return jsonArray;

        }

        else {
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

    public JSONArray relativeFilter(String userId, String dBConnectionId, String datasetId,
            @Valid RelativeFilterRequest relativeFilter)
            throws RecordNotFoundException, BadRequestException, SQLException, ClassNotFoundException,
            JsonMappingException, JsonProcessingException {

        // Load dataset into memory buffer
        DatasetDTO ds = loadDatasetInBuffer(datasetId, userId);

        // Initialize variables
        JSONArray anchorDateArray;
        String query;

        // Check if dataset is flat file data or not
        if (ds.getIsFlatFileData()) {
            // Get the table ID from the filter request
            String tableId = relativeFilter.getFilterTable().getTableId();

            // Find the table object in the dataset schema
            Table tableObj = ds.getDataSchema().getTables().stream()
                    .filter(table -> table.getId().equals(tableId))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("Error: table id is not present in Dataset!"));

            // Load file names from file IDs and load the files as views
            fileDataService.getFileNameFromFileId(userId, Collections.singletonList(tableObj));

            // Compose anchor date query for DuckDB and run it
            String anchorDateQuery = relativeFilterQueryComposer.anchorDateComposeQuery("duckdb", ds, relativeFilter);
            anchorDateArray = duckDbService.runQuery(anchorDateQuery);

            // Compose main query for DuckDB
            query = relativeFilterQueryComposer.composeQuery("duckdb", ds, relativeFilter, anchorDateArray);

        } else {
            // Check if DB connection ID is provided
            if (dBConnectionId == null || dBConnectionId.isEmpty()) {
                throw new BadRequestException("Error: DB Connection Id can't be empty!");
            }

            // Get the vendor name from the connection pool using the DB connection ID
            String vendorName = connectionPoolService.getVendorNameFromConnectionPool(dBConnectionId, userId);
            // Compose anchor date query for the specific vendor and run it
            String anchorDateQuery = relativeFilterQueryComposer.anchorDateComposeQuery(vendorName, ds, relativeFilter);


            anchorDateArray = connectionPoolService.runQuery(dBConnectionId, userId, anchorDateQuery);

            // Compose main query for the specific vendor
            query = relativeFilterQueryComposer.composeQuery(vendorName, ds, relativeFilter, anchorDateArray);
        }

        // Execute the main query and return the result
        JSONArray jsonArray = ds.getIsFlatFileData() ? duckDbService.runQuery(query)
                : connectionPoolService.runQuery(dBConnectionId, userId, query);

        return jsonArray;
    }



    }
