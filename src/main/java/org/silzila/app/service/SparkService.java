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
            // to keep null values in the json result set
            spark.conf().set("spark.sql.jsonGenerator.ignoreNullFields", false);
        }
    }

    // read csv file and get metadata
    public FileUploadResponse readCsv(String filePath) throws JsonMappingException, JsonProcessingException {

        // // set default formats if formats are not given
        // String dateFormat = "MM/dd/yyyy";
        // String timestampFormat = "yyyy-MM-dd'T'HH:mm:ss[.SSS][XXX]";
        // String timestampNTZFormat = "yyyy-MM-dd'T'HH:mm:ss[.SSS]";

        // Spark read csv file

        Dataset<Row> dataset = spark.read().option("header", "true")
                .option("inferSchema", "true")
                // .schema(structType)
                // .schema("pos_id_2 double, order_date date, order_timestamp timestamp,
                // delivery_date date, store_id integer, order_id integer, order_line_id string,
                // product_id integer, quantity integer, discount double, unit_price double,
                // sales double, profit double, payment_method_id integer, customer_type_id
                // integer, delivery_mode_id integer")
                // .schema("yes_no_int integer, num_int integer, num_big_int integer, pi_float
                // double, percent double, name string, big_float double, cur_date date,
                // cur_time timestamp,time2 timestamp, simple_date date")
                .option("samplingRatio", "0.2")
                // .option("enforceSchema", "true")
                // .option("dateFormat", dateFormat)
                // .option("timestampFormat", timestampFormat)
                // .option("timestampNTZFormat", timestampNTZFormat)
                .csv(filePath);

        // dataset.show(2);
        // System.out.println("dateFormat ==== " + dateFormat);
        // System.out.println("timestampFormat ==== " + timestampFormat);
        // System.out.println("timestampNTZFormat ==== " + timestampNTZFormat);

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
        // System.out.println("Json Data ================\n" + jsonNodes.toString());

        // assemble Response Obj.
        // file id & file data name is added in the main service fn
        FileUploadResponse fileUploadResponse = new FileUploadResponse(null, null, columnInfos, jsonNodes);

        dataset.unpersist();
        return fileUploadResponse;
    }

    // edit schema of alreay uploaded file
    public List<JsonNode> readCsvChangeSchema(String filePath, String schemaString,
            String dateFormat, String timestampFormat, String timestampNTZFormat)
            throws JsonMappingException, JsonProcessingException {

        Dataset<Row> dataset = spark.read().option("header", "true")
                // .option("inferSchema", "true")
                .schema(schemaString)
                // .option("samplingRatio", "0.2")
                .option("enforceSchema", "true")
                .option("dateFormat", dateFormat)
                .option("timestampFormat", timestampFormat)
                .option("timestampNTZFormat", timestampNTZFormat)
                .csv(filePath);

        dataset.show(2);
        // _dataset.printSchema();

        // get Sample Records from spark DF
        ObjectMapper mapper = new ObjectMapper();
        List<JsonNode> jsonNodes = new ArrayList<JsonNode>();
        // fetch 100 records as sample records
        List<String> datasetString = dataset.limit(100).toJSON().collectAsList();
        for (String str : datasetString) {
            JsonNode row = mapper.readTree(str);
            jsonNodes.add(row);
        }
        // _dataset.unpersist();
        dataset.unpersist();
        return jsonNodes;
    }

    // save file data from alreay uploaded file
    public void saveFileData(String readFile, String writeFile, String schemaString,
            String dateFormat, String timestampFormat, String timestampNTZFormat)
            throws JsonMappingException, JsonProcessingException {

        // read dataset from uploaded csv with the given schema
        Dataset<Row> dataset = spark.read().option("header", "true")
                // .option("inferSchema", "true")
                .schema(schemaString)
                // .option("samplingRatio", "0.2")
                .option("enforceSchema", "true")
                .option("dateFormat", dateFormat)
                .option("timestampFormat", timestampFormat)
                .option("timestampNTZFormat", timestampNTZFormat)
                .csv(readFile);

        // dataset.show(2);
        // dataset.printSchema();

        // write to parquet file
        dataset.write().mode("overwrite").parquet(writeFile);
        dataset.unpersist();
        // return jsonNodes;
    }

    // get Sample Records from File Data
    public List<JsonNode> getSampleRecords(String parquetFilePath)
            throws JsonMappingException, JsonProcessingException {

        // read saved Parquet file
        Dataset<Row> dataset = spark.read().parquet(parquetFilePath);

        // get Sample Records from spark DF
        ObjectMapper mapper = new ObjectMapper();
        List<JsonNode> jsonNodes = new ArrayList<JsonNode>();
        // fetch 100 records as sample records
        List<String> datasetString = dataset.limit(100).toJSON().collectAsList();
        for (String str : datasetString) {
            JsonNode row = mapper.readTree(str);
            jsonNodes.add(row);
        }
        dataset.unpersist();
        return jsonNodes;
    }

    // get Column Details from File Data
    public List<FileUploadColumnInfo> getColumns(String parquetFilePath)
            throws JsonMappingException, JsonProcessingException {

        // read saved Parquet file
        Dataset<Row> dataset = spark.read().parquet(parquetFilePath);

        // get Column Name + Data Type mapping from spark DF
        List<FileUploadColumnInfo> columnInfos = new ArrayList<>();
        StructField[] fields = dataset.schema().fields();
        for (StructField field : fields) {
            // spark has different data types and converted to Silzila data types
            String silzilaDataType = ConvertSparkDataType.toSilzilaDataType(field.dataType().typeName());
            FileUploadColumnInfo columnInfo = new FileUploadColumnInfo(field.name(), silzilaDataType);
            columnInfos.add(columnInfo);
        }

        dataset.unpersist();
        return columnInfos;
    }

    // 1. temp. edit schema of alreay uploaded file
    public List<JsonNode> readParquetChangeSchema(String parquetFilePath, String query)
            throws JsonMappingException, JsonProcessingException {

        // read saved Parquet file
        Dataset<Row> dataset = spark.read().parquet(parquetFilePath);
        dataset.limit(10).show();

        dataset.createOrReplaceTempView("ds_view");
        query = query + " from ds_view";

        // create another DF with changed schema
        Dataset<Row> _dataset = spark.sql(query);

        // get Sample Records from spark DF
        ObjectMapper mapper = new ObjectMapper();
        List<JsonNode> jsonNodes = new ArrayList<JsonNode>();
        // fetch 100 records as sample records
        List<String> datasetString = _dataset.limit(100).toJSON().collectAsList();
        for (String str : datasetString) {
            JsonNode row = mapper.readTree(str);
            jsonNodes.add(row);
        }
        _dataset.unpersist();
        dataset.unpersist();
        return jsonNodes;
    }

    // 2. Update Parquet file with changed Schema
    public void updateParquetChangeSchema(String readFilePath, String writeFilePath, String query)
            throws JsonMappingException, JsonProcessingException {

        // read saved Parquet file
        Dataset<Row> dataset = spark.read().parquet(readFilePath);
        dataset.limit(10).show();

        dataset.createOrReplaceTempView("ds_view");
        query = query + " from ds_view";

        // create another DF with changed schema
        Dataset<Row> _dataset = spark.sql(query);
        // write to a new file
        _dataset.write().mode("overwrite").parquet(writeFilePath);
        // clear memory
        _dataset.unpersist();
        dataset.unpersist();

    }

}
