package com.silzila.helper;

import com.silzila.domain.entity.Workspace;
import com.silzila.exception.BadRequestException;
import com.silzila.repository.WorkspaceRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UtilityService {
    @Autowired
    WorkspaceRepository workspaceRepository;

    public void validateNonEmptyString(String string) throws BadRequestException {
        if(string == null || string.trim().isEmpty()){
            throw new BadRequestException("Value should not be null or empty string");
        }
    }
    @Transactional
    public Workspace getWorkspaceById(String workspaceId) {
            Workspace workspace = workspaceRepository.findById(workspaceId).get();
            return workspace;
    }
}
