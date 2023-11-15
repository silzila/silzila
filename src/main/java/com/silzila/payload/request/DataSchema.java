package com.silzila.payload.request;

import java.io.Serializable;
import java.util.List;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "tables",
        "relationships"
})
@Generated("jsonschema2pojo")
public class DataSchema implements Serializable {

    @JsonProperty("tables")
    private List<Table> tables = null;
    @JsonProperty("relationships")
    private List<Relationship> relationships = null;
    private final static long serialVersionUID = -2188466840486676788L;

    /**
     * No args constructor for use in serialization
     *
     */
    public DataSchema() {
    }

    /**
     *
     * @param relationships
     * @param tables
     */
    public DataSchema(List<Table> tables, List<Relationship> relationships) {
        super();
        this.tables = tables;
        this.relationships = relationships;
    }

    @JsonProperty("tables")
    public List<Table> getTables() {
        return tables;
    }

    @JsonProperty("tables")
    public void setTables(List<Table> tables) {
        this.tables = tables;
    }

    @JsonProperty("relationships")
    public List<Relationship> getRelationships() {
        return relationships;
    }

    @JsonProperty("relationships")
    public void setRelationships(List<Relationship> relationships) {
        this.relationships = relationships;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(DataSchema.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this)))
                .append('[');
        sb.append("tables");
        sb.append('=');
        sb.append(((this.tables == null) ? "<null>" : this.tables));
        sb.append(',');
        sb.append("relationships");
        sb.append('=');
        sb.append(((this.relationships == null) ? "<null>" : this.relationships));
        sb.append(',');
        if (sb.charAt((sb.length() - 1)) == ',') {
            sb.setCharAt((sb.length() - 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

}