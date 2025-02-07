package com.silzila.helper;

import com.databricks.client.jdbc42.internal.facebook.fb303.FacebookService.AsyncProcessor.reinitialize;
import com.silzila.domain.entity.User;
import com.silzila.domain.entity.Workspace;
import com.silzila.exception.BadRequestException;
import com.silzila.repository.UserRepository;
import com.silzila.repository.WorkspaceRepository;
import com.silzila.exception.BadRequestException;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UtilityService {
    @Autowired
    WorkspaceRepository workspaceRepository;

    @Autowired
    UserRepository userRepository;

    public void validateNonEmptyString(String string)throws BadRequestException {
        if(string == null || string.trim().isEmpty()){
            throw new BadRequestException("Value should not be null or empty string");
        }
    }
    @Transactional
    public Workspace getWorkspaceById(String workspaceId) {
            Workspace workspace = workspaceRepository.findById(workspaceId).get();
            return workspace;
    }
    public User getUserFromEmail(String email)throws BadRequestException {
        User user = userRepository.findByUsername(email).orElseThrow(() -> new BadRequestException("No such user"));;
        return user;
    }
    public void isValidWorkspaceId(String workspaceId)throws BadRequestException{
        boolean workspaceExists = workspaceRepository.existsById(workspaceId);
        if (!workspaceExists) {
            throw new BadRequestException("workspaceId not present");
        }
    }
   
}
