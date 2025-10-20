package hs.aalen.fitness_tracker_backend.plans.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

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
}