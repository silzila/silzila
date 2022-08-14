package org.silzila.app.security.service;

import org.silzila.app.model.User;
import org.silzila.app.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {

        // User user = userRepository.findById(id)
        User user = userRepository.findByEmail(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with Username: " + id));

        return UserDetailsImpl.build(user);
    }

    // Newly added
    @Transactional
    public UserDetails loadUserById(String id) throws UsernameNotFoundException {

        // User user = userRepository.findById(id)
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with Id: " + id));

        return UserDetailsImpl.build(user);
    }

    @Transactional
    public UserDetails loadUserByEmail(String id) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with Email: " + id));

        return UserDetailsImpl.build(user);
    }

}