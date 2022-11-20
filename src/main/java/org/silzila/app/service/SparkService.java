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
    public List<JsonNode> savefileData(String fileName, String query)
            throws JsonMappingException, JsonProcessingException {
        // String filePath = "/home/balu/Desktop/pyspark_different_datatypes.csv";
        final String filePath = System.getProperty("user.home") + "/" + "silzila-uploads"
                + "/" + "tmp" + "/" + fileName;

        // read csv file
        Dataset<Row> dataset = spark.read().option("header", "true").option("inferSchema", "true")
                .option("samplingRatio", "0.2").csv(filePath);

        dataset.createOrReplaceTempView("ds_view");

        // query = """
        // "cast(yes_no as boolean) as yn", "CAST(num_int as integer) as num_intt",
        // "CAST(num_big_int as boolean) as new_bool",
        // "pi_float", "percent", "name", "big_float", "cast(cur_date as date) as dt",
        // "cast(cur_time as TIMESTAMP) as time1", "cast(time2 as TIMESTAMP) as time2",
        // "cast(simple_date as date) as simple_date\"""";

        // query = """
        // select BOOLEAN(yes_no) as yes_no,
        // CAST(num_int as string) as num_intt, num_big_int,
        // CAST(pi_float as double) as pi_float, percent, name, big_float, cur_date,
        // cur_time, time2,
        // to_date(simple_date, 'dd/MM/yyyy') as `to date` from ds_view
        // """;

        // Dataset<Row> _dataset = dataset.selectExpr(query);
        Dataset<Row> _dataset = spark.sql(query);
        _dataset.show(2);
        _dataset.printSchema();

        // query = """
        // SELECT
        // TO_INTEGER(`yes_no`) AS `yes_no_i`,
        // `num_int` AS `num_int`,
        // DECIMAL(`num_big_int`) AS `num_big_dec`,
        // `pi_float` AS `pi_float`,
        // `percent` AS `percent`,
        // `name` AS `emp_name`,
        // `big_float` AS `big_float`,
        // `cur_date` AS `cur_date`,
        // `cur_time` AS `cur_time`,
        // TO_TIMESTAMP(`time2`, 'MM/dd/yyyy hh:MM:SS') AS `time2`,
        // TO_DATE(`simple_date`, 'MM/dd/yyyy') AS `simple_date_dt`""";

        // get Sample Records from spark DF
        ObjectMapper mapper = new ObjectMapper();
        List<JsonNode> jsonNodes = new ArrayList<JsonNode>();
        // fetch 100 records as sample records
        List<String> datasetString = _dataset.limit(100).toJSON().collectAsList();
        for (String str : datasetString) {
            JsonNode row = mapper.readTree(str);
            jsonNodes.add(row);
        }

        return jsonNodes;

        // dataset.printSchema();
        // dataset.show(2);
        // _dataset.show(2);
    }

}
