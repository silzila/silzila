package org.silzila.app.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.apache.spark.sql.types.StructField;

import org.silzila.app.helper.ConvertSparkDataType;
import org.silzila.app.payload.response.FileUploadResponse;

@Service
public class SparkService {

    private static SparkSession spark;

    // start spark session
    public void startSparkSession() {
        if (Objects.isNull(spark)) {
            spark = SparkSession.builder().master("local").appName("silzila_spark_session").getOrCreate();
        }
        // spark.close();
    }

    // read csv file and get metadata
    public FileUploadResponse readCsvFile(String fileName) throws JsonMappingException, JsonProcessingException {

        final String filePath = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp" + "/"
                + fileName;
        // read csv file
        Dataset<Row> dataset = spark.read().option("header", "true").option("inferSchema", "true").csv(filePath);

        // get Field Name + Data Type mapping
        Map<String, String> dataTypeMap = new HashMap<>();
        StructField[] fields = dataset.schema().fields();
        for (StructField field : fields) {
            // spark has different data types and converted to Silzila data types
            String silzilaDataType = ConvertSparkDataType.toSilzilaDataType(field.dataType().typeName());
            dataTypeMap.put(field.name(), silzilaDataType);
        }

        // get Sample Records
        ObjectMapper mapper = new ObjectMapper();
        List<JsonNode> jsonNodes = new ArrayList<JsonNode>();
        // fetch 100 records as sample records
        List<String> datasetString = dataset.limit(100).toJSON().collectAsList();
        for (String str : datasetString) {
            JsonNode row = mapper.readTree(str);
            jsonNodes.add(row);
        }

        // assemble Response Obj
        FileUploadResponse fileUploadResponse = new FileUploadResponse(null, null, dataTypeMap, jsonNodes);

        dataset.unpersist();
        return fileUploadResponse;
    }

}
