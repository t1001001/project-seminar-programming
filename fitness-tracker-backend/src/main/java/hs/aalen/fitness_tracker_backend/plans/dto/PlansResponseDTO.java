package hs.aalen.fitness_tracker_backend.plans.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class PlansResponseDTO {
    private UUID id;
    private String name;
    private String description;
}