package hs.aalen.fitness_tracker_backend.sessionlogs.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class SessionLogsCreateDto {
    private UUID sessionId;
    private String notes;
}
