package hs.aalen.fitness_tracker_backend.plans.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.UUID;
import java.util.List;

@Data
public class PlansUpdateDto {
    @NotBlank
    private UUID id;
    private String name;
    private String description;
    private List<UUID> sessions;
}
