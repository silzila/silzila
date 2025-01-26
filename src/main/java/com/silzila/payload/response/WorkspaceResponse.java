package com.silzila.payload.response;

import java.time.OffsetDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class WorkspaceResponse {
    private Object id;
    private String name;
    private Long contentType = null;
    private String parentWorkspaceId = null;
    private String parentWorkspaceName = null;
    private String createdBy = null;
    private OffsetDateTime createdAt;
    private String updatedBy = null;
    private OffsetDateTime updatedAt;
    private Long roleId = null;
    private String roleName = null;
    private Long levelId = null;

}
