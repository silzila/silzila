package org.silzila.app.querybuilder;

import org.silzila.app.dto.DatasetDTO;
import org.silzila.app.exception.BadRequestException;
import org.silzila.app.payload.request.Query;
import org.springframework.stereotype.Service;

@Service
public class QueryComposer {

    /*
     * Builds query based on Dimensions and Measures of user selection.
     * Query building is split into many sections:
     * like Select clause, Join clause, Where clause,
     * Group By clause & Order By clause
     * Different dialects will have different syntaxes.
     */
    public String composeQuuery(Query req, DatasetDTO ds, String vendorName) throws BadRequestException {

        String fromClause = RelationshipGeneric.buildRelationship(req, ds.getDataSchema());
        return fromClause;

    }
}
