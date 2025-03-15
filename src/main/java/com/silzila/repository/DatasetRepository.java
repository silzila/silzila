package com.silzila.repository;

import com.silzila.domain.entity.Workspace;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import com.silzila.domain.entity.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface DatasetRepository extends JpaRepository<Dataset, String> {

    List<Dataset> findByUserId(String userId);

    Boolean existsByDatasetNameAndWorkspaceId(String name, String workspaceId);
    
    Optional<Dataset> findById(String id);
    Boolean existsByDatasetNameAndWorkspaceIdAndUserId(String name, String workspaceId, String userId);


    Optional<Dataset> findByIdAndUserId(String id, String userId);

    List<Dataset> findByIdNotAndUserIdAndDatasetName(String id, String userId, String dataSetName);

    Optional<Dataset> findByIdAndWorkspaceId(String id,String workspaceId);
    
    List<Dataset> findByUserIdAndDatasetName(String userId, String datasetName);

     @Query("SELECT d.id AS datasetId, d.datasetName,d.createdBy, w.id AS workspaceId, w.name AS workspaceName, " +
       "w.parent.id AS parentWorkspaceId, w.parent.name AS parentWorkspaceName " +
       "FROM Dataset d " +
       "JOIN d.workspace w " +
       "LEFT JOIN w.parent parent " +
       "WHERE d.id IN :datasetIds")
    List<Object[]> findDatasetsWithWorkspaceAndParentDetails(@Param("datasetIds") List<String> datasetIds);
    
    List<Dataset> findAllByConnectionId(String connectionId);

    @Query(value = "SELECT * FROM dataset d WHERE d.data_schema LIKE %:searchTerm%", nativeQuery = true)
    List<Dataset> findByDataSchemaContaining(@Param("searchTerm") String searchTerm);

}
