package hs.aalen.fitness_tracker_backend.sessionlogs.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.LogStatus;

@Getter
@Setter
public class SessionLogsResponseDto {
    private UUID id;
    private Integer sessionID;
    private String sessionName;
    private String sessionPlanName;
    private String sessionPlan;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LogStatus status;
    private String notes;
    private UUID originalSessionId;
    private Integer executionLogCount;
}