package com.silzila.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RenameRequest {
    
    private String workspaceId;
    private Long contentTypeId;
    private String contentId = "";
    private String name = "";
}
