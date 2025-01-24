package com.silzila.payload.response;

import java.util.List;

import lombok.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class WorkspaceTreeResponse {
    private String workspaceId;
    private String workspaceName;
    private List<WorkspaceNode> subWorkspaces;
}
