package org.silzila.app.security.service;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.silzila.app.exception.BadRequestException;
import org.silzila.app.payload.request.DBConnectionRequest;
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
