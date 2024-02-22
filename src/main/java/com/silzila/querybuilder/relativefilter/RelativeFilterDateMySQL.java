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

public class RelativeFilterDateMySQL {

    public static String anchorDate = "";

    public static String getRelativeDate( RelativeFilterRequest relativeFilter,JSONArray ancDateArray)
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
                        fromDate = "date_sub('" + anchorDate + "' , interval " + fromNum + " day)";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum + 1;
                        fromDate = "date_add(date_sub('" + anchorDate + "' , interval " + fromNum
                                + " week), interval 1 day)";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum + 1;
                        fromDate = "date_add(date_sub('" + anchorDate + "' , interval " + fromNum
                                + " month), interval 1 day)";
                        break;
                    case "rollingYear":
                        fromNum = fromNum + 1;
                        fromDate = "date_add(date_sub('" + anchorDate + "' , interval " + fromNum
                                + " year), interval 1 day)";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 1;
                        fromDate = "date_sub('" + anchorDate + "', interval (dayofweek('" + anchorDate + "') + "
                                + fromNum
                                + ") day)";
                        break;
                    case "weekMonSun":
                        fromNum = (fromNum * 7) - 2;
                        fromDate = "if(dayofweek('" + anchorDate + "') = 1, "
                                + "date_sub('" + anchorDate + "', interval (dayofweek('" + anchorDate + "') + "
                                + fromNum + " + 7) day), "
                                + "date_sub('" + anchorDate + "', interval (dayofweek('" + anchorDate + "') + "
                                + fromNum + ") day))";
                        ;
                        break;
                    case "calendarMonth":
                        fromDate = "date_format(date_sub('" + anchorDate + "', interval " + fromNum
                                + " month), \"%Y-%m-01\")";
                        break;
                    case "calendarYear":
                        fromDate = "date_format(date_sub('" + anchorDate + "', interval " + fromNum
                                + " year), \"%Y-01-01\")";
                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("current")) {
                switch (fromType) {
                    case "day":
                        fromNum = 0;
                        fromDate = "date_sub('" + anchorDate + "' , interval " + fromNum + " day)";
                        break;
                    case "rollingWeek":
                        fromNum = 1;
                        fromDate = "date_add(date_sub('" + anchorDate + "' , interval " + fromNum
                                + " week), interval 1 day)";
                        break;
                    case "rollingMonth":
                        fromNum = 1;
                        fromDate = "date_add(date_sub('" + anchorDate + "' , interval " + fromNum
                                + " month), interval 1 day)";
                        break;
                    case "rollingYear":
                        fromNum = 1;
                        fromDate = "date_add(date_sub('" + anchorDate + "' , interval " + fromNum
                                + " year), interval 1 day)";
                        break;
                    case "weekSunSat":

                        fromDate = "date_sub('" + anchorDate + "', interval (dayofweek('" + anchorDate + "') - 1  "
                                + ") day)";
                        break;
                    case "weekMonSun":

                        fromDate = "if(dayofweek('" + anchorDate + "') = 1, " +
                                "date_sub('" + anchorDate + "', interval (dayofweek('" + anchorDate
                                + "') - 2 + 7) day), " +
                                "date_sub('" + anchorDate + "', interval (dayofweek('" + anchorDate + "') - 2) day))";
                        break;
                    case "calendarMonth":
                        fromNum = 0;
                        fromDate = "date_format(date_sub('" + anchorDate + "', interval " + fromNum
                                + " month), \"%Y-%m-01\")";
                        break;

                    case "calendarYear":
                        fromNum = 0;
                        fromDate = "date_format(date_sub('" + anchorDate + "', interval " + fromNum
                                + " year), \"%Y-01-01\")";
                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("next")) {
                switch (fromType) {
                    case "day":
                        fromDate = "date_add('" + anchorDate + "' , interval " + fromNum + " day)";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum - 1;
                        fromDate = "date_add(date_add('" + anchorDate + "' , interval " + fromNum
                                + " week), interval 1 day)";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum - 1;
                        fromDate = "date_add(date_add('" + anchorDate + "' , interval " + fromNum
                                + " month), interval 1 day)";
                        break;
                    case "rollingYear":
                        fromNum = fromNum - 1;
                        fromDate = "date_add(date_add('" + anchorDate + "' , interval " + fromNum
                                + " year), interval 1 day)";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 6;
                        fromDate = "date_add('" + anchorDate + "', interval (7 - dayofweek('" + anchorDate + "') + "
                                + fromNum
                                + ") day)";
                        break;
                    case "weekMonSun":
                        fromNum = 1 + (fromNum * 7) - 6;
                        fromDate = "if(dayofweek('" + anchorDate + "') = 1, " +
                                "date_add('" + anchorDate + "', interval (7 - dayofweek('" + anchorDate + "') + "
                                + fromNum + ") - 7 day), " +
                                "date_add('" + anchorDate + "', interval (7 - dayofweek('" + anchorDate + "') + "
                                + fromNum + ") day))";
                        break;
                    case "calendarMonth":
                        fromDate = "date_format(date_add('" + anchorDate + "', interval " + fromNum
                                + " month), \"%Y-%m-01\")";
                        break;
                    case "calendarYear":
                        fromDate = "date_format(date_add('" + anchorDate + "', interval " + fromNum
                                + " year), \"%Y-01-01\")";
                        break;

                    default:
                        break;
                }
            }

            if (toConditions.get(0).equals("last")) {

                switch (toType) {
                    case "day":
                        toDate = "date_sub('" + anchorDate + "' , interval " + toNum + " day)";
                        break;
                    case "rollingWeek":
                        toDate = "date_sub('" + anchorDate + "' , interval " + toNum
                                + " week)";
                        break;
                    case "rollingMonth":
                        toDate = "date_sub('" + anchorDate + "' , interval " + toNum
                                + " month)";
                        break;
                    case "rollingYear":
                        toDate = "date_sub('" + anchorDate + "' , interval " + toNum
                                + " year)";
                        break;
                    case "weekSunSat":
                        toNum = (toNum * 7) - 1 - 6;
                        toDate = "date_sub('" + anchorDate + "', interval (dayofweek('" + anchorDate + "') + "
                                + toNum
                                + ") day)";
                        break;
                    case "weekMonSun":
                        toNum = (toNum * 7) - 2 - 6;
                        toDate = "if(dayofweek('" + anchorDate + "') = 1, " +
                                "date_sub('" + anchorDate + "', interval (dayofweek('" + anchorDate + "') + "
                                + toNum
                                + " + 7) day), " +
                                "date_sub('" + anchorDate + "', interval (dayofweek('" + anchorDate + "') + "
                                + toNum
                                + ") day))";
                        break;
                    case "calendarMonth":
                        toNum = toNum - 1;
                        toDate = "date_sub(date_format(date_sub('" + anchorDate + "', interval " + toNum
                                + " month), \"%Y-%m-01\"), interval 1 day)";
                        break;
                    case "calendarYear":
                        toNum = toNum - 1;
                        toDate = "date_sub(date_format(date_sub('" + anchorDate + "', interval " + toNum
                                + " year), \"%Y-01-01\"), interval 1 day)";
                        break;

                    default:
                        break;
                }
            }

            if (toConditions.get(0).equals("current")) {
                switch (toType) {
                    case "day":
                        toNum = 0;
                        toDate = "date_add('" + anchorDate + "' , interval " + toNum + " day)";
                        break;
                    case "rollingWeek":
                        toNum = 0;
                        toDate = "date_add('" + anchorDate + "' , interval " + toNum + " day)";
                        break;
                    case "rollingMonth":
                        toNum = 0;
                        toDate = "date_add('" + anchorDate + "' , interval " + toNum + " day)";
                        break;
                    case "rollingYear":
                        toNum = 0;
                        toDate = "date_add('" + anchorDate + "' , interval " + toNum + " day)";
                        break;
                    case "weekSunSat":
                        toDate = "date_add('" + anchorDate + "', interval (7 - dayofweek('" + anchorDate + "') "
                                + ") day)";
                        break;
                    case "weekMonSun":
                        toDate = "if(dayofweek('" + anchorDate + "') = 1, " +
                                "date_add('" + anchorDate + "', interval (7 - dayofweek('" + anchorDate
                                + "') + 1 - 7) day), " +
                                "date_add('" + anchorDate + "', interval (7 - dayofweek('" + anchorDate
                                + "') + 1) day))";
                        break;
                    case "calendarMonth":
                        toNum = 1;
                        toDate = "date_sub(date_format(date_add('" + anchorDate + "', interval " + toNum
                                + " month), \"%Y-%m-01\"), interval 1 day)";
                        break;
                    case "calendarYear":
                        toNum = 1;
                        toDate = "date_sub(date_format(date_add('" + anchorDate + "', interval " + toNum
                                + " year), \"%Y-01-01\"), interval 1 day)";
                        break;

                    default:
                        break;
                }
            }
            if (toConditions.get(0).equals("next")) {
                switch (toType) {
                    case "day":
                        toDate = "date_add('" + anchorDate + "' , interval " + toNum + " day)";
                        break;
                    case "rollingWeek":
                            toDate = "date_add('" + anchorDate + "' , interval " + toNum + " week)";
                        break;
                    case "rollingMonth":
                        toDate = "date_add('" + anchorDate + "' , interval " + toNum + " month)";
                        break;
                    case "rollingYear":
                        toDate = "date_add('" + anchorDate + "' , interval " + toNum + " year)";
                        break;
                    case "weekSunSat":
                        toNum = toNum * 7;
                        toDate = "date_add('" + anchorDate + "', interval (7 - dayofweek('" + anchorDate + "') + "
                                + toNum
                                + ") day)";
                        break;
                    case "weekMonSun":
                        toNum = toNum * 7 + 1;
                        toDate = "if(dayofweek('" + anchorDate + "') = 1, " +
                                "date_add('" + anchorDate + "', interval (7 - dayofweek('" + anchorDate + "') + "
                                + toNum
                                + " - 7) day), " +
                                "date_add('" + anchorDate + "', interval (7 - dayofweek('" + anchorDate + "') + "
                                + toNum
                                + ") day))";
                        break;
                    case "calendarMonth":
                        toNum = toNum + 1;
                        toDate = "date_sub(date_format(date_add('" + anchorDate + "', interval " + toNum
                                + " month), \"%Y-%m-01\"), interval 1 day)";
                        break;
                    case "calendarYear":
                        toNum = toNum + 1;
                        toDate = "date_sub(date_format(date_add('" + anchorDate + "', interval " + toNum
                                + " year), \"%Y-01-01\"), interval 1 day)";
                        break;
                    default:
                        break;
                }
            }
            // finalQuery to get date

            String finalQuery = "SELECT DATE(" + fromDate + ") as fromdate, DATE(" + toDate + ") as todate";

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

        String databaseName = table.getDatabase();

        String anchorDate = relativeFilter.getAnchorDate();

        // pattern checker of specific date
        Pattern pattern = Pattern.compile("\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])");
        Matcher matcher = pattern.matcher(anchorDate);

        // Query
        if (List.of("today", "tomorrow", "yesterday", "latest").contains(anchorDate)) {
            if (anchorDate.equals("today")) {
                query = "select curdate() as anchorDate";
            } else if (anchorDate.equals("tomorrow")) {
                query = "select date_add(curdate(), interval 1 day) as anchorDate";
            } else if (anchorDate.equals("yesterday")) {
                query = "select date_sub(curdate(), interval 1 day) as anchorDate";
            } else if (anchorDate.equals("latest")) {
                query = "select DATE(max(" + relativeFilter.getFilterTable().get(0).getFieldName() + ")) as anchorDate from "
                        +
                        databaseName + "." + tableName;
            }
        } else if (matcher.matches()) {
            query = "select 1 as anchorDate";
        } else {
            throw new BadRequestException("Invalid anchor date");
        }

        return query;

    }

}
