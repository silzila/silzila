package com.silzila.repository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import com.silzila.domain.entity.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface DatasetRepository extends JpaRepository<Dataset, String> {

    List<Dataset> findByUserId(String userId);

    Optional<Dataset> findById(String id);

    Optional<Dataset> findByIdAndUserId(String id, String userId);

    List<Dataset> findByIdNotAndUserIdAndDatasetName(String id, String userId, String dataSetName);

    List<Dataset> findByUserIdAndDatasetName(String userId, String datasetName);

}
