package hs.aalen.fitness_tracker_backend.plans.dto;

import lombok.Data;
import java.util.UUID;
import java.util.List;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;

@Data
public class PlansUpdateDto {
    private UUID id;
    private String name;
    private String description;
    private List<Sessions> sessions;
}
