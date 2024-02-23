package com.silzila.querybuilder.relativefilter;

import java.util.List;

import org.json.JSONArray;

import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.RelativeFilterRequest;

public class RelativeFilterDateValidationUtils {
    
    public static void validateConditions(List<String> fromConditions, List<String> toConditions)
            throws BadRequestException {
        if (fromConditions.size() != 3 || toConditions.size() != 3) {
            throw new BadRequestException("no valid number of conditions");
        }

        if (!List.of("last", "current", "next").contains(fromConditions.get(0)) ||
                !List.of("last", "current", "next").contains(toConditions.get(0)) ||
                !List.of("day", "rollingWeek", "rollingMonth", "rollingYear", "weekSunSat", "weekMonSun",
                        "year",
                        "month").contains(fromConditions.get(2))
                ||
                !List.of("day", "rollingWeek", "rollingMonth", "rollingYear", "weekSunSat", "weekMonSun",
                        "year",
                        "month").contains(toConditions.get(2))) {

            throw new BadRequestException("Invalid type");
        }
    }
    
    public static String anchorDateValidation(RelativeFilterRequest relativeFilter, JSONArray ancDateArray)
            throws BadRequestException {
        String anchorDate = "";
        if (ancDateArray.isEmpty()) {
            throw new BadRequestException("there is no anchor date");
        }
        // get a anchorDate
        String ancDate = String.valueOf(ancDateArray.getJSONObject(0).get("anchordate"));

        if (List.of("today", "tomorrow", "yesterday", "columnMaxDate").contains(relativeFilter.getAnchorDate())
                && !ancDate.equals("1")) {
            anchorDate = ancDate;
        } else if (ancDate.equals("1")) {
            anchorDate = relativeFilter.getAnchorDate();
        }

        return anchorDate;
    }
    
    public static void fromToNumValidation(int fromNum, int toNum) throws BadRequestException {
        if (fromNum < 0 || toNum < 0) {
            throw new BadRequestException("Preceding or Following number should be valid");
        }
    }
}
