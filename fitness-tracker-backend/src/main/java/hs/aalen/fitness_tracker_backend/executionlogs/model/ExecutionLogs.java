package hs.aalen.fitness_tracker_backend.executionlogs.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonBackReference;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.SessionLogs;

@Entity
@Getter
@Setter
public class ExecutionLogs {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    // Denormalized ExerciseExecutions data
    @Column(nullable = false)
    private Integer exerciseExecutionId;
    @Column(nullable = false)
    private Integer exerciseExecutionPlannedSets;
    @Column(nullable = false)
    private Integer exerciseExecutionPlannedReps;
    @Column(nullable = false)
    private Integer exerciseExecutionPlannedWeight;
    // Denormalized Exercise data
    @Column(nullable = false)
    private String exerciseName;
    @Column(nullable = false)
    private String exerciseCategory;
    @ElementCollection
    @CollectionTable(name = "execution_log_muscle_groups", joinColumns = @JoinColumn(name = "execution_log_id"))
    @Column(name = "muscle_group")
    private List<String> exerciseMuscleGroup;
    @Column(length = 1000)
    private String exerciseDescription;
    // Actual execution data
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
