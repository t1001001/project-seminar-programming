package hs.aalen.fitness_tracker_backend.executionlogs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
            @RequestParam(required = false) UUID sessionLogId) {
        List<ExecutionLogsResponseDto> logs;
        if (sessionLogId != null) {
            logs = executionLogsService.getExecutionLogsBySessionLogId(sessionLogId);
        } else {
            logs = executionLogsService.getAllExecutionLogs();
        }
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExecutionLogsResponseDto> getExecutionLogById(@PathVariable UUID id) {
        ExecutionLogsResponseDto response = executionLogsService.getExecutionLogById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExecutionLogsResponseDto> updateExecutionLog(
            @PathVariable UUID id,
            @RequestBody ExecutionLogsUpdateDto dto) {
        ExecutionLogsResponseDto response = executionLogsService.updateExecutionLog(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExecutionLog(@PathVariable UUID id) {
        executionLogsService.deleteExecutionLog(id);
        return ResponseEntity.noContent().build();
    }
}