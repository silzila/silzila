package org.silzila.app.querybuilder;

import java.util.List;

import org.silzila.app.payload.request.Filter;

public class WhereClauseDatePostgres {

    public static void buildWhereClauseDate(Filter filter) {

        if (List.of("EQUAL_TO", "IN").contains(filter.getOperator().name())) {

        }
    }

}
