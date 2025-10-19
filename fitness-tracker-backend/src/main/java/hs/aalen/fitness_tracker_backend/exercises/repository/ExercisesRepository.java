package hs.aalen.fitness_tracker_backend.exercises.repository;

import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExercisesRepository extends JpaRepository<Exercises, UUID> {
    Optional<Exercises> findByNameIgnoreCase(String name);
}