package com.silzila.service;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

import com.silzila.domain.entity.User;
import com.silzila.repository.UserRepository;

@RunWith(SpringRunner.class)
@SpringBootTest
class UserServiceTest {
	
	@MockBean
	UserRepository mockedUserRepository;
	
	@Autowired
	UserService userService;
	
	@MockBean
	User mockedUser;
	
	

	@Test
	void testGetAllUsers() {
		List<User> allUser = new ArrayList<User>();
		allUser.add(mockedUser);
		when(mockedUserRepository.findAll()).thenReturn(allUser);
		userService.getAllUsers();
		verify(mockedUserRepository, times(1)).findAll();
	}

	@Test
	void testGetUserByUsername() {
		when(mockedUserRepository.findByUsername(anyString())).thenReturn(Optional.empty());
		userService.getUserByUsername(anyString());
		verify(mockedUserRepository, times(1)).findByUsername(anyString());
	}

}
