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
    public FileUploadResponse readCsv(String fileName) throws JsonMappingException, JsonProcessingException {

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

    // edit schema of alreay uploaded file
    public List<JsonNode> readCsvChangeSchema(String filePath, String query)
            throws JsonMappingException, JsonProcessingException {
        // String filePath = "/home/balu/Desktop/pyspark_different_datatypes.csv";
        // final String filePath = System.getProperty("user.home") + "/" +
        // "silzila-uploads"
        // + "/" + "tmp" + "/" + fileName;

        // read csv file with auto infer schema
        Dataset<Row> dataset = spark.read().option("header", "true").option("inferSchema", "true")
                .option("samplingRatio", "0.2").csv(filePath);

        dataset.createOrReplaceTempView("ds_view");
        query = query + " from ds_view";

        // query = """
        // select BOOLEAN(yes_no) as yes_no,
        // CAST(num_int as string) as num_intt, num_big_int,
        // CAST(pi_float as double) as pi_float, percent, name, big_float, cur_date,
        // cur_time, CAST(CAST(time2 as date) as TIMESTAMP) as time2,
        // to_date(simple_date, 'dd/MM/yyyy') as `to date` from ds_view
        // """;

        // create another DF with changed schema
        Dataset<Row> _dataset = spark.sql(query);
        // _dataset.show(2);
        // _dataset.printSchema();

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

    // save file data from alreay uploaded file
    public void saveFileData(String readFile, String writeFile, String query)
            throws JsonMappingException, JsonProcessingException {

        // read csv file with auto infer schema
        Dataset<Row> dataset = spark.read().option("header", "true").option("inferSchema", "true")
                .option("samplingRatio", "0.2").csv(readFile);

        dataset.createOrReplaceTempView("ds_view");
        query = query + " from ds_view";

        // create another DF with changed schema
        Dataset<Row> _dataset = spark.sql(query);

        _dataset.write().mode("overwrite").parquet(writeFile);

        _dataset.unpersist();
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
