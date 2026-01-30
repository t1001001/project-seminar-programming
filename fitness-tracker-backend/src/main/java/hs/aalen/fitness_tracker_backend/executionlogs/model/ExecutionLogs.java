package hs.aalen.fitness_tracker_backend.executionlogs.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonBackReference;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.SessionLogs;
import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;

@Entity
@Getter
@Setter
public class ExecutionLogs {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    // Snapshot planned execution data to preserve history
    @Column(nullable = false)
    private Integer exerciseExecutionId;
    @Column(nullable = false)
    private Integer exerciseExecutionPlannedSets;
    @Column(nullable = false)
    private Integer exerciseExecutionPlannedReps;
    @Column(nullable = false)
    private Integer exerciseExecutionPlannedWeight;
    // Snapshot exercise metadata to preserve history
    @Column(nullable = false)
    private UUID exerciseId;
    @Column(nullable = false)
    private String exerciseName;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Exercises.Category exerciseCategory;
    @ElementCollection
    @CollectionTable(name = "execution_log_muscle_groups", joinColumns = @JoinColumn(name = "execution_log_id"))
    @Column(name = "muscle_group")
    private List<String> exerciseMuscleGroup;
    @Column(length = 1000)
    private String exerciseDescription;
    // User‑recorded performance metrics
    @Column(nullable = false)
    private Integer actualSets;
    @Column(nullable = false)
    private Integer actualReps;
    @Column(nullable = false)
    private Integer actualWeight;
    @Column(nullable = false)
    private Boolean completed = false;
    @Column(length = 1000)
    private String notes;
    @ManyToOne
    @JoinColumn(name = "session_log_id", nullable = false)
    @JsonBackReference
    private SessionLogs sessionLog;
}
