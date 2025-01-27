package com.silzila.controller;

import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.WorkspaceRequest;
import com.silzila.payload.response.MessageResponse;
import com.silzila.payload.response.RenameRequest;
import com.silzila.payload.response.WorkspaceContentResponse;
import com.silzila.payload.response.WorkspaceResponse;
import com.silzila.payload.response.WorkspaceTreeResponse;
import com.silzila.service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.sql.SQLException;
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

    @PutMapping("/workspace/update")
    public ResponseEntity<?> updateWorkspace(@RequestBody WorkspaceRequest request,@RequestHeader Map<String,String> requestHeader ) throws Exception{
        String email = requestHeader.get("username");
        return contentService.updateWorkspace(email,request);
    }

    @DeleteMapping("/workspace/{workspaceId}")
    public ResponseEntity <?> deleteWorkspace(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws Exception{
        String email = requestHeader.get("username");
        return contentService.deleteWorkspace(email,workspaceId);
    }

     
    @PostMapping("/sub-workspace/create")
    public ResponseEntity<?> createSubWorkspace(@RequestBody WorkspaceRequest request,@RequestHeader Map<String,String> requestHeader ) throws Exception{
        String email = requestHeader.get("username");
        return contentService.createSubWorkspace(email,request);
    }

    @PutMapping("/sub-workspace/update")
    public ResponseEntity<?> updateSubWorkspace(@RequestBody WorkspaceRequest request,@RequestHeader Map<String,String> requestHeader ) throws Exception{
        String email = requestHeader.get("username");
        return contentService.updateWorkspace(email,request);
    }

    @DeleteMapping("/sub-workspace/delete/{workspaceId}")
    public ResponseEntity <?> deleteSubWorkspace(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws Exception{
        String email = requestHeader.get("username");
        return contentService.deleteWorkspace(email,workspaceId);
    }


    @GetMapping("/workspace")
    public List<WorkspaceResponse> workspaceView(@RequestHeader Map<String,String> requestHeader ) throws SQLException{
        String email = requestHeader.get("username");
        return contentService.workspaceView(email);
    }

    // @GetMapping("/workspace/{workspaceId}")
    // public List<WorkspaceResponse> workspaceContentList(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws SQLException{
    //     String email = requestHeader.get("username");
    //     return contentService.workspaceContentList(email,workspaceId);
    // }



    // Not yet tested
    @PutMapping("/content/rename")
    public ResponseEntity<?> contentRename(@RequestHeader Map<String,String> requestHeader,@RequestBody RenameRequest request) throws BadRequestException {
        String email = requestHeader.get("username");
        return contentService.reNameContent(email, request);
    }
   // Not yet tested
    @DeleteMapping("/content/delete/{id}")
    public ResponseEntity<?> contentDelete(@RequestHeader Map<String,String> requestHeader,
                                           @PathVariable String id,
                                           @RequestParam(name = "workspaceId",required = true) String workspaceId,
                                           @RequestParam(name = "contentType" , required = true) Long contentTpe  ) 
                                           throws FileNotFoundException, BadRequestException, RecordNotFoundException, SQLException{

        String email = requestHeader.get("username");
        contentService.deleteContent(email,workspaceId,id,contentTpe);
        return ResponseEntity.ok().body(new MessageResponse("content is deleted"));
    }

   


   
    // @GetMapping("/sub-workspace-count/list/{workspaceId}")
    // public List<WorkspaceResponse> subFolderList(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws SQLException{
    //     String email = requestHeader.get("username");
    //     return contentService.subFolderList(email,workspaceId);
    // }

    

    @GetMapping("/workspaces/tree")
    public List<WorkspaceTreeResponse> getWorkspaceTreeToSave(@RequestHeader Map<String,String> requestHeader) throws SQLException{
        String email = requestHeader.get("username");
        System.out.println(email);
        return contentService.getWorkspaceTree(email);
    }

    @GetMapping("dbConnection/tree")
    public List<WorkspaceContentResponse> getDBConnectionsOnWorkspaces(@RequestHeader Map<String,String> requestHeader) throws SQLException{
        String email = requestHeader.get("username");
         return contentService.getDBConnectionsOnWorkspaces(email);
    }

    @GetMapping("dataset/tree")
    public List<WorkspaceContentResponse> getDatasetsOnWorkspaces(@RequestHeader Map<String,String> requestHeader) throws SQLException{
        String email = requestHeader.get("username");
         return contentService.getDatasetsOnWorkspaces(email);
    }

    // @GetMapping("flatfile/tree")
    // public List<WorkspaceContentResponse> getFlatfilesOnWorkspaces(@RequestHeader Map<String,String> requestHeader) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //      return contentService.getflatfilesOnWorkspaces(email,tenantId);
    // }

    @GetMapping("/content/dependency/{id}")
    public ResponseEntity<?> contentDependency(@RequestHeader Map<String,String> requestHeader,
                                           @PathVariable String id,
                                           @RequestParam(name = "workspaceId",required = true) String workspaceId,
                                           @RequestParam(name = "contentType" , required = true) Long contentTpe  ) 
                                           throws FileNotFoundException, BadRequestException, RecordNotFoundException, SQLException{

        String email = requestHeader.get("email");
        contentService.contentDependency(email, workspaceId, id, contentTpe);
        return ResponseEntity.ok().body(contentService.contentDependency(email, workspaceId, id, contentTpe));
    }

}