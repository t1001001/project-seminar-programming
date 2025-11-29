package hs.aalen.fitness_tracker_backend.exerciseexecutions.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExerciseExecutionsRepository extends JpaRepository<ExerciseExecutions, UUID> {

    List<ExerciseExecutions> findBySessionIdOrderByOrderID(UUID sessionId);

    List<ExerciseExecutions> findByExerciseId(UUID exerciseId);
}