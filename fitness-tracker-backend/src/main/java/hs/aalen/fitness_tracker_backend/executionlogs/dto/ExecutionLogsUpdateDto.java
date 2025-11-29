package hs.aalen.fitness_tracker_backend.executionlogs.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExecutionLogsUpdateDto {
    private Integer actualSets;
    private Integer actualReps;
    private Integer actualWeight;
    private Boolean completed;
    private String notes;
}
