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
import org.silzila.app.payload.response.FileUploadColumnInfo;
import org.silzila.app.payload.response.FileUploadResponse;

import org.apache.spark.sql.types.*;

@Service
public class SparkService {

    private static SparkSession spark;

    // helper function - start spark session
    public void startSparkSession() {
        if (Objects.isNull(spark)) {
            spark = SparkSession.builder().master("local").appName("silzila_spark_session").getOrCreate();
        }
    }

    // read csv file and get metadata
    public FileUploadResponse readFile(String fileName) throws JsonMappingException, JsonProcessingException {

        final String filePath = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp" + "/"
                + fileName;
        // Spark read csv file
        Dataset<Row> dataset = spark.read().option("header", "true").option("inferSchema", "true")
                .option("samplingRatio", "0.2").csv(filePath);

        // get Column Name + Data Type mapping from spark DF
        List<FileUploadColumnInfo> columnInfos = new ArrayList<>();
        StructField[] fields = dataset.schema().fields();
        for (StructField field : fields) {
            // spark has different data types and converted to Silzila data types
            String silzilaDataType = ConvertSparkDataType.toSilzilaDataType(field.dataType().typeName());
            FileUploadColumnInfo columnInfo = new FileUploadColumnInfo(field.name(), silzilaDataType);
            columnInfos.add(columnInfo);
        }

        // get Sample Records from spark DF
        ObjectMapper mapper = new ObjectMapper();
        List<JsonNode> jsonNodes = new ArrayList<JsonNode>();
        // fetch 100 records as sample records
        List<String> datasetString = dataset.limit(100).toJSON().collectAsList();
        for (String str : datasetString) {
            JsonNode row = mapper.readTree(str);
            jsonNodes.add(row);
        }

        // assemble Response Obj.
        // file id & file data name is added in the main service fn
        FileUploadResponse fileUploadResponse = new FileUploadResponse(null, null, columnInfos, jsonNodes);

        dataset.unpersist();
        return fileUploadResponse;
    }

    // save file data from alreay uploaded file
    public void savefileData() {
        String filePath = "/home/balu/Desktop/pyspark_different_datatypes.csv";

        // read csv file
        Dataset<Row> dataset = spark.read().option("header", "true").option("inferSchema", "true").csv(filePath);

        dataset.createOrReplaceTempView("ds_view");

        String query = """
                    SELECT BOOLEAN(`yes_no`) as `yn`, `num_int`, `num_big_int`,
                `pi_float`, `percent`, `name`, `big_float`, DATE(`cur_date`) as `dt`,
                TIMESTAMP(`cur_time`) as `time1`, TIMESTAMP(`time2`) as `time2`,
                TO_DATE(`simple_date`, 'MM/dd/yyyy') as `simple_date` FROM ds_view""";

        Dataset<Row> _dataset = spark.sql(query);

        // // get Field Name + Data Type mapping
        // Map<String, String> dataTypeMap = new HashMap<>();
        // StructField[] fields = _dataset.schema().fields();
        // for (StructField field : fields) {
        // // spark has different data types and converted to Silzila data types
        // String silzilaDataType =
        // ConvertSparkDataType.toSilzilaDataType(field.dataType().typeName());
        // dataTypeMap.put(field.name(), silzilaDataType);
        // }
        dataset.printSchema();
        _dataset.printSchema();
        dataset.show(2);
        _dataset.show(2);
    }

}
