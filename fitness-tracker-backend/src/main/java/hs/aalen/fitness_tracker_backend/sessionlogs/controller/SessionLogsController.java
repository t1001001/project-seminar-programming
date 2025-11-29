package hs.aalen.fitness_tracker_backend.sessionlogs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import hs.aalen.fitness_tracker_backend.sessionlogs.dto.SessionLogsCreateDto;
import hs.aalen.fitness_tracker_backend.sessionlogs.dto.SessionLogsResponseDto;
import hs.aalen.fitness_tracker_backend.sessionlogs.dto.SessionLogsUpdateDto;
import hs.aalen.fitness_tracker_backend.sessionlogs.service.SessionLogsService;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/session-logs")
public class SessionLogsController {
    @Autowired
    private SessionLogsService sessionLogsService;

    @PostMapping("/start/{sessionId}")
    public ResponseEntity<SessionLogsResponseDto> startSession(@PathVariable UUID sessionId) {
        SessionLogsResponseDto response = sessionLogsService.startSession(sessionId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<SessionLogsResponseDto> completeSession(@PathVariable UUID id) {
        SessionLogsResponseDto response = sessionLogsService.completeSession(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<SessionLogsResponseDto> cancelSession(@PathVariable UUID id) {
        SessionLogsResponseDto response = sessionLogsService.cancelSession(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SessionLogsResponseDto>> getAllSessionLogs(
            @RequestParam(required = false) UUID sessionId) {
        List<SessionLogsResponseDto> logs;
        if (sessionId != null) {
            logs = sessionLogsService.getSessionLogsBySessionId(sessionId);
        } else {
            logs = sessionLogsService.getAllSessionLogs();
        }
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionLogsResponseDto> getSessionLogById(@PathVariable UUID id) {
        SessionLogsResponseDto response = sessionLogsService.getSessionLogById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionLogsResponseDto> updateSessionLog(
            @PathVariable UUID id,
            @RequestBody SessionLogsUpdateDto dto) {
        SessionLogsResponseDto response = sessionLogsService.updateSessionLog(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSessionLog(@PathVariable UUID id) {
        sessionLogsService.deleteSessionLog(id);
        return ResponseEntity.noContent().build();
    }
}