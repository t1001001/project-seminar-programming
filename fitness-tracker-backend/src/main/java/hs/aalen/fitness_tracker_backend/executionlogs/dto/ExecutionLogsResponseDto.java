package hs.aalen.fitness_tracker_backend.executionlogs.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;
import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;

@Getter
@Setter
public class ExecutionLogsResponseDto {
    private UUID id;
    private Integer exerciseExecutionId;
    private Integer exerciseExecutionPlannedSets;
    private Integer exerciseExecutionPlannedReps;
    private Integer exerciseExecutionPlannedWeight;
    private UUID exerciseId;
    private String exerciseName;
    private Exercises.Category exerciseCategory;
    private List<String> exerciseMuscleGroup;
    private String exerciseDescription;
    private Integer actualSets;
    private Integer actualReps;
    private Integer actualWeight;
    private Boolean completed;
    private String notes;
    private UUID sessionLogId;
}