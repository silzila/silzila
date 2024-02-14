package com.silzila.payload.request;

import java.io.Serializable;
import java.util.List;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "table1",
        "table2",
        "cardinality",
        "refIntegrity",
        "table1Columns",
        "table2Columns"
})
@Generated("jsonschema2pojo")
public class Relationship implements Serializable {

    @JsonProperty("table1")
    private String table1;
    @JsonProperty("table2")
    private String table2;
    @JsonProperty("cardinality")
    private String cardinality;
    @JsonProperty("refIntegrity")
    private String refIntegrity;
    @JsonProperty("table1Columns")
    private List<String> table1Columns = null;
    @JsonProperty("table2Columns")
    private List<String> table2Columns = null;
    private final static long serialVersionUID = -3661206249591392256L;

    /**
     * No args constructor for use in serialization
     *
     */
    public Relationship() {
    }

    /**
     *
     * @param refIntegrity
     * @param table2
     * @param table1
     * @param table2Columns
     * @param cardinality
     * @param table1Columns
     */
    public Relationship(String table1, String table2, String cardinality, String refIntegrity,
            List<String> table1Columns, List<String> table2Columns) {
        super();
        this.table1 = table1;
        this.table2 = table2;
        this.cardinality = cardinality;
        this.refIntegrity = refIntegrity;
        this.table1Columns = table1Columns;
        this.table2Columns = table2Columns;
    }

    @JsonProperty("table1")
    public String getTable1() {
        return table1;
    }

    @JsonProperty("table1")
    public void setTable1(String table1) {
        this.table1 = table1;
    }

    @JsonProperty("table2")
    public String getTable2() {
        return table2;
    }

    @JsonProperty("table2")
    public void setTable2(String table2) {
        this.table2 = table2;
    }

    @JsonProperty("cardinality")
    public String getCardinality() {
        return cardinality;
    }

    @JsonProperty("cardinality")
    public void setCardinality(String cardinality) {
        this.cardinality = cardinality;
    }

    @JsonProperty("refIntegrity")
    public String getRefIntegrity() {
        return refIntegrity;
    }

    @JsonProperty("refIntegrity")
    public void setRefIntegrity(String refIntegrity) {
        this.refIntegrity = refIntegrity;
    }

    @JsonProperty("table1Columns")
    public List<String> getTable1Columns() {
        return table1Columns;
    }

    @JsonProperty("table1Columns")
    public void setTable1Columns(List<String> table1Columns) {
        this.table1Columns = table1Columns;
    }

    @JsonProperty("table2Columns")
    public List<String> getTable2Columns() {
        return table2Columns;
    }

    @JsonProperty("table2Columns")
    public void setTable2Columns(List<String> table2Columns) {
        this.table2Columns = table2Columns;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        // sb.append(Relationship.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this)))
        sb.append('[');
        sb.append("table1");
        sb.append('=');
        sb.append(((this.table1 == null) ? "<null>" : this.table1));
        sb.append(',');
        sb.append("table2");
        sb.append('=');
        sb.append(((this.table2 == null) ? "<null>" : this.table2));
        sb.append(',');
        sb.append("cardinality");
        sb.append('=');
        sb.append(((this.cardinality == null) ? "<null>" : this.cardinality));
        sb.append(',');
        sb.append("refIntegrity");
        sb.append('=');
        sb.append(((this.refIntegrity == null) ? "<null>" : this.refIntegrity));
        sb.append(',');
        sb.append("table1Columns");
        sb.append('=');
        sb.append(((this.table1Columns == null) ? "<null>" : this.table1Columns));
        sb.append(',');
        sb.append("table2Columns");
        sb.append('=');
        sb.append(((this.table2Columns == null) ? "<null>" : this.table2Columns));
        sb.append(',');
        if (sb.charAt((sb.length() - 1)) == ',') {
            sb.setCharAt((sb.length() - 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

}
