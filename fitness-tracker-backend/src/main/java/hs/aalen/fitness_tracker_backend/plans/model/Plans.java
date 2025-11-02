package hs.aalen.fitness_tracker_backend.plans.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;
import java.util.List;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;

// TODO: ADD "sessions" FIELD
@Entity
@Getter
@Setter
public class Plans {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @OneToMany
    @JoinTable(
        name = "plan_sessions",
        joinColumns = @JoinColumn(name = "plan_id"),
        inverseJoinColumns = @JoinColumn(name = "session_id")
    )
    private List<Sessions> sessions;
}