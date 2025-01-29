package com.silzila.querybuilder;

import java.sql.SQLException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.silzila.dto.DatasetDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.helper.ColumnListFromClause;
import com.silzila.payload.internals.QueryClauseFieldListMap;
import com.silzila.payload.request.Dimension;
import com.silzila.payload.request.Query;
import com.silzila.service.DatasetService;

public class subTotalsCombination {

    public static QueryClauseFieldListMap selectClauseSql(Query dim, String vendorName) throws BadRequestException {
        QueryClauseFieldListMap qMap = new QueryClauseFieldListMap();
        if ("mysql".equals(vendorName)) {
            qMap = SelectClauseMysql.buildSelectClause(dim, vendorName);
        } else if ("duckdb".equals(vendorName)) {
            qMap = SelectClauseMysql.buildSelectClause(dim, vendorName);
        } else if ("sqlserver".equals(vendorName)) {
            qMap = SelectClauseSqlserver.buildSelectClause(dim, vendorName);
        } else if ("postgresql".equals(vendorName)) {
            qMap = SelectClausePostgres.buildSelectClause(dim, vendorName);
        } else if("bigquery".equals(vendorName)){
            qMap = SelectClauseBigquery.buildSelectClause(dim, vendorName);
        } else if ("databricks".equals(vendorName)) {
            qMap = SelectClauseDatabricks.buildSelectClause(dim, vendorName);
        } else if ("redshift".equals(vendorName)) {
            qMap = SelectClausePostgres.buildSelectClause(dim, vendorName);
        } else if ("oracle".equals(vendorName)) {
            qMap = SelectClauseOracle.buildSelectClause(dim, vendorName);
        } else if ("snowflake".equals(vendorName)) {
            qMap = SelectClauseSnowflake.buildSelectClause(dim, vendorName);
        } else if ("motherduck".equals(vendorName)) {
            qMap = SelectClauseMotherduck.buildSelectClause(dim, vendorName);
        }  else if ("db2".equalsIgnoreCase(vendorName)) {
            qMap = SelectClauseDB2.buildSelectClause(dim, vendorName);
        } else if ("teradata".equalsIgnoreCase(vendorName)) {
            qMap = SelectClauseTeraData.buildSelectClause(dim, vendorName);
        }
        else {
            throw new BadRequestException("Unsupported vendor: " + vendorName);
        }
        return qMap;
    }

    public static List<List<Dimension>> subTotalsCombinations(Query req){

        List<Dimension> row = new ArrayList<>();
        List<Dimension> column = new ArrayList<>();

        int rowValue = req.getMeasures().get(0).getrowColumnMatrix()[0];
        int columnValue = req.getMeasures().get(0).getrowColumnMatrix()[1];

        for (int x = 0; x < rowValue; x++) {
            row.add(req.getDimensions().get(x));
        }
        for (int y = rowValue; y < rowValue + columnValue; y++) {
            column.add(req.getDimensions().get(y));
        }

        Object[] rowArray = row.toArray();
        Object[] columnArray = column.toArray();

        //List<JSONArray> allResults = new ArrayList<>(); 
		List<List<Dimension>> result = new ArrayList<>();
		List<Dimension> combination = new ArrayList<>();
		if(rowArray.length > 0 && columnArray.length > 0){
           // for row combinations only
			for(int i = 0; i < rowArray.length; i++) {
               combination.add((Dimension) rowArray[i]);
			   result.add(new ArrayList<>(combination));
			}
			combination.clear();
           // for column combinations only
			for(int j = 0; j < columnArray.length; j++) {
				combination.add((Dimension) columnArray[j]);
				result.add(new ArrayList<>(combination));
			}
			combination.clear();
           // combined row & colum 
		   for (int rowCount = 0; rowCount < rowArray.length; rowCount++) {
            List<Dimension> currentRowCombination = new ArrayList<>();
            
            for (int i = 0; i <= rowCount; i++) {
                currentRowCombination.add((Dimension) rowArray[i]);
            }

            // Add all possible column combinations except for the last row and last column combination
            for (int colCount = 0; colCount < columnArray.length; colCount++) {
                // Avoid grouping last row and last column dimensions
                if (rowCount == rowArray.length - 1 && colCount == columnArray.length - 1) {
                    continue;
                }

                List<Dimension> currentCombination = new ArrayList<>(currentRowCombination);
                
                for (int j = 0; j <= colCount; j++) {
                    currentCombination.add((Dimension) columnArray[j]);
                }
                result.add(currentCombination);
            }           
            }         
		}
		// incase row only have value and column don't have, viceversa
		else {
			for (int i = 0; i < rowArray.length - 1; i++) { 
				for (int j = 0; j <= i; j++) {
					combination.add((Dimension) rowArray[j]);
				}
				result.add(new ArrayList<>(combination));
				combination.clear();
			}
			for (int i = 0; i < columnArray.length - 1; i++) { 
				for (int j = 0; j <= i; j++) {
					combination.add((Dimension) columnArray[j]);
				}
				result.add(new ArrayList<>(combination));
				combination.clear();
			}
		}
        result.add(new ArrayList<>());
        return result;
    }

    public static List<String> subTotalCombinationResults(Query req, String vendorName, DatasetDTO ds) throws BadRequestException, JsonMappingException, JsonProcessingException, ClassNotFoundException, RecordNotFoundException, SQLException, ParseException {
        List<List<Dimension>> result = subTotalsCombinations(req);
        List<String> tableIDList = new ArrayList<String>();
        List<String> Queries = new ArrayList<>();
        String Query = "";
        String whereClause = "";
        long countOfFilterPanels=ds.getDataSchema().getFilterPanels().size();
        if(countOfFilterPanels==0) {
             whereClause = WhereClause.buildWhereClause(req.getFilterPanels(), vendorName);
        } else {
            for(int i=0;i<countOfFilterPanels;i++) {
                for (int j = 0; j < ds.getDataSchema().getFilterPanels().get(i).getFilters().size(); j++)
                {
                    if(tableIDList.contains(ds.getDataSchema().getFilterPanels().get(i).getFilters().get(j).getTableId())) {
                        req.getFilterPanels().add(ds.getDataSchema().getFilterPanels().get(i));
                    }
                }
            }
            whereClause=WhereClause.buildWhereClause(req.getFilterPanels(), vendorName);
        }
        for (List<Dimension> rowDim : result) {
            Query dim = new Query(rowDim, req.getMeasures(), new ArrayList<>(), new ArrayList<>(), null);
            QueryClauseFieldListMap qMap = selectClauseSql(dim, vendorName);
            String selectClause = "\n\t" + qMap.getSelectList().stream().collect(Collectors.joining(",\n\t"));
            String groupByClause = "\n\t" + qMap.getGroupByList().stream().distinct().collect(Collectors.joining(",\n\t"));
            List<String> allColumnList = ColumnListFromClause.getColumnListFromQuery(dim);
            String fromClause = RelationshipClauseGeneric.buildRelationship(allColumnList, ds.getDataSchema(), vendorName);

            String groupBy = rowDim.isEmpty() ? "" : "\nGROUP BY" + groupByClause;
            
            Query = "SELECT " + selectClause + "\nFROM" + fromClause + whereClause
            + groupBy;

            Queries.add(Query);
            
        }  
        return Queries;
    }

}

