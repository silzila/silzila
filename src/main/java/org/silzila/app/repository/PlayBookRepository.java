package org.silzila.app.repository;

import java.util.List;
import java.util.Optional;

import org.silzila.app.model.PlayBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayBookRepository extends JpaRepository<PlayBook, String> {

    List<PlayBook> findByUserId(String userId);

    Optional<PlayBook> findById(String id);

    Optional<PlayBook> findByIdAndUserId(String id, String userId);

    List<PlayBook> findByIdNotAndUserIdAndName(String id, String userId, String name);

    List<PlayBook> findByUserIdAndName(String userId, String name);

}
