package com.silzila.querybuilder;

import com.silzila.exception.BadRequestException;
import com.silzila.payload.request.Filter;

public interface WhereClauseDate {
    
    public String buildWhereClauseDate(Filter filter) throws BadRequestException;

    public String getDatePartExpression(String timeGrain, String columnName);
}
