package com.silzila.service.impl;

import com.silzila.domain.entity.User;
import com.silzila.exception.NoUserFoundException;
import com.silzila.model.factory.UserFactory;
import com.silzila.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

  private final UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User aUser = this.userRepository
        .findByUsername(username)
        .orElseThrow(
            () -> new NoUserFoundException(String.format("No user found with username '%s'.", username)));
    return UserFactory.create(aUser);
  }

}
