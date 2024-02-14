package com.silzila.payload.request;

import java.io.Serializable;
import javax.annotation.Generated;
import javax.validation.constraints.Size;

import com.silzila.exception.BadRequestException;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "connectionId",
        "datasetName",
        "isFlatFileData",
        "dataSchema"
})
@Generated("jsonschema2pojo")
public class DatasetRequest implements Serializable {

    // @NotNull
    @Size(min = 1)
    @JsonProperty("connectionId")
    private String connectionId;
    @JsonProperty("datasetName")
    private String datasetName;
    @JsonProperty("isFlatFileData")
    private Boolean isFlatFileData;
    @JsonProperty("dataSchema")
    private DataSchema dataSchema;
    private final static long serialVersionUID = -3299944099507340042L;

    /**
     * No args constructor for use in serialization
     *
     */
    // public DatasetRequest() {
    // }

    /**
     *
     * @param dataSchema
     * @param datasetName
     * @param connectionId
     * @param isFlatFileData
     * @throws BadRequestException
     */
    @JsonCreator
    public DatasetRequest(String connectionId, String datasetName, Boolean isFlatFileData,
            DataSchema dataSchema) throws BadRequestException {
        super();
        if (datasetName == null || datasetName.length() == 0) {
            throw new BadRequestException("Error: DataSet Name Field cannot be empty!");
        }
        if (isFlatFileData == null) {
            throw new BadRequestException("Error: Is Flat File Data Field cannot be empty!");
        }
        if (isFlatFileData == false && (connectionId == null || connectionId.length() == 0)) {
            throw new BadRequestException("Error: Connection Id Field cannot be empty!");
        }
        this.connectionId = connectionId;
        this.datasetName = datasetName;
        this.isFlatFileData = isFlatFileData;
        this.dataSchema = dataSchema;
    }

    @JsonProperty("connectionId")
    public String getConnectionId() {
        return connectionId;
    }

    @JsonProperty("connectionId")
    public void setConnectionId(String connectionId) {
        this.connectionId = connectionId;
    }

    @JsonProperty("datasetName")
    public String getDatasetName() {
        return datasetName;
    }

    @JsonProperty("datasetName")
    public void setDatasetName(String datasetName) {
        this.datasetName = datasetName;
    }

    @JsonProperty("isFlatFileData")
    public Boolean getIsFlatFileData() {
        return isFlatFileData;
    }

    @JsonProperty("isFlatFileData")
    public void setIsFlatFileData(Boolean isFlatFileData) {
        this.isFlatFileData = isFlatFileData;
    }

    @JsonProperty("dataSchema")
    public DataSchema getDataSchema() {
        return dataSchema;
    }

    @JsonProperty("dataSchema")
    public void setDataSchema(DataSchema dataSchema) {
        this.dataSchema = dataSchema;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(DatasetRequest.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this)))
                .append('[');
        sb.append("connectionId");
        sb.append('=');
        sb.append(((this.connectionId == null) ? "<null>" : this.connectionId));
        sb.append(',');
        sb.append("datasetName");
        sb.append('=');
        sb.append(((this.datasetName == null) ? "<null>" : this.datasetName));
        sb.append(',');
        sb.append("isFlatFileData");
        sb.append('=');
        sb.append(((this.isFlatFileData == null) ? "<null>" : this.isFlatFileData));
        sb.append(',');
        sb.append("dataSchema");
        sb.append('=');
        sb.append(((this.dataSchema == null) ? "<null>" : this.dataSchema));
        sb.append(',');
        if (sb.charAt((sb.length() - 1)) == ',') {
            sb.setCharAt((sb.length() - 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

}
