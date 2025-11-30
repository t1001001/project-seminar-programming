package hs.aalen.fitness_tracker_backend.sessions.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class SessionsResponseDto {
    private UUID id;
    private String name;
    private UUID planId;
    private Integer orderID;
    private Integer exerciseExecutionsCount;
    private Integer sessionLogCount;
}
