package com.silzila.querybuilder.relativefilter;

import java.sql.SQLException;
import java.util.Objects;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONArray;
import org.springframework.stereotype.Service;

import com.silzila.dto.DatasetDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.RelativeFilterRequest;
import com.silzila.payload.request.Table;


@Service
public class RelativeFilterQueryComposer {

    private static final Logger logger = LogManager.getLogger(RelativeFilterQueryComposer.class);

    public String composeQuery(String vendorName, DatasetDTO ds, RelativeFilterRequest relativeFilter,
            JSONArray anchorDateArray) throws BadRequestException, RecordNotFoundException, SQLException {
        logger.info("----------- RelativeFilterQueryComposer calling......");
        String finalQuery = "";

        if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
            logger.info("------ inside postgres/redshift block");
            finalQuery = RelativeFilterDatePostgres.getRelativeDate(relativeFilter, anchorDateArray);
        } else if (vendorName.equals("mysql")) {
            logger.info("------ inside mysql block");
            finalQuery = RelativeFilterDateMySQL.getRelativeDate(relativeFilter, anchorDateArray);
        } else if (vendorName.equals("sqlserver")) {
            logger.info("------ inside sql server block");
            finalQuery = RelativeFilterDateSqlserver.getRelativeDate(relativeFilter, anchorDateArray);
        } else if (vendorName.equals("databricks")) {
            logger.info("------ inside databricks block");
            finalQuery = RelativeFilterDateDatabricks.getRelativeDate(relativeFilter, anchorDateArray);
        } else if (vendorName.equals("duckdb") ) {
            logger.info("------ inside duckdb block");
            finalQuery = RelativeFilterDateDuckDB.getRelativeDate(relativeFilter, anchorDateArray);
        } else if (vendorName.equals("bigquery")) {
            logger.info("------ inside bigquery block");
            finalQuery = RelativeFilterDateBigquery.getRelativeDate(relativeFilter, anchorDateArray);
        } else if (vendorName.equals("oracle")) {
            logger.info("------ inside Oracle block");
            finalQuery = RelativeFilterDateOracle.getRelativeDate(relativeFilter, anchorDateArray);
        }
        else if (vendorName.equals("snowflake")) {
            logger.info("------ inside snowflake block");
            finalQuery = RelativeFilterDateSnowflake.getRelativeDate(relativeFilter, anchorDateArray);
        }
        else if (vendorName.equals("motherduck")) {
            logger.info("------ inside motherduck block");
            finalQuery = RelativeFilterDateMotherDuck.getRelativeDate(relativeFilter, anchorDateArray);
        }
        else if (vendorName.equals("db2")) {
            logger.info("------ inside db2 block");
            finalQuery = RelativeFilterDateDB2.getRelativeDate(relativeFilter, anchorDateArray);
        }
        else if (vendorName.equals("teradata")) {
            logger.info("------ inside teradata block");
            finalQuery = RelativeFilterDateTeraData.getRelativeDate(relativeFilter, anchorDateArray);
        }
        else {
            throw new BadRequestException("Error: DB vendor Name is wrong!");
        }

        return finalQuery;
    }

    public String anchorDateComposeQuery(String vendorName, DatasetDTO ds, RelativeFilterRequest relativeFilter)
            throws BadRequestException, RecordNotFoundException, SQLException {
        logger.info("----------- RelativeFilteranchorDateQueryComposer calling......");
        String finalQuery = "";
        Table table = null;
        String query = null;
        for (int i = 0; i < ds.getDataSchema().getTables().size(); i++) {
            if (ds.getDataSchema().getTables().get(i).getId()
                    .equals(relativeFilter.getFilterTable().getTableId())) {
                table = ds.getDataSchema().getTables().get(i);
                if(table.isCustomQuery()) {
                     query = table.getCustomQuery();
                }
               break;
            }
        }
        
        if(table.isCustomQuery()) {
            if (!query.contains(relativeFilter.getFilterTable().getFieldName())) {
                throw new BadRequestException("Error: Requested Filter Column is not available in Dataset!");
            }

        }
        if (Objects.isNull(table)) {
            throw new BadRequestException("Error: Requested Filter Column is not available in Dataset!");
        }
        if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
            logger.info("------ inside postgres/redshift block");
            finalQuery = RelativeFilterDatePostgres.getRelativeAnchorDate(table, relativeFilter);
        } else if (vendorName.equals("mysql")) {
            logger.info("------ inside mysql block");
            finalQuery = RelativeFilterDateMySQL.getRelativeAnchorDate(table, relativeFilter);
        } else if (vendorName.equals("sqlserver")) {
            logger.info("------ inside sql server block");
            finalQuery = RelativeFilterDateSqlserver.getRelativeAnchorDate(table, relativeFilter);
        } else if (vendorName.equals("databricks")) {
            logger.info("------ inside databricks block");
            finalQuery = RelativeFilterDateDatabricks.getRelativeAnchorDate(table, relativeFilter);
        } else if (vendorName.equals("duckdb") ) {
            logger.info("------ inside duckdb block");
            finalQuery = RelativeFilterDateDuckDB.getRelativeAnchorDate(table, relativeFilter);
        } else if (vendorName.equals("bigquery")) {
            logger.info("------ inside bigquery block");
            finalQuery = RelativeFilterDateBigquery.getRelativeAnchorDate(table, relativeFilter);
        } else if (vendorName.equals("oracle")) {
            logger.info("------ inside Oracle block");
            finalQuery = RelativeFilterDateOracle.getRelativeAnchorDate(table,relativeFilter);
        } else if (vendorName.equals("snowflake")) {
            logger.info("------ inside snowflake block");
            finalQuery = RelativeFilterDateSnowflake.getRelativeAnchorDate(table,relativeFilter);
        }else if (vendorName.equals("motherduck")) {
            logger.info("------ inside motherduck block");
            finalQuery = RelativeFilterDateMotherDuck.getRelativeAnchorDate(table,relativeFilter);
        }
        else if (vendorName.equals("db2")) {
            logger.info("------ inside db2 block");
            finalQuery = RelativeFilterDateDB2.getRelativeAnchorDate(table,relativeFilter);
        }
        else if (vendorName.equals("teradata")) {
            logger.info("------ inside teradata block");
            finalQuery = RelativeFilterDateTeraData.getRelativeAnchorDate(table,relativeFilter);
        }
        else {
            throw new BadRequestException("Error: DB vendor Name is wrong!");
        }

        return finalQuery;
    }

}
