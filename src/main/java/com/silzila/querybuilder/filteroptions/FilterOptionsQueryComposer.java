package com.silzila.querybuilder.filteroptions;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.BiFunction;
import static java.util.Map.entry;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;

import com.silzila.dto.DatasetDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.helper.ColumnListFromClause;
import com.silzila.payload.request.CalculatedFieldRequest;
import com.silzila.payload.request.ColumnFilter;
import com.silzila.payload.request.FilterPanel;
import com.silzila.payload.request.Table;
import com.silzila.querybuilder.RelationshipClauseGeneric;
import com.silzila.querybuilder.WhereClause;
import com.silzila.querybuilder.CalculatedField.*;
@Service
public class FilterOptionsQueryComposer {

    private static final Logger logger = LogManager.getLogger(FilterOptionsQueryComposer.class);

    // Map to store vendor-specific query functions
    private static final Map<String, BiFunction<ColumnFilter, Table, String>> FILTER_QUERY_MAP = Map.ofEntries(
            entry("postgresql", FilterQueryPostgres::getFilterOptions),
            entry("redshift", FilterQueryPostgres::getFilterOptions),
            entry("mysql", FilterQueryMysql::getFilterOptions),
            entry("sqlserver", FilterQuerySqlserver::getFilterOptions),
            entry("databricks", FilterQueryDatabricks::getFilterOptions),
            entry("duckdb", FilterQueryDuckDb::getFilterOptions),
            entry("bigquery", FilterQueryBigquery::getFilterOptions),
            entry("oracle", FilterQueryOracle::getFilterOptions),
            entry("snowflake", FilterQuerySnowflake::getFilterOptions),
            entry("motherduck", FilterQueryMotherduck::getFilterOptions),
            entry("db2", FilterQueryDB2::getFilterOptions),
            entry("teradata", FilterQueryTeraData::getFilterOptions)
    );

    /*
     * Builds query for the dropped column into a filter
     * Query result are the unique values of the selected column.
     */
    public String composeQuery(ColumnFilter cf, DatasetDTO ds, String vendorName) throws BadRequestException {
        logger.info("----------- FilterOptionsQueryComposer calling......");

        Table table = null;
        if (ds != null) {
            // Find the table corresponding to the given tableId in the dataset
            for (Table t : ds.getDataSchema().getTables()) {
                if (t.getId().equals(cf.getTableId())) {
                    table = t;
                    break;
                }
            }
            if (Objects.isNull(table)) {
                throw new BadRequestException("Error: Requested filter column is not available in Dataset!");
            }

            List<FilterPanel> datasetFilterPanels = ds.getDataSchema().getFilterPanels();
            List<List<CalculatedFieldRequest>> calculatedFieldRequests = null;

            // Handle calculated fields
            if (cf.getIsCalculatedField()) {
                String selectField = CalculatedFieldQueryComposer.calculatedFieldComposed(vendorName, ds.getDataSchema(), cf.getCalculatedField());
                calculatedFieldRequests = List.of(cf.getCalculatedField());
                cf.setFieldName(selectField);
            }

            // If dataset has filter panels, build the WHERE clause
            if (!datasetFilterPanels.isEmpty()) {
                String datasetFilterWhereClause = WhereClause.buildWhereClause(datasetFilterPanels, vendorName, ds.getDataSchema());
                cf.setWhereClause(datasetFilterWhereClause);
            }

            // Get all necessary columns
            List<String> allColumnList = ColumnListFromClause.getColumnListFromCalculatedFieldAndFilterPanels(calculatedFieldRequests, ds.getDataSchema().getFilterPanels(), cf.getTableId());

            // Build FROM clause 
            String fromClause = (!allColumnList.isEmpty()) ? RelationshipClauseGeneric.buildRelationship(allColumnList, ds.getDataSchema(), vendorName) : "";
            cf.setFromClause(fromClause);
        }

        // Fetch the correct function from the map and execute it
        return FILTER_QUERY_MAP.getOrDefault(vendorName, (c, t) -> {
            throw new BadRequestException("Error: DB vendor Name is wrong!");
        }).apply(cf, table);
    }
}
