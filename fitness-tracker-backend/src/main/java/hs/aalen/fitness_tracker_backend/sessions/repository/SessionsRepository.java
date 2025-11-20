package hs.aalen.fitness_tracker_backend.sessions.repository;

import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.time.LocalDate;

@Repository
public interface SessionsRepository extends JpaRepository<Sessions, UUID> {
    // Alte Methode entfernen oder umbenennen
    Optional<Sessions> findByNameIgnoreCase(String name);

    // Neue Methode hinzufuegen:
    Optional<Sessions> findByNameAndScheduledDateAndPlan_Id(
            String name,
            LocalDate scheduledDate,
            UUID planId);

    long countByExerciseExecutions_Id(UUID exerciseId);
}
