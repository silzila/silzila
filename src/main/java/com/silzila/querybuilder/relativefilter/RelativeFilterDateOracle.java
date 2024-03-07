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

public class RelativeFilterDateOracle {
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
        String tableDataType = relativeFilter.getFilterTable().get(0).getDataType().name();

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
                        fromDate = "DATE '" + anchorDate + "' -" + fromNum;
                        break;
                    case "rollingWeek":
                        fromNum = (fromNum * 7) + 6;
                        fromDate = "DATE '" + anchorDate + "' -" + fromNum;
                        break;
                    case "rollingMonth":
                        fromNum = fromNum + 1;
                        fromDate = "ADD_MONTHS(DATE '" + anchorDate + "', -" + fromNum + " ) +1 ";
                        break;
                    case "rollingYear":
                        fromNum = (fromNum * 12) + 12;
                        fromDate = "ADD_MONTHS(DATE '" + anchorDate + "', -" + fromNum + " ) +1 ";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 1;
                        fromDate = "DATE '" + anchorDate + "' - (TO_CHAR(DATE '" + anchorDate + "', 'D') + "
                                + fromNum
                                + ")";
                        break;
                    case "weekMonSun":
                        fromNum = (fromNum * 7) - 2;
                        fromDate = "CASE WHEN TO_CHAR(DATE '" + anchorDate + "','D') = '1' "
                                + "THEN DATE '" + anchorDate + "' - (TO_CHAR(DATE '" + anchorDate + "', 'D') + "
                                + fromNum
                                + " +7 ) "
                                + " ELSE DATE '" + anchorDate + "' - (TO_CHAR(DATE '" + anchorDate + "', 'D') + "
                                + fromNum
                                + ") END";
                        break;
                    case "month":
                        fromDate = "TRUNC(ADD_MONTHS(DATE '" + anchorDate + "', -" + fromNum + " ),'MM')";
                        break;
                    case "year":
                        fromNum = fromNum * 12;
                        fromDate = "TRUNC(ADD_MONTHS(DATE '" + anchorDate + "', -" + fromNum + " ),'YYYY')";
                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("current")) {
                switch (fromType) {
                    case "day":
                        fromNum = 0;
                        fromDate = "DATE '" + anchorDate + "' -" + fromNum;
                        break;
                    case "rollingWeek":
                        fromNum = 6;
                        fromDate = "DATE '" + anchorDate + "' -" + fromNum;
                        break;
                    case "rollingMonth":
                        fromNum = 1;
                        fromDate = "ADD_MONTHS(DATE '" + anchorDate + "', -" + fromNum + " ) +1 ";
                        break;
                    case "rollingYear":
                        fromNum = 12;
                        fromDate = "ADD_MONTHS(DATE '" + anchorDate + "', -" + fromNum + " ) +1 ";
                        break;
                    case "weekSunSat":
                        fromDate = "DATE '" + anchorDate + "' - (TO_CHAR(DATE '" + anchorDate + "', 'D') - 1)";
                        break;
                    case "weekMonSun":
                        fromDate = "CASE WHEN TO_CHAR(DATE '" + anchorDate + "','D') = '1' "
                                + "THEN DATE '" + anchorDate + "' - (TO_CHAR(DATE '" + anchorDate + "', 'D') -2 +7 ) "

                                + " ELSE DATE '" + anchorDate + "' - (TO_CHAR(DATE '" + anchorDate + "', 'D') -2) END ";

                        break;
                    case "month":
                        fromNum = 0;
                        fromDate = "TRUNC(ADD_MONTHS(DATE '" + anchorDate + "', -" + fromNum + " ),'MM')";
                        break;
                    case "year":
                        fromNum = 0;
                        fromDate = "TRUNC(ADD_MONTHS(DATE '" + anchorDate + "', -" + fromNum + " ),'YYYY')";
                        break;
                    default:
                        break;
                }

            }
            if (fromConditions.get(0).equals("next")) {
                switch (fromType) {
                    case "day":
                        fromDate = "DATE '" + anchorDate + "' +" + fromNum;
                        break;
                    case "rollingWeek":
                        fromNum = (fromNum * 7) - 6;
                        fromDate = "DATE '" + anchorDate + "' +" + fromNum;
                        break;
                    case "rollingMonth":
                        fromNum = fromNum - 1;
                        fromDate = "ADD_MONTHS(DATE '" + anchorDate + "', +" + fromNum + " ) +1 ";
                        break;
                    case "rollingYear":
                        fromNum = (fromNum * 12) - 12;
                        fromDate = "ADD_MONTHS(DATE '" + anchorDate + "', +" + fromNum + " ) +1 ";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 6;
                        fromDate = "DATE '" + anchorDate + "' + ((7 - TO_CHAR(DATE '" + anchorDate + "', 'D')) + "
                                + fromNum
                                + ")";
                        break;
                    case "weekMonSun":
                        fromNum = 1 + (fromNum * 7) - 6;
                        fromDate = "CASE WHEN TO_CHAR(DATE '" + anchorDate + "','D') = '1' "
                                + "THEN DATE '" + anchorDate + "' + (( 7 - TO_CHAR(DATE '" + anchorDate + "', 'D')) + "
                                + fromNum
                                + " - 7 ) "
                                + " ELSE DATE '" + anchorDate + "' + ((7 - TO_CHAR(DATE '" + anchorDate + "', 'D')) + "
                                + fromNum
                                + ") END";
                        break;
                    case "month":
                        fromDate = "TRUNC(ADD_MONTHS(DATE '" + anchorDate + "', +" + fromNum + " ),'MM')";
                        break;
                    case "year":
                        fromNum = fromNum * 12;
                        fromDate = "TRUNC(ADD_MONTHS(DATE '" + anchorDate + "', +" + fromNum + " ),'YYYY')";
                        break;
                    default:
                        break;
                }

            }

            if (toConditions.get(0).equals("last")) {

                switch (toType) {
                    case "day":
                        toDate = "DATE '" + anchorDate + "' -" + toNum;
                        break;
                    case "rollingWeek":
                        toNum = toNum * 7;
                        toDate = "DATE '" + anchorDate + "' -" + toNum;
                        break;
                    case "rollingMonth":
                        toDate = "ADD_MONTHS(DATE '" + anchorDate + "', -" + toNum + " ) ";
                        break;
                    case "rollingYear":
                        toNum = toNum * 12;
                        toDate = "ADD_MONTHS(DATE '" + anchorDate + "', -" + toNum + " ) ";
                        break;
                    case "weekSunSat":
                        toNum = (toNum * 7) - 1 - 6;
                        toDate = "DATE '" + anchorDate + "' - (TO_CHAR(DATE '" + anchorDate + "', 'D') + "
                                + toNum
                                + ")";
                        break;
                    case "weekMonSun":
                        toNum = (toNum * 7) - 2 - 6;
                        toDate = "CASE WHEN TO_CHAR(DATE '" + anchorDate + "','D') = '1' "
                                + "THEN DATE '" + anchorDate + "' - (TO_CHAR(DATE '" + anchorDate + "', 'D') + "
                                + toNum
                                + " +7 ) "
                                + " ELSE DATE '" + anchorDate + "' - (TO_CHAR(DATE '" + anchorDate + "', 'D') + "
                                + toNum
                                + ") END";
                        break;
                    case "month":
                        toNum = toNum - 1;
                        toDate = "TRUNC(ADD_MONTHS(DATE '" + anchorDate + "', -" + toNum + " ),'MM') -1 ";
                        break;
                    case "year":
                        toNum = (toNum * 12) - 12;
                        toDate = "TRUNC(ADD_MONTHS(DATE '" + anchorDate + "', -" + toNum + " ),'YYYY') -1 ";
                        break;
                    default:
                        break;
                }

            }

            if (toConditions.get(0).equals("current")) {
                switch (toType) {
                    case "day":
                        toNum = 0;
                        toDate = "DATE '" + anchorDate + "' -" + toNum;
                        break;
                    case "rollingWeek":
                        toNum = 0;
                        toDate = "DATE '" + anchorDate + "' -" + toNum;
                        break;
                    case "rollingMonth":
                        toNum = 0;
                        toDate = "ADD_MONTHS(DATE '" + anchorDate + "', -" + toNum + " ) ";
                        break;
                    case "rollingYear":
                        toNum = 0;
                        toDate = "ADD_MONTHS(DATE '" + anchorDate + "', -" + toNum + " ) ";
                        break;
                    case "weekSunSat":
                        toDate = "DATE '" + anchorDate + "' + (7 - TO_CHAR(DATE '" + anchorDate + "', 'D'))";
                        break;
                    case "weekMonSun":
                        toDate = "CASE WHEN TO_CHAR(DATE '" + anchorDate + "','D') = '1' "
                                + "THEN DATE '" + anchorDate + "' + ((7 - TO_CHAR(DATE '" + anchorDate
                                + "', 'D')) +1 -7 ) "

                                + " ELSE DATE '" + anchorDate + "' + ((7 - TO_CHAR(DATE '" + anchorDate
                                + "', 'D')) +1) END ";
                        break;
                    case "month":
                        toNum = 1;
                        toDate = "TRUNC(ADD_MONTHS(DATE '" + anchorDate + "', +" + toNum + " ),'MM') -1 ";
                        break;
                    case "year":
                        toNum = 12;
                        toDate = "TRUNC(ADD_MONTHS(DATE '" + anchorDate + "', +" + toNum + " ),'YYYY') -1 ";
                        break;
                    default:
                        break;
                }

            }
            if (toConditions.get(0).equals("next")) {
                switch (toType) {
                    case "day":
                        toDate = "DATE '" + anchorDate + "' +" + toNum;
                        break;
                    case "rollingWeek":
                        toNum = toNum * 7;
                        toDate = "DATE '" + anchorDate + "' +" + toNum;
                        break;
                    case "rollingMonth":
                        toDate = "ADD_MONTHS(DATE '" + anchorDate + "', +" + toNum + " ) ";
                        break;
                    case "rollingYear":
                        toNum = toNum * 12;
                        toDate = "ADD_MONTHS(DATE '" + anchorDate + "', +" + toNum + " ) ";
                        break;
                    case "weekSunSat":
                        toNum = toNum * 7;
                        toDate = "DATE '" + anchorDate + "' + ((7 - TO_CHAR(DATE '" + anchorDate + "', 'D')) + "
                                + toNum
                                + ")";
                        break;
                    case "weekMonSun":
                        toNum = toNum * 7 + 1;
                        toDate = "CASE WHEN TO_CHAR(DATE '" + anchorDate + "','D') = '1' "
                                + "THEN DATE '" + anchorDate + "' + (( 7 - TO_CHAR(DATE '" + anchorDate + "', 'D')) + "
                                + toNum
                                + " - 7 ) "
                                + " ELSE DATE '" + anchorDate + "' + ((7 - TO_CHAR(DATE '" + anchorDate + "', 'D')) + "
                                + toNum
                                + ") END";
                        break;
                    case "month":
                        toNum = toNum + 1;
                        toDate = "TRUNC(ADD_MONTHS(DATE '" + anchorDate + "', +" + toNum + " ),'MM') -1 ";
                        break;
                    case "year":
                        toNum = (toNum * 12) + 12;
                        toDate = "TRUNC(ADD_MONTHS(DATE '" + anchorDate + "', +" + toNum + " ),'YYYY') -1 ";
                        break;
                    default:
                        break;
                }

            }
            // finalQuery to get date

            String finalQuery = "SELECT TO_CHAR(" + fromDate + " , 'YYYY-MM-DD' ) as \"fromdate\", TO_CHAR(" + toDate
                    + " , 'YYYY-MM-DD' ) as \"todate\" FROM DUAL";

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
        Pattern pattern = Pattern.compile("\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])");
        Matcher matcher = pattern.matcher(anchorDate);

        // Query
        if (List.of("today", "tomorrow", "yesterday", "columnMaxDate").contains(anchorDate)) {
            if (anchorDate.equals("today")) {
                query = "SELECT TO_CHAR(TRUNC(SYSDATE),'YYYY-MM-DD') AS \"anchordate\" FROM DUAL";
            } else if (anchorDate.equals("tomorrow")) {
                query = "SELECT TO_CHAR(TRUNC(SYSDATE + 1),'YYYY-MM-DD') AS \"anchordate\" FROM DUAL";
            } else if (anchorDate.equals("yesterday")) {
                query = "SELECT TO_CHAR(TRUNC(SYSDATE - 1),'YYYY-MM-DD') AS \"anchordate\" FROM DUAL";
            } else if (anchorDate.equals("columnMaxDate")) {
                query = "SELECT TO_CHAR(TRUNC(MAX(" + relativeFilter.getFilterTable().get(0).getFieldName()
                        + ")),'YYYY-MM-DD') AS \"anchordate\" FROM "
                        +
                        schemaName + "." + tableName;
            }
        } else if (matcher.matches()) {
            query = "SELECT 1 AS \"anchordate\" FROM DUAL";
        } else {
            throw new BadRequestException("Invalid anchor date");
        }

        return query;

    }
}
