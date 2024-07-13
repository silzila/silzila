package com.silzila.querybuilder.relativefilter;

import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.RelativeFilterRequest;
import com.silzila.payload.request.Table;
import org.json.JSONArray;

import javax.validation.Valid;
import java.sql.SQLException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RelativeFilterDateDB2 {
    public static String anchorDate = "";

    public static String getRelativeDate(RelativeFilterRequest relativeFilter, JSONArray ancDateArray)
            throws BadRequestException, RecordNotFoundException, SQLException {

        // to create from and to date query
        String fromDate = "";
        String toDate = "";

        // from and to date conditions
        List<String> fromConditions = relativeFilter.getFrom();
        List<String> toConditions = relativeFilter.getTo();

        // check three elements are there and type is correct or not
        RelativeFilterDateValidationUtils.validateConditions(fromConditions, toConditions);

        // precedingorfollowingNumber
        int fromNum = Integer.parseInt(fromConditions.get(1));
        int toNum = Integer.parseInt(toConditions.get(1));

        // check Number is valid or not
        RelativeFilterDateValidationUtils.fromToNumValidation(fromNum, toNum);

        // tableDateType
        String tableDataType = relativeFilter.getFilterTable().getDataType().name();

        // anchorDate -- specificDate/date
        // retriving a date with validation
        anchorDate = RelativeFilterDateValidationUtils.anchorDateValidation(relativeFilter, ancDateArray);

        if (!List.of("DATE", "TIMESTAMP").contains(tableDataType)) {
            throw new BadRequestException("DateType should be date or timestamp");
        } else {
            // from
            String fromType = fromConditions.get(2);
            // to
            String toType = toConditions.get(2);
            // last/current/next
            if (fromConditions.get(0).equals("last")) {

                switch (fromType) {
                    case "day":
                        fromDate = "('" + anchorDate + "'::DATE - INTERVAL '" + fromNum + " DAY')::DATE";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum + 1;
                        fromDate = "(('" + anchorDate + "'::DATE - INTERVAL '" + fromNum
                                + " WEEK') + INTERVAL '1 DAY')::DATE";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum + 1;
                        fromDate = "(('" + anchorDate + "'::DATE - INTERVAL '" + fromNum
                                + " MONTH') + INTERVAL '1 DAY')::DATE";
                        break;
                    case "rollingYear":
                        fromNum = fromNum + 1;
                        fromDate = "(('" + anchorDate + "'::DATE - INTERVAL '" + fromNum
                                + " YEAR') + INTERVAL '1 DAY')::DATE";
                        break;
                    case "weekSunSat":
                        fromDate ="CASE WHEN DAYOFWEEK_ISO(DATE('"+anchorDate+"')) = 7  THEN \n" +
                                "DATE('"+anchorDate+"') - (DAYOFWEEK_ISO(DATE('"+anchorDate+"'))+7*("+fromNum+"-1)) DAYS \n" +
                                "ELSE \n"+
                                "DATE('"+anchorDate+"') - (DAYOFWEEK_ISO(DATE('"+anchorDate+"')) + 7*"+fromNum+") DAYS \n"+
                                "END" ;
                        break;
                    case "weekMonSun":
                        fromDate = "DATE('"+anchorDate+"') - (DAYOFWEEK_ISO(DATE('"+anchorDate+"')) + (7 *"+fromNum+") -1) DAYS";
                        break;
                    case "month":
                        fromDate = " DATE_TRUNC('MONTH', DATE '" + anchorDate + "' - INTERVAL '" + fromNum
                                + " MONTH') ";
                        break;
                    case "year":
                        fromDate = " DATE_TRUNC('YEAR', DATE '" + anchorDate + "' - INTERVAL '" + fromNum
                                + " YEAR') ";
                        break;
                    default:
                        break;
                }

            }
            if (fromConditions.get(0).equals("current")) {
                switch (fromType) {
                    case "day":
                        fromNum = 0;
                        fromDate = "('" + anchorDate + "'::DATE - INTERVAL '" + fromNum + " DAY')::DATE";
                        break;
                    case "rollingWeek":
                        fromNum = 1;
                        fromDate = "((('" + anchorDate + "'::DATE - INTERVAL '" + fromNum
                                + " WEEK') + INTERVAL '1 DAY')::DATE)";
                        break;
                    case "rollingMonth":
                        fromNum = 1;
                        fromDate = "((('" + anchorDate + "'::DATE - INTERVAL '" + fromNum
                                + " MONTH') + INTERVAL '1 DAY')::DATE)";
                        break;
                    case "rollingYear":
                        fromNum = 1;
                        fromDate = "((('" + anchorDate + "'::DATE - INTERVAL '" + fromNum
                                + " YEAR') + INTERVAL '1 DAY')::DATE)";
                        break;
                    case "weekSunSat":
                        fromDate = "CASE WHEN DAYOFWEEK_ISO(DATE('"+anchorDate+"')) = 7  THEN \n" +
                                "DATE('"+anchorDate+"') \n"+
                                "ELSE \n"+
                                "DATE('"+anchorDate+"') - (DAYOFWEEK_ISO(DATE('"+anchorDate+"'))) DAYS \n" +
                                "END" ;
                        break;
                    case "weekMonSun":
                        fromDate = "DATE('"+anchorDate+"') - (DAYOFWEEK_ISO(DATE('"+anchorDate+"')) -1 ) DAYS";
                        break;
                    case "month":
                        fromNum = 0;
                        fromDate = "DATE_TRUNC('MONTH', DATE '" + anchorDate + "' - INTERVAL '" + fromNum
                                + " MONTH') ";

                        break;
                    case "year":

                        fromNum = 0;
                        fromDate = "DATE_TRUNC('YEAR', DATE '" + anchorDate + "' - INTERVAL '" + fromNum
                                + " YEAR') ";

                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("next")) {
                switch (fromType) {
                    case "day":
                        fromDate = "('" + anchorDate + "'::DATE + INTERVAL '" + fromNum + " DAY')::DATE";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum - 1;
                        fromDate = "((('" + anchorDate + "'::DATE + INTERVAL '" + fromNum
                                + " WEEK') + INTERVAL '1 DAY')::DATE)";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum - 1;
                        fromDate = "((('" + anchorDate + "'::DATE + INTERVAL '" + fromNum
                                + " MONTH') + INTERVAL '1 DAY')::DATE)";
                        break;
                    case "rollingYear":
                        fromNum = fromNum - 1;
                        fromDate = "((('" + anchorDate + "'::DATE + INTERVAL '" + fromNum
                                + " YEAR') + INTERVAL '1 DAY')::DATE)";
                        break;
                    case "weekSunSat":
                        fromDate =  "CASE WHEN DAYOFWEEK_ISO(DATE('"+anchorDate+"')) = 7  THEN \n" +
                                "DATE('"+anchorDate+"') + (7 * "+fromNum+") DAYS \n"+
                                "ELSE \n"+
                                "DATE('"+anchorDate+"') + (7 * "+fromNum+") - (DAYOFWEEK_ISO(DATE('"+anchorDate+"'))) DAYS \n" +
                                "END" ;
                        break;
                    case "weekMonSun":
                        fromDate = "DATE '"+anchorDate+"' + (7 * "+fromNum+") - (DAYOFWEEK_ISO(DATE '"+anchorDate+"')) + 1";
                        break;
                    case "month":

                        fromDate = "DATE_TRUNC('MONTH', DATE '" + anchorDate + "' + INTERVAL '" + fromNum
                                + " MONTH') ";

                        break;
                    case "year":

                        fromDate = "DATE_TRUNC('YEAR', DATE '" + anchorDate + "' + INTERVAL '" + fromNum
                                + " YEAR') ";

                        break;
                    default:
                        break;
                }

            }

            if (toConditions.get(0).equals("last")) {

                switch (toType) {
                    case "day":
                        toDate = "('" + anchorDate + "'::DATE - INTERVAL '" + toNum + " DAY')::DATE";
                        break;
                    case "rollingWeek":
                        toDate = "('" + anchorDate + "'::DATE - INTERVAL '" + toNum + " WEEK')::DATE";
                        break;
                    case "rollingMonth":
                        toDate = "('" + anchorDate + "'::DATE - INTERVAL '" + toNum + " MONTH')::DATE";
                        break;
                    case "rollingYear":
                        toDate = "('" + anchorDate + "'::DATE - INTERVAL '" + toNum + " YEAR')::DATE";
                        break;
                    case "weekSunSat":
                        toDate ="CASE WHEN DAYOFWEEK_ISO(DATE('"+anchorDate+"')) = 7  THEN \n" +
                                "DATE('"+anchorDate+"') - (DAYOFWEEK_ISO(DATE('"+anchorDate+"'))+7*("+toNum+"-1) -6) DAYS \n" +
                                "ELSE \n"+
                                "DATE('"+anchorDate+"') - (DAYOFWEEK_ISO(DATE('"+anchorDate+"'))+7*("+toNum+"-1) + 1) DAYS \n"+
                                "END" ;
                        break;
                    case "weekMonSun":
                        toDate = "DATE('"+anchorDate+"') - (DAYOFWEEK_ISO(DATE('"+anchorDate+"'))) - (7 * ("+toNum+" - 1)) DAYS";
                        break;
                    case "month":

                        toNum = toNum - 1;
                        toDate = "DATE_TRUNC('MONTH', DATE '" + anchorDate + "' - INTERVAL '" + toNum
                                + " MONTH') - INTERVAL '1 DAY' ";
                        break;
                    case "year":

                        toNum = toNum - 1;
                        toDate = "DATE_TRUNC('YEAR', DATE '" + anchorDate + "' - INTERVAL '" + toNum
                                + " YEAR') - INTERVAL '1 DAY' ";

                        break;

                    default:
                        break;
                }

            }

            if (toConditions.get(0).equals("current")) {
                switch (toType) {
                    case "day":
                        toNum = 0;
                        toDate = "('" + anchorDate + "'::DATE + INTERVAL '" + toNum + " DAY')";
                        break;
                    case "rollingWeek":
                        toNum = 0;
                        toDate = "('" + anchorDate + "'::DATE + INTERVAL '" + toNum + " DAY')";
                        break;
                    case "rollingMonth":
                        toNum = 0;
                        toDate = "('" + anchorDate + "'::DATE + INTERVAL '" + toNum + " DAY')";
                        break;
                    case "rollingYear":
                        toNum = 0;
                        toDate = "('" + anchorDate + "'::DATE + INTERVAL '" + toNum + " DAY')";
                        break;
                    case "weekSunSat":
                        toDate = "CASE WHEN DAYOFWEEK_ISO(DATE('"+anchorDate+"')) = 7  THEN \n" +
                                "DATE('"+anchorDate+"') + 6 DAYS \n"+
                                "ELSE \n"+
                                "DATE('"+anchorDate+"') - (DAYOFWEEK_ISO(DATE('"+anchorDate+"')) -6) DAYS \n" +
                                "END" ;
                        break;
                    case "weekMonSun":
                        toDate = "CASE WHEN DAYOFWEEK_ISO(DATE('"+anchorDate+"')) = 7  THEN \n" +
                                "DATE('"+anchorDate+"') \n"+
                                "ELSE \n"+
                                "DATE('"+anchorDate+"') - (DAYOFWEEK_ISO(DATE('2024-02-15'))) + 7 DAYS \n" +
                                "END" ;
                        break;

                    case "month":

                        toNum = 1;
                        toDate = " DATE_TRUNC('MONTH', DATE '" + anchorDate + "' + INTERVAL '" + toNum
                                + " MONTH') - INTERVAL '1 DAY' ";

                        break;
                    case "year":

                        toNum = 1;
                        toDate = " DATE_TRUNC('YEAR', DATE '" + anchorDate + "' + INTERVAL '" + toNum
                                + " YEAR') - INTERVAL '1 DAY' ";

                        break;

                    default:
                        break;
                }
            }
            if (toConditions.get(0).equals("next")) {
                switch (toType) {
                    case "day":
                        toDate = "('" + anchorDate + "'::DATE + INTERVAL '" + toNum + " DAY')::DATE";
                        break;
                    case "rollingWeek":
                        toDate = "('" + anchorDate + "'::DATE + INTERVAL '" + toNum + " WEEK')";
                        break;
                    case "rollingMonth":
                        toDate = "('" + anchorDate + "'::DATE + INTERVAL '" + toNum + " MONTH')";
                        break;
                    case "rollingYear":
                        toDate = "('" + anchorDate + "'::DATE + INTERVAL '" + toNum + " YEAR')";
                        break;
                    case "weekSunSat":
                        toDate="CASE WHEN DAYOFWEEK_ISO(DATE('"+anchorDate+"')) = 7  THEN \n" +
                                "DATE('"+anchorDate+"') + (7 * "+toNum+") + 6 DAYS \n"+
                                "ELSE \n"+
                                "DATE('"+anchorDate+"') + (7 * "+toNum+") - (DAYOFWEEK_ISO(DATE('"+anchorDate+"'))-6) DAYS \n" +
                                "END" ;
                        break;
                    case "weekMonSun":
                        toDate =  "CASE \n" +
                                  "WHEN DAYOFWEEK_ISO(DATE '"+anchorDate+"') = 7 THEN DATE '"+anchorDate+"' + ( 7 * "+toNum+")\n" +
                                  "ELSE DATE '"+anchorDate+"' + (7 * "+toNum+") - (DAYOFWEEK_ISO(DATE '"+anchorDate+"')) + 7\n" +
                                  "END" ;
                        break;

                    case "month":

                        toNum = toNum + 1;
                        toDate = "DATE_TRUNC('MONTH', DATE '" + anchorDate + "' + INTERVAL '" + toNum
                                + " MONTH') - INTERVAL '1 DAY' ";

                        break;
                    case "year":

                        toNum = toNum + 1;
                        toDate = "DATE_TRUNC('YEAR', DATE '" + anchorDate + "' + INTERVAL '" + toNum
                                + " YEAR') - INTERVAL '1 DAY' ";

                        break;

                    default:
                        break;
                }
            }
            // finalQuery to get date
            String finalQuery = "SELECT " +
                                "\nCAST(( \n" + fromDate + "\n) AS DATE) as fromdate, \n" +
                                "CAST((" + toDate
                               + "\n) AS DATE) as todate " +
                                " \nFROM SYSIBM.SYSDUMMY1";


            // String finalQuery = "SELECT 1";

            return finalQuery;
        }

    }

    // based on date

    public static String getRelativeAnchorDate(Table table,
                                               @Valid RelativeFilterRequest relativeFilter) throws BadRequestException {

        if (relativeFilter.getAnchorDate() == null) {
            throw new BadRequestException("there is no anchor date");
        }
        String query = "";

        // table
        String tableName = table.getTable();

        String schemaName = table.getSchema();

        String anchorDate = relativeFilter.getAnchorDate();

        String customQuery = table.getCustomQuery();

        // pattern checker of specific date
        Pattern pattern = Pattern.compile("\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])");
        Matcher matcher = pattern.matcher(anchorDate);

        // Query


        if (List.of("today", "tomorrow", "yesterday", "columnMaxDate").contains(anchorDate)) {
            if (anchorDate.equals("today")) {
                query = "SELECT CURRENT_DATE AS anchordate FROM SYSIBM.SYSDUMMY1";
            } else if (anchorDate.equals("tomorrow")) {
                query = "SELECT CURRENT_DATE + INTERVAL '1 DAY' AS anchordate FROM SYSIBM.SYSDUMMY1";
            } else if (anchorDate.equals("yesterday")) {
                query = "SELECT CURRENT_DATE - INTERVAL '1 DAY' AS anchordate FROM SYSIBM.SYSDUMMY1";
            } else if (anchorDate.equals("columnMaxDate")) {
                if(!table.isCustomQuery()) {
                    query = "SELECT CAST(MAX(" + relativeFilter.getFilterTable().getFieldName()
                            + ") AS DATE) AS anchordate FROM "
                            + schemaName + "." + tableName;
                }else{
                    query = "SELECT CAST(MAX(" + relativeFilter.getFilterTable().getFieldName()
                            + ") AS DATE) AS anchordate FROM ("
                            + customQuery+")";
                }
            }
        } else if (matcher.matches()) {
            query = " SELECT 1 AS anchordate FROM SYSIBM.SYSDUMMY1";
        } else {
            throw new BadRequestException("Invalid anchor date");
        }

        return query;
    }


}
