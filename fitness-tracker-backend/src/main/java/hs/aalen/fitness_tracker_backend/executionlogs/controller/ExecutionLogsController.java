package hs.aalen.fitness_tracker_backend.executionlogs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import hs.aalen.fitness_tracker_backend.executionlogs.dto.ExecutionLogsResponseDto;
import hs.aalen.fitness_tracker_backend.executionlogs.dto.ExecutionLogsUpdateDto;
import hs.aalen.fitness_tracker_backend.executionlogs.service.ExecutionLogsService;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/execution-logs")
public class ExecutionLogsController {
    @Autowired
    private ExecutionLogsService executionLogsService;

    @GetMapping
    public ResponseEntity<List<ExecutionLogsResponseDto>> getAllExecutionLogs(
            @RequestParam(required = false) UUID sessionLogId,
            Authentication authentication) {
        List<ExecutionLogsResponseDto> logs;
        if (sessionLogId != null) {
            logs = executionLogsService.getExecutionLogsBySessionLogId(
                    sessionLogId, authentication.getName());
        } else {
            logs = executionLogsService.getAllExecutionLogs(authentication.getName());
        }
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExecutionLogsResponseDto> getExecutionLogById(
            @PathVariable UUID id,
            Authentication authentication) {
        ExecutionLogsResponseDto response = executionLogsService.getExecutionLogById(
                id, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExecutionLogsResponseDto> updateExecutionLog(
            @PathVariable UUID id,
            @RequestBody ExecutionLogsUpdateDto dto,
            Authentication authentication) {
        ExecutionLogsResponseDto response = executionLogsService.updateExecutionLog(
                id, dto, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExecutionLog(
            @PathVariable UUID id,
            Authentication authentication) {
        executionLogsService.deleteExecutionLog(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}