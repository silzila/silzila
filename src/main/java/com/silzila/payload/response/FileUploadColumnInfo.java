package com.silzila.payload.response;

import java.io.Serializable;

import jakarta.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
// import com.silzila.helper.RandomGenerator;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "fieldName",
        "dataType"
})
@Generated("jsonschema2pojo")
public class FileUploadColumnInfo implements Serializable {

    @JsonProperty("fieldName")
    private String fieldName;
    @JsonProperty("dataType")
    private String dataType;
    private final static long serialVersionUID = 6540755237787596216L;

    /**
     * No args constructor for use in serialization
     *
     */
    public FileUploadColumnInfo() {
    }

    /**
     *
     * @param fieldName
     * @param dataType
     */
    public FileUploadColumnInfo(String fieldName, String dataType) {
        super();
        this.fieldName = fieldName;
        this.dataType = dataType;
    }

    @JsonProperty("fieldName")
    public String getFieldName() {
        return fieldName;
    }

    @JsonProperty("fieldName")
    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    @JsonProperty("dataType")
    public String getDataType() {
        return dataType;
    }

    @JsonProperty("dataType")
    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(FileUploadColumnInfo.class.getName()).append('@')
                .append(Integer.toHexString(System.identityHashCode(this))).append('[');
        sb.append("fieldName");
        sb.append('=');
        sb.append(((this.fieldName == null) ? "<null>" : this.fieldName));
        sb.append(',');
        sb.append("dataType");
        sb.append('=');
        sb.append(((this.dataType == null) ? "<null>" : this.dataType));
        sb.append(',');
        if (sb.charAt((sb.length() - 1)) == ',') {
            sb.setCharAt((sb.length() - 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

}