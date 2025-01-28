package com.silzila.service;

import com.databricks.client.jdbc42.internal.facebook.fb303.FacebookService.AsyncProcessor.reinitialize;
import com.ibm.db2.jcc.am.al;
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
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.Collections;
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
    private final DataSource dataSource;

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

    public ResponseEntity<?> createSubWorkspace(String email, WorkspaceRequest request)
            throws SQLException, BadRequestException {
        WorkspaceDTO savedWorkspace = (WorkspaceDTO) createWorkspace(email, request).getBody();
        String parentId = savedWorkspace.getParentId();
        String subWorkspaceId = savedWorkspace.getId();
        // RoleResponse role = highestPrivilege(email,tenantId,parentId);
        // Long granteeId = utilityService.getUserIdFromEmail(email);
        // Map<Long,Boolean> owners = getWorkspaceOwners(tenantId,parentId);
        // if(role.getRoleID()==4){
        // owners.put(granteeId, false);
        // }
        // if(!owners.isEmpty()){
        // List<AccessRequest> ownerAccessRequest = subWorkspaceOwnerAccess(owners);
        // accessContentService.manageUserGroupAccess(granteeId,subWorkspaceId,ownerAccessRequest,tenantId);
        // }
        return ResponseEntity.ok(savedWorkspace);
    }

    public ResponseEntity<?> reNameContent(String email, RenameRequest renameRequest) throws BadRequestException {
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
                DBConnection dbConnection = dBconnectionRepository.findByIdAndWorkspaceId(contentId, workspaceId)
                        .orElseThrow();
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

    public void deleteContent(String email, String workspaceId, String id, Long contentTypeId)
            throws FileNotFoundException, BadRequestException, RecordNotFoundException, SQLException {

        int contentTypeInt = contentTypeId.intValue();

        switch (contentTypeInt) {
            case 2:
                dbConnectionService.deleteDBConnection(id, email, workspaceId);
                break;
            case 3:
                datasetService.deleteDataset(id, email, workspaceId);
                break;
            case 4:
                fileDataService.deleteFileData(id, email, workspaceId);
                break;
            case 5:
                playBookService.deletePlayBook(id, email, workspaceId);
                break;
            default:
                throw new BadRequestException("Invalid content type ID: " + contentTypeId);
        }
    }

    // public List<WorkspaceResponse> workspaceView(String email,String tenantId)
    // throws SQLException {
    // User user = utilityService.getUserFromEmail(email);
    // return viewContentService.workspaceView(userId);
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
                            workspace.getId(), workspace.getName(), new ArrayList<>()));

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

    public List<WorkspaceContentResponse> contentDependency(String email, String workspaceId, String contentId,
            Long contentTypeId) throws BadRequestException {

        int contentTypeInt = contentTypeId.intValue();

        List<WorkspaceContentResponse> dependencies = new ArrayList<>();
        List<WorkspaceContentDTO> workspaceContentDTOs = new ArrayList<>();

        switch (contentTypeInt) {
            case 2:
                workspaceContentDTOs = dbConnectionService.dbConnectionDependency(email, workspaceId, contentId);
                dependencies = transformWorkspacesForContent(workspaceContentDTOs, "dataset");
                break;
            case 3:
                workspaceContentDTOs = datasetService.datasetDependency(email, workspaceId, contentId);
                dependencies = transformWorkspacesForContent(workspaceContentDTOs, "playbook");
                break;
            case 4:
                workspaceContentDTOs = fileDataService.flatfileDependency(email, workspaceId, contentId);
                dependencies = transformWorkspacesForContent(workspaceContentDTOs, "dataset");
                break;
            default:
                throw new BadRequestException("Invalid content type ID: " + contentTypeId);
        }

        return dependencies;
    }

    // structured view of workspaces with contents in it
    public List<WorkspaceContentResponse> transformWorkspacesForContent(List<WorkspaceContentDTO> workspaceContents,
            String contentType) {
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
                                SubWorkspaceContentResponse subResponse = new SubWorkspaceContentResponse(
                                        workspaceDTO.getWorkspaceId(), workspaceDTO.getWorkspaceName(),
                                        workspaceDTO.getContents());
                                parentWorkspace.getSubWorkspaces().add(subResponse);
                            }
                        }
                        // if parent workspace is not present , creating a parent workspace with parent
                        // id and name
                        else {
                            WorkspaceContentResponse newParentWorkspace = WorkspaceContentResponse.builder()
                                    .workspaceId(dto.getParentId())
                                    .workspaceName(dto.getParentWorkspaceName())
                                    .contentType(contentType)
                                    .subWorkspaces(new ArrayList<>())
                                    .contents(new ArrayList<>())
                                    .build();
                            workspaceMap.put(dto.getParentId(), newParentWorkspace);
                            SubWorkspaceContentResponse subResponse = new SubWorkspaceContentResponse(
                                    workspaceDTO.getWorkspaceId(), workspaceDTO.getWorkspaceName(),
                                    workspaceDTO.getContents());
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

        topLevelWorkspaces
                .removeIf(workspace -> workspace.getContents().isEmpty() && workspace.getSubWorkspaces().isEmpty());

        return topLevelWorkspaces;
    }

    public List<WorkspaceContentResponse> getDBConnectionsOnWorkspaces(String email) throws SQLException {
        List<Workspace> allWorkspace = workspaceRepository.findByUserId(email);
        return getAllDbContent(allWorkspace, "dbConnection", email);
    }

    public List<WorkspaceContentResponse> getAllDbContent(List<Workspace> allworkspace, String contentType,
            String userId) {
        List<WorkspaceContentResponse> WCResponse = new ArrayList<>();
        for (Workspace w : allworkspace) {
            WorkspaceContentResponse response = new WorkspaceContentResponse();
            response.setContentType(contentType);
            response.setWorkspaceId(w.getId());
            response.setWorkspaceName(w.getName());

            // Null check for DbConnections
            List<IdNameDTO> conecnts = new ArrayList<>();
            if (w.getDbConnections() != null && !w.getDbConnections().isEmpty()) {
                for (DBConnection db : w.getDbConnections()) {
                    IdNameDTO content = new IdNameDTO();
                    content.setId(db.getId());
                    content.setCreatedBy(db.getCreatedBy());
                    content.setName(db.getConnectionName());
                    conecnts.add(content);
                }
            }

            // Fetch all sub-workspaces
            List<SubWorkspaceContentResponse> subWorkspaceContent = new ArrayList<>();
            List<Workspace> subWorkpaces = workspaceRepository.findByUserIdAndParentWorkspaceId(userId, w.getId());
            if (subWorkpaces != null && !subWorkpaces.isEmpty()) {
                for (Workspace sw : subWorkpaces) {
                    SubWorkspaceContentResponse swContent = new SubWorkspaceContentResponse();

                    // Null check for sub-workspace DbConnections
                    List<IdNameDTO> subConecnts = new ArrayList<>();
                    if (sw.getDbConnections() != null && !sw.getDbConnections().isEmpty()) {
                        for (DBConnection db : sw.getDbConnections()) {
                            IdNameDTO content = new IdNameDTO();
                            content.setId(db.getId());
                            content.setCreatedBy(db.getCreatedBy());
                            content.setName(db.getConnectionName());
                            subConecnts.add(content);
                        }
                    }

                    swContent.setContents(subConecnts);
                    swContent.setWorkspaceName(sw.getName());
                    swContent.setWorkspaceId(sw.getId());
                    subWorkspaceContent.add(swContent);
                }
            }

            response.setContents(conecnts);
            response.setSubWorkspaces(subWorkspaceContent);
            WCResponse.add(response);
        }

        // Return empty list if no data exists
        return WCResponse.isEmpty() ? Collections.emptyList() : WCResponse;
    }

    public List<WorkspaceContentResponse> getDatasetsOnWorkspaces(String email) throws SQLException {
        List<Workspace> allWorkspace = workspaceRepository.findByUserId(email);

        return getAllDatasetContent(allWorkspace, "dataset", email);
    }

    public List<WorkspaceContentResponse> getAllDatasetContent(List<Workspace> allworkspace, String contentType,
            String userId) {
        List<WorkspaceContentResponse> WCResponse = new ArrayList<>();
        for (Workspace w : allworkspace) {
            WorkspaceContentResponse response = new WorkspaceContentResponse();
            response.setContentType(contentType);
            response.setWorkspaceId(w.getId());
            response.setWorkspaceName(w.getName());

            // Null check for DbConnections
            List<IdNameDTO> conecnts = new ArrayList<>();
            if (w.getDataSets() != null && !w.getDataSets().isEmpty()) {
                for (Dataset d : w.getDataSets()) {
                    IdNameDTO content = new IdNameDTO();
                    content.setId(d.getId());
                    content.setCreatedBy(d.getCreatedBy());
                    content.setName(d.getDatasetName());
                    conecnts.add(content);
                }
            }

            // Fetch all sub-workspaces
            List<SubWorkspaceContentResponse> subWorkspaceContent = new ArrayList<>();
            List<Workspace> subWorkpaces = workspaceRepository.findByUserIdAndParentWorkspaceId(userId, w.getId());
            if (subWorkpaces != null && !subWorkpaces.isEmpty()) {
                for (Workspace sw : subWorkpaces) {
                    SubWorkspaceContentResponse swContent = new SubWorkspaceContentResponse();

                    // Null check for sub-workspace DbConnections
                    List<IdNameDTO> subConecnts = new ArrayList<>();
                    if (sw.getDataSets() != null && !sw.getDataSets().isEmpty()) {
                        for (Dataset db : sw.getDataSets()) {
                            IdNameDTO content = new IdNameDTO();
                            content.setId(db.getId());
                            content.setCreatedBy(db.getCreatedBy());
                            content.setName(db.getDatasetName());
                            subConecnts.add(content);
                        }
                    }

                    swContent.setContents(subConecnts);
                    swContent.setWorkspaceName(sw.getName());
                    swContent.setWorkspaceId(sw.getId());
                    subWorkspaceContent.add(swContent);
                }
            }

            response.setContents(conecnts);
            response.setSubWorkspaces(subWorkspaceContent);
            WCResponse.add(response);
        }

        return WCResponse.isEmpty() ? Collections.emptyList() : WCResponse;
    }

    public List<WorkspaceContentResponse> getFlatFilesOnWorkspaces(String email) throws SQLException {
        List<Workspace> allWorkspace = workspaceRepository.findByUserId(email);
        return getAllFlatFileContent(allWorkspace, "flatfile", email);
    }

    public List<WorkspaceContentResponse> getAllFlatFileContent(List<Workspace> allWorkspace, String contentType,
            String userId) {
        List<WorkspaceContentResponse> WCResponse = new ArrayList<>();

        for (Workspace w : allWorkspace) {
            WorkspaceContentResponse response = new WorkspaceContentResponse();
            response.setContentType(contentType);
            response.setWorkspaceId(w.getId());
            response.setWorkspaceName(w.getName());

            // Process flat files for the workspace
            List<IdNameDTO> flatFileContents = new ArrayList<>();
            if (w.getFlatFiles() != null && !w.getFlatFiles().isEmpty()) {
                for (FileData f : w.getFlatFiles()) {
                    IdNameDTO content = new IdNameDTO();
                    content.setId(f.getId());
                    content.setCreatedBy(f.getCreatedBy());
                    content.setName(f.getName());
                    flatFileContents.add(content);
                }
            }

            // Process sub-workspaces
            List<SubWorkspaceContentResponse> subWorkspaceContent = new ArrayList<>();
            List<Workspace> subWorkspaces = workspaceRepository.findByUserIdAndParentWorkspaceId(userId, w.getId());
            if (subWorkspaces != null && !subWorkspaces.isEmpty()) {
                for (Workspace sw : subWorkspaces) {
                    SubWorkspaceContentResponse swContent = new SubWorkspaceContentResponse();

                    // Process flat files for sub-workspace
                    List<IdNameDTO> subFlatFileContents = new ArrayList<>();
                    if (sw.getFlatFiles() != null && !sw.getFlatFiles().isEmpty()) {
                        for (FileData f : sw.getFlatFiles()) {
                            IdNameDTO content = new IdNameDTO();
                            content.setId(f.getId());
                            content.setCreatedBy(f.getCreatedBy());
                            content.setName(f.getName());
                            subFlatFileContents.add(content);
                        }
                    }

                    swContent.setContents(subFlatFileContents);
                    swContent.setWorkspaceName(sw.getName());
                    swContent.setWorkspaceId(sw.getId());
                    subWorkspaceContent.add(swContent);
                }
            }

            // Set contents and sub-workspaces in the response
            response.setContents(flatFileContents);
            response.setSubWorkspaces(subWorkspaceContent);
            WCResponse.add(response);
        }

        return WCResponse.isEmpty() ? Collections.emptyList() : WCResponse;
    }

    public List<WorkspaceContentDTO> workspaceToWorkspaceContentDTO(List<Workspace> allWorkspaces) {
        List<WorkspaceContentDTO> workspaceContentDTOs = new ArrayList<>();

        for (Workspace workspace : allWorkspaces) {
            WorkspaceContentDTO dto = WorkspaceContentDTO.builder()
                    .id(workspace.getId())
                    .name(workspace.getName())
                    .createdBy(workspace.getCreatedBy())
                    .workspaceId(workspace.getId())
                    .workspaceName(workspace.getName())
                    .parentId(workspace.getParent() != null ? workspace.getParent().getId() : null)
                    .parentWorkspaceName(workspace.getParent() != null ? workspace.getParent().getName() : null)
                    .build();

            workspaceContentDTOs.add(dto);
        }

        return workspaceContentDTOs;
    }

    public ResponseEntity<Object> getWorkspaceResponse(List<Workspace> workspaces) {
        List<Map<String, Object>> responseList = new ArrayList<>();

        for (Workspace workspace : workspaces) {
            // Build the workspace-level structure
            Map<String, Object> workspaceMap = new HashMap<>();
            workspaceMap.put("workspaceId", workspace.getId());
            workspaceMap.put("workspaceName", workspace.getName());
            workspaceMap.put("contentType", "dbConnection");

            // Extract DB Connections and add them to 'contents'
            List<Map<String, Object>> contents = new ArrayList<>();
            if (workspace.getDbConnections() != null) {
                for (DBConnection dbConnection : workspace.getDbConnections()) {
                    Map<String, Object> connectionMap = new HashMap<>();
                    connectionMap.put("id", dbConnection.getId());
                    connectionMap.put("name", dbConnection.getConnectionName());
                    connectionMap.put("createdBy", dbConnection.getCreatedBy());
                    contents.add(connectionMap);
                }
            }
            workspaceMap.put("contents", contents);

            // Add an empty 'subWorkspaces' (assuming it will be filled later)
            workspaceMap.put("subWorkspaces", new ArrayList<>());

            // Add the constructed workspace map to the response list
            responseList.add(workspaceMap);
        }

        // Return the response using ResponseEntity
        return ResponseEntity.status(HttpStatus.OK).body(responseList);
    }

    public List<WorkspaceResponse> workspaceView(String email) throws SQLException {
        // not subworkspace
        List<Workspace> allworkspace = workspaceRepository.findByUserId(email);
        System.out.println(allworkspace.size());
        List<WorkspaceResponse> result = new ArrayList<>();
        for (Workspace w : allworkspace) {
            WorkspaceResponse wResponse = WorkspaceResponse.builder()
                    .id(w.getId())
                    .createdAt(w.getCreatedAt())
                    .createdBy(w.getCreatedBy())
                    .name(w.getName())
                    .updatedAt(w.getUpdatedAt())
                    .updatedBy(w.getUpdatedBy())
                    .build();
            if (w.getParent() != null) {
                wResponse.setParentWorkspaceId(w.getParent().getId());
                wResponse.setParentWorkspaceName(w.getParent().getName());

            }
            result.add(wResponse);
        }
        return result;

    }

    // public static List<WorkspaceContentResponse>
    // toWorkspaceContentResponseList(List<WorkspaceContentDTO>
    // workspaceContentDTOs) {
    // return workspaceContentDTOs.stream()
    // .map(dto -> WorkspaceContentResponse.builder()
    // .id(dto.getId())
    // .name(dto.getName())
    // .createdBy(dto.getCreatedBy())
    // .workspaceId(dto.getWorkspaceId())
    // .workspaceName(dto.getWorkspaceName())
    // .parentId(dto.getParentId())
    // .parentWorkspaceName(dto.getParentWorkspaceName())
    // .build())
    // .collect(Collectors.toList());
    // }

    // public List<WorkspaceResponse> workspaceView(Long userId) throws SQLException
    // {
    // List<WorkspaceResponse> workspaces = new ArrayList<>();
    // DataSource dataSource = // Initialize your DataSource here (e.g., from a
    // DataSourceManager)

    // // Use normal DataSource to get the database connection
    // try (Connection connection = dataSource.getConnection();
    // PreparedStatement statement = connection.prepareStatement(
    // """
    // WITH workspace_view AS (
    // SELECT DISTINCT
    // w.id AS id,
    // w.name AS name,
    // COALESCE(w.parent_id, w.id) AS pid,
    // w.inherit_permission AS inherited,
    // w.created_by, w.created_at, w.updated_by, w.updated_at,
    // a.content_id AS content_id,
    // r.id AS role_id,
    // r.name AS role_name
    // FROM "users" u
    // LEFT JOIN users_groups ug ON ug.user_id = u.id
    // LEFT JOIN "groups" g ON ug.group_id = g.id
    // LEFT JOIN "access" a ON (g.id = a.grantee_id AND a.is_group = TRUE)
    // OR (u.id = a.grantee_id AND a.is_group = FALSE)
    // JOIN role r ON a.role_id = r.id
    // JOIN workspace w ON a.workspace_id = w.id
    // WHERE u.id = ? AND (w.inherit_permission = FALSE OR a.content_id != '')
    // ORDER BY created_at, content_id, role_id
    // ),
    // ranked_rows AS (
    // SELECT *,
    // ROW_NUMBER() OVER (PARTITION BY pid ORDER BY created_at, content_id, role_id)
    // AS row_rank
    // FROM workspace_view
    // ),
    // new_workspaces AS (
    // SELECT
    // COALESCE(pid, id) AS id,
    // inherited,
    // created_by,
    // created_at,
    // updated_by,
    // updated_at,
    // content_id,
    // CASE
    // WHEN content_id != '' THEN NULL
    // WHEN pid != id THEN NULL
    // ELSE role_id
    // END AS role_id,
    // CASE
    // WHEN content_id != '' THEN NULL
    // WHEN pid != id THEN NULL
    // ELSE role_name
    // END AS role_name,
    // row_rank
    // FROM ranked_rows
    // WHERE row_rank = 1
    // )
    // SELECT w.id, w.name, w.created_by, w.created_at, w.updated_by, w.updated_at,
    // nw.role_id, nw.role_name
    // FROM workspace w
    // JOIN new_workspaces nw ON w.id = nw.id
    // ORDER BY w.created_at;
    // """
    // )) {
    // statement.setLong(1, userId);

    // try (ResultSet resultSet = statement.executeQuery()) {
    // while (resultSet.next()) {
    // Long roleId = resultSet.getLong("role_id");
    // String workspaceId = resultSet.getString("id");

    // workspaces.add(new WorkspaceResponse(
    // workspaceId,
    // resultSet.getString("name"),
    // null,
    // null,
    // null,
    // resultSet.getString("created_by"),
    // OffsetDateTimeConverter.convertToOffsetDateTime(resultSet.getTimestamp("created_at")),
    // resultSet.getString("updated_by"),
    // OffsetDateTimeConverter.convertToOffsetDateTime(resultSet.getTimestamp("updated_at")),
    // roleId,
    // resultSet.getString("role_name"),
    // null
    // ));
    // }
    // }
    // }

    // return workspaces;
    // }

    // Main method to collect all workspace content
    public List<WorkspaceResponse> workspaceContentList(String email, String workspaceId) throws SQLException {
        List<WorkspaceResponse> allContents = new ArrayList<>();
        allContents.addAll(subFolderList(email, workspaceId));
        allContents.addAll(dbConnectionList(email, workspaceId)); 
        allContents.addAll(datasetList(email, workspaceId));
        allContents.addAll(flatfileList(email, workspaceId));
        allContents.addAll(playbookList(email, workspaceId));
        return allContents;
    }

    // Method to fetch list of subfolders
    private List<WorkspaceResponse> subFolderList(String email, String workspaceId) {
        
        List<WorkspaceResponse> subFolders =new ArrayList<>();
        List<Workspace> allsubWorkspaces= workspaceRepository.findByUserIdAndParentWorkspaceId(email, workspaceId);
        for (Workspace w : allsubWorkspaces) {

            WorkspaceResponse wResponse = WorkspaceResponse.builder()
                    .id(w.getId())
                    .createdAt(w.getCreatedAt())
                    .createdBy(w.getCreatedBy())
                    .name(w.getName())
                    .contentType(1L)
                    .updatedAt(w.getUpdatedAt())
                    .updatedBy(w.getUpdatedBy())
                    .build();
                subFolders.add(wResponse);
        }
        return subFolders;
    }

    // Method to fetch list of database connections
    private List<WorkspaceResponse> dbConnectionList(String email, String workspaceId) {
        List<WorkspaceResponse> dbconnections =new ArrayList<>();
        Workspace workspace= workspaceRepository.findWorkspaceById(workspaceId);
        for(DBConnection db:workspace.getDbConnections()){
            WorkspaceResponse wr= WorkspaceResponse.builder()
            .id(db.getId())
            .createdAt(db.getCreatedAt())
            .createdBy(db.getCreatedBy())
            .name(db.getConnectionName())
            .contentType(2L)
            .updatedAt(db.getUpdatedAt())
            .updatedBy(db.getUpdatedBy())
            .build();
            dbconnections.add(wr);

        }        
        return dbconnections;
    }

    // Method to fetch list of datasets
    private List<WorkspaceResponse> datasetList(String email, String workspaceId) {
        List<WorkspaceResponse> dbconnections =new ArrayList<>();
        Workspace workspace= workspaceRepository.findWorkspaceById(workspaceId);
        for(Dataset db:workspace.getDataSets()){
            WorkspaceResponse wr= WorkspaceResponse.builder()
            .id(db.getId())
            .createdAt(db.getCreatedAt())
            .createdBy(db.getCreatedBy())
            .name(db.getDatasetName())
            .contentType(3L)
            .updatedAt(db.getUpdatedAt())
            .updatedBy(db.getUpdatedBy())
            .build();
            dbconnections.add(wr);

        }        
        return dbconnections;
    }

    // Method to fetch list of flat files
    private List<WorkspaceResponse> flatfileList(String email, String workspaceId) {
        List<WorkspaceResponse> dbconnections =new ArrayList<>();
        Workspace workspace= workspaceRepository.findWorkspaceById(workspaceId);
        for(FileData db:workspace.getFlatFiles()){
            WorkspaceResponse wr= WorkspaceResponse.builder()
            .id(db.getId())
            .createdAt(db.getCreatedAt())
            .createdBy(db.getCreatedBy())
            .name(db.getName())
            .contentType(4L)
            .updatedAt(db.getUpdatedAt())
            .updatedBy(db.getUpdatedBy())
            .build();
            dbconnections.add(wr);
        }        
        return dbconnections;
    }

    // Method to fetch list of playbooks
    private List<WorkspaceResponse> playbookList(String email, String workspaceId) {
        List<WorkspaceResponse> dbconnections =new ArrayList<>();
        Workspace workspace= workspaceRepository.findWorkspaceById(workspaceId);
        for(PlayBook db:workspace.getPlaybooks()){
            WorkspaceResponse wr= WorkspaceResponse.builder()
            .id(db.getId())
            .createdAt(db.getCreatedAt())
            .createdBy(db.getCreatedBy())
            .name(db.getName())
            .contentType(5L)
            .updatedAt(db.getUpdatedAt())
            .updatedBy(db.getUpdatedBy())
            .build();
            dbconnections.add(wr);
        }        
        return dbconnections;
    }

}