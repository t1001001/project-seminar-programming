package hs.aalen.fitness_tracker_backend.plans.dto;

import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import java.util.List;
import java.util.UUID;
import lombok.Data;

@Data
public class PlansResponseDto {

    private UUID id;
    private String name;
    private String description;
    private List<Sessions> sessions;
}
