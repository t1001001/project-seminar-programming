package hs.aalen.fitness_tracker_backend.plans.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class PlansUpdateDto {
    @NotBlank
    private String name;
    private String description;
    private List<UUID> sessions;
}
