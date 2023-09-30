package org.silzila.app.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.duckdb.DuckDBConnection;
import org.json.JSONArray;
import org.json.JSONObject;
import org.silzila.app.AppApplication;
import org.silzila.app.helper.ConvertDuckDbDataType;
import org.silzila.app.helper.DuckDbMetadataToJson;
import org.silzila.app.helper.ResultSetToJson;
import org.silzila.app.model.FileData;
import org.silzila.app.payload.request.FileUploadRevisedColumnInfo;
import org.silzila.app.payload.request.FileUploadRevisedInfoRequest;
import org.silzila.app.payload.request.Table;
import org.silzila.app.payload.response.FileUploadResponseDuckDb;
import org.springframework.stereotype.Service;

@Service
public class DuckDbService {

    private static final Logger logger = LogManager.getLogger(DuckDbService.class);
    // holds view name of DFs used in query
    // contains user wise dataset wise list of tables
    public static HashMap<String, HashMap<String, ArrayList<String>>> views = new HashMap<String, HashMap<String, ArrayList<String>>>();

    // Home folder for saved flat files
    final String SILZILA_DIR = System.getProperty("user.home") + "/" + "silzila-uploads";

    Connection conn = null;

    // helper function to initialize InMemory Duck DB
    public void startDuckDb() throws ClassNotFoundException, SQLException {
        if (Objects.isNull(conn)) {
            Class.forName("org.duckdb.DuckDBDriver");
            // String connectionUrl = "jdbc:duckdb:" + SILZILA_DIR + "/silzila.db";
            conn = DriverManager.getConnection("jdbc:duckdb:");
        }
    }

    // read csv file and get metadata
    public FileUploadResponseDuckDb readCsv(String fileName) throws SQLException {
        // String filePath = SILZILA_DIR + "/" + fileName;
        String filePath = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp" + "/"
                + fileName;
        Connection conn2 = ((DuckDBConnection) conn).duplicate();

        Statement stmtRecords = conn2.createStatement();
        Statement stmtMeta = conn2.createStatement();
        Statement stmtDeleteTbl = conn2.createStatement();

        String query = "CREATE OR REPLACE TABLE tbl_" + fileName + " AS SELECT * from read_csv_auto('" + filePath
                + "', SAMPLE_SIZE=200)";
        stmtRecords.execute(query);
        ResultSet rsRecords = stmtRecords.executeQuery("SELECT * FROM tbl_" + fileName + " LIMIT 200");
        ResultSet rsMeta = stmtMeta.executeQuery("DESCRIBE tbl_" + fileName);

        JSONArray jsonArrayRecords = ResultSetToJson.convertToJson(rsRecords);
        // keep only column name & data type
        JSONArray jsonArrayMeta = DuckDbMetadataToJson.convertToJson(rsMeta);

        List<Map<String, Object>> recordList = new ArrayList<Map<String, Object>>();
        List<Map<String, Object>> metaList = new ArrayList<Map<String, Object>>();

        // Sample Records
        // convert JsonArray -> List of JsonObject -> List of Map(String, Object)
        if (jsonArrayRecords != null) {
            for (int i = 0; i < jsonArrayRecords.length(); i++) {
                JSONObject rec = jsonArrayRecords.getJSONObject(i);
                Map<String, Object> rowObj = new HashMap<String, Object>();
                rec.keySet().forEach(keyStr -> {
                    Object keyValue = rec.get(keyStr);
                    rowObj.put(keyStr, keyValue);
                });
                recordList.add(rowObj);
            }
        }
        // Meta data - column name & data type
        // convert JsonArray -> List of JsonObject -> List of Map(String, Object)
        if (jsonArrayMeta != null) {
            for (int i = 0; i < jsonArrayMeta.length(); i++) {
                JSONObject rec = jsonArrayMeta.getJSONObject(i);
                Map<String, Object> rowObj = new HashMap<String, Object>();
                rec.keySet().forEach(keyStr -> {
                    Object keyValue = rec.get(keyStr);
                    // DuckDB Data type -> Silzila Data Type
                    if (keyStr.equals("dataType")) {
                        String silzilaDataType = ConvertDuckDbDataType.toSilzilaDataType(keyValue.toString());
                        rowObj.put(keyStr, silzilaDataType);
                    } else {
                        rowObj.put(keyStr, keyValue);
                    }
                });
                metaList.add(rowObj);
            }
        }
        // System.out.println(jsonArrayRecords.toString());
        // System.out.println(jsonArrayMeta.toString());
        // delete the in-memory table as it's not required
        String deleteQuery = "DROP TABLE IF EXISTS tbl_" + fileName;
        stmtDeleteTbl.execute(deleteQuery);
        stmtRecords.close();
        stmtMeta.close();
        stmtDeleteTbl.close();
        conn2.close();

        FileUploadResponseDuckDb fileUploadResponseDuckDb = new FileUploadResponseDuckDb(null, fileName,
                metaList,
                recordList);
        return fileUploadResponseDuckDb;
    }

    // edit schema of alreay uploaded file
    public JSONArray readCsvChangeSchema(
            FileUploadRevisedInfoRequest revisedInfoRequest) throws SQLException {

        String fileName = revisedInfoRequest.getFileId();

        // String filePath = SILZILA_DIR + "/" + fileName;
        String filePath = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp" + "/"
                + fileName;
        Connection conn2 = ((DuckDBConnection) conn).duplicate();

        Statement stmtRecords = conn2.createStatement();

        // put column name & data type into separate list
        ArrayList<String> columnList = new ArrayList<String>();
        ArrayList<String> dataTypeList = new ArrayList<String>();

        for (int i = 0; i < revisedInfoRequest.getRevisedColumnInfos().size(); i++) {
            FileUploadRevisedColumnInfo col = revisedInfoRequest.getRevisedColumnInfos().get(i);
            String colName = col.getFieldName();
            String silzilaDataType = col.getDataType().name().toLowerCase();
            String duckDbDataType = ConvertDuckDbDataType.toDuckDbDataType(silzilaDataType);
            String columnString = "'" + colName + "'";
            String dataTypeString = "'" + duckDbDataType + "'";
            columnList.add(columnString);
            dataTypeList.add(dataTypeString);
        }
        // build stringified list of columns
        String colMapString = "[" + String.join(", ", columnList) + "]";
        // build stringified list of data types
        String dataTypeMapString = "[" + String.join(", ", dataTypeList) + "]";
        logger.info("====================\n" + colMapString);
        logger.info("====================\n" + dataTypeMapString);

        // when user provieds custom data format
        String dateFormatCondition = "";
        if (revisedInfoRequest.getDateFormat() != null
                && !revisedInfoRequest.getDateFormat().trim().isEmpty()) {
            dateFormatCondition = ", dateformat='" + revisedInfoRequest.getDateFormat().trim() + "'";
        }
        // when user provieds custom timestamp format
        String timeStampFormatCondition = "";
        if (revisedInfoRequest.getTimestampFormat() != null
                && !revisedInfoRequest.getTimestampFormat().trim().isEmpty()) {
            timeStampFormatCondition = ", timestampformat='" + revisedInfoRequest.getTimestampFormat().trim() + "'";
        }

        String query = "SELECT * from read_csv_auto('" + filePath
                + "', SAMPLE_SIZE=200, names=" + colMapString + ", types=" + dataTypeMapString
                + dateFormatCondition
                + timeStampFormatCondition + ");";
        logger.info("************************\n" + query);

        ResultSet resultSet = stmtRecords.executeQuery(query);
        JSONArray jsonArray = ResultSetToJson.convertToJson(resultSet);
        stmtRecords.close();
        conn2.close();

        return jsonArray;

    }

    // save CSV to Parquet
    public void writeToParquet(
            FileUploadRevisedInfoRequest revisedInfoRequest, String userId) throws SQLException {

        String fileName = revisedInfoRequest.getFileId();
        String filePath = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + "tmp" + "/"
                + fileName;

        Connection conn2 = ((DuckDBConnection) conn).duplicate();
        Statement stmtRecords = conn2.createStatement();

        // put column name & data type into separate list
        ArrayList<String> columnList = new ArrayList<String>();
        ArrayList<String> dataTypeList = new ArrayList<String>();

        for (int i = 0; i < revisedInfoRequest.getRevisedColumnInfos().size(); i++) {
            FileUploadRevisedColumnInfo col = revisedInfoRequest.getRevisedColumnInfos().get(i);

            String colName = col.getFieldName();
            String silzilaDataType = col.getDataType().name().toLowerCase();
            String duckDbDataType = ConvertDuckDbDataType.toDuckDbDataType(silzilaDataType);
            String columnString = "'" + colName + "'";
            String dataTypeString = "'" + duckDbDataType + "'";
            columnList.add(columnString);
            dataTypeList.add(dataTypeString);
        }
        // build stringified list of columns
        String colMapString = "[" + String.join(", ", columnList) + "]";
        // build stringified list of data types
        String dataTypeMapString = "[" + String.join(", ", dataTypeList) + "]";
        logger.info("====================\n" + colMapString);
        logger.info("====================\n" + dataTypeMapString);

        // when user provieds custom data format
        String dateFormatCondition = "";
        if (revisedInfoRequest.getDateFormat() != null
                && !revisedInfoRequest.getDateFormat().trim().isEmpty()) {
            dateFormatCondition = ", dateformat='" + revisedInfoRequest.getDateFormat().trim() + "'";
        }
        // when user provieds custom timestamp format
        String timeStampFormatCondition = "";
        if (revisedInfoRequest.getTimestampFormat() != null
                && !revisedInfoRequest.getTimestampFormat().trim().isEmpty()) {
            timeStampFormatCondition = ", timestampformat='" + revisedInfoRequest.getTimestampFormat().trim() + "'";
        }

        // read CSV and write as Parquet file
        final String writeFile = System.getProperty("user.home") + "/" + "silzila-uploads" + "/" + userId + "/"
                + "/" + revisedInfoRequest.getFileId() + ".parquet";
        String query = "COPY (SELECT * from read_csv_auto('" + filePath
                + "', names=" + colMapString + ", types=" + dataTypeMapString
                + dateFormatCondition
                + timeStampFormatCondition + ")) TO '" + writeFile
                + "' (FORMAT PARQUET, COMPRESSION ZSTD);";
        stmtRecords.execute(query);
        logger.info("************************\n" + query);

        stmtRecords.close();
        conn2.close();
    }

    // get sample records from Parquet file
    public JSONArray getSampleRecords(String parquetFilePath) throws SQLException {

        Connection conn2 = ((DuckDBConnection) conn).duplicate();
        Statement stmtRecords = conn2.createStatement();

        String query = "SELECT * from read_parquet('" + parquetFilePath + "') LIMIT 200;";
        logger.info("************************\n" + query);

        ResultSet resultSet = stmtRecords.executeQuery(query);
        JSONArray jsonArray = ResultSetToJson.convertToJson(resultSet);
        stmtRecords.close();
        conn2.close();

        return jsonArray;
    }

    // get sample records from Parquet file
    public List<Map<String, Object>> getColumnMetaData(String parquetFilePath) throws SQLException {

        Connection conn2 = ((DuckDBConnection) conn).duplicate();
        Statement stmtMeta = conn2.createStatement();

        String query = "DESCRIBE SELECT * from read_parquet('" + parquetFilePath + "') LIMIT 1;";
        logger.info("************************\n" + query);

        ResultSet rsMeta = stmtMeta.executeQuery(query);
        // keep only column name & data type
        JSONArray jsonArrayMeta = DuckDbMetadataToJson.convertToJson(rsMeta);
        List<Map<String, Object>> metaList = new ArrayList<Map<String, Object>>();

        // convert JsonArray -> List of JsonObject -> List of Map(String, Object)
        if (jsonArrayMeta != null) {
            for (int i = 0; i < jsonArrayMeta.length(); i++) {
                JSONObject rec = jsonArrayMeta.getJSONObject(i);
                Map<String, Object> rowObj = new HashMap<String, Object>();
                rec.keySet().forEach(keyStr -> {
                    Object keyValue = rec.get(keyStr);
                    // DuckDB Data type -> Silzila Data Type
                    if (keyStr.equals("dataType")) {
                        String silzilaDataType = ConvertDuckDbDataType.toSilzilaDataType(keyValue.toString());
                        rowObj.put(keyStr, silzilaDataType);
                    } else {
                        rowObj.put(keyStr, keyValue);
                    }
                });
                metaList.add(rowObj);
            }
        }
        stmtMeta.close();
        conn2.close();
        return metaList;
    }

    // create DF for flat files
    public void createViewForFlatFiles(String userId, List<Table> tableObjList, List<FileData> fileDataList)
            throws SQLException, ClassNotFoundException {
        // System.out.println("Table Obj ============\n" + tableObjList.toString());
        // System.out.println("File Data List ============\n" +
        // fileDataList.toString());
        // iterate file table list and create DF & SQL view if not already created
        for (int i = 0; i < tableObjList.size(); i++) {
            /*
             * check if the view name is already existing
             * else create
             */
            String flatFileId = tableObjList.get(i).getFlatFileId();
            // create user
            if (!views.containsKey(userId)) {
                HashMap<String, ArrayList<String>> userHashMap = new HashMap<String, ArrayList<String>>();
                views.put(userId, userHashMap);
            }
            // create empty view list for the flatFileId for the user
            if (!views.get(userId).containsKey(flatFileId)) { // flatFileId
                ArrayList<String> viewList = new ArrayList<>();
                views.get(userId).put(flatFileId, viewList);
            }
            // add view name for the flatFileId
            String viewName = "vw_" + tableObjList.get(i).getAlias().replaceAll("[^a-zA-Z0-9_]", "_") + "_"
                    + flatFileId.substring(0, 8);
            if (!views.get(userId).get(flatFileId).contains(viewName)) {
                // iterate flat file list and get flat file name corresponding to file id
                for (int j = 0; j < fileDataList.size(); j++) {
                    if (flatFileId.equals(fileDataList.get(j).getId())) {
                        final String filePath = System.getProperty("user.home") + "/" + "silzila-uploads" + "/"
                                + userId + "/" + fileDataList.get(j).getFileName();
                        // create view on DF and maintain the view name to know if view is already there
                        startDuckDb();
                        Connection conn2 = ((DuckDBConnection) conn).duplicate();
                        Statement stmt = conn2.createStatement();
                        String query = "CREATE OR REPLACE VIEW " + viewName + " AS (SELECT * FROM '" + filePath + "')";
                        logger.info("View creating query ==============\n" + query);
                        stmt.execute(query);
                        stmt.close();
                        conn2.close();
                        views.get(userId).get(flatFileId).add(viewName);
                        logger.info("Views list ================ \n" + views);
                    }
                }

            }

        }
    }

    // get sample records from Parquet file
    public JSONArray runQuery(String query) throws SQLException {

        Connection conn2 = ((DuckDBConnection) conn).duplicate();
        Statement stmtRecords = conn2.createStatement();

        ResultSet resultSet = stmtRecords.executeQuery(query);
        JSONArray jsonArray = ResultSetToJson.convertToJson(resultSet);
        stmtRecords.close();
        conn2.close();

        return jsonArray;
    }

}
