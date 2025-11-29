package hs.aalen.fitness_tracker_backend.sessionlogs.dto;

import lombok.Getter;
import lombok.Setter;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.LogStatus;

@Getter
@Setter
public class SessionLogsUpdateDto {
    private String notes;
    private LogStatus status;
}
