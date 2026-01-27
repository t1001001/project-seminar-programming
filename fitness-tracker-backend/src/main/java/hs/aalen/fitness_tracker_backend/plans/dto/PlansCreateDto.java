package hs.aalen.fitness_tracker_backend.plans.dto;

import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.Data;

@Data
public class PlansCreateDto {

    @NotBlank
    private String name;

    private String description;

    private List<Sessions> sessions;
}
