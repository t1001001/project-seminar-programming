package hs.aalen.fitness_tracker_backend.exerciseexecutions.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonBackReference;

import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;

@Entity
@Getter
@Setter
public class ExerciseExecutions {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private Integer plannedSets;

    @Column(nullable = false)
    private Integer plannedReps;

    @Column(nullable = false)
    private Integer plannedWeight;

    @Column(nullable = false)
    private Integer orderID;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    @JsonBackReference
    private Sessions session;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercises exercise;
}
