package com.silzila.repository;

import com.silzila.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);

}
