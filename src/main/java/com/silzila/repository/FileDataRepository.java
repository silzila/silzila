package com.silzila.repository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import com.silzila.domain.entity.FileData;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface FileDataRepository extends JpaRepository<FileData, String> {

    List<FileData> findByUserId(String userId);

    Optional<FileData> findById(String id);

    Optional<FileData> findByIdAndUserId(String id, String userId);

    List<FileData> findByIdNotAndUserIdAndName(String id, String userId, String fileName);

    List<FileData> findByUserIdAndName(String userId, String fileName);

}
