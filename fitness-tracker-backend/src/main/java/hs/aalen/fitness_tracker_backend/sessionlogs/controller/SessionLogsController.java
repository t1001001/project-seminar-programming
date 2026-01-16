package hs.aalen.fitness_tracker_backend.sessionlogs.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import hs.aalen.fitness_tracker_backend.sessionlogs.dto.SessionLogsResponseDto;
import hs.aalen.fitness_tracker_backend.sessionlogs.dto.SessionLogsUpdateDto;
import hs.aalen.fitness_tracker_backend.sessionlogs.service.SessionLogsService;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/session-logs")
public class SessionLogsController {
    @Autowired
    private SessionLogsService sessionLogsService;

    @PostMapping("/start/{sessionId}")
    public ResponseEntity<SessionLogsResponseDto> startSession(
            @PathVariable UUID sessionId,
            Authentication authentication) {
        SessionLogsResponseDto response = sessionLogsService.startSession(
                sessionId, authentication.getName());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<SessionLogsResponseDto> completeSession(
            @PathVariable UUID id,
            Authentication authentication) {
        SessionLogsResponseDto response = sessionLogsService.completeSession(
                id, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SessionLogsResponseDto>> getAllSessionLogs(
            @RequestParam(required = false) UUID sessionId,
            Authentication authentication) {
        List<SessionLogsResponseDto> logs;
        if (sessionId != null) {
            logs = sessionLogsService.getSessionLogsBySessionId(
                    sessionId, authentication.getName());
        } else {
            logs = sessionLogsService.getAllSessionLogs(authentication.getName());
        }
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionLogsResponseDto> getSessionLogById(
            @PathVariable UUID id,
            Authentication authentication) {
        SessionLogsResponseDto response = sessionLogsService.getSessionLogById(
                id, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SessionLogsResponseDto> updateSessionLog(
            @PathVariable UUID id,
            @RequestBody SessionLogsUpdateDto dto,
            Authentication authentication) {
        SessionLogsResponseDto response = sessionLogsService.updateSessionLog(
                id, dto, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSessionLog(
            @PathVariable UUID id,
            Authentication authentication) {
        sessionLogsService.deleteSessionLog(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}