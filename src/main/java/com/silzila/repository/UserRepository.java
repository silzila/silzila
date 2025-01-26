package com.silzila.repository;

import com.silzila.domain.entity.User;
import com.silzila.domain.entity.Workspace;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);
  
  


}
