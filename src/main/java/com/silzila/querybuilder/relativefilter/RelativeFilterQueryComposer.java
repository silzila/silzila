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
import com.silzila.querybuilder.filteroptions.FilterOptionsQueryComposer;
import com.silzila.querybuilder.filteroptions.FilterQueryBigquery;
import com.silzila.querybuilder.filteroptions.FilterQueryDatabricks;
import com.silzila.querybuilder.filteroptions.FilterQueryDuckDb;
import com.silzila.querybuilder.filteroptions.FilterQueryMysql;
import com.silzila.querybuilder.filteroptions.FilterQueryPostgres;
import com.silzila.querybuilder.filteroptions.FilterQuerySqlserver;

@Service
public class RelativeFilterQueryComposer {
    

    private static final Logger logger = LogManager.getLogger(RelativeFilterQueryComposer.class);


    public String composeQuery(String vendorName, DatasetDTO ds, RelativeFilterRequest relativeFilter,
            JSONArray anchorDateArray) throws BadRequestException, RecordNotFoundException, SQLException {
        logger.info("----------- RelativeFilterQueryComposer calling......");
        String finalQuery = "";

        if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
            logger.info("------ inside postges/redshift block");

        } else if (vendorName.equals("mysql")) {
            logger.info("------ inside mysql block");
            finalQuery = RelativeFilterDateMySQL.getRelativeDate(relativeFilter, anchorDateArray);
        } else if (vendorName.equals("sqlserver")) {
            logger.info("------ inside sql server block");

        } else if (vendorName.equals("databricks")) {
            logger.info("------ inside databricks block");

        } else if (vendorName.equals("duckdb")) {
            logger.info("------ inside duckdb block");

        } else if (vendorName.equals("bigquery")) {
            logger.info("------ inside bigquery block");

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
        for (int i = 0; i < ds.getDataSchema().getTables().size(); i++) {
            if (ds.getDataSchema().getTables().get(i).getId()
                    .equals(relativeFilter.getFilterTable().get(0).getTableId())) {
                table = ds.getDataSchema().getTables().get(i);
                break;
            }
        }
        ;

        if (Objects.isNull(table)) {
            throw new BadRequestException("Error: RequestedFiter Column is not available in Dataset!");
        }

        if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
            logger.info("------ inside postges/redshift block");

        } else if (vendorName.equals("mysql")) {
            logger.info("------ inside mysql block");
            finalQuery = RelativeFilterDateMySQL.getRelativeAnchorDate(table, relativeFilter);
        } else if (vendorName.equals("sqlserver")) {
            logger.info("------ inside sql server block");

        } else if (vendorName.equals("databricks")) {
            logger.info("------ inside databricks block");

        } else if (vendorName.equals("duckdb")) {
            logger.info("------ inside duckdb block");

        } else if (vendorName.equals("bigquery")) {
            logger.info("------ inside bigquery block");

        }

        else {
            throw new BadRequestException("Error: DB vendor Name is wrong!");
        }

        return finalQuery;
    }

}
