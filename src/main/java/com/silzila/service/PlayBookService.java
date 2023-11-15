package com.silzila.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.json.JSONObject;

import com.silzila.exception.BadRequestException;
import com.silzila.exception.RecordNotFoundException;
import com.silzila.domain.entity.PlayBook;
import com.silzila.dto.PlayBookMetaDTO;
import com.silzila.payload.request.PlayBookRequest;
import com.silzila.payload.response.PlayBookResponse;
import com.silzila.repository.PlayBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class PlayBookService {

        @Autowired
        PlayBookRepository playBookRepository;

        // create Playbook
        public PlayBook createPlayBook(PlayBookRequest playBookRequest, String userId)
                        throws JsonProcessingException, BadRequestException {

                // if Playbook already exists, send error
                List<PlayBook> playBooks = playBookRepository.findByUserIdAndName(userId,
                                playBookRequest.getName());
                if (!playBooks.isEmpty()) {
                        throw new BadRequestException("Error: PlayBook Name is already taken!");
                }
                // seriailze playbook content into json
                ObjectMapper mapper = new ObjectMapper();
                JSONObject jsonObject = new JSONObject(mapper.writeValueAsString(playBookRequest.getContent()));
                // create playbook object to persist in DB
                PlayBook playBook = new PlayBook(
                                userId,
                                playBookRequest.getName(),
                                playBookRequest.getDescription(),
                                jsonObject.toString());
                playBookRepository.save(playBook);
                return playBook;
        }

        // read all Playbooks Metadata
        public List<PlayBookMetaDTO> getAllPlayBooks(String userId) throws JsonProcessingException {
                List<PlayBook> playBooks = playBookRepository.findByUserId(userId);
                List<PlayBookMetaDTO> pbDtos = new ArrayList<>();
                playBooks.forEach((pb) -> {
                        PlayBookMetaDTO dto = new PlayBookMetaDTO(pb.getId(), pb.getUserId(),
                                        pb.getName(), pb.getDescription());
                        pbDtos.add(dto);
                });
                return pbDtos;
        }

        // read One PlayBook
        public PlayBookResponse getPlayBookById(String id, String userId)
                        throws JsonMappingException, JsonProcessingException, RecordNotFoundException {
                // if no PlayBook details inside optional warpper, then send NOT FOUND Error
                Optional<PlayBook> pOptional = playBookRepository.findByIdAndUserId(id,
                                userId);
                if (!pOptional.isPresent()) {
                        throw new RecordNotFoundException("Error: No such PlayBook Id exists!");
                }
                // seriaize to JSON content
                ObjectMapper mapper = new ObjectMapper();
                PlayBook playBook = pOptional.get();
                JsonNode jsonContent = mapper.valueToTree(playBook);
                // create response object
                PlayBookResponse playBookResponse = new PlayBookResponse(
                                playBook.getId(),
                                playBook.getUserId(),
                                playBook.getName(),
                                playBook.getDescription(),
                                jsonContent);
                return playBookResponse;

        }

        // update PlayBook
        public PlayBook updatePlayBook(PlayBookRequest playBookRequest, String id, String userId)
                        throws RecordNotFoundException, JsonProcessingException, JsonMappingException,
                        BadRequestException {

                Optional<PlayBook> pOptional = playBookRepository.findByIdAndUserId(id, userId);
                // if no PlayBook inside optional warpper, then send NOT FOUND Error
                if (!pOptional.isPresent()) {
                        throw new RecordNotFoundException("Error: No such PlayBook Id exists!");
                }
                // if dataset name already exists, send error
                List<PlayBook> playBooks = playBookRepository.findByIdNotAndUserIdAndName(id, userId,
                                playBookRequest.getName());
                if (!playBooks.isEmpty()) {
                        throw new BadRequestException("Error: PlayBook Name is already taken!");
                }
                // seriailze playbook content into json
                ObjectMapper mapper = new ObjectMapper();
                JSONObject jsonObject = new JSONObject(mapper.writeValueAsString(playBookRequest.getContent()));
                // create playbook object to persist in DB
                PlayBook playBook = new PlayBook(
                                userId,
                                playBookRequest.getName(),
                                playBookRequest.getDescription(),
                                jsonObject.toString());
                // add existing id of PlayBook to make it edit intead of save new
                playBook.setId(id);
                playBookRepository.save(playBook);
                return playBook;
        }

        // delete PlayBook
        public void deletePlayBook(String id, String userId) throws RecordNotFoundException {
                // fetch specific PlayBook for the user
                Optional<PlayBook> pOptional = playBookRepository.findByIdAndUserId(id, userId);
                // if no PlayBook inside optional warpper, then send NOT FOUND Error
                if (!pOptional.isPresent()) {
                        throw new RecordNotFoundException("Error: No such PlayBook Id exists!");
                }
                // Delete from DB
                playBookRepository.deleteById(id);
        }
}
