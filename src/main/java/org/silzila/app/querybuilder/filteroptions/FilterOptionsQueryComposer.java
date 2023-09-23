package org.silzila.app.querybuilder.filteroptions;

import java.util.stream.Collectors;
import java.util.Objects;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.silzila.app.AppApplication;
import org.silzila.app.domain.QueryClauseFieldListMap;
import org.silzila.app.dto.DatasetDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.payload.request.ColumnFilter;
import org.silzila.app.payload.request.Query;
import org.silzila.app.payload.request.Table;
import org.springframework.stereotype.Service;

@Service
public class FilterOptionsQueryComposer {

    private static final Logger logger = LogManager.getLogger(FilterOptionsQueryComposer.class);

    /*
     * Builds query for the dropped column into a filter
     * Query result are the unique values of the selected column.
     */
    public String composeQuery(ColumnFilter cf, DatasetDTO ds, String vendorName) throws BadRequestException {
        logger.info("----------- FilterOptionsQueryComposer calling......");
        String finalQuery = "";

        /*
         * builds SELECT Clause of SQL
         * SELECT clause is the most varying of all clauses, different for each dialect
         * select_dim_list columns are used in group_by_dim_list & order_by_dim_list
         * except that
         * select_dim_list has column alias and group_by_dim_list & order_by_dim_list
         * don't have alias
         */

        Table table = null;
        for (int i = 0; i < ds.getDataSchema().getTables().size(); i++) {
            if (ds.getDataSchema().getTables().get(i).getId().equals(cf.getTableId())) {
                table = ds.getDataSchema().getTables().get(i);
                break;
            }
        }

        if (Objects.isNull(table)) {
            throw new BadRequestException("Error: RequestedFiter Column is not available in Dataset!");
        }

        if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
            logger.info("------ inside postges/redshift block");
            finalQuery = FilterQueryPostgres.getFilterOptions(cf, table);
        } else if (vendorName.equals("mysql")) {
            logger.info("------ inside mysql block");
            finalQuery = FilterQueryMysql.getFilterOptions(cf, table);
        } else if (vendorName.equals("sqlserver")) {
            logger.info("------ inside sql server block");
            finalQuery = FilterQuerySqlserver.getFilterOptions(cf, table);
        } else if (vendorName.equals("databricks")) {
            logger.info("------ inside databricks block");
            finalQuery = FilterQueryDatabricks.getFilterOptions(cf, table);
        } else if (vendorName.equals("duckdb")) {
            logger.info("------ inside duckdb block");
            finalQuery = FilterQueryDuckDb.getFilterOptions(cf, table);
        }

        else {
            throw new BadRequestException("Error: DB vendor Name is wrong!");
        }

        return finalQuery;

    }
}
