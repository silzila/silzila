package com.silzila.querybuilder.relativefilter;

import java.sql.SQLException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.validation.Valid;

import org.json.JSONArray;

import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.RelativeFilterRequest;
import com.silzila.payload.request.Table;

public class RelativeFilterDateSqlserver {
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
        if (fromConditions.size() != 3 || toConditions.size() != 3) {
            throw new BadRequestException("no valid number of conditions");
        }

        if (!List.of("last", "current", "next").contains(fromConditions.get(0)) ||
                !List.of("last", "current", "next").contains(toConditions.get(0)) ||
                !List.of("day", "rollingWeek", "rollingMonth", "rollingYear", "weekSunSat", "weekMonSun",
                        "calendarYear",
                        "calendarMonth").contains(fromConditions.get(2))
                ||
                !List.of("day", "rollingWeek", "rollingMonth", "rollingYear", "weekSunSat", "weekMonSun",
                        "calendarYear",
                        "calendarMonth").contains(toConditions.get(2))) {

            throw new BadRequestException("Invalid type");
        }

        // precedingorfollowingNumber
        int fromNum = Integer.parseInt(fromConditions.get(1));
        int toNum = Integer.parseInt(toConditions.get(1));

        if (fromNum < 0 || toNum < 0) {
            throw new BadRequestException("Preceding or Following number should be valid");
        }

        // tableDateType
        String tableDataType = relativeFilter.getFilterTable().get(0).getDataType().name();

        // anchorDate -- specificDate/date
        // retriving a date
        if (ancDateArray.isEmpty()) {
            throw new BadRequestException("there is no anchor date");
        }
        String ancDate = String.valueOf(ancDateArray.getJSONObject(0).get("anchorDate"));

        if (List.of("today", "tomorrow", "yesterday", "latest").contains(relativeFilter.getAnchorDate())
                && !ancDate.equals("1")) {
            anchorDate = ancDate;
        } else if (ancDate.equals("1")) {
            anchorDate = relativeFilter.getAnchorDate();
        }

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
                        fromDate = "dateadd(day, -" + fromNum + ", convert(date, '" + anchorDate + "', 23))";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum + 1;
                        fromDate = "dateadd(day, 1, dateadd(week, -" + fromNum + ", convert(date, '" + anchorDate
                                + "', 23)))";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum + 1;
                        fromDate = "dateadd(day, 1, dateadd(month, -" + fromNum + ", convert(date, '" + anchorDate
                                + "', 23)))";
                        break;
                    case "rollingYear":
                        fromNum = fromNum + 1;
                        fromDate = "dateadd(day, 1, dateadd(year, -" + fromNum + ", convert(date, '" + anchorDate
                                + "', 23)))";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 1;
                        fromDate = "dateadd(day, -((datepart(dw, '" + anchorDate + "') + " + fromNum
                                + ")), convert(date, '" + anchorDate + "', 23))";
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
                    case "calendarMonth":
                        fromDate = "datetrunc(month,dateadd(day, 1, dateadd(month, -" + fromNum + ", convert(date, '"
                                + anchorDate
                                + "', 23))))";
                        break;
                    case "calendarYear":
                        fromDate = "datetrunc(year,dateadd(day, 1, dateadd(year, -" + fromNum
                                + ", convert(date, '" + anchorDate
                                + "', 23))))";
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("current")) {
                    switch (fromType) {
                        case "day":
                            fromNum = 0;
                            fromDate = "dateadd(day, -" + fromNum + ", '" + anchorDate + "')";
                            break;
                        case "rollingWeek":
                            fromNum = 1;
                            fromDate = "dateadd(day, 1, dateadd(week, -" + fromNum + ", '" + anchorDate + "'))";
                            break;
                        case "rollingMonth":
                            fromNum = 1;
                            fromDate = "dateadd(day, 1, dateadd(month, -" + fromNum + ", '" + anchorDate + "'))";
                            break;
                        case "rollingYear":
                            fromNum = 1;
                            fromDate = "dateadd(day, 1, dateadd(year, -" + fromNum + ", '" + anchorDate + "'))";
                            break;
                        case "weekSunSat":
                            fromDate = "dateadd(day, -(datepart(dw, '" + anchorDate + "') - 1), '" + anchorDate + "')";
                            break;
                        case "weekMonSun":

                            fromDate = "case " +
                                    "when datepart(dw, '" + anchorDate + "') = 1 then dateadd(day, -6, '" + anchorDate
                                    + "') " +
                                    "else dateadd(day, - (datepart(dw, '" + anchorDate + "') - 2), '" + anchorDate
                                    + "') " +
                                    "end";

                            break;
                        case "calendarMonth":
                            fromNum = 0;
                            fromDate = "format(dateadd(month, -" + fromNum + ", '" + anchorDate + "'), 'yyyy-MM-01')";
                            break;

                        case "calendarYear":
                            fromNum = 0;
                            fromDate = "format(dateadd(year, -" + fromNum + ", '" + anchorDate + "'), 'yyyy-01-01')";
                            break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("next")) {
                switch (fromType) {
                    case "day":
                        fromDate = "dateadd(day, " + fromNum + ", '" + anchorDate + "')";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum - 1;
                        fromDate = "dateadd(day, 1, dateadd(week, " + fromNum + ", '" + anchorDate + "'))";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum - 1;
                        fromDate = "dateadd(day, 1, dateadd(month, " + fromNum + ", '" + anchorDate + "'))";
                        break;
                    case "rollingYear":
                        fromNum = fromNum - 1;
                        fromDate = "dateadd(day, 1, dateadd(year, " + fromNum + ", '" + anchorDate + "'))";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 6;
                        fromDate = "dateadd(day, (7 - datepart(dw, '" + anchorDate + "') + " + fromNum + "), '"
                                + anchorDate + "')";
                        break;
                    case "weekMonSun":
                        fromNum = 1 + (fromNum * 7) - 6;
                        fromDate = "case " +
                                "when datepart(dw, '" + anchorDate + "') = 1 then dateadd(day, (7 - datepart(dw, '"
                                + anchorDate + "') + " + fromNum + ") - 7, '" + anchorDate + "') " +
                                "else dateadd(day, (7 - datepart(dw, '" + anchorDate + "') + " + fromNum + "), '"
                                + anchorDate + "') " +
                                "end";

                        break;
                    case "calendarMonth":
                        fromDate = "format(dateadd(month, " + fromNum + ", '" + anchorDate + "'), 'yyyy-MM-01')";

                        break;
                    case "calendarYear":
                        fromDate = "format(dateadd(year, " + fromNum + ", '" + anchorDate + "'), 'yyyy-01-01')";

                        break;

                    default:
                        break;
                }
            }

            if (toConditions.get(0).equals("last")) {

                switch (toType) {
                    case "day":
                        toDate = "dateadd(day, -" + toNum + ", convert(date, '" + anchorDate + "', 23))";
                        break;
                    case "rollingWeek":
                        toDate = "dateadd(week, -" + toNum + ", '" + anchorDate + "')";

                        break;
                    case "rollingMonth":
                        toDate = "dateadd(month, -" + toNum + ", '" + anchorDate + "')";

                        break;
                    case "rollingYear":
                        toDate = "dateadd(year, -" + toNum + ", '" + anchorDate + "')";

                        break;
                    case "weekSunSat":
                        toNum = (toNum * 7) - 1 - 6;
                        toDate = "dateadd(day, - (datepart(dw, '" + anchorDate + "') + " + toNum + "), '" + anchorDate
                                + "')";
                        break;
                    case "weekMonSun":
                        toNum = (toNum * 7) - 2 - 6;
                        toDate = "case " +
                                "when datepart(dw, '" + anchorDate + "') = 1 then dateadd(day, - (datepart(dw, '"
                                + anchorDate + "') + " + toNum + " + 7), '" + anchorDate + "') " +
                                "else dateadd(day, - (datepart(dw, '" + anchorDate + "') + " + toNum + "), '"
                                + anchorDate + "') " +
                                "end";
                        break;
                    case "calendarMonth":
                        toNum = toNum - 1;
                        toDate = "dateadd(day, -1, format(dateadd(month, -" + toNum + ", '" + anchorDate
                                + "'), 'yyyy-MM-01'))";

                        break;
                    case "calendarYear":
                        toNum = toNum - 1;
                        toDate = "dateadd(day, -1, format(dateadd(year, -" + toNum + ", '" + anchorDate
                                + "'), 'yyyy-01-01'))";

                        break;

                    default:
                        break;
                }
            }

            if (toConditions.get(0).equals("current")) {
                switch (toType) {
                    case "day":
                        toNum = 0;
                        toDate = "dateadd(day, " + toNum + ", '" + anchorDate + "')";
                        break;
                    case "rollingWeek":
                        toNum = 0;
                        toDate = "dateadd(day, " + toNum + ", '" + anchorDate + "')";
                        break;
                    case "rollingMonth":
                        toNum = 0;
                        toDate = "dateadd(day, " + toNum + ", '" + anchorDate + "')";
                        break;
                    case "rollingYear":
                        toNum = 0;
                        toDate = "dateadd(day, " + toNum + ", '" + anchorDate + "')";
                        break;
                    case "weekSunSat":
                        toDate = "dateadd(day, (7 - datepart(dw, '" + anchorDate + "')), '" + anchorDate + "')";

                        break;
                    case "weekMonSun":
                        toDate = "case " +
                                "when datepart(dw, '" + anchorDate + "') = 1 then dateadd(day,0, '" + anchorDate
                                + "') " +
                                "else dateadd(day, (8 - datepart(dw, '" + anchorDate + "')), '" + anchorDate + "') " +
                                "end";
                        break;
                    case "calendarMonth":
                        toNum = 1;
                        toDate = "dateadd(day, -1, format(dateadd(month, " + toNum + ", '" + anchorDate
                                + "'), 'yyyy-MM-01'))";

                        break;
                    case "calendarYear":
                        toNum = 1;
                        toDate = "dateadd(day, -1, format(dateadd(year, " + toNum + ", '" + anchorDate
                                + "'), 'yyyy-01-01'))";
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
                        toDate = "DATEADD(day, -1, DATEADD(week, " + toNum + ", '" + anchorDate + "'))";
                        if (fromType.equals("rollingWeek") && fromConditions.get(0).equals("next")) {
                            toDate = "DATEADD(week, " + toNum + ", '" + anchorDate + "')";
                        }
                        if (toNum == 0 && !fromConditions.get(0).equals("next")) {
                            toDate = "DATEADD(day, " + toNum + ", '" + anchorDate + "')";
                        }

                        break;
                    case "rollingMonth":
                        toDate = "DATEADD(day, -1, DATEADD(month, " + toNum + ", '" + anchorDate + "'))";
                        if (fromType.equals("rollingMonth") && fromConditions.get(0).equals("next")) {
                            toDate = "DATEADD(month, " + toNum + ", '" + anchorDate + "')";
                        }
                        if (toNum == 0 && !fromConditions.get(0).equals("next")) {
                            toDate = "DATEADD(day, " + toNum + ", '" + anchorDate + "')";
                        }
                        break;
                    case "rollingYear":
                        toDate = "DATEADD(day, -1, DATEADD(year, " + toNum + ", '" + anchorDate + "'))";
                        if (fromType.equals("rollingYear") && fromConditions.get(0).equals("next")) {
                            toDate = "DATEADD(year, " + toNum + ", '" + anchorDate + "')";
                        }
                        if (toNum == 0 && !fromConditions.get(0).equals("next")) {
                            toDate = "DATEADD(day, " + toNum + ", '" + anchorDate + "')";
                        }
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
                    case "calendarMonth":
                        toDate = "EOMONTH(DATEADD(month, " + toNum + ", '" + anchorDate + "'))";

                        break;
                    case "calendarYear":
                        toNum = toNum + 1;
                        toDate = "DATEADD(day, -1, FORMAT(DATEADD(year, " + toNum + ", '" + anchorDate
                                + "'), 'yyyy-01-01'))";

                        break;
                    default:
                        break;
                }
            }
            // finalQuery to get date

            String finalQuery = "SELECT CONVERT(DATE, " + fromDate + ") as fromdate, CONVERT(DATE, " + toDate
                    + ") as todate";

            // String finalQuery = "SELECT 1";
            System.out.println(finalQuery);
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

        // pattern checker of specific date
        Pattern pattern = Pattern.compile("\\d{4}-\\d{2}-\\d{2}");
        Matcher matcher = pattern.matcher(anchorDate);

        // Query
        if (List.of("today", "tomorrow", "yesterday", "latest").contains(anchorDate)) {
            if (anchorDate.equals("today")) {
                query = "select convert(date, getdate()) as anchorDate";
            } else if (anchorDate.equals("tomorrow")) {
                query = "select dateadd(day, 1, convert(date, getdate())) as anchorDate";
            } else if (anchorDate.equals("yesterday")) {
                query = "select dateadd(day, -1, convert(date, getdate())) as anchorDate";
            } else if (anchorDate.equals("latest")) {
                query = "select max(" + relativeFilter.getFilterTable().get(0).getFieldName() + ") as anchorDate from "
                        + schemaName + "." + tableName;
            }
        } else if (matcher.matches()) {
            query = "select 1 as anchorDate";
        } else {
            throw new BadRequestException("Invalid anchor date");
        }

        return query;
    }
}
