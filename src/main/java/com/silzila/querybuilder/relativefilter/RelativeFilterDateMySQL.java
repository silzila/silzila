package com.silzila.querybuilder.relativefilter;

import java.sql.SQLException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.validation.Valid;

import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;

import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.RelativeFilterRequest;
import com.silzila.payload.request.Table;

public class RelativeFilterDateMySQL {

    @Autowired
    RelativeFilterDateValidationUtils validation;

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
                        fromDate = "DATE_SUB('" + anchorDate + "' , INTERVAL " + fromNum + " DAY)";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum + 1;
                        fromDate = "DATE_ADD(DATE_SUB('" + anchorDate + "' , INTERVAL " + fromNum
                                + " WEEK), INTERVAL 1 DAY)";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum + 1;
                        fromDate = "DATE_ADD(DATE_SUB('" + anchorDate + "' , INTERVAL " + fromNum
                                + " MONTH), INTERVAL 1 DAY)";
                        break;
                    case "rollingYear":
                        fromNum = fromNum + 1;
                        fromDate = "DATE_ADD(DATE_SUB('" + anchorDate + "' , INTERVAL " + fromNum
                                + " YEAR), INTERVAL 1 DAY)";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 1;
                        fromDate = "DATE_SUB('" + anchorDate + "', INTERVAL (DAYOFWEEK('" + anchorDate + "') + "
                                + fromNum
                                + ") DAY)";
                        break;
                    case "weekMonSun":
                        fromNum = (fromNum * 7) - 2;
                        fromDate = "IF(DAYOFWEEK('" + anchorDate + "') = 1, "
                                + "DATE_SUB('" + anchorDate + "', INTERVAL (DAYOFWEEK('" + anchorDate + "') + "
                                + fromNum + " + 7) DAY), "
                                + "DATE_SUB('" + anchorDate + "', INTERVAL (DAYOFWEEK('" + anchorDate + "') + "
                                + fromNum + ") DAY))";
                        break;
                    case "month":
                        fromDate = "DATE_FORMAT(DATE_SUB('" + anchorDate + "', INTERVAL " + fromNum
                                + " MONTH), \"%Y-%m-01\")";
                        break;
                    case "year":
                        fromDate = "DATE_FORMAT(DATE_SUB('" + anchorDate + "', INTERVAL " + fromNum
                                + " YEAR), \"%Y-01-01\")";
                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("current")) {
                switch (fromType) {
                    case "day":
                        fromNum = 0;
                        fromDate = "DATE_SUB('" + anchorDate + "' , INTERVAL " + fromNum + " DAY)";
                        break;
                    case "rollingWeek":
                        fromNum = 1;
                        fromDate = "DATE_ADD(DATE_SUB('" + anchorDate + "' , INTERVAL " + fromNum
                                + " WEEK), INTERVAL 1 DAY)";
                        break;
                    case "rollingMonth":
                        fromNum = 1;
                        fromDate = "DATE_ADD(DATE_SUB('" + anchorDate + "' , INTERVAL " + fromNum
                                + " MONTH), INTERVAL 1 DAY)";
                        break;
                    case "rollingYear":
                        fromNum = 1;
                        fromDate = "DATE_ADD(DATE_SUB('" + anchorDate + "' , INTERVAL " + fromNum
                                + " YEAR), INTERVAL 1 DAY)";
                        break;
                    case "weekSunSat":
                        fromDate = "DATE_SUB('" + anchorDate + "', INTERVAL (DAYOFWEEK('" + anchorDate + "') - 1) DAY)";
                        break;
                    case "weekMonSun":
                        fromDate = "IF(DAYOFWEEK('" + anchorDate + "') = 1, " +
                                "DATE_SUB('" + anchorDate + "', INTERVAL (DAYOFWEEK('" + anchorDate
                                + "') - 2 + 7) DAY), " +
                                "DATE_SUB('" + anchorDate + "', INTERVAL (DAYOFWEEK('" + anchorDate + "') - 2) DAY))";
                        break;
                    case "month":
                        fromNum = 0;
                        fromDate = "DATE_FORMAT(DATE_SUB('" + anchorDate + "', INTERVAL " + fromNum
                                + " MONTH), \"%Y-%m-01\")";
                        break;
                    case "year":
                        fromNum = 0;
                        fromDate = "DATE_FORMAT(DATE_SUB('" + anchorDate + "', INTERVAL " + fromNum
                                + " YEAR), \"%Y-01-01\")";
                        break;
                    default:
                        break;
                }

            }
            if (fromConditions.get(0).equals("next")) {
                switch (fromType) {
                    case "day":
                        fromDate = "DATE_ADD('" + anchorDate + "' , INTERVAL " + fromNum + " DAY)";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum - 1;
                        fromDate = "DATE_ADD(DATE_ADD('" + anchorDate + "' , INTERVAL " + fromNum
                                + " WEEK), INTERVAL 1 DAY)";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum - 1;
                        fromDate = "DATE_ADD(DATE_ADD('" + anchorDate + "' , INTERVAL " + fromNum
                                + " MONTH), INTERVAL 1 DAY)";
                        break;
                    case "rollingYear":
                        fromNum = fromNum - 1;
                        fromDate = "DATE_ADD(DATE_ADD('" + anchorDate + "' , INTERVAL " + fromNum
                                + " YEAR), INTERVAL 1 DAY)";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 6;
                        fromDate = "DATE_ADD('" + anchorDate + "', INTERVAL (7 - DAYOFWEEK('" + anchorDate + "') + "
                                + fromNum
                                + ") DAY)";
                        break;
                    case "weekMonSun":
                        fromNum = 1 + (fromNum * 7) - 6;
                        fromDate = "IF(DAYOFWEEK('" + anchorDate + "') = 1, " +
                                "DATE_ADD('" + anchorDate + "', INTERVAL (7 - DAYOFWEEK('" + anchorDate + "') + "
                                + fromNum + ") - 7 DAY), " +
                                "DATE_ADD('" + anchorDate + "', INTERVAL (7 - DAYOFWEEK('" + anchorDate + "') + "
                                + fromNum + ") DAY))";
                        break;
                    case "month":
                        fromDate = "DATE_FORMAT(DATE_ADD('" + anchorDate + "', INTERVAL " + fromNum
                                + " MONTH), \"%Y-%m-01\")";
                        break;
                    case "year":
                        fromDate = "DATE_FORMAT(DATE_ADD('" + anchorDate + "', INTERVAL " + fromNum
                                + " YEAR), \"%Y-01-01\")";
                        break;
                    default:
                        break;
                }

            }

            if (toConditions.get(0).equals("last")) {

                switch (toType) {
                    case "day":
                        toDate = "DATE_SUB('" + anchorDate + "' , INTERVAL " + toNum + " DAY)";
                        break;
                    case "rollingWeek":
                        toDate = "DATE_SUB('" + anchorDate + "' , INTERVAL " + toNum
                                + " WEEK)";
                        break;
                    case "rollingMonth":
                        toDate = "DATE_SUB('" + anchorDate + "' , INTERVAL " + toNum
                                + " MONTH)";
                        break;
                    case "rollingYear":
                        toDate = "DATE_SUB('" + anchorDate + "' , INTERVAL " + toNum
                                + " YEAR)";
                        break;
                    case "weekSunSat":
                        toNum = (toNum * 7) - 1 - 6;
                        toDate = "DATE_SUB('" + anchorDate + "', INTERVAL (DAYOFWEEK('" + anchorDate + "') + "
                                + toNum
                                + ") DAY)";
                        break;
                    case "weekMonSun":
                        toNum = (toNum * 7) - 2 - 6;
                        toDate = "IF(DAYOFWEEK('" + anchorDate + "') = 1, " +
                                "DATE_SUB('" + anchorDate + "', INTERVAL (DAYOFWEEK('" + anchorDate + "') + "
                                + toNum
                                + " + 7) DAY), " +
                                "DATE_SUB('" + anchorDate + "', INTERVAL (DAYOFWEEK('" + anchorDate + "') + "
                                + toNum
                                + ") DAY))";
                        break;
                    case "month":
                        toNum = toNum - 1;
                        toDate = "DATE_SUB(DATE_FORMAT(DATE_SUB('" + anchorDate + "', INTERVAL " + toNum
                                + " MONTH), \"%Y-%m-01\"), INTERVAL 1 DAY)";
                        break;
                    case "year":
                        toNum = toNum - 1;
                        toDate = "DATE_SUB(DATE_FORMAT(DATE_SUB('" + anchorDate + "', INTERVAL " + toNum
                                + " YEAR), \"%Y-01-01\"), INTERVAL 1 DAY)";
                        break;
                    default:
                        break;
                }

            }

            if (toConditions.get(0).equals("current")) {
                switch (toType) {
                    case "day":
                        toNum = 0;
                        toDate = "DATE_ADD('" + anchorDate + "' , INTERVAL " + toNum + " DAY)";
                        break;
                    case "rollingWeek":
                        toNum = 0;
                        toDate = "DATE_ADD('" + anchorDate + "' , INTERVAL " + toNum + " DAY)";
                        break;
                    case "rollingMonth":
                        toNum = 0;
                        toDate = "DATE_ADD('" + anchorDate + "' , INTERVAL " + toNum + " DAY)";
                        break;
                    case "rollingYear":
                        toNum = 0;
                        toDate = "DATE_ADD('" + anchorDate + "' , INTERVAL " + toNum + " DAY)";
                        break;
                    case "weekSunSat":
                        toDate = "DATE_ADD('" + anchorDate + "', INTERVAL (7 - DAYOFWEEK('" + anchorDate + "') "
                                + ") DAY)";
                        break;
                    case "weekMonSun":
                        toDate = "IF(DAYOFWEEK('" + anchorDate + "') = 1, " +
                                "DATE_ADD('" + anchorDate + "', INTERVAL (7 - DAYOFWEEK('" + anchorDate
                                + "') + 1 - 7) DAY), " +
                                "DATE_ADD('" + anchorDate + "', INTERVAL (7 - DAYOFWEEK('" + anchorDate
                                + "') + 1) DAY))";
                        break;
                    case "month":
                        toNum = 1;
                        toDate = "DATE_SUB(DATE_FORMAT(DATE_ADD('" + anchorDate + "', INTERVAL " + toNum
                                + " MONTH), \"%Y-%m-01\"), INTERVAL 1 DAY)";
                        break;
                    case "year":
                        toNum = 1;
                        toDate = "DATE_SUB(DATE_FORMAT(DATE_ADD('" + anchorDate + "', INTERVAL " + toNum
                                + " YEAR), \"%Y-01-01\"), INTERVAL 1 DAY)";
                        break;
                    default:
                        break;
                }

            }
            if (toConditions.get(0).equals("next")) {
                switch (toType) {
                    case "day":
                        toDate = "DATE_ADD('" + anchorDate + "' , INTERVAL " + toNum + " DAY)";
                        break;
                    case "rollingWeek":
                        toDate = "DATE_ADD('" + anchorDate + "' , INTERVAL " + toNum + " WEEK)";
                        break;
                    case "rollingMonth":
                        toDate = "DATE_ADD('" + anchorDate + "' , INTERVAL " + toNum + " MONTH)";
                        break;
                    case "rollingYear":
                        toDate = "DATE_ADD('" + anchorDate + "' , INTERVAL " + toNum + " YEAR)";
                        break;
                    case "weekSunSat":
                        toNum = toNum * 7;
                        toDate = "DATE_ADD('" + anchorDate + "', INTERVAL (7 - DAYOFWEEK('" + anchorDate + "') + "
                                + toNum
                                + ") DAY)";
                        break;
                    case "weekMonSun":
                        toNum = toNum * 7 + 1;
                        toDate = "IF(DAYOFWEEK('" + anchorDate + "') = 1, " +
                                "DATE_ADD('" + anchorDate + "', INTERVAL (7 - DAYOFWEEK('" + anchorDate + "') + "
                                + toNum
                                + " - 7) DAY), " +
                                "DATE_ADD('" + anchorDate + "', INTERVAL (7 - DAYOFWEEK('" + anchorDate + "') + "
                                + toNum
                                + ") DAY))";
                        break;
                    case "month":
                        toNum = toNum + 1;
                        toDate = "DATE_SUB(DATE_FORMAT(DATE_ADD('" + anchorDate + "', INTERVAL " + toNum
                                + " MONTH), \"%Y-%m-01\"), INTERVAL 1 DAY)";
                        break;
                    case "year":
                        toNum = toNum + 1;
                        toDate = "DATE_SUB(DATE_FORMAT(DATE_ADD('" + anchorDate + "', INTERVAL " + toNum
                                + " YEAR), \"%Y-01-01\"), INTERVAL 1 DAY)";
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
        if (List.of("today", "tomorrow", "yesterday", "columnMaxDate").contains(anchorDate)) {
            if (anchorDate.equals("today")) {
                query = "SELECT CURDATE() AS anchordate";
            } else if (anchorDate.equals("tomorrow")) {
                query = "SELECT DATE_ADD(CURDATE(), INTERVAL 1 DAY) AS anchordate";
            } else if (anchorDate.equals("yesterday")) {
                query = "SELECT DATE_SUB(CURDATE(), INTERVAL 1 DAY) AS anchordate";
            } else if (anchorDate.equals("columnMaxDate")) {
                query = "SELECT DATE(MAX(" + relativeFilter.getFilterTable().getFieldName()
                        + ")) AS anchordate FROM "
                        +
                        databaseName + "." + tableName;
            }
        } else if (matcher.matches()) {
            query = "SELECT 1 AS anchordate";
        } else {
            throw new BadRequestException("Invalid anchor date");
        }

        return query;

    }

}
