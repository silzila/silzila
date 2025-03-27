package com.silzila.helper;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.silzila.payload.request.CalculatedFieldRequest;
import com.silzila.payload.request.Field;
import com.silzila.payload.request.FilterPanel;
import com.silzila.payload.request.Query;

public class ColumnListFromClause {

    public static List<String> getColumnListFromQuery(Query req) {

        Set<String> uniqueTables = new HashSet<>();

        req.getDimensions().forEach(dim -> collectTableIds(dim.getTableId(),
                dim.getIsCalculatedField() ? dim.getCalculatedField() : null, uniqueTables));
        req.getMeasures().forEach(measure -> collectTableIds(measure.getTableId(),
                measure.getIsCalculatedField() ? measure.getCalculatedField() : null, uniqueTables));
        req.getFields().forEach(field -> uniqueTables.add(field.getTableId()));
        req.getFilterPanels().forEach(panel -> panel.getFilters().forEach(filter -> collectTableIds(filter.getTableId(),
                filter.getIsCalculatedField() ? filter.getCalculatedField() : null, uniqueTables)));
        return new ArrayList<>(uniqueTables);
    }

    
    public static List<String> getColumnListFromFields(Map<String, Field> fields) {
        return fields.values().stream()
                .map(Field::getTableId)
                .distinct()
                .collect(Collectors.toList());
    }

    public static List<String> getColumnListFromFieldsRequest(List<CalculatedFieldRequest> calculatedFieldRequests) {
        return calculatedFieldRequests.stream()
                .flatMap(request -> getColumnListFromFields(request.getFields()).stream())
                .distinct()
                .collect(Collectors.toList());
    }

    public static List<String> getColumnListFromListOfFieldRequests(
            List<List<CalculatedFieldRequest>> calculatedFieldsList) {
        return calculatedFieldsList.stream()
                .flatMap(List::stream)
                .flatMap(request -> getColumnListFromFieldsRequest(List.of(request)).stream())
                .distinct()
                .collect(Collectors.toList());
    }
    

    public static List<String> getColumnListFromCalculatedFieldAndFilterPanels(
            List<List<CalculatedFieldRequest>> calculatedFieldRequests, List<FilterPanel> filterPanels,
             String tableId) {

        Set<String> columnTableIds = new HashSet<>();   

        if (calculatedFieldRequests!=null && calculatedFieldRequests.get(0) != null) {
            List<String> calculatedFieldRequestIds = getColumnListFromListOfFieldRequests(calculatedFieldRequests);
            columnTableIds.addAll(calculatedFieldRequestIds);
        }

        if (filterPanels != null) {
            List<String> filterPanelIds = getColumnListFromFilterPanels(filterPanels);
            columnTableIds.addAll(filterPanelIds);
        }

        columnTableIds.add(tableId);

        return new ArrayList<>(columnTableIds);

    }

    public static List<String> getColumnListFromFilterPanels(List<FilterPanel> filterPanels) {

        Set<String> uniqueTables = new HashSet<>();

        filterPanels.forEach(panel -> panel.getFilters().forEach(filter -> collectTableIds(filter.getTableId(),
                filter.getIsCalculatedField() ? filter.getCalculatedField() : null, uniqueTables)));

        return new ArrayList<>(uniqueTables);

    }

    private static void collectTableIds(String tableId, List<CalculatedFieldRequest> calculatedFieldRequests,
            Set<String> uniqueTables) {
        if (tableId != null) {
            uniqueTables.add(tableId);
        }
        if (calculatedFieldRequests != null) {
            for (CalculatedFieldRequest calculatedFieldRequest : calculatedFieldRequests) {
                uniqueTables.addAll(getColumnListFromFields(calculatedFieldRequest.getFields()));
            }
        }
    }
    
    

}
