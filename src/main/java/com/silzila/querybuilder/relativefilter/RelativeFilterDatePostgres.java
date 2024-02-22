package com.silzila.querybuilder.relativefilter;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.validation.Valid;

import org.json.JSONArray;

import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.RelativeFilterRequest;
import com.silzila.payload.request.Table;

public class RelativeFilterDatePostgres {
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
        // get a anchorDate
        String ancDate = String.valueOf(ancDateArray.getJSONObject(0).get("anchordate"));

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
                        fromDate = "('" + anchorDate + "'::date - interval '" + fromNum + " day')::date";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum + 1;
                        fromDate = "(('" + anchorDate + "'::date - interval '" + fromNum
                                + " week') + interval '1 day')::date";

                        break;
                    case "rollingMonth":
                        fromNum = fromNum + 1;
                        fromDate = "(('" + anchorDate + "'::date - interval '" + fromNum
                                + " month') + interval '1 day')::date";
                        break;
                    case "rollingYear":
                        fromNum = fromNum + 1;
                        fromDate = "(('" + anchorDate + "'::date - interval '" + fromNum
                                + " year') + interval '1 day')::date";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7);
                        fromDate = "('" + anchorDate + "'::date - (EXTRACT(DOW FROM '" + anchorDate + "'::date)::int + "
                                + fromNum + "))::date";
                        break;
                    case "weekMonSun":
                        fromNum = (fromNum * 7) - 1;
                        fromDate = "CASE WHEN EXTRACT(DOW FROM '" + anchorDate + "'::date) = 0 THEN " +
                                "('" + anchorDate + "'::date - (EXTRACT(DOW FROM '" + anchorDate + "'::date)::int + "
                                + fromNum + " + 7))::date " +
                                "ELSE " +
                                "('" + anchorDate + "'::date - (EXTRACT(DOW FROM '" + anchorDate + "'::date)::int + "
                                + fromNum + "))::date " +
                                "END";
                        break;
                    case "calendarMonth":

                        if (isLastDay(anchorDate, "month")) {
                            fromNum = fromNum + 1;
                            fromDate = " DATE_TRUNC('MONTH', DATE '" + anchorDate + "' - INTERVAL '" + fromNum
                                    + " MONTH' + INTERVAL '1 day') ";
                        } else {
                            fromDate = " DATE_TRUNC('MONTH', DATE '" + anchorDate + "' - INTERVAL '" + fromNum
                                    + " MONTH' + INTERVAL '1 day') ";
                        }

                        break;
                    case "calendarYear":
                        if (isLastDay(anchorDate, "year")) {
                            fromNum = fromNum + 1;
                            fromDate = " DATE_TRUNC('YEAR', DATE '" + anchorDate + "' - INTERVAL '" + fromNum
                                    + " YEAR' + INTERVAL '1 day') ";
                        } else {
                            fromDate = " DATE_TRUNC('YEAR', DATE '" + anchorDate + "' - INTERVAL '" + fromNum
                                    + " YEAR' + INTERVAL '1 day') ";
                        }
                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("current")) {
                switch (fromType) {
                    case "day":
                        fromNum = 0;
                        fromDate = "('" + anchorDate + "'::date - interval '" + fromNum + " day')::date";
                        break;
                    case "rollingWeek":
                        fromNum = 1;
                        fromDate = "((('" + anchorDate + "'::date - interval '" + fromNum
                                + " week') + interval '1 day')::date)";
                        break;
                    case "rollingMonth":
                        fromNum = 1;
                        fromDate = "((('" + anchorDate + "'::date - interval '" + fromNum
                                + " month') + interval '1 day')::date)";
                        break;
                    case "rollingYear":
                        fromNum = 1;
                        fromDate = "((('" + anchorDate + "'::date - interval '" + fromNum
                                + " year') + interval '1 day')::date)";
                        break;
                    case "weekSunSat":
                        fromDate = "('" + anchorDate + "'::date - interval '1 day' * EXTRACT(DOW FROM '" + anchorDate
                                + "'::date))::date";
                        break;
                    case "weekMonSun":
                        fromDate = "CASE WHEN EXTRACT(DOW FROM '" + anchorDate + "'::date) = 0 THEN " +
                                "('" + anchorDate + "'::date - interval '1 day' * (EXTRACT(DOW FROM '" + anchorDate
                                + "'::date) + 6))::date " +
                                "ELSE " +
                                "('" + anchorDate + "'::date - interval '1 day' * (EXTRACT(DOW FROM '" + anchorDate
                                + "'::date) - 1))::date " +
                                "END";
                        break;
                    case "calendarMonth":
                        if (isLastDay(anchorDate, "month")) {
                            fromNum = 1;
                            fromDate = " DATE_TRUNC('MONTH', DATE '" + anchorDate + "' - INTERVAL '" + fromNum
                                    + " MONTH' + INTERVAL '1 day') ";
                        } else {
                            fromNum = 0;
                            fromDate = "DATE_TRUNC('MONTH', DATE '" + anchorDate + "' - INTERVAL '" + fromNum
                                    + " MONTH' + INTERVAL '1 day') ";
                        }
                        break;
                    case "calendarYear":
                        if (isLastDay(anchorDate, "year")) {
                            fromNum = 1;
                            fromDate = " DATE_TRUNC('YEAR', DATE '" + anchorDate + "' - INTERVAL '" + fromNum
                                    + " YEAR' + INTERVAL '1 day') ";
                        } else {
                            fromNum = 0;
                            fromDate = "DATE_TRUNC('YEAR', DATE '" + anchorDate + "' - INTERVAL '" + fromNum
                                    + " YEAR' + INTERVAL '1 day') ";
                        }
                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("next")) {
                switch (fromType) {
                    case "day":
                        fromDate = "('" + anchorDate + "'::date + interval '" + fromNum + " day')::date";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum - 1;
                        fromDate = "((('" + anchorDate + "'::date + interval '" + fromNum
                                + " week') + interval '1 day')::date)";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum - 1;
                        fromDate = "((('" + anchorDate + "'::date + interval '" + fromNum
                                + " month') + interval '1 day')::date)";
                        break;
                    case "rollingYear":
                        fromNum = fromNum - 1;
                        fromDate = "((('" + anchorDate + "'::date + interval '" + fromNum
                                + " year') + interval '1 day')::date)";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 7;
                        fromDate = "('" + anchorDate + "'::date + interval '1 day' * (7 - extract(dow from '"
                                + anchorDate + "'::date) + (" + fromNum + ")))::date";
                        break;
                    case "weekMonSun":
                        fromNum = (fromNum * 7) - 6;
                        fromDate = "CASE WHEN EXTRACT(DOW FROM '" + anchorDate + "'::date) = 0 THEN " +
                                "('" + anchorDate + "'::date + interval '1 day' * (7 - EXTRACT(DOW FROM '" + anchorDate
                                + "'::date) + " + fromNum + ") - interval '7 day')::date " +
                                "ELSE " +
                                "('" + anchorDate + "'::date + interval '1 day' * (7 - EXTRACT(DOW FROM '" + anchorDate
                                + "'::date) + " + fromNum + "))::date " +
                                "END";
                        break;
                    case "calendarMonth":

                        if (isLastDay(anchorDate, "month")) {
                            fromNum = fromNum - 1;
                            fromDate = " DATE_TRUNC('MONTH', DATE '" + anchorDate + "' +  INTERVAL '" + fromNum
                                    + " MONTH' + INTERVAL '1 day') ";
                        } else {
                            fromDate = "DATE_TRUNC('MONTH', DATE '" + anchorDate + "' + INTERVAL '" + fromNum
                                    + " MONTH' + INTERVAL '1 day') ";
                        }
                        break;
                    case "calendarYear":
                        if (isLastDay(anchorDate, "year")) {
                            fromNum = fromNum - 1;
                            fromDate = " DATE_TRUNC('YEAR', DATE '" + anchorDate + "' +  INTERVAL '" + fromNum
                                    + " YEAR' + INTERVAL '1 day') ";
                        } else {
                            fromDate = "DATE_TRUNC('YEAR', DATE '" + anchorDate + "' + INTERVAL '" + fromNum
                                    + " YEAR' + INTERVAL '1 day') ";
                        }
                        break;
                    default:
                        break;
                }
            }

            if (toConditions.get(0).equals("last")) {

                switch (toType) {
                    case "day":
                        toDate = "('" + anchorDate + "'::date - interval '" + toNum + " day')::date";
                        break;
                    case "rollingWeek":
                        toDate = "('" + anchorDate + "'::date - interval '" + toNum + " week')::date";
                        break;
                    case "rollingMonth":
                        toDate = "('" + anchorDate + "'::date - interval '" + toNum + " month')::date";
                        break;
                    case "rollingYear":
                        toDate = "('" + anchorDate + "'::date - interval '" + toNum + " year')::date";
                        break;
                    case "weekSunSat":
                        toNum = (toNum * 7) - 1 - 7;
                        toDate = "('" + anchorDate + "'::date - interval '1 day' * ((EXTRACT(DOW FROM '" + anchorDate
                                + "'::date) + " + toNum + ") + 2))::date";
                        break;
                    case "weekMonSun":
                        toNum = (toNum * 7) - 7;
                        toDate = "CASE WHEN EXTRACT(DOW FROM '" + anchorDate + "'::date) = 0 THEN " +
                                "('" + anchorDate + "'::date - interval '1 day' * (EXTRACT(DOW FROM '" + anchorDate
                                + "'::date) + 7 + " + toNum + "))::date " +
                                "ELSE " +
                                "('" + anchorDate + "'::date - interval '1 day' * (EXTRACT(DOW FROM '" + anchorDate
                                + "'::date) + " + toNum + "))::date " +
                                "END";
                        break;
                    case "calendarMonth":

                        if (isLastDay(anchorDate, "month")) {
                            toDate = " DATE_TRUNC('MONTH', DATE '" + anchorDate + "' - INTERVAL '" + toNum
                                    + " MONTH' + INTERVAL '1 day') - INTERVAL '1 day' ";
                        } else {
                            toNum = toNum - 1;
                            toDate = "DATE_TRUNC('MONTH', DATE '" + anchorDate + "' - INTERVAL '" + toNum
                                    + " MONTH' + INTERVAL '1 day') - INTERVAL '1 day' ";
                        }
                        break;
                    case "calendarYear":
                        if (isLastDay(anchorDate, "year")) {
                            toDate = " DATE_TRUNC('YEAR', DATE '" + anchorDate + "' - INTERVAL '" + toNum
                                    + " YEAR' + INTERVAL '1 day') - INTERVAL '1 day' ";
                        } else {
                            toNum = toNum - 1;
                            toDate = "DATE_TRUNC('YEAR', DATE '" + anchorDate + "' - INTERVAL '" + toNum
                                    + " YEAR' + INTERVAL '1 day') - INTERVAL '1 day' ";
                        }
                        break;

                    default:
                        break;
                }
            }

            if (toConditions.get(0).equals("current")) {
                switch (toType) {
                    case "day":
                        toNum = 0;
                        toDate = "('" + anchorDate + "'::date + interval '" + toNum + " day')";
                        break;
                    case "rollingWeek":
                        toNum = 0;
                        toDate = "('" + anchorDate + "'::date + interval '" + toNum + " day')";
                        break;
                    case "rollingMonth":
                        toNum = 0;
                        toDate = "('" + anchorDate + "'::date + interval '" + toNum + " day')";
                        break;
                    case "rollingYear":
                        toNum = 0;
                        toDate = "('" + anchorDate + "'::date + interval '" + toNum + " day')";
                        break;
                    case "weekSunSat":
                        toDate = "('" + anchorDate + "'::date + interval '1 day' * (6 - EXTRACT(DOW FROM '" + anchorDate
                                + "'::date)))::date";
                        break;
                    case "weekMonSun":
                        toDate = "CASE WHEN EXTRACT(DOW FROM '" + anchorDate + "'::date) = 0 THEN " +
                                "('" + anchorDate + "'::date + interval '1 day' * (7 - EXTRACT(DOW FROM '" + anchorDate
                                + "'::date) - 7))::date " +
                                "ELSE " +
                                "('" + anchorDate + "'::date + interval '1 day' * (7 - EXTRACT(DOW FROM '" + anchorDate
                                + "'::date)))::date " +
                                "END";
                        break;

                    case "calendarMonth":

                        if (isLastDay(anchorDate, "month")) {
                            toNum = 0;
                            toDate = " DATE_TRUNC('MONTH', DATE '" + anchorDate + "' + INTERVAL '" + toNum
                                    + " MONTH' + INTERVAL '1 day')  - INTERVAL '1 day'  ";
                        } else {
                            toNum = 1;
                            toDate = " DATE_TRUNC('MONTH', DATE '" + anchorDate + "' + INTERVAL '" + toNum
                                    + " MONTH' + INTERVAL '1 day') - INTERVAL '1 day' ";
                        }
                        break;
                    case "calendarYear":
                        if (isLastDay(anchorDate, "year")) {
                            toNum = 0;
                            toDate = " DATE_TRUNC('YEAR', DATE '" + anchorDate + "' + INTERVAL '" + toNum
                                    + " YEAR' + INTERVAL '1 day')  - INTERVAL '1 day'  ";
                        } else {
                            toNum = 1;
                            toDate = " DATE_TRUNC('YEAR', DATE '" + anchorDate + "' + INTERVAL '" + toNum
                                    + " YEAR' + INTERVAL '1 day') - INTERVAL '1 day' ";
                        }
                        break;

                    default:
                        break;
                }
            }
            if (toConditions.get(0).equals("next")) {
                switch (toType) {
                    case "day":
                        toDate = "('" + anchorDate + "'::date + interval '" + toNum + " day')::date";
                        break;
                    case "rollingWeek":
                        toDate = "('" + anchorDate + "'::date + interval '" + toNum + " week')";
                        break;
                    case "rollingMonth":
                        toDate = "('" + anchorDate + "'::date + interval '" + toNum + " month')";
                        break;
                    case "rollingYear":
                        toDate = "('" + anchorDate + "'::date + interval '" + toNum + " year')";
                        break;
                    case "weekSunSat":
                        toNum = (toNum * 7) - 1;
                        toDate = "('" + anchorDate + "'::date + interval '1 day' * (7- EXTRACT(DOW FROM '" + anchorDate
                                + "'::date) + " + toNum + "))::date";
                        break;
                    case "weekMonSun":
                        toNum = (toNum * 7);
                        toDate = "CASE WHEN EXTRACT(DOW FROM '" + anchorDate + "'::date) = 0 THEN " +
                                "('" + anchorDate + "'::date + interval '1 day' * (7 - EXTRACT(DOW FROM '" + anchorDate
                                + "'::date) - 7 + " + toNum + "))::date " +
                                "ELSE " +
                                "('" + anchorDate + "'::date + interval '1 day' * (7 - EXTRACT(DOW FROM '" + anchorDate
                                + "'::date) + " + toNum + "))::date " +
                                "END";
                        break;

                    case "calendarMonth":

                        if (isLastDay(anchorDate, "month")) {
                            toDate = " DATE_TRUNC('MONTH', DATE '" + anchorDate + "' + INTERVAL '" + toNum
                                    + " MONTH' + INTERVAL '1 day')  - INTERVAL '1 day' ";
                        } else {
                            toNum = toNum + 1;
                            toDate = "DATE_TRUNC('MONTH', DATE '" + anchorDate + "' + INTERVAL '" + toNum
                                    + " MONTH' + INTERVAL '1 day') - INTERVAL '1 day' ";
                        }
                        break;
                    case "calendarYear":
                        if (isLastDay(anchorDate, "year")) {
                            toDate = " DATE_TRUNC('YEAR', DATE '" + anchorDate + "' + INTERVAL '" + toNum
                                    + " YEAR' + INTERVAL '1 day')  - INTERVAL '1 day' ";
                        } else {
                            toNum = toNum + 1;
                            toDate = "DATE_TRUNC('YEAR', DATE '" + anchorDate + "' + INTERVAL '" + toNum
                                    + " YEAR' + INTERVAL '1 day') - INTERVAL '1 day' ";
                        }
                        break;

                    default:
                        break;
                }
            }
            // finalQuery to get date

            String finalQuery = "SELECT CAST((" + fromDate + ") AS DATE) as fromdate, CAST((" + toDate
                    + ") AS DATE) as todate";

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

        // pattern checker of specific date
        Pattern pattern = Pattern.compile("\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])");
        Matcher matcher = pattern.matcher(anchorDate);

        // Query
        if (List.of("today", "tomorrow", "yesterday", "latest").contains(anchorDate)) {
            if (anchorDate.equals("today")) {
                query = "select current_date as anchorDate";
            } else if (anchorDate.equals("tomorrow")) {
                query = "select current_date + interval '1 day' as anchorDate";
            } else if (anchorDate.equals("yesterday")) {
                query = "select current_date - interval '1 day' as anchorDate";
            } else if (anchorDate.equals("latest")) {
                query = "select CAST(max(" + relativeFilter.getFilterTable().get(0).getFieldName()
                        + ")as DATE) as anchorDate from "
                        + schemaName + "." + tableName;
            }
        } else if (matcher.matches()) {
            query = "select 1 as anchorDate";
        } else {
            throw new BadRequestException("Invalid anchor date");
        }

        return query;
    }

    public static boolean isLastDay(String dateString, String type) {
        LocalDate date = LocalDate.parse(dateString);

        if ("month".equalsIgnoreCase(type)) {
            int lastDayOfMonth = date.lengthOfMonth();
            return date.getDayOfMonth() == lastDayOfMonth;
        } else if ("year".equalsIgnoreCase(type)) {
            int dayOfYear = date.getDayOfYear();
            int lastDayOfYear = date.isLeapYear() ? 366 : 365;
            return dayOfYear == lastDayOfYear;
        } else {
            throw new IllegalArgumentException("Invalid type. Use 'month' or 'year'.");
        }
    }
}
