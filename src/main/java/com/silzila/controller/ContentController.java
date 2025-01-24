package com.silzila.controller;

import com.silzila.payload.request.WorkspaceRequest;
import com.silzila.payload.response.WorkspaceTreeResponse;
import com.silzila.service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping
public class ContentController {
    @Autowired
    private ContentService contentService;
    @PostMapping("/workspace/create")
    public ResponseEntity<?> createWorkspace(@RequestBody WorkspaceRequest request, @RequestHeader Map<String,String> requestHeader ) throws Exception{
        String userId = requestHeader.get("username");
        return contentService.createWorkspace(userId,request);
    }




}
