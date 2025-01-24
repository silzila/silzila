package com.silzila.service;

import com.silzila.domain.entity.User;
import com.silzila.domain.entity.Workspace;
import com.silzila.dto.WorkspaceDTO;
import com.silzila.exception.BadRequestException;
import com.silzila.helper.UtilityService;
import com.silzila.payload.request.WorkspaceRequest;
import com.silzila.repository.WorkspaceRepository;
import com.silzila.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class ContentService {
    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final UtilityService utilityService;


    public ResponseEntity<?> createWorkspace(String userId, WorkspaceRequest request) throws BadRequestException {
        // Find user by email
        Optional<User> optionalUser = userRepository.findByEmail(userId);
        if (!optionalUser.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = optionalUser.get();
        String workspaceName = request.getName().trim();
        utilityService.validateNonEmptyString(workspaceName);

        if(workspaceRepository.existsByNameAndParentId(workspaceName,request.getParentId())){
            throw new BadRequestException("Name is already taken");
        }
        Workspace existingWorkspace = null;
        if (request.getParentId() != null) {
            Optional<Workspace> optionalWorkspace = workspaceRepository.findById(request.getParentId());
            if (optionalWorkspace.isPresent()) {
                existingWorkspace = optionalWorkspace.get();
                if(existingWorkspace.getParent()!= null && existingWorkspace.getParent().getId()!=null){
                    throw new BadRequestException("It is already a sub folder");
                }
            } else {
                throw new BadRequestException("Parent workspace not found");
            }
        }
        Workspace workspace = Workspace.builder()
                .name(workspaceName)
                .parent(existingWorkspace)
                .createdBy(user.getName())
                .build();
        Workspace savedWorkspace = workspaceRepository.save(workspace);
        WorkspaceDTO workspaceResponse = new WorkspaceDTO(
                savedWorkspace.getId(),
                savedWorkspace.getName(),
                savedWorkspace.getParent() != null ? savedWorkspace.getParent().getId() : null
        );
        return ResponseEntity.ok(workspaceResponse);
    }


}
