package hs.aalen.fitness_tracker_backend.users.repository;

import hs.aalen.fitness_tracker_backend.users.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsersRepository extends JpaRepository<Users, UUID> {
    Optional<Users> findByNameIgnoreCase(String username);
}
