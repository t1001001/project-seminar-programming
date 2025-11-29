package hs.aalen.fitness_tracker_backend.executionlogs.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ExecutionLogsCreateDto {
    private Integer exerciseExecutionId;
    private Integer exerciseExecutionPlannedSets;
    private Integer exerciseExecutionPlannedReps;
    private Integer exerciseExecutionPlannedWeight;
    private String exerciseName;
    private String exerciseCategory;
    private List<String> exerciseMuscleGroup;
    private String exerciseDescription;
    private Integer actualSets;
    private Integer actualReps;
    private Integer actualWeight;
    private Boolean completed;
    private String notes;
    private UUID sessionLogId;
}