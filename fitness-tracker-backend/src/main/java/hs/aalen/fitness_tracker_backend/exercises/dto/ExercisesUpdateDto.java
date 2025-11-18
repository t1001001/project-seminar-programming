package hs.aalen.fitness_tracker_backend.exercises.dto;

import lombok.Data;
import java.util.List;

@Data
public class ExercisesUpdateDto {
    private String name;
    private String category;
    private List<String> muscleGroups;
    private String description;
}