package com.silzila.payload.response;


import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PlayBookCreationResponse {

    private String id;
    
    private String userId;

    private String name;

    private String description;

    private Object content;

    private String workspaceId;

    private String createdBy;

    private OffsetDateTime createdAt;

}
