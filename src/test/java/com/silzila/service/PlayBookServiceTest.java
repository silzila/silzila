// package com.silzila.service;

// import static org.junit.Assert.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.anyString;
// import static org.mockito.Mockito.times;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;

// import java.util.ArrayList;
// import java.util.List;
// import java.util.Optional;

// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.junit.runner.RunWith;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.test.context.junit4.SpringRunner;

// import com.silzila.domain.entity.PlayBook;
// import com.silzila.exception.BadRequestException;
// import com.silzila.exception.RecordNotFoundException;
// import com.silzila.payload.request.PlayBookRequest;
// import com.silzila.payload.response.PlayBookResponse;
// import com.silzila.repository.PlayBookRepository;

// import com.fasterxml.jackson.core.JsonProcessingException;
// import com.fasterxml.jackson.databind.ObjectMapper;

// @RunWith(SpringRunner.class)
// @SpringBootTest
// public class PlayBookServiceTest {
	
// 	@Autowired
// 	PlayBookService playBookService;
	
// 	@MockBean
// 	PlayBookRepository mockedPlayBookRepository;
	
// 	@MockBean
// 	PlayBook mockedPlayBook;
	
// 	private PlayBookRequest getMockedPlayBookRequest() {
// 		PlayBookRequest mockedPlayBookRequest = new PlayBookRequest();
// 		mockedPlayBookRequest.setName("test");
// 		mockedPlayBookRequest.setDescription("desc");
// 		ObjectMapper mapper = new ObjectMapper();
// 		mockedPlayBookRequest.setContent(mapper.valueToTree(mockedPlayBook));
		
// 		return mockedPlayBookRequest;
// 	}
	
// 	private List<PlayBook> getListOfPlayBook(){
// 		List<PlayBook> mockedResult = new ArrayList<PlayBook>();
// 		PlayBook mockPlayBook = getPlayBook();
// 		mockedResult.add(mockPlayBook);
		
// 		return mockedResult;
// 	}
	
// 	private List<PlayBook> getEmptyListOfPlayBook(){
// 		List<PlayBook> mockedResult = new ArrayList<PlayBook>();
// 		return mockedResult;
// 	}
	
// 	private PlayBook getPlayBook() {
// 		PlayBook mockPlayBook = new PlayBook();
// 		mockPlayBook.setUserId("testUserId");
// 		mockPlayBook.setId("testId");
// 		mockPlayBook.setName("testName");
// 		mockPlayBook.setDescription("testDesription");
// 		return mockPlayBook;
// 	}
	

// 	@Test
// 	@DisplayName("Test create playbook negative scenario")
// 	public void testCreatePlayBookError() {
// 		/***
// 		 * This method tests the case where if there are any playbook with the same name exists
// 		 * it throws an error while creating playbook.
// 		 */
		
// 		List<PlayBook> mockedResult = getListOfPlayBook();
// 		when(mockedPlayBookRepository.findByUserIdAndName(anyString(), anyString())).thenReturn(mockedResult);
		
// 		String exceptionMessage = "";
// 		try {
// 			PlayBookRequest mockedPlayBookRequest = getMockedPlayBookRequest();
// 			playBookService.createPlayBook(mockedPlayBookRequest, "test");
// 		}catch (BadRequestException | JsonProcessingException e) {
// 			exceptionMessage = e.getMessage();
// 		}
// 		// There shouldn't be a call to save, because playbook service threw an exception.
// 		verify(mockedPlayBookRepository, times(0)).save(any());
// 		assertEquals("Error: PlayBook Name is already taken!", exceptionMessage);
// 	}
	
// 	@Test
// 	@DisplayName("Test create playbook happy path")
// 	public void testCreatePlayBookSuccess() {
// 		/***
// 		 * This method tests the case where if there is not any playbook with the same name exists
// 		 * then this checks whether the playbook gets created successfully or not.
// 		 */
// 		List<PlayBook> mockedResult = getEmptyListOfPlayBook();
// 		PlayBookRequest mockedPlayBookRequest = getMockedPlayBookRequest(); 
		
		
// 		when(mockedPlayBookRepository.findByUserIdAndName(anyString(), anyString())).thenReturn(mockedResult);
// 		when(mockedPlayBookRepository.save(any())).thenReturn(mockedPlayBook);
		
		
// 		try {
// 			playBookService.createPlayBook(mockedPlayBookRequest, "test");
// 		} catch (JsonProcessingException | BadRequestException e) {
// 			e.printStackTrace();
// 			fail("Control should never reach here");
// 		}
// 		verify(mockedPlayBookRepository, times(1)).save(any());
// 	}

// 	@Test
// 	@DisplayName("Test get playbook by id threw error if id not exists")
// 	public void testGetPlayBookById() {
// 		when(mockedPlayBookRepository.findByIdAndUserId(anyString(), anyString())).thenReturn(java.util.Optional.empty());
		
// 		String exceptionMessage = "";
// 		try {
// 			playBookService.getPlayBookById(anyString(), anyString());
// 		} catch (JsonProcessingException | RecordNotFoundException e) {
// 			exceptionMessage = e.getMessage();
// 		}
		
// 		assertEquals("Error: No such PlayBook Id exists!", exceptionMessage);
// 	}
	
// 	@Test
// 	@DisplayName("Test get playbook by id return proper result")
// 	public void testGetPlayBookByIdSuccess() {
// 		PlayBook mockPlayBook = getPlayBook(); 
		
// 		when(mockedPlayBookRepository.findByIdAndUserId(anyString(), anyString())).thenReturn(Optional.of(mockPlayBook));
		
// 		PlayBookResponse playbookResponse = null;
// 		try {
// 			playbookResponse = playBookService.getPlayBookById(anyString(), anyString());
// 		} catch (JsonProcessingException | RecordNotFoundException e) {
// 			fail("The control should never reach here");
// 		}
		
// 		assertEquals(playbookResponse.getId(), mockPlayBook.getId());
// 		assertEquals(playbookResponse.getUserId(), mockPlayBook.getUserId());
// 		assertEquals(playbookResponse.getName(), mockPlayBook.getName());
		
// 	}
	
// 	@Test
// 	@DisplayName("Test update play book throws record not found exception properly")
// 	public void testUpdatePlayBookFailure1() {
		
// 		PlayBookRequest mockedPlayBookRequest = getMockedPlayBookRequest();
		
// 		when(mockedPlayBookRepository.findByIdAndUserId(anyString(), anyString())).thenReturn(Optional.empty());
		
// 		String exceptionMessage = "";
// 		try {
// 			playBookService.updatePlayBook(mockedPlayBookRequest, anyString(), anyString());
// 		} catch (RecordNotFoundException | JsonProcessingException | BadRequestException e) {
// 			exceptionMessage = e.getMessage();
// 		}
// 		assertEquals(exceptionMessage, "Error: No such PlayBook Id exists!");
// 		verify(mockedPlayBookRepository, times(0)).save(any());
// 	}
	
// 	@Test
// 	@DisplayName("Test update play book throws name already taken")
// 	public void testUpdatePlayBookFailure2() {
		
// 		List<PlayBook> mockedResult = getListOfPlayBook();
		
// 		PlayBookRequest mockedPlayBookRequest = getMockedPlayBookRequest();
		
// 		when(mockedPlayBookRepository.findByIdAndUserId(anyString(), anyString())).thenReturn(Optional.of(mockedPlayBook));
// 		when(mockedPlayBookRepository.findByIdNotAndUserIdAndName(anyString(), anyString(), anyString())).thenReturn(mockedResult);
		
		
// 		String exceptionMessage = "";
// 		try {
// 			playBookService.updatePlayBook(mockedPlayBookRequest, anyString(), anyString());
// 		} catch (RecordNotFoundException | JsonProcessingException | BadRequestException e) {
// 			exceptionMessage = e.getMessage();
// 		}
// 		assertEquals(exceptionMessage, "Error: PlayBook Name is already taken!");
// 		verify(mockedPlayBookRepository, times(0)).save(any());
// 	}
	
// 	@Test
// 	@DisplayName("Test update playbook saves the playbook")
// 	public void testUpdatePlayBookSuccess() {
// 		List<PlayBook> mockedResult = getEmptyListOfPlayBook();
		
// 		PlayBookRequest mockedPlayBookRequest = getMockedPlayBookRequest();
		
// 		when(mockedPlayBookRepository.findByIdAndUserId(anyString(), anyString())).thenReturn(Optional.of(mockedPlayBook));
// 		when(mockedPlayBookRepository.findByIdNotAndUserIdAndName(anyString(), anyString(), anyString())).thenReturn(mockedResult);
		
		
// 		try {
// 			playBookService.updatePlayBook(mockedPlayBookRequest, anyString(), anyString());
// 		} catch (RecordNotFoundException | JsonProcessingException | BadRequestException e) {
// 			fail("Control should never reach here");
// 		}
		
// 		verify(mockedPlayBookRepository, times(1)).save(any());
// 	}
	
// }
