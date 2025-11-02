package hs.aalen.fitness_tracker_backend.sessions.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;

import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.plans.model.Plans;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(uniqueConstraints = {
    @UniqueConstraint(columnNames = {"plan_id", "name", "scheduled_date"})
})
public class Sessions {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private Plans plan;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDate scheduledDate;

    @ManyToMany
    @JoinTable(
        name = "session_exercises",
        joinColumns = @JoinColumn(name = "session_id"),
        inverseJoinColumns = @JoinColumn(name = "exercise_id")
    )
    private List<Exercises> exerciseExecutions;

}