package hs.aalen.fitness_tracker_backend.exerciseexecutions.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class ExerciseExecutionsCreateDto {

    @NotNull(message = "Planned sets is required")
    @Min(value = 1, message = "Planned sets must be greater than 0")
    private Integer plannedSets;

    @NotNull(message = "Planned reps is required")
    @Min(value = 1, message = "Planned reps must be greater than 0")
    private Integer plannedReps;

    @NotNull(message = "Planned weight is required")
    @Min(value = 0, message = "Planned weight must be greater than or equal to 0")
    private Integer plannedWeight;

    private Integer orderID;

    @NotNull(message = "Session ID is required")
    private UUID sessionId;

    @NotNull(message = "Exercise ID is required")
    private UUID exerciseId;
}