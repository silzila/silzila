package com.silzila.repository;

import java.util.List;
import java.util.Optional;

import com.silzila.domain.entity.PlayBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayBookRepository extends JpaRepository<PlayBook, String> {

    List<PlayBook> findByUserId(String userId);

    Optional<PlayBook> findByIdAndUserIdAndWorkspaceId(String id, String userId, String workspaceId);

    Optional<PlayBook> findById(String id);

    Optional<PlayBook> findByIdAndUserId(String id, String userId);

    List<PlayBook> findByIdNotAndUserIdAndName(String id, String userId, String name);

    List<PlayBook> findByUserIdAndName(String userId, String name);

    Boolean existsByNameAndWorkspaceId(String name, String string);

    Optional<PlayBook> findByIdAndWorkspaceId(String id,String workspaceId);


       @Query("SELECT p.id AS playbookId, p.name, p.createdBy, w.id AS workspaceId, w.name AS workspaceName, " +
            "w.parent.id AS parentWorkspaceId, w.parent.name AS parentWorkspaceName " +
            "FROM PlayBook p " +
            "JOIN p.workspace w " +
            "LEFT JOIN w.parent parent " +
            "WHERE p.id IN :playbookIds")
    List<Object[]> findPlayBooksWithWorkspaceAndParentDetails(@Param("playbookIds") List<String> playbookIds);

    @Query(value = "SELECT * FROM playbook p WHERE p.content::text LIKE %:searchTerm%", nativeQuery = true)
    List<PlayBook> findByContentContaining(@Param("searchTerm") String searchTerm);

}
