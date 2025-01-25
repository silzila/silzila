package com.silzila.repository;

import com.silzila.domain.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WorkspaceRepository extends JpaRepository<Workspace,String> {
    List<Workspace>findByUserId(String userId);
    @Query(value = "SELECT EXISTS (" +
            "    SELECT 1 " +
            "    FROM workspace w " +
            "    WHERE w.name ILIKE ?1 AND COALESCE(w.parent_id, 'no_parent') = COALESCE(?2, 'no_parent')" +
            ") AS name_exists", nativeQuery = true)
    boolean existsByNameAndParentId(String name, String parentId);

    Boolean existsByParentId(String workspaceId);
}
