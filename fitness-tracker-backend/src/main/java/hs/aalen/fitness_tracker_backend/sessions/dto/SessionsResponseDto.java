package hs.aalen.fitness_tracker_backend.sessions.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;
import java.time.LocalTime;

@Data
public class SessionsResponseDto {
    private UUID id;
    private String name;
    private LocalTime scheduledDate;
    private List<String> exerciseExecutions;

}
