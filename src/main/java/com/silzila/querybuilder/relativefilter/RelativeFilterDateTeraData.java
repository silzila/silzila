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

public class RelativeFilterDateTeraData {
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
                        fromDate = "CAST((DATE '" + anchorDate + "') -"+fromNum+" AS DATE)";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum + 1;
                        fromDate = "CAST((DATE '"+anchorDate+"')-(7*"+fromNum+")+1 AS DATE)";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum + 1;
                        fromDate = "CAST(CAST((DATE '"+anchorDate+"')+ 1 AS DATE) - INTERVAL '"+fromNum+"' MONTH AS DATE)";
                        break;
                    case "rollingYear":
                        fromNum = fromNum + 1;
                        fromDate = "CAST(CAST((DATE '"+anchorDate+"')+ 1 AS DATE) - INTERVAL '"+fromNum+"' YEAR AS DATE)";
                        break;
                    case "weekSunSat":
                        fromDate = "CAST((DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 1 + 7 *"+fromNum+") AS DATE)";
                        break;
                    case "weekMonSun":
                        fromDate = "CAST(CASE\n"+
                                "WHEN TD_DAY_OF_WEEK(DATE '"+anchorDate+"') = 1 THEN (DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 2 + 7 *"+(fromNum+1)+")\n"+
                                "ELSE (DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 2 + 7 *"+fromNum+")\n"+
                                "END AS DATE)";
                        break;
                    case "month":
                        fromDate = "CAST(((ADD_MONTHS(DATE '"+anchorDate+"', -"+fromNum+")/100)*100+1) AS DATE)";
                        break;
                    case "year":
                        fromDate = "CAST(trim(EXTRACT(YEAR FROM DATE '"+anchorDate+"')-"+fromNum+") || '-01-01' AS DATE)";
                        break;
                    default:
                        break;
                }

            }
            if (fromConditions.get(0).equals("current")) {
                switch (fromType) {
                    case "day":
                        fromNum = 0;
                        fromDate = "CAST((DATE '"+anchorDate+"')-"+fromNum+" AS DATE)" ;
                        break;
                    case "rollingWeek":
                        fromDate = "CAST((DATE '"+anchorDate+"')-(7*"+fromNum+")+1 AS DATE)";
                        break;
                    case "rollingMonth":
                        fromNum = 1;
                        fromDate = "CAST(CAST((DATE '"+anchorDate+"')+ 1 AS DATE) - INTERVAL '"+fromNum+"' MONTH AS DATE)";
                        break;
                    case "rollingYear":
                        fromDate = "CAST(CAST((DATE '"+anchorDate+"')+ 1 AS DATE) - INTERVAL '"+fromNum+"' YEAR AS DATE)";
                        break;
                    case "weekSunSat":
                        fromDate = "CAST((DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 1 + 7 *"+(fromNum-1)+") AS DATE)";
                        break;
                    case "weekMonSun":
                        fromDate = "CAST(CASE\n"+
                                "WHEN TD_DAY_OF_WEEK(DATE '"+anchorDate+"') = 1 THEN (DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 2 + 7 *"+fromNum+")\n"+
                                "ELSE (DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 2 + 7 *"+(fromNum-1)+")\n"+
                                "END AS DATE)";
                        break;
                    case "month":
                        fromNum = 0;
                        fromDate = "CAST(((ADD_MONTHS(DATE '"+anchorDate+"', -"+fromNum+")/100)*100+1) AS DATE)";
                        break;
                    case "year":
                        fromNum = 0;
                        fromDate = "CAST(trim(EXTRACT(YEAR FROM DATE '"+anchorDate+"')-"+fromNum+") || '-01-01' AS DATE)";
                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("next")) {
                switch (fromType) {
                    case "day":
                        fromDate = "CAST((DATE '"+anchorDate+"')+"+fromNum+" AS DATE)";
                        break;
                    case "rollingWeek":
                        fromDate = "CAST((DATE '" + anchorDate + "')+1 AS DATE)";
                        break;
                    case "rollingMonth":
                        fromDate = "CAST((DATE '" + anchorDate + "')+1 AS DATE)";
                        break;
                    case "rollingYear":
                        fromDate = "CAST((DATE '" + anchorDate + "')+1 AS DATE)";
                        break;
                    case "weekSunSat":
                        fromDate = "CAST((DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 1 - 7 *"+fromNum+") AS DATE)";;
                        break;
                    case "weekMonSun":

                        fromDate = "CAST(CASE\n"+
                                "WHEN TD_DAY_OF_WEEK(DATE '"+anchorDate+"') = 1 THEN (DATE '"+anchorDate+"') + (TD_DAY_OF_WEEK(DATE '"+anchorDate+"')  + 7 *"+(fromNum-1)+")\n"+
                                "ELSE (DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 2 - 7 *"+fromNum+")\n"+
                                "END AS DATE)";

                        break;
                    case "month":
                        fromDate = "CAST(((ADD_MONTHS(DATE '"+anchorDate+"', +"+fromNum+")/100)*100+1) AS DATE)";

                        break;
                    case "year":
                        fromDate = "CAST(trim(EXTRACT(YEAR FROM DATE '"+anchorDate+"')+"+fromNum+") || '-01-01' AS DATE)";

                        break;

                    default:
                        break;
                }

            }

            if (toConditions.get(0).equals("last")) {

                switch (toType) {
                    case "day":
                        toDate = "CAST((DATE '" + anchorDate + "') -"+toNum+" AS DATE)";
                        break;
                    case "rollingWeek":
                        toDate = "CAST((DATE '"+anchorDate+"')-(7*"+toNum+") AS DATE)";

                        break;
                    case "rollingMonth":
                        toDate = "CAST((DATE '"+anchorDate+"') - INTERVAL '"+toNum+"' MONTH AS DATE)";

                        break;
                    case "rollingYear":
                        toDate = "CAST((DATE '"+anchorDate+"') - INTERVAL '"+toNum+"' YEAR AS DATE)";

                        break;
                    case "weekSunSat":
                        toDate = "CAST((DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 7 + 7 *"+toNum+") AS DATE)";
                        break;
                    case "weekMonSun":
                        toDate = "CAST(CASE\n"+
                                "WHEN TD_DAY_OF_WEEK(DATE '"+anchorDate+"') = 1 THEN (DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 1 + 7 *"+toNum+")\n"+
                                "ELSE (DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 1 + 7 *"+(toNum+1)+")\n"+
                                "END AS DATE)";
                        break;
                    case "month":
                        toDate = "CAST(LAST_DAY(ADD_MONTHS(DATE '"+anchorDate+"', -"+toNum+") - 1)AS DATE)";;

                        break;
                    case "year":
                        toDate = "CAST(trim(EXTRACT(YEAR FROM DATE '"+anchorDate+"')-"+toNum+") || '-12-31' AS DATE)";

                        break;

                    default:
                        break;
                }

            }

            if (toConditions.get(0).equals("current")) {
                switch (toType) {
                    case "day":
                        toNum = 0;
                        toDate = "CAST((DATE '"+anchorDate+"')+"+toNum+" AS DATE)";
                        break;
                    case "rollingWeek":

                        toDate = "CAST('"+anchorDate+"' AS DATE)";
                        break;
                    case "rollingMonth":
                        toNum = 0;
                        toDate = "CAST((DATE '"+anchorDate+"') - INTERVAL '"+toNum+"' MONTH AS DATE)";
                        break;
                    case "rollingYear":
                        toNum = 0;
                        toDate = "CAST((DATE '"+anchorDate+"') - INTERVAL '"+toNum+"' YEAR AS DATE)";
                        break;
                    case "weekSunSat":
                        toDate = "CAST((DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 7 + 7 *"+(toNum-1)+") AS DATE)";

                        break;
                    case "weekMonSun":
                        toDate = "CAST(CASE\n"+
                                "WHEN TD_DAY_OF_WEEK(DATE '"+anchorDate+"') = 1 THEN (DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 1 + 7 *"+(toNum-1)+")\n"+
                                "ELSE (DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 1 - 7 *"+toNum+")\n"+
                                "END AS DATE)";
                        break;
                    case "month":
                        toNum = 0;
                        toDate = "CAST(LAST_DAY(ADD_MONTHS(DATE '"+anchorDate+"', "+toNum+") - 1)AS DATE)";

                        break;
                    case "year":
                        toNum = 0;
                        toDate = "CAST(trim(EXTRACT(YEAR FROM DATE '"+anchorDate+"')-"+toNum+") || '-12-31' AS DATE)";

                        break;

                    default:
                        break;
                }
            }
            if (toConditions.get(0).equals("next")) {
                switch (toType) {
                    case "day":
                        toDate = "CAST((DATE '"+anchorDate+"')+"+toNum+" AS DATE)";
                        break;
                    case "rollingWeek":
                        toDate = " CAST((DATE '"+anchorDate+"')+(7*"+toNum+") AS DATE)";
                        break;
                    case "rollingMonth":
                        toDate = "CAST((DATE '"+anchorDate+"') + INTERVAL '"+toNum+"' MONTH AS DATE)";
                        break;
                    case "rollingYear":
                        toDate = "CAST((DATE '"+anchorDate+"') + INTERVAL '"+toNum+"' YEAR AS DATE)";
                        break;
                    case "weekSunSat":
                        toDate = "CAST((DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 7 - 7 *"+toNum+") AS DATE)";
                        break;
                    case "weekMonSun":
                        toDate ="CAST(CASE\n"+
                                "WHEN TD_DAY_OF_WEEK(DATE '"+anchorDate+"') = 1 THEN (DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 1 - 7 *"+toNum+")\n"+
                                "ELSE (DATE '"+anchorDate+"') - (TD_DAY_OF_WEEK(DATE '"+anchorDate+"') - 1 - 7 *"+(toNum+1)+")\n"+
                                "END AS DATE)";
                        break;
                    case "month":
                        toDate = "CAST(LAST_DAY(ADD_MONTHS(DATE '"+anchorDate+"', "+toNum+") - 1)AS DATE)";
                        break;
                    case "year":
                        toDate="CAST(trim(EXTRACT(YEAR FROM DATE '"+anchorDate+"')+"+toNum+") || '-12-31' AS DATE)";
                        break;
                    default:
                        break;
                }
            }
            // finalQuery to get date

            String finalQuery = "SELECT \n " + fromDate + " as fromdate,\n " + toDate + " as todate";

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

        String customQuery= table.getCustomQuery();

        // pattern checker of specific date
        Pattern pattern = Pattern.compile("\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])");
        Matcher matcher = pattern.matcher(anchorDate);

        // Query
        if (List.of("today", "tomorrow", "yesterday", "columnMaxDate").contains(anchorDate)) {
            if (anchorDate.equals("today")) {
                query = "SELECT CURRENT_DATE AS anchordate";
            } else if (anchorDate.equals("tomorrow")) {
                query = "SELECT CURRENT_DATE+1 AS anchordate";
            } else if (anchorDate.equals("yesterday")) {
                query = "SELECT CURRENT_DATE-1 AS anchordate";
            } else if (anchorDate.equals("columnMaxDate")) {
                //checking for custom query
                if(!table.isCustomQuery()) {
                    query = "select CAST(max(" + relativeFilter.getFilterTable().getFieldName()
                            + ") as DATE) as anchordate from " + tableName;
                }else {
                    query = "select CAST(max(" + relativeFilter.getFilterTable().getFieldName()
                            + ") as DATE) as anchordate from "
                            +"("+ customQuery + ")  cq";
                }
            }
        } else if (matcher.matches()) {
            query = "select 1 as anchordate";
        } else {
            throw new BadRequestException("Invalid anchor date");
        }

        return query;
    }
}


