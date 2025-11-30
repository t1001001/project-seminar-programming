package hs.aalen.fitness_tracker_backend.sessions.repository;

import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface SessionsRepository extends JpaRepository<Sessions, UUID> {

    Optional<Sessions> findByNameIgnoreCase(String name);

    Optional<Sessions> findByNameAndPlan_Id(String name, UUID planId);

    List<Sessions> findByPlan_Id(UUID planId);
}
