package hs.aalen.fitness_tracker_backend.executionlogs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import hs.aalen.fitness_tracker_backend.executionlogs.model.ExecutionLogs;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExecutionLogsRepository extends JpaRepository<ExecutionLogs, UUID> {

    List<ExecutionLogs> findBySessionLogId(UUID sessionLogId);

    List<ExecutionLogs> findByExerciseExecutionId(Integer exerciseExecutionId);
}
