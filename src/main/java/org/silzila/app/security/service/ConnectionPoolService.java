package org.silzila.app.security.service;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.hibernate.mapping.MetaAttributable;
import org.json.JSONArray;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.RecordNotFoundException;
import org.silzila.app.helper.ResultSetToJson;
import org.silzila.app.model.DBConnection;
import org.silzila.app.payload.request.DBConnectionRequest;
import org.silzila.app.payload.response.MetadataDatabase;
import org.silzila.app.payload.response.MetadataSchema;
import org.silzila.app.security.encryption.AESEncryption;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mysql.cj.x.protobuf.MysqlxDatatypes.Array;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Service
public class ConnectionPoolService {

    private HikariDataSource dataSource = null;
    HikariConfig config = new HikariConfig();

    Connection connection = null;
    Statement statement = null;
    ResultSet resultSet = null;

    private static Map<String, Connection> connectionPool = new HashMap<>();

    @Autowired
    DBConnectionService dbConnectionService;

    public void createConnectionPool(String id, String userId) throws RecordNotFoundException, SQLException {
        System.out.println("calling createConnectionPool Fn ----------------");
        if (!connectionPool.containsKey(id)) {
            System.out.println("newly creating connection pool ----------------");
            DBConnection dbConnection = dbConnectionService.getDBConnectionWithPasswordById(id, userId);
            System.out.println("DC name ---------------- " + dbConnection.getConnectionName());
            String fullUrl = "jdbc:" + dbConnection.getVendor() + "://" + dbConnection.getServer() + ":"
                    + dbConnection.getPort() + "/" +
                    dbConnection.getDatabase();
            config.setJdbcUrl(fullUrl);
            config.setUsername(dbConnection.getUsername());
            config.setPassword(dbConnection.getPasswordHash()); // passwordHash now contains decrypted password
            config.addDataSourceProperty("minimulIdle", "3");
            config.addDataSourceProperty("maximumPoolSize", "5");

            dataSource = new HikariDataSource(config);
            connection = dataSource.getConnection();
            connectionPool.put(id, connection);
        }
    }

    public JSONArray runQuery(String id, String userId) throws RecordNotFoundException, SQLException {
        System.out.println("calling runQuery Fn ----------------");
        createConnectionPool(id, userId);
        System.out.println("After calling createConnectionPool Fn ----------------");
        try {
            Connection _connection = connectionPool.get(id);
            statement = _connection.createStatement();
            System.out.println("after statement declaration ----------------");
            resultSet = statement.executeQuery("select * from pos.point_of_sales limit 10"); // select 1 as x, 2 as y
            JSONArray jsonArray = ResultSetToJson.convertToJson(resultSet);
            System.out.println("result printing ----------------");
            System.out.println("Stringigy JSON ===========\n " + jsonArray.toString());
            return jsonArray;
        } catch (Exception e) {
            System.out.println("runQuery Exception ----------------");
            System.out.println("error: " + e.toString());
            throw new SQLException();
        }
    }

    public ArrayList<MetadataDatabase> getDatabase(String id, String userId)
            throws RecordNotFoundException, SQLException {
        System.out.println("calling getDatabase Fn ----------------");
        createConnectionPool(id, userId);
        System.out.println("After calling createConnectionPool Fn ----------------");
        // HashMap<String, MetadataDatabase> hashMap = new HashMap<>();
        ArrayList<MetadataDatabase> schemaList = new ArrayList<MetadataDatabase>();
        try {
            Connection _connection = connectionPool.get(id);
            // statement = _connection.createStatement();
            DatabaseMetaData databaseMetaData = _connection.getMetaData();
            ResultSet resultSet = databaseMetaData.getCatalogs();
            while (resultSet.next()) {
                MetadataDatabase metadataDatabase = new MetadataDatabase();
                metadataDatabase.setDatabase(resultSet.getString("TABLE_CAT"));
                System.out.println("Schema loop ======== " + resultSet.getString("TABLE_CAT"));
                schemaList.add(metadataDatabase);
            }
            return schemaList;
        } catch (Exception e) {
            throw new SQLException();
        }
    }

    public ArrayList<MetadataSchema> getSchema(String id, String userId) throws RecordNotFoundException, SQLException {
        System.out.println("calling getSchema Fn ----------------");
        createConnectionPool(id, userId);
        System.out.println("After calling createConnectionPool Fn ----------------");
        // HashMap<String, MetadataSchema> hashMap = new HashMap<>();
        ArrayList<MetadataSchema> schemaList = new ArrayList<MetadataSchema>();
        try {
            Connection _connection = connectionPool.get(id);
            // statement = _connection.createStatement();
            DatabaseMetaData databaseMetaData = _connection.getMetaData();
            ResultSet resultSet = databaseMetaData.getSchemas();
            // JSONArray resultSet = ResultSetToJson.convertToJson(resultSet);
            while (resultSet.next()) {
                String databaseName = resultSet.getString("TABLE_CATALOG");
                String schemaName = resultSet.getString("TABLE_SCHEM");
                System.out.println("DB NAME ======== " + databaseName + " SCHEMA NAME ======= " + schemaName);

                MetadataSchema metadataSchema = new MetadataSchema(databaseName, schemaName);
                // metadataSchema.setSchema(resultSet.getString("TABLE_CAT"));
                // hashMap.put("schema", metadataSchema);
                schemaList.add(metadataSchema);
                // System.out.println("Schema hash Map ======== " + hashMap.toString());
            }
            // System.out.println("Schema hash Map +++++++++++ " + hashMap.toString());
            return schemaList;
        } catch (Exception e) {
            throw new SQLException();
        }
    }

    // test connect a given database connection parameters
    public void testDBConnection(DBConnectionRequest request) throws SQLException, BadRequestException {
        String fullUrl = "jdbc:" + request.getVendor() + "://" + request.getServer() + ":" + request.getPort() + "/" +
                request.getDatabase();
        config.setJdbcUrl(fullUrl);
        config.setUsername(request.getUsername());
        config.setPassword(request.getPassword());
        config.addDataSourceProperty("minimulIdle", "3");
        config.addDataSourceProperty("maximumPoolSize", "5");
        dataSource = new HikariDataSource(config);
        connection = dataSource.getConnection();
        Integer rowCount = 0;
        // run a simple query and see it record is fetched
        try {
            statement = connection.createStatement();
            resultSet = statement.executeQuery("select 1");
            while (resultSet.next()) {
                rowCount++;
            }
        } catch (Exception e) {
            System.out.println("error: " + e.toString());
            throw new SQLException();

        } finally {
            resultSet.close();
            statement.close();
            connection.close();
            dataSource.close();
        }
        // return error if no record is fetched
        if (rowCount == 0) {
            throw new BadRequestException("Error: Something wrong!");
        }
    }

}
