package hs.aalen.fitness_tracker_backend.plans.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PlansCreateDTO {

    @NotBlank
    private String name;

    private String description;
}