package com.silzila.controller;

import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.payload.request.WorkspaceRequest;
import com.silzila.payload.response.MessageResponse;
import com.silzila.payload.response.RenameRequest;
import com.silzila.service.ContentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.sql.SQLException;
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

    // @PutMapping("/sub-workspace/update")
    // public ResponseEntity<?> updateSubWorkspace(@RequestBody WorkspaceRequest request,@RequestHeader Map<String,String> requestHeader ) throws Exception{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     utilityService.subWorkspaceCRUDPermission(email,request.getWorkspaceId(),tenantId);
    //     return contentService.updateWorkspace(email,tenantId,request);
    // }

    @DeleteMapping("/sub-workspace/delete/{workspaceId}")
    public ResponseEntity <?> deleteSubWorkspace(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws Exception{
        String email = requestHeader.get("username");
        // utilityService.subWorkspaceCRUDPermission(email,workspaceId,tenantId);
        return contentService.deleteWorkspace(email,workspaceId);
    }

  

    // @GetMapping("/workspace")
    // public List<WorkspaceResponse> workspaceView(@RequestHeader Map<String,String> requestHeader ) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.workspaceView(email,tenantId);
    // }

    // @GetMapping("/workspace/{workspaceId}")
    // public List<WorkspaceResponse> workspaceContentList(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.workspaceContentList(email,tenantId,workspaceId);
    // }

    // @GetMapping("/content-permissions/create/{workspaceId}")
    // public Map<String,Boolean> fetchContentCreatePermissions(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.fetchContentCreatePermissions(email,tenantId,workspaceId);
    // }


    // Not yet tested
    @PutMapping("/content/rename")
    public ResponseEntity<?> contentRename(@RequestHeader Map<String,String> requestHeader,@RequestBody RenameRequest request) throws BadRequestException {
        String email = requestHeader.get("username");
        return contentService.reNameContent(email, request);
    }

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

    // @GetMapping("/workspace/privilege/{workspaceId}")
    // public RoleResponse highestPrivilege(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.highestPrivilege(email,tenantId,workspaceId);
    // }

    // @GetMapping("/workspace/access/{workspaceId}")
    // public List<WorkspaceAccessDTO> workspaceAccessList(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.workspaceAccessList(email,tenantId,workspaceId);
    // }

    // @GetMapping("/content/access")
    // public List<WorkspaceAccessResponse> contentAccessList(@RequestHeader Map<String,String> requestHeader,
    // @RequestParam(name = "workspaceId", required = true) String workspaceId,
    // @RequestParam(name = "contentId", required = false) String contentId,
    // @RequestParam(name = "contentType") Long contentType) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.contentAccessList(email,tenantId,workspaceId,new CustomPermission(contentId, contentType,null));
    // }

    // // @GetMapping("/dbconnection/list/{workspaceId}")
    // // public List<WorkspaceResponse> dbConnectionList(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws SQLException{
    // //     String email = requestHeader.get("email");
    // //     return contentService.dbConnectionList(email, workspaceId);
    // // }

    // // @GetMapping("/dataset/list/{workspaceId}")
    // // public List<WorkspaceResponse> datasetList(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws SQLException{
    // //     String email = requestHeader.get("email");
    // //     return contentService.datasetList(email, workspaceId);
    // // }

    // // @GetMapping("/flatfile/list/{workspaceId}")
    // // public List<WorkspaceResponse> flatfileList(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws SQLException{
    // //     String email = requestHeader.get("email");
    // //     return contentService.flatfileList(email, workspaceId);
    // // }

    // // @GetMapping("/playbook/list/{workspaceId}")
    // // public List<WorkspaceResponse> playbookList(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws SQLException{
    // //     String email = requestHeader.get("email");
    // //     return contentService.playbookList(email, workspaceId);
    // // }

    // @GetMapping("/subfolder/list/{workspaceId}")
    // public List<WorkspaceResponse> subFolderList(@RequestHeader Map<String,String> requestHeader,@PathVariable String workspaceId) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.subFolderList(email,tenantId,workspaceId);
    // }

    // @GetMapping("/user/privilege")
    // public Boolean isAdminOrNot(@RequestHeader Map<String,String> requestHeader) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.isAdminOrNot(email,tenantId);
    // }

    // @GetMapping("/privilege")
    // public Map<String,Long> individualPrivilege(@RequestHeader Map<String,String> requestHeader,
    //     @RequestParam String workspaceId,
    //     @RequestParam String  contentId,
    //     @RequestParam Long contentTypeId) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.individualPrivilegeCustomCreator(email,tenantId,workspaceId,contentId,contentTypeId);
    // }
 

    // @PutMapping("/workspace/inherit")
    // public ResponseEntity<?> subfolderInheritPermission(@RequestHeader Map<String,String> requestHeader,@RequestBody WorkspaceRequest request) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.subfolderInheritPermission(email,tenantId,request);
    // }


    // @DeleteMapping("workspace/access-deletion")
    // public ResponseEntity<?>  workspaceAccessDeletion(@RequestHeader Map<String,String> requestHeader,
    // @RequestParam String workspaceId,
    // @RequestBody List<AccessRequest> request) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.workspaceAccessDeletion(email,tenantId,workspaceId,request);
    // }

    // @DeleteMapping("content/access-deletion")
    // public ResponseEntity<?>  contentAccessDeletion(@RequestHeader Map<String,String> requestHeader,
    // @RequestParam String workspaceId,
    // @RequestBody List<AccessRequest> request) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.contentAccessDeletion(email,tenantId,workspaceId,request);
    // }

    // @PostMapping("workspace/user-access")
    // public List<AccessResponse> manageUserGroupAccess(@RequestHeader Map<String,String> requestHeader,
    // @RequestParam String workspaceId,
    // @RequestBody List<AccessRequest> request) throws SQLException{

    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.manageUserGroupAccess(email,tenantId, workspaceId, request);
    // }

    // @PostMapping("content/user-access")
    // public List<AccessResponse> manageUserGroupContentAccess(@RequestHeader Map<String,String> requestHeader,
    // @RequestParam String workspaceId,
    // @RequestBody List<AccessRequest> request) throws SQLException{

    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.manageUserGroupContentAccess(email,tenantId, workspaceId, request);
    // }

    // @GetMapping("/access/user-groups/workspace")
    // public List<UserGroupResponse>  listUserAndGroupWorkspace(@RequestHeader Map<String,String> requestHeader,
    // @RequestParam String workspaceId) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.listUserAndGroupWorkspace(email,tenantId, workspaceId);
    // }

    // @GetMapping("/access/user-groups/content")
    // public List<UserGroupResponse>  listUserAndGroupContent(@RequestHeader Map<String,String> requestHeader,
    // @RequestParam String workspaceId,@RequestParam String contentId) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.listUserAndGroupContent(email,tenantId, workspaceId,contentId);
    // }

    // @GetMapping("/workspaces/tree")
    // public List<WorkspaceTreeResponse> getWorkspaceTreeToSave(@RequestHeader Map<String,String> requestHeader) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //     return contentService.getWorkspaceTreeToSave(email,tenantId);
    // }

    // @GetMapping("dbConnection/tree")
    // public List<WorkspaceContentResponse> getDBConnectionsOnWorkspaces(@RequestHeader Map<String,String> requestHeader) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //      return contentService.getDBConnectionsOnWorkspaces(email,tenantId);
    // }

    // @GetMapping("dataset/tree")
    // public List<WorkspaceContentResponse> getDatasetsOnWorkspaces(@RequestHeader Map<String,String> requestHeader) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //      return contentService.getDatasetsOnWorkspaces(email,tenantId);
    // }

    // @GetMapping("flatfile/tree")
    // public List<WorkspaceContentResponse> getFlatfilesOnWorkspaces(@RequestHeader Map<String,String> requestHeader) throws SQLException{
    //     String email = requestHeader.get("email");
    //     String tenantId = requestHeader.get("tenantId");
    //      return contentService.getflatfilesOnWorkspaces(email,tenantId);
    // }

    // @GetMapping("/content/dependency/{id}")
    // public ResponseEntity<?> contentDependency(@RequestHeader Map<String,String> requestHeader,
    //                                        @PathVariable String id,
    //                                        @RequestParam(name = "workspaceId",required = true) String workspaceId,
    //                                        @RequestParam(name = "contentType" , required = true) Long contentTpe  ) 
    //                                        throws FileNotFoundException, BadRequestException, RecordNotFoundException, SQLException{

    //     String email = requestHeader.get("email");
    //     contentService.contentDependency(email, workspaceId, id, contentTpe);
    //     return ResponseEntity.ok().body(contentService.contentDependency(email, workspaceId, id, contentTpe));
    // }

}