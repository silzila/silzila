package com.silzila.payload.response;

import java.util.List;

import com.silzila.dto.IdNameDTO;

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
public class SubWorkspaceContentResponse {
    private String workspaceId;       
    private String workspaceName;   
    private List<IdNameDTO> contents;
}
