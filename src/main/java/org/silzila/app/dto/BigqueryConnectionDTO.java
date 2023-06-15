package org.silzila.app.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Data
public class BigqueryConnectionDTO {

    private String projectId;

    private String clientEmail;

    private String tokenFileName;

    public BigqueryConnectionDTO() {
    }

    public BigqueryConnectionDTO(String projectId, String clientEmail, String tokenFileName) {
        this.projectId = projectId;
        this.clientEmail = clientEmail;
        this.tokenFileName = tokenFileName;
    }

}
