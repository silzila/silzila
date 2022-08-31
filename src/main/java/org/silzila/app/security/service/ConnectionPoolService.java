package org.silzila.app.security.service;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.exception.RecordNotFoundException;
import org.silzila.app.helper.ResultSetToJson;
import org.silzila.app.model.DBConnection;
import org.silzila.app.payload.request.DBConnectionRequest;
import org.silzila.app.payload.response.MetadataDatabase;
import org.silzila.app.payload.response.MetadataSchema;
import org.silzila.app.payload.response.MetadataTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    private static Map<String, DBConnection> connectionDetails = new HashMap<>();

    @Autowired
    DBConnectionService dbConnectionService;

    public void createConnectionPool(String id, String userId) throws RecordNotFoundException, SQLException {
        System.out.println("calling createConnectionPool Fn ----------------");
        if (!connectionPool.containsKey(id)) {
            System.out.println("newly creating connection pool ----------------");
            DBConnection dbConnection = dbConnectionService.getDBConnectionWithPasswordById(id, userId);
            System.out.println("DC name ---------------- " + dbConnection.getConnectionName());
            String fullUrl = "";
            if (dbConnection.getVendor() == "sqlserver") {
                // dbConnection.getPasswordHash() now holds decrypted password
                // fullUrl = "jdbc:sqlserver://" + dbConnection.getServer() + ":" +
                // dbConnection.getPort()
                // + ";databaseName=" + dbConnection.getDatabase() + ";user="
                // + dbConnection.getUsername() + ";password=" + dbConnection.getPasswordHash()
                // + ";encrypt=false";
                // System.out.println("Server URL ==========" + fullUrl);
                // config.setJdbcUrl(fullUrl);
                // config.addDataSourceProperty("minimulIdle", "3");
                // config.addDataSourceProperty("maximumPoolSize", "5");
                // config.setDataSourceClassName("com.microsoft.sqlserver.jdbc.SQLServerDataSource");

                // // config.setDataSource(new
                // com.microsoft.sqlserver.jdbc.SQLServerDataSource());
                // config.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDataSource");
                // config.setMinimumIdle(3);
                // config.setMaximumPoolSize(10);
                // //
                // config.setDataSourceClassName("com.microsoft.sqlserver.jdbc.SQLServerDataSource");
                // config.addDataSourceProperty("serverName", dbConnection.getServer());
                // config.addDataSourceProperty("port", dbConnection.getPort());
                // config.addDataSourceProperty("databaseName", dbConnection.getDatabase());
                // config.addDataSourceProperty("user", dbConnection.getUsername());
                // config.addDataSourceProperty("password", dbConnection.getPasswordHash());
                // config.addDataSourceProperty("encryption", false);

                fullUrl = "jdbc:sqlserver://3.7.39.222:1433;databaseName=landmark;user=balu;password=Marina!1234;encrypt=false";
                config.setJdbcUrl(fullUrl);
                config.addDataSourceProperty("minimulIdle", "3");
                config.addDataSourceProperty("maximumPoolSize", "5");

            } else {
                // dbConnection.getPasswordHash() now holds decrypted password
                fullUrl = "jdbc:" + dbConnection.getVendor() + "://" + dbConnection.getServer() + ":"
                        + dbConnection.getPort() + "/" + dbConnection.getDatabase();
                config.setJdbcUrl(fullUrl);
                config.setUsername(dbConnection.getUsername());
                config.setPassword(dbConnection.getPasswordHash());
                config.addDataSourceProperty("minimulIdle", "3");
                config.addDataSourceProperty("maximumPoolSize", "5");
            }
            dataSource = new HikariDataSource(config);
            connection = dataSource.getConnection();
            connectionPool.put(id, connection);
            connectionDetails.put(id, dbConnection);
        }
    }

    public JSONArray checkSqlServer() throws SQLException, RecordNotFoundException {
        String connectionUrl = "jdbc:sqlserver://3.7.39.222:1433;databaseName=landmark;user=balu;password=Marina!1234;encrypt=false";
        System.out.println("Connection String ==========" + connectionUrl);
        try {
            Connection con = DriverManager.getConnection(connectionUrl);
            Statement statement = con.createStatement();
            String sql = "SELECT * from pos.category";
            ResultSet rs = statement.executeQuery(sql);
            // if (rs.wasNull()) {
            // throw new RecordNotFoundException("no result!");
            // }
            // while (rs.next()) {
            // System.out.println("--------" + rs.getString("category"));
            // }
            JSONArray jsonArray = ResultSetToJson.convertToJson(rs);
            /* DB NAMES */
            DatabaseMetaData databaseMetaData = con.getMetaData();
            ResultSet resultSet = databaseMetaData.getCatalogs();
            while (resultSet.next()) {
                MetadataDatabase metadataDatabase = new MetadataDatabase();
                metadataDatabase.setDatabase(resultSet.getString("TABLE_CAT"));
                System.out.println("Schema loop ======== " + resultSet.getString("TABLE_CAT"));
            }
            /* SCHEMA NAMES */
            ResultSet resultSet2 = databaseMetaData.getSchemas();
            // JSONArray resultSet = ResultSetToJson.convertToJson(resultSet);
            while (resultSet2.next()) {
                String databaseName = resultSet2.getString("TABLE_CATALOG");
                String schemaName = resultSet2.getString("TABLE_SCHEM");
                System.out.println("DB NAME ======== " + databaseName + " SCHEMA NAME ======= " + schemaName);
            }
            // System.out.println("Stringigy JSON ===========\n " + jsonArray.toString());
            return jsonArray;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
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

    public ArrayList<String> getDatabase(String id, String userId)
            throws RecordNotFoundException, SQLException {
        // first create connection pool to query DB
        // when connection id is not available, RecordNotFoundException will be throws
        createConnectionPool(id, userId);
        ArrayList<String> schemaList = new ArrayList<String>();
        try {
            Connection _connection = connectionPool.get(id);
            DatabaseMetaData databaseMetaData = _connection.getMetaData();
            // get database (catalog) names from metadata object
            ResultSet resultSet = databaseMetaData.getCatalogs();
            while (resultSet.next()) {
                String databaseName = resultSet.getString("TABLE_CAT");
                // append iterated result set into list
                schemaList.add(databaseName);
            }
            return schemaList;
        } catch (Exception e) {
            throw new SQLException();
        }
    }

    public ArrayList<MetadataSchema> getSchema(String id, String userId) throws RecordNotFoundException, SQLException {
        // first create connection pool to query DB
        createConnectionPool(id, userId);
        ArrayList<MetadataSchema> schemaList = new ArrayList<MetadataSchema>();
        try {
            Connection _connection = connectionPool.get(id);
            DatabaseMetaData databaseMetaData = _connection.getMetaData();

            // get database & schema names from metadata object
            // Postgres will not show other databases in the server and MySQL doen't have
            // Schema. So, either db or schema will be populated for Postgres and MySQL
            // TODO: need to check for SQL Server or Snowflake which contain both Databases
            // and shemas and can query cross DB
            ResultSet resultSet = databaseMetaData.getSchemas();
            // iterate result and add row to object and append object to list
            while (resultSet.next()) {
                String databaseName = resultSet.getString("TABLE_CATALOG");
                String schemaName = resultSet.getString("TABLE_SCHEM");
                MetadataSchema metadataSchema = new MetadataSchema(databaseName, schemaName);
                schemaList.add(metadataSchema);
            }
            return schemaList;
        } catch (Exception e) {
            throw new SQLException();
        }
    }

    public MetadataTable getTable(String id, String userId, String databaseName, String schemaName)
            throws RecordNotFoundException, SQLException {
        // first create connection pool to query DB
        createConnectionPool(id, userId);
        try {
            Connection _connection = connectionPool.get(id);
            DBConnection _dbConnection = connectionDetails.get(id);
            DatabaseMetaData databaseMetaData = _connection.getMetaData();
            // this object will hold list of tables and list of views
            MetadataTable metadataTable = new MetadataTable();

            ResultSet resultSetTables = null;
            ResultSet resultSetViews = null;
            // based on database dialect, we pass either DB name or schema name at different
            // position in the funciton
            // for POSTGRESQL DB
            if (_dbConnection.getVendor().equalsIgnoreCase("postgresql")) {
                // ADD Table Names
                resultSetTables = databaseMetaData.getTables(null, schemaName, null,
                        new String[] { "TABLE" });
                // ADD View Names
                resultSetViews = databaseMetaData.getTables(null, schemaName, null, new String[] { "VIEW" });
            }
            // for MYSQL DB
            else if (_dbConnection.getVendor().equalsIgnoreCase("mysql")) {
                // ADD Table Names
                resultSetTables = databaseMetaData.getTables(databaseName, null, null,
                        new String[] { "TABLE" });
                // ADD View Names
                resultSetViews = databaseMetaData.getTables(databaseName, null, null,
                        new String[] { "VIEW" });
            }
            // iterate table names and add it to List
            while (resultSetTables.next()) {
                String tableName = resultSetTables.getString("TABLE_NAME");
                metadataTable.getTables().add(tableName);
            }
            // iterate view names and add it to List
            while (resultSetViews.next()) {
                String viewName = resultSetViews.getString("TABLE_NAME");
                metadataTable.getViews().add(viewName);
            }
            return metadataTable;
        } catch (Exception e) {
            throw new SQLException();
        }
    }

    // test connect a given database connection parameters
    public void testDBConnection(DBConnectionRequest request) throws SQLException, BadRequestException {
        if (request.getVendor() == "sqlserver") {
            // String fullUrl =
            // "jdbc:sqlserver://3.7.39.222;databaseName=landmark;user=balu;password=Marina!1234";
            // String fullUrl =
            // "jdbc:sqlserver://;serverName=3.7.39.222;databaseName=landmark;user=balu;password=Marina!1234";
            // config.setJdbcUrl(fullUrl);
            // config.addDataSourceProperty("minimulIdle", "3");
            // config.addDataSourceProperty("maximumPoolSize", "5");
            // dataSource = new HikariDataSource(config);
            // config.setMinimumIdle(3);
            // config.setMaximumPoolSize(10);
            config.setDataSourceClassName("com.microsoft.sqlserver.jdbc.SQLServer");
            config.addDataSourceProperty("serverName", request.getServer());
            config.addDataSourceProperty("port", request.getPort());
            config.addDataSourceProperty("databaseName", request.getDatabase());
            config.addDataSourceProperty("user", request.getUsername());
            config.addDataSourceProperty("password", request.getPassword());
            config.addDataSourceProperty("encryption", false);
        } else {

            String fullUrl = "jdbc:" + request.getVendor() + "://" + request.getServer() + ":" + request.getPort() + "/"
                    + request.getDatabase();
            config.setJdbcUrl(fullUrl);
            config.setUsername(request.getUsername());
            config.setPassword(request.getPassword());
            config.addDataSourceProperty("minimulIdle", "3");
            config.addDataSourceProperty("maximumPoolSize", "5");
            dataSource = new HikariDataSource(config);
        }
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
