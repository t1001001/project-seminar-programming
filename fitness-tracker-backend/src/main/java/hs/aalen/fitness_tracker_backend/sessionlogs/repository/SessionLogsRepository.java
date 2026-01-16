package hs.aalen.fitness_tracker_backend.sessionlogs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.SessionLogs;
import hs.aalen.fitness_tracker_backend.users.model.Users;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SessionLogsRepository extends JpaRepository<SessionLogs, UUID> {

    List<SessionLogs> findByOriginalSessionId(UUID originalSessionId);

    List<SessionLogs> findByStatus(SessionLogs.LogStatus status);

    List<SessionLogs> findByStartedAtBetween(LocalDateTime start, LocalDateTime end);

    // User-filtered queries for data isolation
    List<SessionLogs> findByOwner(Users owner);

    List<SessionLogs> findByOwnerAndOriginalSessionId(Users owner, UUID originalSessionId);

    Optional<SessionLogs> findByIdAndOwner(UUID id, Users owner);

    long countByOwnerAndOriginalSessionId(Users owner, UUID originalSessionId);
}
