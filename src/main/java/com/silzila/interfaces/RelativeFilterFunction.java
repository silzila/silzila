package com.silzila.interfaces;

import java.sql.SQLException;
import org.json.JSONArray;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.RelativeFilterRequest;

@FunctionalInterface
public interface RelativeFilterFunction {
    JSONArray apply(String userId, String dBConnectionId, String datasetId,String workspaceId, RelativeFilterRequest relativeFilter)
        throws JsonProcessingException, RecordNotFoundException, SQLException, BadRequestException,ClassNotFoundException;
}


