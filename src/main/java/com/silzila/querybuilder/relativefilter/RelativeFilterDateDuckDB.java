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

public class RelativeFilterDateDuckDB {
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
                        fromNum = -fromNum;
                        fromDate = "date_add(DATE '" + anchorDate + "' ," + fromNum + ")";
                        break;
                    case "rollingWeek":
                        fromNum = -((fromNum * 7) + 7);
                        fromDate = "date_add(CAST(date_add(DATE '" + anchorDate + "' ," + fromNum + " ) as DATE),1)";
                        break;
                    case "rollingMonth":
                        fromNum = -(fromNum + 1);
                        fromDate = "date_add(CAST(date_add(DATE '" + anchorDate + "' , interval (" + fromNum
                                + ") month) as DATE),1)";
                        break;
                    case "rollingYear":
                        fromNum = -(fromNum + 1);
                        fromDate = "date_add(CAST(date_add(DATE '" + anchorDate + "' , interval (" + fromNum
                                + ") year) as DATE),1)";
                        break;
                    case "weekSunSat":
                        fromNum = -((fromNum * 7));
                        fromDate = "date_add(DATE '" + anchorDate + "', interval ((dayofweek(DATE '" + anchorDate
                                + "') * -1) + "
                                + fromNum
                                + ") day)";
                        break;
                    case "weekMonSun":
                        fromNum = -((fromNum * 7) - 1);
                        fromDate = "if(dayofweek(DATE'" + anchorDate + "') = 0, "
                                + "date_add(DATE'" + anchorDate + "', interval ((dayofweek(DATE'" + anchorDate
                                + "')*-1) + "
                                + fromNum + " - 7) day), "
                                + "date_add(DATE'" + anchorDate + "', interval (dayofweek(DATE'" + anchorDate
                                + "')*-1 + "
                                + fromNum + ") day))";
                        break;
                    case "calendarMonth":
                        fromNum = -fromNum;
                        fromDate = "date_trunc('month',CAST(date_add(DATE '" + anchorDate + "' , interval (" + fromNum
                                + ") month) as DATE))";
                        break;
                    case "calendarYear":
                        fromNum = -fromNum;
                        fromDate = "date_trunc('year',CAST(date_add(DATE '" + anchorDate + "' , interval (" + fromNum
                                + ") year) as DATE))";
                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("current")) {
                switch (fromType) {
                    case "day":
                        fromNum = 0;
                        fromDate = "date_add(DATE '" + anchorDate + "' ," + fromNum + ")";
                        break;
                    case "rollingWeek":
                        fromNum = -7;
                        fromDate = "date_add(CAST(date_add(DATE '" + anchorDate + "' ," + fromNum + " ) as DATE),1)";
                        break;
                    case "rollingMonth":
                        fromNum = -1;
                        fromDate = "date_add(CAST(date_add(DATE '" + anchorDate + "' , interval (" + fromNum
                                + ") month) as DATE),1)";
                        break;
                    case "rollingYear":
                        fromNum = -1;
                        fromDate = "date_add(CAST(date_add(DATE '" + anchorDate + "' , interval (" + fromNum
                                + ") year) as DATE),1)";
                        break;
                    case "weekSunSat":
                        fromNum = 0;
                        fromDate = "date_add(DATE '" + anchorDate + "', interval ((dayofweek(DATE '" + anchorDate
                                + "') * -1) + "
                                + fromNum
                                + ") day)";
                        break;
                    case "weekMonSun":
                        fromNum = 1;
                        fromDate = "if(dayofweek(DATE'" + anchorDate + "') = 0, "
                                + "date_add(DATE'" + anchorDate + "', interval ((dayofweek(DATE'" + anchorDate
                                + "')*-1) + "
                                + fromNum + " - 7) day), "
                                + "date_add(DATE'" + anchorDate + "', interval (dayofweek(DATE'" + anchorDate
                                + "')*-1 + "
                                + fromNum + ") day))";
                        break;
                    case "calendarMonth":
                        fromNum = 0;
                        fromDate = "date_trunc('month',CAST(date_add(DATE '" + anchorDate + "' , interval (" + fromNum
                                + ") month) as DATE))";
                        break;
                    case "calendarYear":
                        fromNum = 0;
                        fromDate = "date_trunc('year',CAST(date_add(DATE '" + anchorDate + "' , interval (" + fromNum
                                + ") year) as DATE))";
                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("next")) {
                switch (fromType) {
                    case "day":
                        fromDate = "date_add(DATE '" + anchorDate + "' ," + fromNum + ")";
                        break;
                    case "rollingWeek":
                        fromNum = ((fromNum * 7) - 7);
                        fromDate = "date_add(CAST(date_add(DATE '" + anchorDate + "' ," + fromNum + " ) as DATE),1)";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum - 1;
                        fromDate = "date_add(CAST(date_add(DATE '" + anchorDate + "' , interval (" + fromNum
                                + ") month) as DATE), 1)";
                        break;
                    case "rollingYear":
                        fromNum = fromNum - 1;
                        fromDate = "date_add(CAST(date_add(DATE '" + anchorDate + "' , interval (" + fromNum
                                + ") year) as DATE), 1)";
                        break;
                    case "weekSunSat":
                        fromNum = ((fromNum * 7) - 7);
                        fromDate = "date_add(DATE '" + anchorDate + "', interval ((7 - dayofweek(DATE '" + anchorDate
                                + "')) + "
                                + fromNum
                                + ") day)";
                        break;
                    case "weekMonSun":
                        fromNum = ((fromNum * 7) - 6);
                        fromDate = "if(dayofweek(DATE'" + anchorDate + "') = 0, "
                                + "date_add(DATE'" + anchorDate + "', interval ((7 - dayofweek(DATE'" + anchorDate
                                + "')) + "
                                + fromNum + " - 7) day), "
                                + "date_add(DATE'" + anchorDate + "', interval (7 - dayofweek(DATE'" + anchorDate
                                + "') + "
                                + fromNum + ") day))";
                        break;
                    case "calendarMonth":
                        fromDate = "date_trunc('month',CAST(date_add(DATE '" + anchorDate + "' , interval (" + fromNum
                                + ") month) as DATE))";
                        break;
                    case "calendarYear":
                        fromDate = "date_trunc('year',CAST(date_add(DATE '" + anchorDate + "' , interval (" + fromNum
                                + ") year) as DATE))";
                        break;

                    default:
                        break;
                }
            }

            if (toConditions.get(0).equals("last")) {

                switch (toType) {
                    case "day":
                        toNum = -toNum;
                        toDate = "date_add(DATE '" + anchorDate + "' ," + toNum + ")";
                        break;
                    case "rollingWeek":
                        toNum = -((toNum * 7));
                        toDate = "date_add(DATE '" + anchorDate + "' ," + toNum + " )";
                        break;
                    case "rollingMonth":
                        toNum = -toNum;
                        toDate = "date_add(DATE '" + anchorDate + "' , interval (" + toNum
                                + ") month)";
                        break;
                    case "rollingYear":
                        toNum = -toNum;
                        toDate = "date_add(DATE '" + anchorDate + "' , interval (" + toNum
                                + ") year)";
                        break;
                    case "weekSunSat":
                        toNum = -((toNum * 7) -6);
                        toDate = "date_add(DATE '" + anchorDate + "', interval ((dayofweek(DATE '" + anchorDate
                                + "') * -1) + "
                                + toNum
                                + ") day)";
                        break;
                    case "weekMonSun":
                        toNum = -((toNum * 7) - 7);
                        toDate = "if(dayofweek(DATE'" + anchorDate + "') = 0, "
                                + "date_add(DATE'" + anchorDate + "', interval ((dayofweek(DATE'" + anchorDate
                                + "')*-1) + "
                                + toNum + " - 7) day), "
                                + "date_add(DATE'" + anchorDate + "', interval (dayofweek(DATE'" + anchorDate
                                + "')*-1 + "
                                + toNum + ") day))";
                        break;
                    case "calendarMonth":
                        toNum = -toNum;
                        toDate = "last_day(CAST(date_add(DATE '" + anchorDate + "' , interval (" + toNum
                                + ") month) as DATE))";
                        break;
                    case "calendarYear":
                        toNum = -(toNum -1);
                        toDate = "date_add(date_trunc('year',CAST(date_add(DATE '" + anchorDate + "' , interval (" + toNum
                                + ") year) as DATE)),-1)";
                        break;

                    default:
                        break;
                }
            }

            if (toConditions.get(0).equals("current")) {
                switch (toType) {
                    case "day":
                        toNum = 0;
                        toDate = "date_add(DATE '" + anchorDate + "' ," + toNum + ")";
                        break;
                    case "rollingWeek":
                        toNum = 0;
                        toDate = "date_add(DATE '" + anchorDate + "' , interval " + toNum + " day)";
                        break;
                    case "rollingMonth":
                        toNum = 0;
                        toDate = "date_add(DATE '" + anchorDate + "' , interval " + toNum + " day)";
                        break;
                    case "rollingYear":
                        toNum = 0;
                        toDate = "date_add(DATE '" + anchorDate + "' , interval " + toNum + " day)";
                        break;
                    case "weekSunSat":
                        toNum = -1;
                        toDate = "date_add(DATE '" + anchorDate + "', interval ((7-dayofweek(DATE '" + anchorDate
                                + "')) + "
                                + toNum
                                + ") day)";
                        break;
                    case "weekMonSun":
                        toNum = 0;
                        toDate = "if(dayofweek(DATE'" + anchorDate + "') = 0, "
                                + "date_add(DATE'" + anchorDate + "', interval ((7-dayofweek(DATE'" + anchorDate
                                + "')) + "
                                + toNum + " - 7) day), "
                                + "date_add(DATE'" + anchorDate + "', interval (7 - dayofweek(DATE'" + anchorDate
                                + "') + "
                                + toNum + ") day))";
                        break;
                    case "calendarMonth":
                        toNum = 0;
                        toDate = "last_day(CAST(date_add(DATE '" + anchorDate + "' , interval (" + toNum
                                + ") month) as DATE))";
                        break;
                    case "calendarYear":
                        toNum = 1;
                        toDate = "date_add(date_trunc('year',CAST(date_add(DATE '" + anchorDate + "' , interval ("
                                + toNum
                                + ") year) as DATE)),-1)";
                        break;

                    default:
                        break;
                }
            }
            if (toConditions.get(0).equals("next")) {
                switch (toType) {
                    case "day":
                        toDate = "date_add(DATE '" + anchorDate + "' ," + toNum + ")";
                        break;
                    case "rollingWeek":
                        toNum = (toNum * 7);
                        toDate = "date_add(DATE '" + anchorDate + "' ," + toNum + " )";
                        if (toNum == 0 && !fromConditions.get(0).equals("next")) {
                            toNum = 0;
                            toDate = "date_add(DATE '" + anchorDate + "' , interval " + toNum + " day)";
                        }
                        break;
                    case "rollingMonth":
                        toDate = "date_add(DATE '" + anchorDate + "' , interval (" + toNum
                                + ") month)";
                        if (toNum == 0 && !fromConditions.get(0).equals("next")) {
                            toNum = 0;
                            toDate = "date_add(DATE '" + anchorDate + "' , interval " + toNum + " day)";
                        }
                        break;
                    case "rollingYear":
                        toDate = "date_add(DATE '" + anchorDate + "' , interval (" + toNum
                                + ") year)";
                        if (toNum == 0 && !fromConditions.get(0).equals("next")) {
                            toNum = 0;
                            toDate = "date_add(DATE '" + anchorDate + "' , interval " + toNum + " day)";
                        }
                        break;
                    case "weekSunSat":
                        toNum = ((toNum * 7) - 7 + 6);
                        toDate = "date_add(DATE '" + anchorDate + "', interval ((7 - dayofweek(DATE '" + anchorDate
                                + "')) + "
                                + toNum
                                + ") day)";
                        break;
                    case "weekMonSun":
                        toNum = ((toNum * 7));
                        toDate = "if(dayofweek(DATE'" + anchorDate + "') = 0, "
                                + "date_add(DATE'" + anchorDate + "', interval ((7 - dayofweek(DATE'" + anchorDate
                                + "')) + "
                                + toNum + " - 7) day), "
                                + "date_add(DATE'" + anchorDate + "', interval (7 - dayofweek(DATE'" + anchorDate
                                + "') + "
                                + toNum + ") day))";
                        break;
                    case "calendarMonth":
                        toDate = "last_day(CAST(date_add(DATE '" + anchorDate + "' , interval (" + toNum
                                + ") month) as DATE))";
                        break;
                    case "calendarYear":
                        toNum = (toNum + 1);
                        toDate = "date_add(date_trunc('year',CAST(date_add(DATE '" + anchorDate + "' , interval ("
                                + toNum
                                + ") year) as DATE)),-1)";
                        break;
                    default:
                        break;
                }
            }
            // finalQuery to get date

            String finalQuery = "SELECT CAST(" + fromDate + " as DATE )as fromdate, CAST( " + toDate
                    + " as DATE )as todate;";

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

        // fromClause
        String fromClause = " FROM vw_" + table.getAlias() + "_" + table.getFlatFileId().substring(0, 8) + " ";

        // Query
        if (List.of("today", "tomorrow", "yesterday", "latest").contains(anchorDate)) {
            if (anchorDate.equals("today")) {
                query = "SELECT CURRENT_DATE() AS anchorDate";
            } else if (anchorDate.equals("tomorrow")) {
                query = "SELECT DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY) AS anchorDate";
            } else if (anchorDate.equals("yesterday")) {
                query = "SELECT DATE_ADD(CURRENT_DATE(), INTERVAL (-1) DAY) AS anchorDate";
            } else if (anchorDate.equals("latest")) {
                query = "SELECT MAX(" + relativeFilter.getFilterTable().get(0).getFieldName() + ") AS anchorDate "
                        + fromClause;
            }
        } else if (matcher.matches()) {
            query = "SELECT 1 AS anchorDate";
        } else {
            throw new BadRequestException("Invalid anchor date");
        }
        return query;

    }
}
