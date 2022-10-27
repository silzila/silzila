package org.silzila.app.service;

import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SparkSession;
import org.springframework.stereotype.Service;

@Service
public class SparkService {

    private static SparkSession spark;

    // start spark session
    public void startSparkSession() {
        System.out.println("starting spark =============");
        spark = SparkSession.builder().master("local").appName("silzila_spark_session").getOrCreate();

        System.out.println("starting spark =============");
        // spark.close();
    }

    public void readCsvFile(String fileName) {
        String filePath = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp" + "/" + fileName;
        System.out.println("file path ============= " + filePath);
        Dataset<Row> df = spark.read().csv(filePath);
        // df.show();
        // spark.close();

    }

}
