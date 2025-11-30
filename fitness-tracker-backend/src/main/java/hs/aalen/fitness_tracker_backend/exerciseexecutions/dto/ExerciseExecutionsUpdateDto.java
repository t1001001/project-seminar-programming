package hs.aalen.fitness_tracker_backend.exerciseexecutions.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class ExerciseExecutionsUpdateDto {

    @Min(value = 1, message = "Planned sets must be greater than 0")
    private Integer plannedSets;

    @Min(value = 1, message = "Planned reps must be greater than 0")
    private Integer plannedReps;

    @Min(value = 0, message = "Planned weight must be greater than or equal to 0")
    private Integer plannedWeight;

    private Integer orderID;

    private UUID exerciseId;
}