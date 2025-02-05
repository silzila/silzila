package com.silzila.helper;

import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.interfaces.RelativeFilterFunction;
import com.silzila.payload.request.CalculatedFieldRequest;
import com.silzila.payload.request.ColumnFilter;
import com.silzila.payload.request.Condition;
import com.silzila.payload.request.ConditionFilter;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.Filter;
import com.silzila.payload.request.FilterPanel;
import com.silzila.payload.request.RelativeCondition;
import com.silzila.payload.request.RelativeFilterRequest;

@Component
public class RelativeFilterProcessor {
    public List<FilterPanel> processFilterPanels(List<FilterPanel> filterPanels, String userId, String dBConnectionId,
            String datasetId, String workspaceId, RelativeFilterFunction relativeFilterFunction)
            throws ClassNotFoundException, RecordNotFoundException, BadRequestException, SQLException,
            JsonProcessingException {

        for (FilterPanel filterPanel : filterPanels) {
            List<Filter> filters = filterPanel.getFilters();
            if (filters != null) {
                for (Filter filter : filters) {
                    // Check if the filter is of type 'relative_filter'
                    if ("relativeFilter".equals(filter.getFilterType())) {
                        // Get the relative condition associated with the filter
                        RelativeCondition relativeCondition = filter.getRelativeCondition();
                        if (relativeCondition != null) {
                            // Create a new RelativeFilterRequest object with the relative condition and
                            // filter
                            RelativeFilterRequest relativeFilter = new RelativeFilterRequest();

                            relativeFilter.setAnchorDate(relativeCondition.getAnchorDate());
                            relativeFilter.setFrom(relativeCondition.getFrom());
                            relativeFilter.setTo(relativeCondition.getTo());

                            // Check if both DataType and TimeGrain match for date
                            if ((Filter.DataType.DATE.equals(filter.getDataType())
                                    || Filter.DataType.TIMESTAMP.equals(filter.getDataType()))
                                    && Filter.TimeGrain.DATE.equals(filter.getTimeGrain())) {
                                ColumnFilter relativeColumnFilter = new ColumnFilter();
                                relativeColumnFilter.setTableId(filter.getTableId());
                                relativeColumnFilter.setFieldName(filter.getFieldName());
                                relativeColumnFilter.setDataType(ColumnFilter.DataType.DATE); // Set DataType.DATE if
                                                                                              // both checks pass
                                relativeColumnFilter.setTimeGrain(ColumnFilter.TimeGrain.DATE); // Set TimeGrain.DATE
                                relativeFilter.setFilterTable(relativeColumnFilter);
                            }

                            // Call the passed relative filter function
                            JSONArray relativeDateJson = relativeFilterFunction.apply(userId, dBConnectionId, datasetId,
                                    workspaceId, relativeFilter);

                            // Extract 'fromdate' and 'todate' from the JSON response
                            String fromDate = extractDate(relativeDateJson.getJSONObject(0), "FROMDATE", "fromdate");
                            String toDate = extractDate(relativeDateJson.getJSONObject(0), "TODATE", "todate");

                            // Ensure fromDate is before toDate
                            if (fromDate.compareTo(toDate) > 0) {
                                String tempDate = fromDate;
                                fromDate = toDate;
                                toDate = tempDate;
                            }

                            // Set the user selection - date range
                            filter.setUserSelection(Arrays.asList(fromDate, toDate));
                        } else {
                            throw new BadRequestException("Error: There is no relative filter condition");
                        }
                    }
                }
            }
        }
        return filterPanels;
    }

    // Helper method for extracting date
    private String extractDate(JSONObject jsonObject, String primaryKey, String fallbackKey) {
        return jsonObject.has(primaryKey) ? String.valueOf(jsonObject.get(primaryKey))
                : String.valueOf(jsonObject.get(fallbackKey));
    }

    public void processFilter(Filter filter, String userId, String dBConnectionId, String datasetId, String workspaceId,
            RelativeFilterFunction relativeFilterFunction)
            throws ClassNotFoundException, RecordNotFoundException, BadRequestException, SQLException,
            JsonProcessingException {
        // Get the relative condition associated with the filter
        RelativeCondition relativeCondition = filter.getRelativeCondition();
        if (relativeCondition != null) {
            // Create a new RelativeFilterRequest object with the relative condition and
            // filter
            RelativeFilterRequest relativeFilter = new RelativeFilterRequest();

            relativeFilter.setAnchorDate(relativeCondition.getAnchorDate());
            relativeFilter.setFrom(relativeCondition.getFrom());
            relativeFilter.setTo(relativeCondition.getTo());

            // Check if both DataType and TimeGrain match for date
            if (Filter.DataType.DATE.equals(filter.getDataType())
                    && Filter.TimeGrain.DATE.equals(filter.getTimeGrain())) {
                ColumnFilter relativeColumnFilter = new ColumnFilter();
                relativeColumnFilter.setTableId(filter.getTableId());
                relativeColumnFilter.setFieldName(filter.getFieldName());
                relativeColumnFilter.setDataType(ColumnFilter.DataType.DATE); // Set DataType.DATE if both checks pass
                relativeColumnFilter.setTimeGrain(ColumnFilter.TimeGrain.DATE); // Set TimeGrain.DATE
                relativeFilter.setFilterTable(relativeColumnFilter);
            }

            // Call the passed relative filter function
            JSONArray relativeDateJson = relativeFilterFunction.apply(userId, dBConnectionId, datasetId, workspaceId,
                    relativeFilter);

            // Extract 'fromdate' and 'todate' from the JSON response
            String fromDate = extractDate(relativeDateJson.getJSONObject(0), "FROMDATE", "fromdate");
            String toDate = extractDate(relativeDateJson.getJSONObject(0), "TODATE", "todate");

            // Ensure fromDate is before toDate
            if (fromDate.compareTo(toDate) > 0) {
                String tempDate = fromDate;
                fromDate = toDate;
                toDate = tempDate;
            }

            // Set the user selection - date range
            filter.setUserSelection(Arrays.asList(fromDate, toDate));
        } else {
            throw new BadRequestException("Error: There is no relative filter condition");
        }

    }

    public void processCalculatedFields(List<CalculatedFieldRequest> calculatedFieldRequests,
            String userId, String dBConnectionId, String datasetId, String workspaceId,
            RelativeFilterFunction relativeFilterFunction) {
        for (CalculatedFieldRequest calculatedField : calculatedFieldRequests) {
            if (calculatedField.getConditionFilters() != null && !calculatedField.getConditionFilters().isEmpty()) {
                processConditionFilters(calculatedField.getFields(), calculatedField.getConditionFilters(), userId,
                        dBConnectionId, datasetId, workspaceId, relativeFilterFunction);
            }
        }
    }

    private void processConditionFilters(Map<String, Field> fields, Map<String, List<ConditionFilter>> conditionFilters,
            String userId, String dBConnectionId, String datasetId, String workspaceId,
            RelativeFilterFunction relativeFilterFunction) {
        conditionFilters.forEach((key, conditionFilterList) -> {
            for (ConditionFilter conditionFilter : conditionFilterList) {
                for (Condition condition : conditionFilter.getConditions()) {
                    if (isRelativeFilterCondition(condition)) {
                        try {
                            processCalculatedField(fields, condition, userId, dBConnectionId, datasetId,
                                    workspaceId, relativeFilterFunction);
                        } catch (Exception e) {
                            e.printStackTrace(); // Better error handling could be implemented here
                        }
                    }
                }
            }
        });
    }

    public void processCalculatedField(Map<String, Field> fields, Condition condition, String userId,
            String dBConnectionId,
            String datasetId, String workspaceId, RelativeFilterFunction relativeFilterFunction)
            throws JsonProcessingException, ClassNotFoundException, RecordNotFoundException, SQLException,
            BadRequestException {

        RelativeFilterRequest relativeFilter = createRelativeFilterRequest(fields, condition);

        // Call the passed relative filter function
        JSONArray relativeDateJson = relativeFilterFunction.apply(userId, dBConnectionId, datasetId, workspaceId,
                relativeFilter);

        // Extract 'fromdate' and 'todate' from the JSON response and process the result
        List<String> relativeDates = processRelativeDateJson(relativeDateJson);

        settingConditionRelativeFilter(condition, relativeDates);
    }

    private void settingConditionRelativeFilter(Condition condition, List<String> dates) {

        // Set the condition values accordingly
        condition.setRightOperand(dates);
        condition.setRightOperandType(Arrays.asList("text", "text"));
        condition.setOperator("between");
    }

    private List<String> processRelativeDateJson(JSONArray relativeDateJson) throws BadRequestException {
        // Extract 'fromdate' and 'todate' from the JSON response
        String fromDate = extractDate(relativeDateJson.getJSONObject(0), "FROMDATE", "fromdate");
        String toDate = extractDate(relativeDateJson.getJSONObject(0), "TODATE", "todate");
        // Ensure fromDate is before toDate
        if (fromDate.compareTo(toDate) > 0) {
            String tempDate = fromDate;
            fromDate = toDate;
            toDate = tempDate;
        }

        return Arrays.asList(fromDate, toDate);
    }

    public void processListOfCalculatedFields(List<List<CalculatedFieldRequest>> calculatedFieldLists, String userId,
             String dBConnectionId, String datasetId, String workspaceId,
            RelativeFilterFunction relativeFilterFunction) {
        for (List<CalculatedFieldRequest> calculatedFieldList : calculatedFieldLists) {
            processCalculatedFields(calculatedFieldList, userId, dBConnectionId, datasetId, workspaceId,
                    relativeFilterFunction);
        }
    }

   

    private boolean isRelativeFilterCondition(Condition condition) {
        return "relativeFilter".equals(condition.getOperator());
    }

    public void processCalculatedField(Map<String, Field> fields, Condition condition, String userId, String tenantId,
            String dBConnectionId,
            String datasetId, String workspaceId, RelativeFilterFunction relativeFilterFunction)
            throws JsonProcessingException, ClassNotFoundException, RecordNotFoundException, SQLException,
            BadRequestException {

        RelativeFilterRequest relativeFilter = createRelativeFilterRequest(fields, condition);

        // Call the passed relative filter function
        JSONArray relativeDateJson = relativeFilterFunction.apply(userId, dBConnectionId, datasetId,
                workspaceId, relativeFilter);

        // Extract 'fromdate' and 'todate' from the JSON response and process the result
        List<String> relativeDates = processRelativeDateJson(relativeDateJson);

        settingConditionRelativeFilter(condition, relativeDates);
    }
    
private RelativeFilterRequest createRelativeFilterRequest(Map<String, Field> fields, Condition condition) {
    RelativeCondition relativeCondition = condition.getRelativeCondition();

    RelativeFilterRequest relativeFilter = new RelativeFilterRequest();
    relativeFilter.setAnchorDate(relativeCondition.getAnchorDate());
    relativeFilter.setFrom(relativeCondition.getFrom());
    relativeFilter.setTo(relativeCondition.getTo());

    Field field = fields.get(condition.getLeftOperand().get(0));

    // Set up the ColumnFilter based on the condition and field metadata
    if (isRelativeFilterCondition(condition)) {
        ColumnFilter relativeColumnFilter = new ColumnFilter();
        relativeColumnFilter.setTableId(field.getTableId());
        relativeColumnFilter.setFieldName(field.getFieldName());
        relativeColumnFilter.setDataType(ColumnFilter.DataType.DATE);
        relativeColumnFilter.setTimeGrain(ColumnFilter.TimeGrain.DATE);
        relativeFilter.setFilterTable(relativeColumnFilter);
    }
    System.out.println("Relative filter" + relativeFilter);
    return relativeFilter;
}


    private void processConditionFilters(Map<String, Field> fields, Map<String, List<ConditionFilter>> conditionFilters,
            String userId, String tenantId, String dBConnectionId, String datasetId, String workspaceId,
            RelativeFilterFunction relativeFilterFunction) {
        conditionFilters.forEach((key, conditionFilterList) -> {
            for (ConditionFilter conditionFilter : conditionFilterList) {
                for (Condition condition : conditionFilter.getConditions()) {
                    if (isRelativeFilterCondition(condition)) {
                        try {
                            processCalculatedField(fields, condition, userId, tenantId, dBConnectionId, datasetId,
                                    workspaceId, relativeFilterFunction);
                        } catch (Exception e) {
                            e.printStackTrace(); // Better error handling could be implemented here
                        }
                    }
                }
            }
        });
    }

}