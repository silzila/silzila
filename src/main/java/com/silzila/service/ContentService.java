package com.silzila.service;

import com.silzila.domain.entity.DBConnection;
import com.silzila.domain.entity.Dataset;
import com.silzila.domain.entity.FileData;
import com.silzila.domain.entity.PlayBook;
import com.silzila.domain.entity.User;
import com.silzila.domain.entity.Workspace;
import com.silzila.dto.WorkspaceDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.helper.UtilityService;
import com.silzila.payload.request.WorkspaceRequest;
import com.silzila.payload.response.RenameRequest;
import com.silzila.repository.WorkspaceRepository;

import jakarta.transaction.Transactional;

import com.silzila.repository.DBConnectionRepository;
import com.silzila.repository.DatasetRepository;
import com.silzila.repository.FileDataRepository;
import com.silzila.repository.PlayBookRepository;
import com.silzila.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.sql.SQLException;
import java.util.Optional;

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
    
    

}
