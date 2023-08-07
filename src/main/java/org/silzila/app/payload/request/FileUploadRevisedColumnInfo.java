package org.silzila.app.payload.request;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonValue;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "fieldName",
        "newFieldName",
        "dataType",
        "newDataType",
        "format"
})
@Generated("jsonschema2pojo")
public class FileUploadRevisedColumnInfo implements Serializable {

    @JsonProperty("fieldName")
    private String fieldName;
    // @JsonProperty("newFieldName")
    // private String newFieldName;
    @JsonProperty("dataType")
    private FileUploadRevisedColumnInfo.DataType dataType;
    // @JsonProperty("newDataType")
    // private FileUploadRevisedColumnInfo.NewDataType newDataType;
    // @JsonProperty("format")
    // private String format;
    private final static long serialVersionUID = -4018176502088620701L;

    /**
     * No args constructor for use in serialization
     *
     */
    public FileUploadRevisedColumnInfo() {
    }

    /**
     *
     * @param fieldName
     * @param dataType
     * @param format
     * @param newFieldName
     * @param newDataType
     */
    public FileUploadRevisedColumnInfo(String fieldName, FileUploadRevisedColumnInfo.DataType dataType
    // , FileUploadRevisedColumnInfo.NewDataType newDataType, String format
    ) {
        super();
        this.fieldName = fieldName;
        // this.newFieldName = newFieldName;
        this.dataType = dataType;
        // this.newDataType = newDataType;
        // this.format = format;
    }

    @JsonProperty("fieldName")
    public String getFieldName() {
        return fieldName;
    }

    @JsonProperty("fieldName")
    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    // @JsonProperty("newFieldName")
    // public String getNewFieldName() {
    // return newFieldName;
    // }

    // @JsonProperty("newFieldName")
    // public void setNewFieldName(String newFieldName) {
    // this.newFieldName = newFieldName;
    // }

    @JsonProperty("dataType")
    public FileUploadRevisedColumnInfo.DataType getDataType() {
        return dataType;
    }

    @JsonProperty("dataType")
    public void setDataType(FileUploadRevisedColumnInfo.DataType dataType) {
        this.dataType = dataType;
    }

    // @JsonProperty("newDataType")
    // public FileUploadRevisedColumnInfo.NewDataType getNewDataType() {
    // return newDataType;
    // }

    // @JsonProperty("newDataType")
    // public void setNewDataType(FileUploadRevisedColumnInfo.NewDataType
    // newDataType) {
    // this.newDataType = newDataType;
    // }

    // @JsonProperty("format")
    // public String getFormat() {
    // return format;
    // }

    // @JsonProperty("format")
    // public void setFormat(String format) {
    // this.format = format;
    // }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(FileUploadRevisedColumnInfo.class.getName()).append('@')
                .append(Integer.toHexString(System.identityHashCode(this))).append('[');
        sb.append("fieldName");
        sb.append('=');
        sb.append(((this.fieldName == null) ? "<null>" : this.fieldName));
        sb.append(',');
        // sb.append("newFieldName");
        // sb.append('=');
        // sb.append(((this.newFieldName == null) ? "<null>" : this.newFieldName));
        // sb.append(',');
        sb.append("dataType");
        sb.append('=');
        sb.append(((this.dataType == null) ? "<null>" : this.dataType));
        sb.append(',');
        // sb.append("newDataType");
        // sb.append('=');
        // sb.append(((this.newDataType == null) ? "<null>" : this.newDataType));
        // sb.append(',');
        // sb.append("format");
        // sb.append('=');
        // sb.append(((this.format == null) ? "<null>" : this.format));
        // sb.append(',');
        if (sb.charAt((sb.length() - 1)) == ',') {
            sb.setCharAt((sb.length() - 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

    @Generated("jsonschema2pojo")
    public enum DataType {

        TEXT("text"),
        INTEGER("integer"),
        DECIMAL("decimal"),
        BOOLEAN("boolean"),
        DATE("date"),
        TIMESTAMP("timestamp");

        private final String value;
        private final static Map<String, FileUploadRevisedColumnInfo.DataType> CONSTANTS = new HashMap<String, FileUploadRevisedColumnInfo.DataType>();

        static {
            for (FileUploadRevisedColumnInfo.DataType c : values()) {
                CONSTANTS.put(c.value, c);
            }
        }

        DataType(String value) {
            this.value = value;
        }

        @Override
        public String toString() {
            return this.value;
        }

        @JsonValue
        public String value() {
            return this.value;
        }

        @JsonCreator
        public static FileUploadRevisedColumnInfo.DataType fromValue(String value) {
            FileUploadRevisedColumnInfo.DataType constant = CONSTANTS.get(value);
            if (constant == null) {
                throw new IllegalArgumentException(value);
            } else {
                return constant;
            }
        }

    }

    // @Generated("jsonschema2pojo")
    // public enum NewDataType {

    // TEXT("text"),
    // INTEGER("integer"),
    // DECIMAL("decimal"),
    // BOOLEAN("boolean"),
    // DATE("date"),
    // TIMESTAMP("timestamp");

    // private final String value;
    // private final static Map<String, FileUploadRevisedColumnInfo.NewDataType>
    // CONSTANTS = new HashMap<String, FileUploadRevisedColumnInfo.NewDataType>();

    // static {
    // for (FileUploadRevisedColumnInfo.NewDataType c : values()) {
    // CONSTANTS.put(c.value, c);
    // }
    // }

    // NewDataType(String value) {
    // this.value = value;
    // }

    // @Override
    // public String toString() {
    // return this.value;
    // }

    // @JsonValue
    // public String value() {
    // return this.value;
    // }

    // @JsonCreator
    // public static FileUploadRevisedColumnInfo.NewDataType fromValue(String value)
    // {
    // FileUploadRevisedColumnInfo.NewDataType constant = CONSTANTS.get(value);
    // if (constant == null) {
    // throw new IllegalArgumentException(value);
    // } else {
    // return constant;
    // }
    // }

    // }

}