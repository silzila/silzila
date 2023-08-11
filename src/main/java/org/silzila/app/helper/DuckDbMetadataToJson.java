package org.silzila.app.helper;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class DuckDbMetadataToJson {

    public static JSONArray convertToJson(ResultSet resultSet) throws SQLException {
        Map<String, String> colNameMap = Map.of("column_name", "fieldName", "column_type", "dataType");
        ResultSetMetaData metaData = resultSet.getMetaData();
        int numCols = metaData.getColumnCount();
        List<String> colNames = IntStream.range(0, numCols)
                .mapToObj(i -> {
                    try {
                        return metaData.getColumnName(i + 1);
                    } catch (SQLException e) {
                        e.printStackTrace();
                        return "?";
                    }
                })
                .collect(Collectors.toList());

        JSONArray result = new JSONArray();
        while (resultSet.next()) {
            JSONObject row = new JSONObject();
            colNames.forEach(cn -> {
                // to change column names and to filter required columns
                if (colNameMap.containsKey(cn)) {
                    try {
                        row.put(colNameMap.get(cn), resultSet.getObject(cn));
                    } catch (JSONException | SQLException e) {
                        e.printStackTrace();
                    }
                }
            });
            result.put(row);
        }
        return result;
    }

}
