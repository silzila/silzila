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
                        fromDate = "DATEADD(DAY, -" + fromNum + ", CONVERT(DATE, '" + anchorDate + "', 23))";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum + 1;
                        fromDate = "DATEADD(DAY, 1, DATEADD(WEEK, -" + fromNum + ", CONVERT(DATE, '" + anchorDate
                                + "', 23)))";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum + 1;
                        fromDate = "DATEADD(DAY, 1, DATEADD(MONTH, -" + fromNum + ", CONVERT(DATE, '" + anchorDate
                                + "', 23)))";
                        break;
                    case "rollingYear":
                        fromNum = fromNum + 1;
                        fromDate = "DATEADD(DAY, 1, DATEADD(YEAR, -" + fromNum + ", CONVERT(DATE, '" + anchorDate
                                + "', 23)))";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 1;
                        fromDate = "DATEADD(DAY, -((DATEPART(DW, '" + anchorDate + "') + " + fromNum
                                + ")), CONVERT(DATE, '" + anchorDate + "', 23))";
                        break;
                    case "weekMonSun":
                        fromNum = (fromNum * 7 - 2);
                        fromDate = "CASE WHEN DATEPART(WEEKDAY, '" + anchorDate + "') = 1 THEN " +
                                "DATEADD(DAY, -(DATEPART(WEEKDAY, '" + anchorDate + "') + " + fromNum + " + 7), '"
                                + anchorDate + "') " +
                                "ELSE " +
                                "DATEADD(DAY, -(DATEPART(WEEKDAY, '" + anchorDate + "') + " + fromNum + "), '"
                                + anchorDate + "') " +
                                "END";
                        break;
                    case "month":
                        fromDate = "DATETRUNC(MONTH, DATEADD(MONTH, -" + fromNum
                                + ", CONVERT(DATE, '" + anchorDate + "', 23))) ";
                        break;
                    case "year":
                        fromDate = "DATETRUNC(YEAR, DATEADD(YEAR, -" + fromNum
                                + ", CONVERT(DATE, '" + anchorDate + "', 23))) ";
                        break;
                    default:
                        break;
                }

            }
            if (fromConditions.get(0).equals("current")) {
                switch (fromType) {
                    case "day":
                        fromNum = 0;
                        fromDate = "DATEADD(DAY, -" + fromNum + ", '" + anchorDate + "')";
                        break;
                    case "rollingWeek":
                        fromNum = 1;
                        fromDate = "DATEADD(DAY, 1, DATEADD(WEEK, -" + fromNum + ", '" + anchorDate + "'))";
                        break;
                    case "rollingMonth":
                        fromNum = 1;
                        fromDate = "DATEADD(DAY, 1, DATEADD(MONTH, -" + fromNum + ", '" + anchorDate + "'))";
                        break;
                    case "rollingYear":
                        fromNum = 1;
                        fromDate = "DATEADD(DAY, 1, DATEADD(YEAR, -" + fromNum + ", '" + anchorDate + "'))";
                        break;
                    case "weekSunSat":
                        fromDate = "DATEADD(DAY, -(DATEPART(DW, '" + anchorDate + "') - 1), '" + anchorDate + "')";
                        break;
                    case "weekMonSun":
                        fromDate = "CASE " +
                                "WHEN DATEPART(DW, '" + anchorDate + "') = 1 THEN DATEADD(DAY, -6, '" + anchorDate
                                + "') " +
                                "ELSE DATEADD(DAY, - (DATEPART(DW, '" + anchorDate + "') - 2), '" + anchorDate
                                + "') " +
                                "END";
                        break;
                    case "month":
                        fromNum = 0;
                        fromDate = "DATETRUNC(MONTH, DATEADD(MONTH, -" + fromNum
                                + ", CONVERT(DATE, '" + anchorDate + "', 23))) ";
                        break;
                    case "year":
                        fromNum = 0;
                        fromDate = "DATETRUNC(YEAR, DATEADD(YEAR, -" + fromNum
                                + ", CONVERT(DATE, '" + anchorDate + "', 23))) ";
                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("next")) {
                switch (fromType) {
                    case "day":
                        fromDate = "DATEADD(DAY, " + fromNum + ", '" + anchorDate + "')";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum - 1;
                        fromDate = "DATEADD(DAY, 1, DATEADD(WEEK, " + fromNum + ", '" + anchorDate + "'))";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum - 1;
                        fromDate = "DATEADD(DAY, 1, DATEADD(MONTH, " + fromNum + ", '" + anchorDate + "'))";
                        break;
                    case "rollingYear":
                        fromNum = fromNum - 1;
                        fromDate = "DATEADD(DAY, 1, DATEADD(YEAR, " + fromNum + ", '" + anchorDate + "'))";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 6;
                        fromDate = "DATEADD(DAY, (7 - DATEPART(DW, '" + anchorDate + "') + " + fromNum + "), '"
                                + anchorDate + "')";
                        break;
                    case "weekMonSun":
                        fromNum = 1 + (fromNum * 7) - 6;
                        fromDate = "CASE " +
                                "WHEN DATEPART(DW, '" + anchorDate + "') = 1 THEN DATEADD(DAY, (7 - DATEPART(DW, '"
                                + anchorDate + "') + " + fromNum + ") - 7, '" + anchorDate + "') " +
                                "ELSE DATEADD(DAY, (7 - DATEPART(DW, '" + anchorDate + "') + " + fromNum + "), '"
                                + anchorDate + "') " +
                                "END";

                        break;
                    case "month":
                        fromDate = "DATETRUNC(MONTH, DATEADD(MONTH, " + fromNum
                                + ", CONVERT(DATE, '" + anchorDate + "', 23))) ";

                        break;
                    case "year":
                        fromDate = "DATETRUNC(YEAR, DATEADD(YEAR, " + fromNum
                                + ", CONVERT(DATE, '" + anchorDate + "', 23))) ";

                        break;

                    default:
                        break;
                }

            }

            if (toConditions.get(0).equals("last")) {

                switch (toType) {
                    case "day":
                        toDate = "DATEADD(DAY, -" + toNum + ", CONVERT(DATE, '" + anchorDate + "', 23))";
                        break;
                    case "rollingWeek":
                        toDate = "DATEADD(WEEK, -" + toNum + ", '" + anchorDate + "')";

                        break;
                    case "rollingMonth":
                        toDate = "DATEADD(MONTH, -" + toNum + ", '" + anchorDate + "')";

                        break;
                    case "rollingYear":
                        toDate = "DATEADD(YEAR, -" + toNum + ", '" + anchorDate + "')";

                        break;
                    case "weekSunSat":
                        toNum = (toNum * 7) - 1 - 6;
                        toDate = "DATEADD(DAY, - (DATEPART(DW, '" + anchorDate + "') + " + toNum + "), '" + anchorDate
                                + "')";
                        break;
                    case "weekMonSun":
                        toNum = (toNum * 7) - 2 - 6;
                        toDate = "CASE " +
                                "WHEN DATEPART(DW, '" + anchorDate + "') = 1 THEN DATEADD(DAY, - (DATEPART(DW, '"
                                + anchorDate + "') + " + toNum + " + 7), '" + anchorDate + "') " +
                                "ELSE DATEADD(DAY, - (DATEPART(DW, '" + anchorDate + "') + " + toNum + "), '"
                                + anchorDate + "') " +
                                "END";
                        break;
                    case "month":
                        toNum = toNum - 1;
                        toDate = "DATEADD(DAY, -1, DATETRUNC(MONTH, DATEADD(MONTH, -" + toNum
                                + ", CONVERT(DATE, '" + anchorDate + "', 23))))";

                        break;
                    case "year":
                        toNum = toNum - 1;
                        toDate = "DATEADD(DAY, -1, DATETRUNC(YEAR, DATEADD(YEAR, -" + toNum
                                + ", CONVERT(DATE, '" + anchorDate + "', 23))))";

                        break;

                    default:
                        break;
                }

            }

            if (toConditions.get(0).equals("current")) {
                switch (toType) {
                    case "day":
                        toNum = 0;
                        toDate = "DATEADD(DAY, " + toNum + ", '" + anchorDate + "')";
                        break;
                    case "rollingWeek":
                        toNum = 0;
                        toDate = "DATEADD(DAY, " + toNum + ", '" + anchorDate + "')";
                        break;
                    case "rollingMonth":
                        toNum = 0;
                        toDate = "DATEADD(DAY, " + toNum + ", '" + anchorDate + "')";
                        break;
                    case "rollingYear":
                        toNum = 0;
                        toDate = "DATEADD(DAY, " + toNum + ", '" + anchorDate + "')";
                        break;
                    case "weekSunSat":
                        toDate = "DATEADD(DAY, (7 - DATEPART(DW, '" + anchorDate + "')), '" + anchorDate + "')";

                        break;
                    case "weekMonSun":
                        toDate = "CASE " +
                                "WHEN DATEPART(DW, '" + anchorDate + "') = 1 THEN DATEADD(DAY,0, '" + anchorDate
                                + "') " +
                                "ELSE DATEADD(DAY, (8 - DATEPART(DW, '" + anchorDate + "')), '" + anchorDate + "') " +
                                "END";
                        break;
                    case "month":
                        toNum = 1;
                        toDate = "DATEADD(DAY, -1, DATETRUNC(MONTH, DATEADD(MONTH," + toNum
                                + ", CONVERT(DATE, '" + anchorDate + "', 23))))";

                        break;
                    case "year":
                        toNum = 1;
                        toDate = "DATEADD(DAY, -1, DATETRUNC(YEAR, DATEADD(YEAR," + toNum
                                + ", CONVERT(DATE, '" + anchorDate + "', 23))))";

                        break;

                    default:
                        break;
                }
            }
            if (toConditions.get(0).equals("next")) {
                switch (toType) {
                    case "day":
                        toDate = "DATEADD(day, " + toNum + ", '" + anchorDate + "')";
                        break;
                    case "rollingWeek":
                        toDate = "DATEADD(week, " + toNum + ", '" + anchorDate + "')";
                        break;
                    case "rollingMonth":
                        toDate = "DATEADD(month, " + toNum + ", '" + anchorDate + "')";
                        break;
                    case "rollingYear":
                        toDate = "DATEADD(year, " + toNum + ", '" + anchorDate + "')";
                        break;
                    case "weekSunSat":
                        toNum = toNum * 7;
                        toDate = "DATEADD(day, (7 - DATEPART(dw, '" + anchorDate + "')) + " + toNum + ", '" + anchorDate
                                + "')";
                        break;
                    case "weekMonSun":
                        toNum = toNum * 7 + 1;
                        toDate = "CASE " +
                                "WHEN DATEPART(dw, '" + anchorDate + "') = 1 THEN DATEADD(day, (7 - DATEPART(dw, '"
                                + anchorDate + "')) + " + toNum + " - 7, '" + anchorDate + "') " +
                                "ELSE DATEADD(day, (7 - DATEPART(dw, '" + anchorDate + "')) + " + toNum + ", '"
                                + anchorDate + "') " +
                                "END";
                        break;
                    case "month":
                        toDate = "EOMONTH(DATEADD(month, " + toNum + ", '" + anchorDate + "'))";
                        break;
                    case "year":
                        toNum = toNum + 1;
                        toDate = "DATEADD(day, -1, DATETRUNC(year, DATEADD(year, " + toNum
                                + ", CONVERT(date, '" + anchorDate + "', 23))))";
                        break;
                    default:
                        break;
                }
            }
            // finalQuery to get date

            String finalQuery = "SELECT CONVERT(DATE, " + fromDate + ") as fromdate, CONVERT(DATE, " + toDate
                    + ") as todate";

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
                query = "select convert(date, getdate()) as anchordate";
            } else if (anchorDate.equals("tomorrow")) {
                query = "select dateadd(day, 1, convert(date, getdate())) as anchordate";
            } else if (anchorDate.equals("yesterday")) {
                query = "select dateadd(day, -1, convert(date, getdate())) as anchordate";
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
            query = "select 1  anchordate";
        } else {
            throw new BadRequestException("Invalid anchor date");
        }

        return query;
    }
}


