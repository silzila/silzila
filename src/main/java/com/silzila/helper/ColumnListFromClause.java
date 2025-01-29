package com.silzila.helper;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.silzila.payload.request.Query;



public class ColumnListFromClause {
    
    public static List<String> getColumnListFromQuery(Query req) {

        Set<String> uniqueTables = new HashSet<>();
    
        req.getDimensions().forEach(dim -> collectTableIds(dim.getTableId(), uniqueTables));
        req.getMeasures().forEach(measure -> collectTableIds(measure.getTableId(), uniqueTables));
        req.getFields().forEach(field -> uniqueTables.add(field.getTableId()));
        req.getFilterPanels().forEach(panel -> 
            panel.getFilters().forEach(filter -> collectTableIds(filter.getTableId(), uniqueTables)));
    
        return new ArrayList<>(uniqueTables);
    }
    
    private static void collectTableIds(String tableId, Set<String> uniqueTables) {
        if (tableId != null) {
            uniqueTables.add(tableId);
        }
    }
    
}
