package hs.aalen.fitness_tracker_backend.sessionlogs.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import hs.aalen.fitness_tracker_backend.executionlogs.dto.ExecutionLogsResponseDto;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.SessionLogs;

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
    private SessionLogs.LogStatus status;
    private String notes;
    private UUID originalSessionId;
    private List<ExecutionLogsResponseDto> executionLogs;
    private Integer executionLogCount;
}
