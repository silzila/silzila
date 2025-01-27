package com.silzila.service;

import com.silzila.domain.entity.DBConnection;
import com.silzila.domain.entity.Dataset;
import com.silzila.domain.entity.FileData;
import com.silzila.domain.entity.PlayBook;
import com.silzila.domain.entity.User;
import com.silzila.domain.entity.Workspace;
import com.silzila.dto.IdNameDTO;
import com.silzila.dto.WorkspaceContentDTO;
import com.silzila.dto.WorkspaceDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.helper.OffsetDateTimeConverter;
import com.silzila.helper.UtilityService;
import com.silzila.payload.request.WorkspaceRequest;
import com.silzila.payload.response.RenameRequest;
import com.silzila.payload.response.SubWorkspaceContentResponse;
import com.silzila.payload.response.WorkspaceContentResponse;
import com.silzila.payload.response.WorkspaceNode;
import com.silzila.payload.response.WorkspaceResponse;
import com.silzila.payload.response.WorkspaceTreeResponse;
import com.silzila.repository.WorkspaceRepository;

import jakarta.transaction.Transactional;

import javax.sql.DataSource;
import com.silzila.repository.DBConnectionRepository;
import com.silzila.repository.DatasetRepository;
import com.silzila.repository.FileDataRepository;
import com.silzila.repository.PlayBookRepository;
import com.silzila.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.hibernate.boot.registry.classloading.spi.ClassLoaderService.Work;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Queue;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ContentService {
    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final UtilityService utilityService;
    private final DBConnectionRepository dBconnectionRepository;
    private final DatasetRepository datasetRepository;
    private final FileDataRepository flatFileRepository;
    private final PlayBookRepository playBookRepository;
    private final DBConnectionService dbConnectionService;
    private final FileDataService fileDataService;
    private final PlayBookService playBookService;
    private final DatasetService datasetService;

    public ResponseEntity<?> createWorkspace(String userId, WorkspaceRequest request) throws BadRequestException {
        // Find user by email
        Optional<User> optionalUser = userRepository.findByUsername(userId);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = optionalUser.get();
        String workspaceName = request.getName().trim();
        utilityService.validateNonEmptyString(workspaceName);

        if (workspaceRepository.existsByNameAndParentId(workspaceName, request.getParentId())) {
            throw new BadRequestException("Name is already taken");
        }
        Workspace existingWorkspace = null;
        if (request.getParentId() != null) {
            Optional<Workspace> optionalWorkspace = workspaceRepository.findById(request.getParentId());
            if (optionalWorkspace.isPresent()) {
                existingWorkspace = optionalWorkspace.get();
                if (existingWorkspace.getParent() != null && existingWorkspace.getParent().getId() != null) {
                    throw new BadRequestException("It is already a sub folder");
                }
            } else {
                throw new BadRequestException("Parent workspace not found");
            }
        }
        Workspace workspace = Workspace.builder()
                .name(workspaceName)
                .parent(existingWorkspace)
                .userId(userId)
                .createdBy(user.getFirstName())
                .build();
        Workspace savedWorkspace = workspaceRepository.save(workspace);
        WorkspaceDTO workspaceResponse = new WorkspaceDTO(
                savedWorkspace.getId(),
                savedWorkspace.getName(),
                savedWorkspace.getParent() != null ? savedWorkspace.getParent().getId() : null);
        return ResponseEntity.ok(workspaceResponse);
    }

    public ResponseEntity<?> updateWorkspace(String email, WorkspaceRequest request)
            throws SQLException, BadRequestException {
        // Find user by email
        Optional<User> optionalUser = userRepository.findByUsername(email);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = optionalUser.get();
        Workspace workspace = utilityService.getWorkspaceById(request.getWorkspaceId());

        String workspaceName = request.getName().trim();

        utilityService.validateNonEmptyString(workspaceName);

        if (workspaceRepository.existsByNameAndParentId(workspaceName, request.getParentId())) {
            return ResponseEntity.badRequest().body("Name is already taken");
        }

        workspace.setName(workspaceName);
        workspace.setUpdatedBy(user.getFirstName());

        workspaceRepository.save(workspace);

        return ResponseEntity.ok("Workspace name changed successfully successfully");
    }

    @Transactional
    public ResponseEntity<?> deleteWorkspace(String email, String workspaceId) {
        try {

            // Check if the workspace exists
            Workspace workspace = utilityService.getWorkspaceById(workspaceId);

            if (workspaceRepository.existsByParentId(workspaceId) ||
                    !workspace.getFlatFiles().isEmpty() ||
                    !workspace.getDbConnections().isEmpty() ||
                    !workspace.getDataSets().isEmpty() ||
                    !workspace.getPlaybooks().isEmpty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Failed to delete workspace: it is either referenced as a parent by other workspaces or contains related content");
            }

            workspaceRepository.deleteById(workspaceId);
            return ResponseEntity.ok().body("Workspace deleted successfully");
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete workspace " + e.getMessage());
        }
    }

    public ResponseEntity<?> createSubWorkspace(String email,WorkspaceRequest request) throws SQLException,BadRequestException{
        WorkspaceDTO savedWorkspace = (WorkspaceDTO) createWorkspace(email,request).getBody();
        String parentId = savedWorkspace.getParentId();
        String subWorkspaceId= savedWorkspace.getId();
        // RoleResponse role = highestPrivilege(email,tenantId,parentId);
        // Long granteeId = utilityService.getUserIdFromEmail(email);
        // Map<Long,Boolean> owners = getWorkspaceOwners(tenantId,parentId);
        // if(role.getRoleID()==4){
        //     owners.put(granteeId, false);
        // }
        // if(!owners.isEmpty()){
        //     List<AccessRequest> ownerAccessRequest = subWorkspaceOwnerAccess(owners);
        //     accessContentService.manageUserGroupAccess(granteeId,subWorkspaceId,ownerAccessRequest,tenantId);
        // }
        return ResponseEntity.ok(savedWorkspace);
    }
 public ResponseEntity<?> reNameContent(String email, RenameRequest renameRequest)throws BadRequestException {
        Workspace workspace = utilityService.getWorkspaceById(renameRequest.getWorkspaceId());

        utilityService.validateNonEmptyString(renameRequest.getName().trim());
    
        String name = renameRequest.getName().trim();
        String workspaceId = workspace.getId();
        String contentId = renameRequest.getContentId();
        Long contentTypeId = renameRequest.getContentTypeId();
    
        switch (contentTypeId.intValue()) {
            case 2:
                if (dBconnectionRepository.existsByConnectionNameAndWorkspaceId(name, workspaceId)) {
                    throw new BadRequestException("Name is already taken");
                }
                DBConnection dbConnection = dBconnectionRepository.findByIdAndWorkspaceId(contentId, workspaceId).orElseThrow();
                dbConnection.setConnectionName(name);
                dBconnectionRepository.save(dbConnection);
                break;
            case 3:
                if (datasetRepository.existsByDatasetNameAndWorkspaceId(name, workspaceId)) {
                    throw new BadRequestException("Name is already taken");
                }
                Dataset dataset = datasetRepository.findByIdAndWorkspaceId(contentId, workspaceId).orElseThrow();
                dataset.setDatasetName(name);
                datasetRepository.save(dataset);
                break;
            case 4:
                if (flatFileRepository.existsByNameAndWorkspaceId(name, workspaceId)) {
                    throw new BadRequestException("Name is already taken");
                }
                FileData flatFile = flatFileRepository.findByIdAndWorkspaceId(contentId, workspaceId).orElseThrow();
                flatFile.setName(name);
                flatFileRepository.save(flatFile);
                break;
            case 5:
                if (playBookRepository.existsByNameAndWorkspaceId(name, workspaceId)) {
                    throw new BadRequestException("Name is already taken");
                }
                PlayBook playBook = playBookRepository.findByIdAndWorkspaceId(contentId, workspaceId).orElseThrow();
                playBook.setName(name);
                playBookRepository.save(playBook);
                break;
            default:
                throw new BadRequestException("Invalid content type");
        }
    
        return ResponseEntity.ok("Rename was successful");
    }
    
    public void deleteContent(String email, String workspaceId, String id,Long contentTypeId) throws FileNotFoundException, BadRequestException, RecordNotFoundException, SQLException {
        
        int contentTypeInt = contentTypeId.intValue();

        switch (contentTypeInt) {
            case 2:
                dbConnectionService.deleteDBConnection(id, email, workspaceId);
                break;
            case 3:
                datasetService.deleteDataset(id,email, workspaceId);
                break;
            case 4:
                fileDataService.deleteFileData(id, email, workspaceId);
                break;
            case 5:
                playBookService.deletePlayBook(id,email, workspaceId);
                break;
            default:
                throw new BadRequestException("Invalid content type ID: " + contentTypeId);
        }
    }
    
       
    // public List<WorkspaceResponse> workspaceView(String  email,String tenantId) throws SQLException {
    //     User user = utilityService.getUserFromEmail(email);
    //    return viewContentService.workspaceView(userId);
    // }

    public List<WorkspaceTreeResponse> getWorkspaceTree(String userId) {
        // Get all workspaces for the user
        List<Workspace> workspaces = workspaceRepository.findByUserId(userId);
    
        // Create a map of workspaceId to WorkspaceTreeResponse
        Map<String, WorkspaceTreeResponse> workspaceTreeMap = new HashMap<>();
    
        for (Workspace workspace : workspaces) {
            // Initialize WorkspaceTreeResponse for the current workspace
            WorkspaceTreeResponse workspaceTreeResponse = workspaceTreeMap
                    .computeIfAbsent(workspace.getId(), id -> new WorkspaceTreeResponse(
                            workspace.getId(), workspace.getName(), new ArrayList<>())
                    );
    
            // If the workspace has a parent, add it to the parent's subWorkspaces list
            if (workspace.getParent() != null) {
                WorkspaceTreeResponse parentWorkspace = workspaceTreeMap.get(workspace.getParent().getId());
                if (parentWorkspace != null) {
                    parentWorkspace.getSubWorkspaces().add(new WorkspaceNode(workspace.getId(), workspace.getName()));
                }
            }
        }
    
        // Convert the map values into a list and return it
        return new ArrayList<>(workspaceTreeMap.values());
    }
     

    public List<WorkspaceResponse> subFolderList(String userId, String parentWorkspaceId) {
        // Fetch workspaces by userId and parentWorkspaceId
        List<Workspace> workspaces = workspaceRepository.findByUserIdAndParentWorkspaceId(userId, parentWorkspaceId);
System.out.println(workspaces.size());
        // Map the Workspace entities to WorkspaceResponse DTOs
        return workspaces.stream()
                .map(this::convertToWorkspaceResponse)
                .collect(Collectors.toList());
    }

    private WorkspaceResponse convertToWorkspaceResponse(Workspace workspace) {
        return WorkspaceResponse.builder()
                .id(workspace.getId())
                .name(workspace.getName())
                .parentWorkspaceId(workspace.getParent() != null ? workspace.getParent().getId() : null)
                .parentWorkspaceName(workspace.getParent() != null ? workspace.getParent().getName() : null)
                .createdBy(workspace.getCreatedBy())
                .createdAt(workspace.getCreatedAt())
                .updatedBy(workspace.getUpdatedBy())
                .updatedAt(workspace.getUpdatedAt())
                .build();
    }

    

    public List<WorkspaceContentResponse> contentDependency(String email,String workspaceId,String contentId,Long contentTypeId)throws BadRequestException{

        int contentTypeInt = contentTypeId.intValue();

        List<WorkspaceContentResponse> dependencies = new ArrayList<>();
        List<WorkspaceContentDTO> workspaceContentDTOs = new ArrayList<>();

        switch (contentTypeInt) {
            case 2:
                workspaceContentDTOs =  dbConnectionService.dbConnectionDependency(email, workspaceId, contentId);
                dependencies = transformWorkspacesForContent(workspaceContentDTOs, "dataset");
                break;
            case 3:
                workspaceContentDTOs =  datasetService.datasetDependency(email, workspaceId, contentId);
                dependencies = transformWorkspacesForContent(workspaceContentDTOs, "playbook");
                break;
            case 4:
                workspaceContentDTOs =  fileDataService.flatfileDependency(email, workspaceId, contentId);
                dependencies = transformWorkspacesForContent(workspaceContentDTOs, "dataset");
                break;
            default:
                throw new BadRequestException("Invalid content type ID: " + contentTypeId);
        }

        return dependencies;
    }
    
     // structured view of workspaces with contents in it
    public List<WorkspaceContentResponse> transformWorkspacesForContent(List<WorkspaceContentDTO> workspaceContents,String contentType) {
        Map<String, WorkspaceContentResponse> workspaceMap = new HashMap<>();
        List<WorkspaceContentResponse> topLevelWorkspaces = new ArrayList<>();
        Set<String> addedWorkspaceIds = new HashSet<>();
    
        for (WorkspaceContentDTO dto : workspaceContents) {
            if (dto.getId() != null) {
                workspaceMap.put(dto.getWorkspaceId(), WorkspaceContentResponse.builder()
                    .workspaceId(dto.getWorkspaceId())
                    .workspaceName(dto.getWorkspaceName())
                    .contentType(contentType)
                    .contents(new ArrayList<>())
                    .subWorkspaces(new ArrayList<>())
                    .build());
            }
        }
    
        for (WorkspaceContentDTO dto : workspaceContents) {
            if (dto.getId() != null) {
                WorkspaceContentResponse workspaceDTO = workspaceMap.get(dto.getWorkspaceId());
                if (workspaceDTO != null) {
                    IdNameDTO connectionDTO = IdNameDTO.builder()
                        .id(dto.getId())
                        .name(dto.getName())
                        .createdBy(dto.getCreatedBy())
                        .build();
                    workspaceDTO.getContents().add(connectionDTO);
    
                    if (dto.getParentId() != null) {
                        WorkspaceContentResponse parentWorkspace = workspaceMap.get(dto.getParentId());
                        if (parentWorkspace != null) {
                            boolean subWorkspaceExists = parentWorkspace.getSubWorkspaces().stream()
                            .anyMatch(sub -> sub.getWorkspaceId().equals(workspaceDTO.getWorkspaceId()));
                        if (!subWorkspaceExists) {
                            SubWorkspaceContentResponse subResponse = new SubWorkspaceContentResponse(workspaceDTO.getWorkspaceId(), workspaceDTO.getWorkspaceName(), workspaceDTO.getContents());
                            parentWorkspace.getSubWorkspaces().add(subResponse);
                        }
                        } 
                        // if parent workspace is not present , creating a parent workspace with parent id and name
                        else {
                            WorkspaceContentResponse newParentWorkspace = WorkspaceContentResponse.builder()
                                .workspaceId(dto.getParentId())
                                .workspaceName(dto.getParentWorkspaceName())
                                .contentType(contentType)
                                .subWorkspaces(new ArrayList<>())
                                .contents(new ArrayList<>())
                                .build();
                            workspaceMap.put(dto.getParentId(),newParentWorkspace);        
                            SubWorkspaceContentResponse subResponse = new SubWorkspaceContentResponse(workspaceDTO.getWorkspaceId(), workspaceDTO.getWorkspaceName(), workspaceDTO.getContents());
                            newParentWorkspace.getSubWorkspaces().add(subResponse);

                            topLevelWorkspaces.add(newParentWorkspace);
                            addedWorkspaceIds.add(newParentWorkspace.getWorkspaceId());
                        }
                    } else {
                        if (!addedWorkspaceIds.contains(workspaceDTO.getWorkspaceId())) {
                            topLevelWorkspaces.add(workspaceDTO);
                            addedWorkspaceIds.add(workspaceDTO.getWorkspaceId());
                        }
                    }
                }
            }
        }
    
        topLevelWorkspaces.removeIf(workspace -> workspace.getContents().isEmpty() && workspace.getSubWorkspaces().isEmpty());
    
        return topLevelWorkspaces;
    }

//     public List<WorkspaceContentResponse> getDBConnectionsOnWorkspaces(String email) throws SQLException {
//         // Step 1: Fetch workspaces by user ID (email)
//         List<Workspace> workspaces = workspaceRepository.findWorkspacesByUserId(email);

//         // Step 2: Convert workspaces to DTO
//         List<WorkspaceContentDTO> workspaceContentDTOs = toWorkspaceContentDTOList(workspaces);

//         // Step 3: Convert DTO to Response
//          toWorkspaceContentResponseList(workspaceContentDTOs);
//     }

//   public static WorkspaceContentDTO toWorkspaceContentDTO(Workspace workspace) {
//         if (workspace == null) {
//             return null;
//         }

//         return WorkspaceContentDTO.builder()
//                 .id(workspace.getId()) // Entity ID
//                 .name(workspace.getName()) // Workspace name
//                 .createdBy(workspace.getCreatedBy()) // Created by
//                 .workspaceId(workspace.getId()) // Workspace ID
//                 .workspaceName(workspace.getName()) // Workspace name
//                 .parentId(workspace.getParent() != null ? workspace.getParent().getId() : null) // Parent ID (null-safe)
//                 .parentWorkspaceName(workspace.getParent() != null ? workspace.getParent().getName() : null) // Parent workspace name (null-safe)
//                 .build();
//     }

     // public static List<WorkspaceContentResponse> toWorkspaceContentResponseList(List<WorkspaceContentDTO> workspaceContentDTOs) {
    //     return workspaceContentDTOs.stream()
    //             .map(dto -> WorkspaceContentResponse.builder()
    //                     .id(dto.getId())
    //                     .name(dto.getName())
    //                     .createdBy(dto.getCreatedBy())
    //                     .workspaceId(dto.getWorkspaceId())
    //                     .workspaceName(dto.getWorkspaceName())
    //                     .parentId(dto.getParentId())
    //                     .parentWorkspaceName(dto.getParentWorkspaceName())
    //                     .build())
    //             .collect(Collectors.toList());
    // }



    

    

    //     public List<WorkspaceResponse> workspaceView(Long userId) throws SQLException {
//         List<WorkspaceResponse> workspaces = new ArrayList<>();
//         DataSource dataSource = // Initialize your DataSource here (e.g., from a DataSourceManager)
    
//         // Use normal DataSource to get the database connection
//         try (Connection connection = dataSource.getConnection();
//              PreparedStatement statement = connection.prepareStatement(
//                 """
//                     WITH workspace_view AS (
//                              SELECT DISTINCT
//                                  w.id AS id,
//                                  w.name AS name,
//                                  COALESCE(w.parent_id, w.id) AS pid,
//                                  w.inherit_permission AS inherited,
//                                  w.created_by, w.created_at, w.updated_by, w.updated_at,
//                                  a.content_id AS content_id,
//                                  r.id AS role_id,
//                                  r.name AS role_name
//                              FROM "users" u
//                              LEFT JOIN users_groups ug ON ug.user_id = u.id
//                              LEFT JOIN "groups" g ON ug.group_id = g.id
//                              LEFT JOIN "access" a ON (g.id = a.grantee_id AND a.is_group = TRUE) 
//                                 OR (u.id = a.grantee_id AND a.is_group = FALSE)
//                              JOIN role r ON a.role_id = r.id
//                              JOIN workspace w ON a.workspace_id = w.id
//                              WHERE u.id = ? AND (w.inherit_permission = FALSE OR a.content_id != '')
//                              ORDER BY created_at, content_id, role_id
//                     ),
//                     ranked_rows AS (
//                         SELECT *,
//                             ROW_NUMBER() OVER (PARTITION BY pid ORDER BY created_at, content_id, role_id) AS row_rank
//                         FROM workspace_view
//                     ),
//                     new_workspaces AS (
//                         SELECT
//                             COALESCE(pid, id) AS id,
//                             inherited,
//                             created_by,
//                             created_at,
//                             updated_by,
//                             updated_at,
//                             content_id,
//                             CASE
//                                 WHEN content_id != '' THEN NULL
//                                 WHEN pid != id THEN NULL
//                                 ELSE role_id
//                             END AS role_id,
//                             CASE
//                                 WHEN content_id != '' THEN NULL
//                                 WHEN pid != id THEN NULL
//                                 ELSE role_name
//                             END AS role_name,
//                             row_rank
//                         FROM ranked_rows
//                         WHERE row_rank = 1
//                     )
//                     SELECT w.id, w.name, w.created_by, w.created_at, w.updated_by, w.updated_at, nw.role_id, nw.role_name
//                     FROM workspace w
//                     JOIN new_workspaces nw ON w.id = nw.id
//                     ORDER BY w.created_at;
//                 """
//             )) {
//             statement.setLong(1, userId);
    
//             try (ResultSet resultSet = statement.executeQuery()) {
//                 while (resultSet.next()) {
//                     Long roleId = resultSet.getLong("role_id");
//                     String workspaceId = resultSet.getString("id");
    
    
//                     workspaces.add(new WorkspaceResponse(
//                             workspaceId,
//                             resultSet.getString("name"),
//                             null, 
//                             null, 
//                             null, 
//                             resultSet.getString("created_by"),
//                             OffsetDateTimeConverter.convertToOffsetDateTime(resultSet.getTimestamp("created_at")),
//                             resultSet.getString("updated_by"),
//                             OffsetDateTimeConverter.convertToOffsetDateTime(resultSet.getTimestamp("updated_at")),
//                             roleId,
//                             resultSet.getString("role_name"),
//                             null
//                     ));
//                 }
//             }
//         }
    
//         return workspaces;
//     }




}    