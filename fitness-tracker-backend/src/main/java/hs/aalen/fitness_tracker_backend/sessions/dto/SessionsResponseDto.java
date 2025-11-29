package hs.aalen.fitness_tracker_backend.sessions.dto;

import lombok.Data;
import java.util.UUID;
import java.time.LocalDate;

@Data
public class SessionsResponseDto {
    private UUID id;
    private UUID planId;
    private String name;
    private LocalDate scheduledDate;
    private Integer orderID;
    private Integer sessionLogCount;
    private Integer exerciseCount;
    private hs.aalen.fitness_tracker_backend.sessions.model.Sessions.SessionStatus status;
}
