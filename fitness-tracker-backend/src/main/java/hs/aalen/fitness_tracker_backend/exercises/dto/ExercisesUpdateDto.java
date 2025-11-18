package hs.aalen.fitness_tracker_backend.exercises.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class ExercisesUpdateDto {
    private UUID id;
    private String name;
    private String category;
    private List<String> muscleGroups;
    private String description;
}