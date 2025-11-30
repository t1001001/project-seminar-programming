package hs.aalen.fitness_tracker_backend.sessionlogs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.SessionLogs;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface SessionLogsRepository extends JpaRepository<SessionLogs, UUID> {

    List<SessionLogs> findBySessionId(UUID sessionId);

    List<SessionLogs> findByStatus(SessionLogs.LogStatus status);

    List<SessionLogs> findByStartedAtBetween(LocalDateTime start, LocalDateTime end);
}
