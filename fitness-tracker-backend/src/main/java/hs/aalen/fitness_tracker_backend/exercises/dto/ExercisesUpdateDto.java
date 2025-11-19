package hs.aalen.fitness_tracker_backend.exercises.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class ExercisesUpdateDto {
    @NotBlank
    private String name;
    
    @NotBlank
    private String category;
    
    @NotEmpty
    private List<String> muscleGroups;
    
    private String description;
}