package hs.aalen.fitness_tracker_backend.plans.repository;

import hs.aalen.fitness_tracker_backend.plans.model.Plans;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlansRepository extends JpaRepository<Plans, UUID> {
    Optional<Plans> findByNameIgnoreCase(String name);
}
