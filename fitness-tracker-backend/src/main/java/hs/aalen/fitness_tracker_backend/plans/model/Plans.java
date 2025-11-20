package hs.aalen.fitness_tracker_backend.plans.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.ArrayList;
import java.util.List;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;

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

    @OneToMany(mappedBy = "plan")
    @JsonManagedReference
    private List<Sessions> sessions = new ArrayList<>();
}
