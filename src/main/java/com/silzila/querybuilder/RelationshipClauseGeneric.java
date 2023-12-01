package com.silzila.querybuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.DataSchema;
import com.silzila.payload.request.Query;
import com.silzila.payload.request.Relationship;
import com.silzila.payload.request.Table;

public class RelationshipClauseGeneric {

    /*
     * Recursively searches relationships to build network of tabels & joins
     * this function traverses in Relationship Network (list of object) and finds
     * if the path is needed or not.
     * 
     * tList = user given table list for which we need to fing relationships
     * rList = contains all relationships - ref node diagram
     * tableX = table to be searched iteratively till the breadh and depth
     * i = current index where x is starting to travel
     * ok = dict holds if both node in a relationship is valid
     * noInitialMatch = flag - indicating both tables in this relationship
     * don't have initial match`
     * tableToSearch = flag - first or second table in relationship. This helps
     * tracking if origin X table is table1 or table2 and helps to mark
     * in ok dict as complete
     */
    public static void schemaRecursiveSearch(List<String> tList, List<Relationship> rList,
            String tableX, Integer i, List<Boolean> isT1T2MatchingList,
            Boolean noInitialMatch, String tableToSearch) {
        // System.out.println("-------- schemaRecursiveSearch fn-----");
        for (int j = 0; j < rList.size(); j++) {
            if (!i.equals(j)) {
                String t1 = rList.get(j).getTable1();
                String t2 = rList.get(j).getTable2();

                if (tableX.equals(t1) && tList.contains(t2)) {
                    if (tableToSearch.equals("table1")) {
                        isT1T2MatchingList.set(0, true);
                    } else if (tableToSearch.equals("table2")) {
                        isT1T2MatchingList.set(1, true);
                    }
                    if ((noInitialMatch == true && isT1T2MatchingList.get(1) == true)
                            || (isT1T2MatchingList.get(0) == true && isT1T2MatchingList.get(1) == true)) {
                        break;
                    }
                } else if (tableX.equals(t2) && tList.contains(t1)) {
                    if (tableToSearch.equals("table1")) {
                        isT1T2MatchingList.set(0, true);
                    } else if (tableToSearch.equals("table2")) {
                        isT1T2MatchingList.set(1, true);
                    }
                    if ((noInitialMatch == true && isT1T2MatchingList.get(0) == true)
                            || (isT1T2MatchingList.get(0) == true && isT1T2MatchingList.get(1) == true)) {
                        break;
                    }
                } else if (tableX.equals(t1) && !tList.contains(t2)) {
                    schemaRecursiveSearch(tList, rList, t2, j, isT1T2MatchingList, noInitialMatch, tableToSearch);
                    if ((isT1T2MatchingList.get(0) == true && isT1T2MatchingList.get(1) == true)) {
                        break;
                    }
                } else if (tableX.equals(t2) && !tList.contains(t1)) {
                    schemaRecursiveSearch(tList, rList, t1, j, isT1T2MatchingList, noInitialMatch, tableToSearch);
                    if ((isT1T2MatchingList.get(0) == true && isT1T2MatchingList.get(1) == true)) {
                        break;
                    }
                }

            }
        }

    }

    /*
     * constructs JOIN clause of the query
     * Same for all sql dialects.
     * For now, it doesn't handle the following scenarios:
     * 1. self join (same table joined multiple times)
     * 2. more than one possibility of join between 2 tables
     * eg: a, b, c tables, a to b, b to c relationship.
     * if we add a to c then there are two ways of joining a to c.
     * a to c directly and via b.
     */
    public static String buildRelationship(Query req, DataSchema ds, String vendorName)
            throws BadRequestException {

        // declare lists to save incoming query requested tables accordingly
        List<String> dimList = new ArrayList<>();
        List<String> measureList = new ArrayList<>();
        List<String> fieldList = new ArrayList<>();
        List<String> filterList = new ArrayList<>();
        List<String> allColumnList = new ArrayList<>();

        // take list of unique dim tables & another list on all unique tables
        req.getDimensions().forEach((dim) -> {
            if (!dimList.contains(dim.getTableId())) {
                dimList.add(dim.getTableId());
            }
            if (!allColumnList.contains(dim.getTableId())) {
                allColumnList.add(dim.getTableId());
            }
        });
        // take list of unique measure tables & another list on all unique tables
        req.getMeasures().forEach((measure) -> {
            if (!measureList.contains(measure.getTableId())) {
                measureList.add(measure.getTableId());
            }
            if (!allColumnList.contains(measure.getTableId())) {
                allColumnList.add(measure.getTableId());
            }
        });
        // take list of unique field tables & another list on all unique tables
        req.getFields().forEach((field) -> {
            if (!fieldList.contains(field.getTableId())) {
                fieldList.add(field.getTableId());
            }
            if (!allColumnList.contains(field.getTableId())) {
                allColumnList.add(field.getTableId());
            }
        });
        // take list of unique filter tables & another list on all unique tables
        req.getFilterPanels().forEach((panel) -> {
            panel.getFilters().forEach((filter) -> {
                // System.out.println("----------------");
                // System.out.println(filter.toString());
                if (!filterList.contains(filter.getTableId())) {
                    filterList.add(filter.getTableId());
                }
                if (!allColumnList.contains(filter.getTableId())) {
                    allColumnList.add(filter.getTableId());
                }
            });
        });

        // System.out.println("-----------------------------------");
        // System.out.println("allColumnList = " + allColumnList);
        // System.out.println("dimList = " + dimList);
        // System.out.println("measureList = " + measureList);
        // System.out.println("fieldList = " + fieldList);
        // System.out.println("filterList = " + filterList);
        // System.out.println("-----------------------------------");

        String fromClause = "";
        List<Relationship> relationships = new ArrayList<>();

        /*
         * Build relationship - when ONLY ONE TABLE in qry
         */
        if (allColumnList.size() == 1) {
            // System.out.println("---------------- allColumnList.size = 1");
            Optional<Table> tOptional = ds.getTables().stream()
                    .filter(t -> t.getId().equalsIgnoreCase(allColumnList.get(0))).findAny();
            if (!tOptional.isPresent()) {
                throw new BadRequestException("Error: Table Id" + allColumnList.get(0) + "is not present in Dataset!");
            }
            Table table = tOptional.get();
            // Postgres has the format of Schema_name.Table_name
            if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
                fromClause = "\n\t" + table.getSchema() + "." + table.getTable() + " AS " + table.getId();
            }
            // MySQL has the format of Database_name.Table_name
            else if (vendorName.equals("mysql")) {
                fromClause = "\n\t" + table.getDatabase() + "." + table.getTable() + " AS " + table.getId();
            }
            // SQL Server has the format of Database_name.Schema_name.Table_name
            else if (vendorName.equals("sqlserver")) {
                fromClause = "\n\t" + table.getDatabase() + "." + table.getSchema() + "." + table.getTable() + " AS "
                        + table.getId();
            } else if (vendorName.equals("databricks")) {
                fromClause = "\n\t" + table.getDatabase() + ".`" + table.getSchema() + "`." + table.getTable() + " AS "
                        + table.getId();
            } else if (vendorName.equals("duckdb")) {
                fromClause = "\n\t" + "vw_" + table.getAlias() + "_" + table.getFlatFileId().substring(0, 8) + " AS "
                        + table.getId();
            } else if (vendorName.equals("bigquery")) {
                fromClause = "\n\t`" + table.getDatabase() + "." + table.getSchema() + "." + table.getTable() + "` AS "
                        + table.getId();
            }

        }

        /*
         * Build relationship - when MANY TABLES in qry
         */
        else if (allColumnList.size() > 1) {
            // System.out.println("---------------- allColumnList.size > 1");
            for (int i = 0; i < ds.getRelationships().size(); i++) {
                List<Boolean> isT1T2MatchingList = new ArrayList<>(); // List.of(false, false);
                isT1T2MatchingList.add(false);
                isT1T2MatchingList.add(false);
                // System.out.println("isT1T2MatchingList = " + isT1T2MatchingList);
                String table1 = ds.getRelationships().get(i).getTable1();
                String table2 = ds.getRelationships().get(i).getTable2();
                // System.out.println("\ntable1 = " + table1 + " table2 = " + table2);

                // when both tables present in request list - keep it
                if (allColumnList.contains(table1) && allColumnList.contains(table2)) {
                    isT1T2MatchingList.set(0, true);
                    isT1T2MatchingList.set(1, true);
                    // System.out.println("* YES YES");
                }
                // if from table matches, pass the other table to recursive search to find
                // if that is required, means a must in between the network
                else if (allColumnList.contains(table1)) {
                    // System.out.println("-----------allColumnList.contains(table1)");
                    isT1T2MatchingList.set(0, true);
                    // System.out.println("* YES YES");
                    schemaRecursiveSearch(allColumnList, ds.getRelationships(), table2, i, isT1T2MatchingList, false,
                            "table2");

                }
                // pass the to table to recursive search
                else if (allColumnList.contains(table2)) {
                    isT1T2MatchingList.set(1, true);
                    // System.out.println("* NO YES");
                    schemaRecursiveSearch(allColumnList, ds.getRelationships(), table1, i, isT1T2MatchingList, false,
                            "table1");

                } else {
                    // System.out.println("* NO NO");
                    // System.out.println(" Calling First");
                    schemaRecursiveSearch(allColumnList, ds.getRelationships(), table1, i, isT1T2MatchingList, true,
                            "table1");
                    // System.out.println(" Calling Second");
                    schemaRecursiveSearch(allColumnList, ds.getRelationships(), table2, i, isT1T2MatchingList, true,
                            "table2");
                }
                // after recursive search, if the connection is needed for final network, keep
                // it
                if (isT1T2MatchingList.get(0) == true && isT1T2MatchingList.get(1) == true) {
                    relationships.add(ds.getRelationships().get(i));
                }
            }

        }

        // System.out.println("Relationships =======" + relationships.toString());

        // Sort Relationships in list
        List<Relationship> _relationships = new ArrayList<>();

        while (_relationships.size() < relationships.size()) {
            relationships.forEach((rel) -> {
                if (_relationships.size() == 0) {
                    _relationships.add(rel);
                } else if (!_relationships.contains(rel)) {
                    for (int j = 0; j < _relationships.size(); j++) {
                        if (!_relationships.contains(rel)
                                && rel.getTable1().equals(_relationships.get(j).getTable1())) {
                            _relationships.add(rel);
                            break;
                        }
                    }
                    for (int j = 0; j < _relationships.size(); j++) {
                        if (!_relationships.contains(rel)
                                && rel.getTable1().equals(_relationships.get(j).getTable2())) {
                            _relationships.add(rel);
                            break;
                        }
                    }
                    for (int j = 0; j < _relationships.size(); j++) {
                        if (!_relationships.contains(rel)
                                && rel.getTable2().equals(_relationships.get(j).getTable1())) {
                            _relationships.add(rel);
                            break;
                        }
                    }
                    for (int j = 0; j < _relationships.size(); j++) {
                        if (!_relationships.contains(rel)
                                && rel.getTable2().equals(_relationships.get(j).getTable2())) {
                            _relationships.add(rel);
                            break;
                        }
                    }
                }
            });
        }
        // System.out.println("_Relationships =======" + _relationships.toString());
        /*
         * RELATIONSHIP SECTION
         * eg. a left join b.
         * if we traverse a first then b, use joins (left: Left outer join, a left join
         * b)
         * if we traverse b first then a, use mirror_joins (left: Right outer join, b
         * right join a)
         */
        Map<String, String> joins = Map.of("inner", "INNER JOIN", "left", "LEFT OUTER JOIN", "right",
                "RIGHT OUTER JOIN", "full", "FULL OUTER JOIN");

        Map<String, String> mirrorJoins = Map.of("inner", "INNER JOIN", "left", "RIGHT OUTER JOIN", "right",
                "LEFT OUTER JOIN", "full", "FULL OUTER JOIN");

        for (int i = 0; i < _relationships.size(); i++) {
            Relationship _rship = _relationships.get(i);
            Table fromTable;
            Table toTable;
            Optional<Table> tbl1Optional = ds.getTables().stream()
                    .filter(_r -> _r.getId().equals(_rship.getTable1())).findFirst();
            // if (tbl1Optional.isPresent()) {
            fromTable = tbl1Optional.get();
            // }
            Optional<Table> tbl2Optional = ds.getTables().stream()
                    .filter(_r -> _r.getId().equals(_rship.getTable2())).findFirst();
            // if (tbl2Optional.isPresent()) {
            toTable = tbl2Optional.get();
            // }

            List<String> joinList = new ArrayList<>();
            for (int j = 0; j < _rship.getTable1Columns().size(); j++) {
                String joinCondition = _rship.getTable1() + "."
                        + _rship.getTable1Columns().get(j)
                        + " = " + _rship.getTable2() + "." + _rship.getTable2Columns().get(j);
                joinList.add(joinCondition);
            }
            String joinString = joinList.stream().collect(Collectors.joining(" AND\n\t"));

            /*
             * Postgres has the format of Schema_name.Table_name
             */
            if (vendorName.equals("postgresql") || vendorName.equals("redshift")) {
                if (i == 0) {
                    fromClause += "\n\t" + fromTable.getSchema() + "." + fromTable.getTable() + " AS "
                            + fromTable.getId()
                            + "\n\t" + joins.get(_rship.getRefIntegrity()) + " " + toTable.getSchema() + "."
                            + toTable.getTable() + " AS " + toTable.getId() + " ON \n\t\t " + joinString;
                } else if (i > 0) {
                    if (_rship.getTable1().equals(_relationships.get(i - 1).getTable1()) ||
                            _rship.getTable1().equals(_relationships.get(i - 1).getTable2())) {
                        fromClause += "\n\t" + joins.get(_rship.getRefIntegrity()) + " "
                                + toTable.getSchema() + "."
                                + toTable.getTable() + " AS " + toTable.getId() + " ON \n\t\t " + joinString;
                    } else if (_rship.getTable2().equals(_relationships.get(i - 1).getTable1()) ||
                            _rship.getTable2().equals(_relationships.get(i - 1).getTable2())) {
                        fromClause += "\n\t" + mirrorJoins.get(_rship.getRefIntegrity()) + " "
                                + fromTable.getSchema() + "."
                                + fromTable.getTable() + " AS " + fromTable.getId() + " ON \n\t\t " + joinString;
                    }
                    // when not matching with one level above - need to check the whole list
                    else {
                        List<String> existingTables = new ArrayList<>();
                        for (int k = 0; k <= i; k++) {
                            existingTables.add(_relationships.get(k).getTable1());
                            existingTables.add(_relationships.get(k).getTable2());
                        }
                        if (existingTables.contains(_rship.getTable1())) {
                            Optional<Table> _tbl2Optional = ds.getTables().stream()
                                    .filter(_r -> _r.getId().equals(_rship.getTable2())).findFirst();
                            Table _to = _tbl2Optional.get();
                            fromClause += "\n\t" + joins.get(_rship.getRefIntegrity()) + " "
                                    + _to.getSchema() + "."
                                    + _to.getTable() + " AS " + _to.getId() + " ON \n\t\t " + joinString;
                        } else if (existingTables.contains(_rship.getTable2())) {
                            Optional<Table> _tbl1Optional = ds.getTables().stream()
                                    .filter(_r -> _r.getId().equals(_rship.getTable1())).findFirst();
                            Table _from = _tbl1Optional.get();
                            fromClause += "\n\t" + mirrorJoins.get(_rship.getRefIntegrity()) + " "
                                    + _from.getSchema() + "."
                                    + _from.getTable() + " AS " + _from.getId() + " ON \n\t\t " + joinString;
                        }
                    }
                }
            }
            /*
             * MySQL has the format of Database_name.Table_name
             */
            else if (vendorName.equals("mysql")) {
                if (i == 0) {
                    fromClause += "\n\t" + fromTable.getDatabase() + "." + fromTable.getTable() + " AS "
                            + fromTable.getId()
                            + "\n\t" + joins.get(_rship.getRefIntegrity()) + " " + toTable.getDatabase() + "."
                            + toTable.getTable() + " AS " + toTable.getId() + " ON \n\t\t " + joinString;
                } else if (i > 0) {
                    if (_rship.getTable1().equals(_relationships.get(i - 1).getTable1()) ||
                            _rship.getTable1().equals(_relationships.get(i - 1).getTable2())) {
                        fromClause += "\n\t" + joins.get(_rship.getRefIntegrity()) + " "
                                + toTable.getDatabase() + "."
                                + toTable.getTable() + " AS " + toTable.getId() + " ON \n\t\t " + joinString;
                    } else if (_rship.getTable2().equals(_relationships.get(i - 1).getTable1()) ||
                            _rship.getTable2().equals(_relationships.get(i - 1).getTable2())) {
                        fromClause += "\n\t" + mirrorJoins.get(_rship.getRefIntegrity()) + " "
                                + fromTable.getDatabase() + "."
                                + fromTable.getTable() + " AS " + fromTable.getId() + " ON \n\t\t " + joinString;
                    }
                    // when not matching with one level above - need to check the whole list
                    else {
                        List<String> existingTables = new ArrayList<>();
                        for (int k = 0; k <= i; k++) {
                            existingTables.add(_relationships.get(k).getTable1());
                            existingTables.add(_relationships.get(k).getTable2());
                        }
                        if (existingTables.contains(_rship.getTable1())) {
                            Optional<Table> _tbl2Optional = ds.getTables().stream()
                                    .filter(_r -> _r.getId().equals(_rship.getTable2())).findFirst();
                            Table _to = _tbl2Optional.get();
                            fromClause += "\n\t" + joins.get(_rship.getRefIntegrity()) + " "
                                    + _to.getDatabase() + "."
                                    + _to.getTable() + " AS " + _to.getId() + " ON \n\t\t " + joinString;
                        } else if (existingTables.contains(_rship.getTable2())) {
                            Optional<Table> _tbl1Optional = ds.getTables().stream()
                                    .filter(_r -> _r.getId().equals(_rship.getTable1())).findFirst();
                            Table _from = _tbl1Optional.get();
                            fromClause += "\n\t" + mirrorJoins.get(_rship.getRefIntegrity()) + " "
                                    + _from.getDatabase() + "." + _from.getTable() + " AS " + _from.getId()
                                    + " ON \n\t\t " + joinString;
                        }
                    }
                }
            }
            /*
             * SQL Server has the format of Database_name.Schema_name.Table_name
             */
            else if (vendorName.equals("sqlserver")) {
                if (i == 0) {
                    fromClause += "\n\t" + fromTable.getDatabase() + "." + fromTable.getSchema() + "."
                            + fromTable.getTable() + " AS "
                            + fromTable.getId()
                            + "\n\t" + joins.get(_rship.getRefIntegrity()) + " " + toTable.getDatabase() + "."
                            + toTable.getSchema() + "." + toTable.getTable() + " AS " + toTable.getId() + " ON \n\t\t "
                            + joinString;
                } else if (i > 0) {
                    if (_rship.getTable1().equals(_relationships.get(i - 1).getTable1()) ||
                            _rship.getTable1().equals(_relationships.get(i - 1).getTable2())) {
                        fromClause += "\n\t" + joins.get(_rship.getRefIntegrity()) + " " + toTable.getDatabase() + "."
                                + toTable.getSchema() + "." + toTable.getTable() + " AS " + toTable.getId()
                                + " ON \n\t\t " + joinString;
                    } else if (_rship.getTable2().equals(_relationships.get(i - 1).getTable1()) ||
                            _rship.getTable2().equals(_relationships.get(i - 1).getTable2())) {
                        fromClause += "\n\t" + mirrorJoins.get(_rship.getRefIntegrity()) + " " + fromTable.getDatabase()
                                + "." + fromTable.getSchema() + "." + fromTable.getTable() + " AS " + fromTable.getId()
                                + " ON \n\t\t " + joinString;
                    }
                    // when not matching with one level above - need to check the whole list
                    else {
                        List<String> existingTables = new ArrayList<>();
                        for (int k = 0; k <= i; k++) {
                            existingTables.add(_relationships.get(k).getTable1());
                            existingTables.add(_relationships.get(k).getTable2());
                        }
                        if (existingTables.contains(_rship.getTable1())) {
                            Optional<Table> _tbl2Optional = ds.getTables().stream()
                                    .filter(_r -> _r.getId().equals(_rship.getTable2())).findFirst();
                            Table _to = _tbl2Optional.get();
                            fromClause += "\n\t" + joins.get(_rship.getRefIntegrity()) + " " + _to.getDatabase() + "."
                                    + _to.getSchema() + "." + _to.getTable() + " AS " + _to.getId() + " ON \n\t\t "
                                    + joinString;
                        } else if (existingTables.contains(_rship.getTable2())) {
                            Optional<Table> _tbl1Optional = ds.getTables().stream()
                                    .filter(_r -> _r.getId().equals(_rship.getTable1())).findFirst();
                            Table _from = _tbl1Optional.get();
                            fromClause += "\n\t" + mirrorJoins.get(_rship.getRefIntegrity()) + " " + _from.getDatabase()
                                    + "." + _from.getSchema() + "." + _from.getTable() + " AS " + _from.getId()
                                    + " ON \n\t\t " + joinString;
                        }
                    }
                }
            }
            // Databricks has the format of Database_name.Schema_name.Table_name
            else if (vendorName.equals("databricks")) {
                if (i == 0) {
                    fromClause += "\n\t" + fromTable.getDatabase() + ".`" + fromTable.getSchema() + "`."
                            + fromTable.getTable() + " AS "
                            + fromTable.getId()
                            + "\n\t" + joins.get(_rship.getRefIntegrity()) + " " + toTable.getDatabase() + ".`"
                            + toTable.getSchema() + "`." + toTable.getTable() + " AS " + toTable.getId() + " ON \n\t\t "
                            + joinString;
                } else if (i > 0) {
                    if (_rship.getTable1().equals(_relationships.get(i - 1).getTable1()) ||
                            _rship.getTable1().equals(_relationships.get(i - 1).getTable2())) {
                        fromClause += "\n\t" + joins.get(_rship.getRefIntegrity()) + " " + toTable.getDatabase() + ".`"
                                + toTable.getSchema() + "`." + toTable.getTable() + " AS " + toTable.getId()
                                + " ON \n\t\t " + joinString;
                    } else if (_rship.getTable2().equals(_relationships.get(i - 1).getTable1()) ||
                            _rship.getTable2().equals(_relationships.get(i - 1).getTable2())) {
                        fromClause += "\n\t" + mirrorJoins.get(_rship.getRefIntegrity()) + " " + fromTable.getDatabase()
                                + ".`" + fromTable.getSchema() + "`." + fromTable.getTable() + " AS "
                                + fromTable.getId()
                                + " ON \n\t\t " + joinString;
                    }
                    // when not matching with one level above - need to check the whole list
                    else {
                        List<String> existingTables = new ArrayList<>();
                        for (int k = 0; k <= i; k++) {
                            existingTables.add(_relationships.get(k).getTable1());
                            existingTables.add(_relationships.get(k).getTable2());
                        }
                        if (existingTables.contains(_rship.getTable1())) {
                            Optional<Table> _tbl2Optional = ds.getTables().stream()
                                    .filter(_r -> _r.getId().equals(_rship.getTable2())).findFirst();
                            Table _to = _tbl2Optional.get();
                            fromClause += "\n\t" + joins.get(_rship.getRefIntegrity()) + " " + _to.getDatabase() + ".`"
                                    + _to.getSchema() + "`." + _to.getTable() + " AS " + _to.getId() + " ON \n\t\t "
                                    + joinString;
                        } else if (existingTables.contains(_rship.getTable2())) {
                            Optional<Table> _tbl1Optional = ds.getTables().stream()
                                    .filter(_r -> _r.getId().equals(_rship.getTable1())).findFirst();
                            Table _from = _tbl1Optional.get();
                            fromClause += "\n\t" + mirrorJoins.get(_rship.getRefIntegrity()) + " " + _from.getDatabase()
                                    + ".`" + _from.getSchema() + "`." + _from.getTable() + " AS " + _from.getId()
                                    + " ON \n\t\t " + joinString;
                        }
                    }
                }
            }
            //Bigquery has the format of Database_name.Schema_name.Table_name
            else if (vendorName.equals("bigquery")) {
                if (i == 0) {
                    fromClause += "\n\t`" + fromTable.getDatabase() + "." + fromTable.getSchema() + "."
                            + fromTable.getTable() + "` AS "
                            + fromTable.getId()
                            + "\n\t" + joins.get(_rship.getRefIntegrity()) + " `" + toTable.getDatabase() + "."
                            + toTable.getSchema() + "." + toTable.getTable() + "` AS " + toTable.getId() + " ON \n\t\t "
                            + joinString;
                } else if (i > 0) {
                    if (_rship.getTable1().equals(_relationships.get(i - 1).getTable1()) ||
                            _rship.getTable1().equals(_relationships.get(i - 1).getTable2())) {
                        fromClause += "\n\t" + joins.get(_rship.getRefIntegrity()) + " `" + toTable.getDatabase() + "."
                                + toTable.getSchema() + "." + toTable.getTable() + "` AS " + toTable.getId()
                                + " ON \n\t\t " + joinString;
                    } else if (_rship.getTable2().equals(_relationships.get(i - 1).getTable1()) ||
                            _rship.getTable2().equals(_relationships.get(i - 1).getTable2())) {
                        fromClause += "\n\t" + mirrorJoins.get(_rship.getRefIntegrity()) + " `" + fromTable.getDatabase()
                                + "." + fromTable.getSchema() + "." + fromTable.getTable() + "` AS " + fromTable.getId()
                                + " ON \n\t\t " + joinString;
                    }
                    // when not matching with one level above - need to check the whole list
                    else {
                        List<String> existingTables = new ArrayList<>();
                        for (int k = 0; k <= i; k++) {
                            existingTables.add(_relationships.get(k).getTable1());
                            existingTables.add(_relationships.get(k).getTable2());
                        }
                        if (existingTables.contains(_rship.getTable1())) {
                            Optional<Table> _tbl2Optional = ds.getTables().stream()
                                    .filter(_r -> _r.getId().equals(_rship.getTable2())).findFirst();
                            Table _to = _tbl2Optional.get();
                            fromClause += "\n\t" + joins.get(_rship.getRefIntegrity()) + " `" + _to.getDatabase() + "."
                                    + _to.getSchema() + "." + _to.getTable() + "` AS " + _to.getId() + " ON \n\t\t "
                                    + joinString;
                        } else if (existingTables.contains(_rship.getTable2())) {
                            Optional<Table> _tbl1Optional = ds.getTables().stream()
                                    .filter(_r -> _r.getId().equals(_rship.getTable1())).findFirst();
                            Table _from = _tbl1Optional.get();
                            fromClause += "\n\t" + mirrorJoins.get(_rship.getRefIntegrity()) + " `" + _from.getDatabase()
                                    + "." + _from.getSchema() + "." + _from.getTable() + "` AS " + _from.getId()
                                    + " ON \n\t\t " + joinString;
                        }
                    }
                }
            }
            /*
             * duckdb - flatfile has the format of:
             * vw_ + first 8 letters of flatfileid + _ + alias
             */
            else if ((vendorName.equals("duckdb"))) {
                if (i == 0) {
                    fromClause += "\n\t" + "vw_" + fromTable.getAlias() + "_"
                            + fromTable.getFlatFileId().substring(0, 8)
                            + " AS " + fromTable.getId()
                            + "\n\t" + joins.get(_rship.getRefIntegrity()) + " "
                            + "vw_" + toTable.getAlias() + "_" + toTable.getFlatFileId().substring(0, 8)
                            + " AS " + toTable.getId() + " ON \n\t\t " + joinString;
                } else if (i > 0) {
                    if (_rship.getTable1().equals(_relationships.get(i - 1).getTable1()) ||
                            _rship.getTable1().equals(_relationships.get(i - 1).getTable2())) {
                        fromClause += "\n\t" + joins.get(_rship.getRefIntegrity()) + " "
                                + "vw_" + toTable.getAlias() + "_" + toTable.getFlatFileId().substring(0, 8)
                                + " AS " + toTable.getId() + " ON \n\t\t " + joinString;
                    } else if (_rship.getTable2().equals(_relationships.get(i - 1).getTable1()) ||
                            _rship.getTable2().equals(_relationships.get(i - 1).getTable2())) {
                        fromClause += "\n\t" + mirrorJoins.get(_rship.getRefIntegrity()) + " "
                                + "vw_" + fromTable.getAlias() + "_" + fromTable.getFlatFileId().substring(0, 8)
                                + " AS " + fromTable.getId() + " ON \n\t\t " + joinString;
                    }
                    // when not matching with one level above - need to check the whole list
                    else {
                        List<String> existingTables = new ArrayList<>();
                        for (int k = 0; k <= i; k++) {
                            existingTables.add(_relationships.get(k).getTable1());
                            existingTables.add(_relationships.get(k).getTable2());
                        }
                        if (existingTables.contains(_rship.getTable1())) {
                            Optional<Table> _tbl2Optional = ds.getTables().stream()
                                    .filter(_r -> _r.getId().equals(_rship.getTable2())).findFirst();
                            Table _to = _tbl2Optional.get();
                            fromClause += "\n\t" + joins.get(_rship.getRefIntegrity()) + " "
                                    + "vw_" + _to.getAlias() + "_" + _to.getFlatFileId().substring(0, 8)
                                    + " AS " + _to.getId() + " ON \n\t\t " + joinString;
                        } else if (existingTables.contains(_rship.getTable2())) {
                            Optional<Table> _tbl1Optional = ds.getTables().stream()
                                    .filter(_r -> _r.getId().equals(_rship.getTable1())).findFirst();
                            Table _from = _tbl1Optional.get();
                            fromClause += "\n\t" + mirrorJoins.get(_rship.getRefIntegrity()) + " "
                                    + "vw_" + _from.getAlias() + "_" + _from.getFlatFileId().substring(0, 8)
                                    + " AS " + _from.getId()
                                    + " ON \n\t\t " + joinString;
                        }
                    }
                }
            }
        }
        return fromClause;
    }

}