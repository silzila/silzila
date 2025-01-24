package com.silzila.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkspaceContentDTO {
    private String id;      
    private String name;
    private String createdBy;
    private String workspaceId;       
    private String workspaceName;     
    private String parentId;
    private String parentWorkspaceName;
}
