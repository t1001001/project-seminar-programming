package hs.aalen.fitness_tracker_backend.exerciseexecutions.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class ExerciseExecutionsResponseDto {
    private UUID id;
    private Integer plannedSets;
    private Integer plannedReps;
    private Integer plannedWeight;
    private Integer orderID;
    private UUID sessionId;
    private String sessionName;
    private UUID exerciseId;
    private String exerciseName;
}
