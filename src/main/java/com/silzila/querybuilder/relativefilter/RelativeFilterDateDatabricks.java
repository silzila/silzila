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

public class RelativeFilterDateDatabricks {
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
                        fromDate = "date_sub('" + anchorDate + "' , " + fromNum + ")";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum + 1;
                        fromDate = "date_add(date_sub('" + anchorDate + "' , " + fromNum + " * 7), 1)";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum + 1;
                        fromDate = "date_add(add_months('" + anchorDate + "', -" + fromNum + "), 1)";
                        break;
                    case "rollingYear":
                        fromNum = (fromNum + 1)*12;
                        fromDate = "date_add(add_months('" + anchorDate + "', -" + fromNum + "), 1)";

                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 1;
                        fromDate = "date_sub('" + anchorDate + "', (dayofweek('" + anchorDate + "') + "
                                + fromNum
                                + ") )";
                        break;
                    case "weekMonSun":
                        fromNum = (fromNum * 7) - 2;
                        fromDate = "if(dayofweek('" + anchorDate + "') = 1, " +
                                "date_sub('" + anchorDate + "', (dayofweek('" + anchorDate + "') + " + fromNum
                                + " + 7)), " +
                                "date_sub('" + anchorDate + "', (dayofweek('" + anchorDate + "') + " + fromNum + ")))";
                        break;
                    case "month":
                        fromDate = "date_format(add_months('" + anchorDate + "', -" + fromNum
                                + "), 'yyyy-MM-01')";
                        break;
                    case "year":
                        fromNum = fromNum*12;
                        fromDate = "date_format(add_months('" + anchorDate + "', -" + fromNum+ "), 'yyyy-01-01')";
                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("current")) {
                switch (fromType) {
                    case "day":
                        fromNum = 0;
                        fromDate = "date_sub('" + anchorDate + "', " + fromNum + ")";
                        break;
                    case "rollingWeek":
                        fromNum = 1;
                        fromDate = "date_add(date_sub('" + anchorDate + "', " + fromNum + " * 7), 1)";
                        break;
                    case "rollingMonth":
                        fromNum = 1;
                        fromDate = "date_add(add_months('" + anchorDate + "', -" + fromNum + "), 1)";
                        break;
                    case "rollingYear":
                        fromNum = 12;
                        fromDate = "date_add(add_months('" + anchorDate + "', -" + fromNum + "), 1)";
                        break;
                    case "weekSunSat":

                        fromDate = "date_sub('" + anchorDate + "', (dayofweek('" + anchorDate + "') - 1))";
                        break;
                    case "weekMonSun":

                        fromDate = "IF(dayofweek('" + anchorDate + "') = 1, " +
                                "date_sub('" + anchorDate + "', (dayofweek('" + anchorDate + "') - 2 + 7) ), " +
                                "date_sub('" + anchorDate + "', (dayofweek('" + anchorDate + "') - 2) ))";
                        break;
                    case "month":
                        fromNum = 0;
                        fromDate = "date_format(add_months('" + anchorDate + "', " + fromNum
                                + "), 'yyyy-MM-01')";
                        break;

                    case "year":
                        fromNum = 0;
                        fromDate = "date_format(add_months('" + anchorDate + "', " + fromNum
                                + "), 'yyyy-01-01')";
                        break;
                    default:
                        break;
                }
            }
            if (fromConditions.get(0).equals("next")) {
                switch (fromType) {
                    case "day":
                        fromDate = "date_add('" + anchorDate + "', " + fromNum + ")";
                        break;
                    case "rollingWeek":
                        fromNum = fromNum - 1;
                        fromDate = "date_add(date_add('" + anchorDate + "', " + fromNum + " * 7), 1)";
                        break;
                    case "rollingMonth":
                        fromNum = fromNum - 1;
                        fromDate = "date_add(add_months('" + anchorDate + "', " + fromNum + "), 1)";
                        break;
                    case "rollingYear":
                        fromNum = (fromNum - 1)*12;
                        fromDate = "date_add(add_months('" + anchorDate + "', " + fromNum + "), 1)";
                        break;
                    case "weekSunSat":
                        fromNum = (fromNum * 7) - 6;
                        fromDate = "date_add('" + anchorDate + "', (7 - dayofweek('" + anchorDate + "') + " + fromNum
                                + "))";
                        break;
                    case "weekMonSun":
                        fromNum = 1 + (fromNum * 7) - 6;
                        fromDate = "IF(dayofweek('" + anchorDate + "') = 1, " +
                                "date_add('" + anchorDate + "', (7 - dayofweek('" + anchorDate + "') + " + fromNum
                                + ") - 7), " +
                                "date_add('" + anchorDate + "', 7 - dayofweek('" + anchorDate + "') + " + fromNum
                                + "))";
                        break;
                    case "month":
                        fromDate = "date_format(add_months('" + anchorDate + "', " + fromNum
                                + "), 'yyyy-MM-01')";
                        break;
                    case "year":
                        fromNum = fromNum*12;
                        fromDate = "date_format(add_months('" + anchorDate + "', " + fromNum
                                + "), 'yyyy-01-01')";
                        break;

                    default:
                        break;
                }
            }

            if (toConditions.get(0).equals("last")) {

                switch (toType) {
                    case "day":
                        toDate = "date_sub('" + anchorDate + "', " + toNum + ")";
                        break;
                    case "rollingWeek":
                        toDate = "date_sub('" + anchorDate + "', " + toNum + " * 7)";
                        break;
                    case "rollingMonth":
                        toDate = "add_months('" + anchorDate + "', -" + toNum + ")";
                        break;
                    case "rollingYear":
                        toNum = toNum*12;
                        toDate = "add_months('" + anchorDate + "', -" + toNum + ")";
                        break;
                    case "weekSunSat":
                        toNum = (toNum * 7) - 1 - 6;
                        toDate = "date_sub('" + anchorDate + "', (dayofweek('" + anchorDate + "') + " + toNum + "))";
                        break;
                    case "weekMonSun":
                        toNum = (toNum * 7) - 2 - 6;
                        toDate = "IF(dayofweek('" + anchorDate + "') = 1, " +
                                "date_sub('" + anchorDate + "', (dayofweek('" + anchorDate + "') + " + toNum
                                + " + 7)), " +
                                "date_sub('" + anchorDate + "', (dayofweek('" + anchorDate + "') + " + toNum + ")))";
                        break;
                    case "month":
                        toNum = toNum - 1;
                        toDate = "date_sub(date_format(add_months('" + anchorDate + "', -" + toNum
                                + "), 'yyyy-MM-01'), 1)";
                        break;
                    case "year":
                        toNum = (toNum - 1) * 12;
                        toDate = "date_sub(date_format(add_months('" + anchorDate + "', -" + toNum
                                + "), 'yyyy-01-01'), 1)";
                        break;

                    default:
                        break;
                }
            }

            if (toConditions.get(0).equals("current")) {
                switch (toType) {
                    case "day":
                        toNum = 0;
                        toDate = "date_add('" + anchorDate + "', " + toNum + ")";
                        break;
                    case "rollingWeek":
                        toNum = 0;
                        toDate = "add_months('" + anchorDate + "', " + toNum + ")";
                        break;
                    case "rollingMonth":
                        toNum = 0;
                        toDate = "date_add('" + anchorDate + "', " + toNum + ")";
                        break;
                    case "rollingYear":
                        toNum = 0;
                        toDate = "date_add('" + anchorDate + "', " + toNum + ")";
                        break;
                    case "weekSunSat":
                        toDate = "date_add('" + anchorDate + "', (7 - dayofweek('" + anchorDate + "')))";
                        break;
                    case "weekMonSun":
                        toDate = "IF(dayofweek('" + anchorDate + "') = 1, " +
                                "date_add('" + anchorDate + "', (7 - dayofweek('" + anchorDate + "') + 1 - 7)), " +
                                "date_add('" + anchorDate + "', (7 - dayofweek('" + anchorDate + "') + 1)))";
                        break;
                    case "month":
                        toNum = 1;
                        toDate = "date_sub(date_format(add_months('" + anchorDate + "', " + toNum
                                + "), 'yyyy-MM-01'), 1)";

                        break;
                    case "year":
                        toNum = 12;
                        toDate = "date_sub(date_format(add_months('" + anchorDate + "', " + toNum
                                + "), 'yyyy-01-01'), 1)";
                        break;

                    default:
                        break;
                }
            }
            if (toConditions.get(0).equals("next")) {
                switch (toType) {
                    case "day":
                        toDate = "date_add('" + anchorDate + "', " + toNum + ")";
                        break;
                    case "rollingWeek":
                        toDate = "date_add('" + anchorDate + "' , " + toNum + "* 7)";
                        break;
                    case "rollingMonth":
                        toDate = "add_months('" + anchorDate + "' , " + toNum + ")";
                        break;
                    case "rollingYear":
                        toNum = toNum*12;
                        toDate = "add_months('" + anchorDate + "' , " + toNum + ")";
                        break;
                    case "weekSunSat":
                        toNum = toNum * 7;
                        toDate = "date_add('" + anchorDate + "', (7 - dayofweek('" + anchorDate + "') + " + toNum
                                + "))";

                        break;
                    case "weekMonSun":
                        toNum = toNum * 7 + 1;
                        toDate = "if(dayofweek('" + anchorDate + "') = 1, " +
                                "date_add('" + anchorDate + "', (7 - dayofweek('" + anchorDate + "') + " + toNum
                                + " - 7)), " +
                                "date_add('" + anchorDate + "', (7 - dayofweek('" + anchorDate + "') + " + toNum
                                + ")))";
                        break;
                    case "month":
                        toNum = toNum + 1;
                        toDate = "date_sub(date_format(add_months('" + anchorDate + "', " + toNum
                                + "), 'yyyy-MM-01'), 1)";
                        break;
                    case "year":
                        toNum = (toNum + 1)*12;
                        toDate = "date_sub(date_format(add_months('" + anchorDate + "', " + toNum
                                + "), 'yyyy-01-01'), 1)";
                        break;
                    default:
                        break;
                }
            }
            // finalQuery to get date

            String finalQuery = "SELECT " + fromDate + " as fromdate, " + toDate + " as todate";

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

        String schemaName = table.getSchema();

        String anchorDate = relativeFilter.getAnchorDate();

        String customQuery = table.getCustomQuery();

        // pattern checker of specific date
        Pattern pattern = Pattern.compile("\\d{4}-\\d{2}-\\d{2}");
        Matcher matcher = pattern.matcher(anchorDate);

        // Query
        if (List.of("today", "tomorrow", "yesterday", "columnMaxDate").contains(anchorDate)) {
            if (anchorDate.equals("today")) {
                query = "select current_date() as anchordate";
            } else if (anchorDate.equals("tomorrow")) {
                query = "select date_add(current_date(), 1) as anchordate";
            } else if (anchorDate.equals("yesterday")) {
                query = "select date_sub(current_date(), 1) as anchordate";
            } else if (anchorDate.equals("columnMaxDate")) {
                //checking for custom query
                if(!table.isCustomQuery()){
                    query = "select date(max(" + relativeFilter.getFilterTable().getFieldName() + "))as anchordate from "
                            + databaseName +"."+ schemaName +"." + tableName;
                }else {
                    query = "select date(max(" + relativeFilter.getFilterTable().getFieldName() + "))as anchordate from "
                            + "(" + customQuery + ") as cq ";
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
