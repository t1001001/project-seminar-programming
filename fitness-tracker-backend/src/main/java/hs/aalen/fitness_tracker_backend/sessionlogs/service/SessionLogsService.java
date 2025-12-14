package hs.aalen.fitness_tracker_backend.sessionlogs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hs.aalen.fitness_tracker_backend.executionlogs.model.ExecutionLogs;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.repository.ExerciseExecutionsRepository;
import hs.aalen.fitness_tracker_backend.sessionlogs.dto.SessionLogsResponseDto;
import hs.aalen.fitness_tracker_backend.sessionlogs.dto.SessionLogsUpdateDto;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.SessionLogs;
import hs.aalen.fitness_tracker_backend.sessionlogs.repository.SessionLogsRepository;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SessionLogsService {
    @Autowired
    private SessionLogsRepository sessionLogsRepository;
    @Autowired
    private SessionsRepository sessionsRepository;
    @Autowired
    private ExerciseExecutionsRepository exerciseExecutionsRepository;

    @Transactional
    public SessionLogsResponseDto startSession(UUID sessionId) {
        Sessions session = sessionsRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Check if session has at least one exercise
        List<ExerciseExecutions> executions = exerciseExecutionsRepository.findBySessionIdOrderByOrderID(sessionId);
        if (executions.isEmpty()) {
            throw new IllegalArgumentException(
                    "Cannot start training: Session must contain at least one exercise");
        }

        // Increment session log count
        Integer currentCount = session.getSessionLogCount() != null ? session.getSessionLogCount() : 0;
        session.setSessionLogCount(currentCount + 1);
        // Create SessionLogs with denormalized data
        SessionLogs sessionLog = new SessionLogs();
        sessionLog.setSessionID(currentCount + 1);
        sessionLog.setSessionName(session.getName());
        sessionLog.setSessionPlanName(session.getPlan() != null ? session.getPlan().getName() : "No Plan");
        sessionLog.setSessionPlan(session.getPlan() != null ? session.getPlan().getDescription() : "");
        sessionLog.setStartedAt(LocalDateTime.now());
        sessionLog.setStatus(SessionLogs.LogStatus.InProgress);
        // Store original session ID for reference (not a foreign key - allows deletion of original)
        sessionLog.setOriginalSessionId(session.getId());
        // Save session log first to get ID
        SessionLogs savedLog = sessionLogsRepository.save(sessionLog);
        // Get all exercise executions for this session and create execution logs

        for (ExerciseExecutions execution : executions) {
            ExecutionLogs executionLog = new ExecutionLogs();
            // Denormalize ExerciseExecutions data
            executionLog.setExerciseExecutionId(execution.getOrderID());
            executionLog.setExerciseExecutionPlannedSets(execution.getPlannedSets());
            executionLog.setExerciseExecutionPlannedReps(execution.getPlannedReps());
            executionLog.setExerciseExecutionPlannedWeight(execution.getPlannedWeight());
            // Denormalize Exercise data
            executionLog.setExerciseId(execution.getExercise().getId());
            executionLog.setExerciseName(execution.getExercise().getName());
            executionLog.setExerciseCategory(execution.getExercise().getCategory());
            executionLog.setExerciseMuscleGroup(execution.getExercise().getMuscleGroups());
            executionLog.setExerciseDescription(execution.getExercise().getDescription());
            // Initialize actual values to planned values
            executionLog.setActualSets(execution.getPlannedSets());
            executionLog.setActualReps(execution.getPlannedReps());
            executionLog.setActualWeight(execution.getPlannedWeight());
            executionLog.setCompleted(false);

            executionLog.setSessionLog(savedLog);
            savedLog.getExecutionLogs().add(executionLog);
        }
        // Save again with execution logs
        SessionLogs finalLog = sessionLogsRepository.save(savedLog);
        sessionsRepository.save(session);
        return mapToResponseDto(finalLog);
    }

    @Transactional
    public SessionLogsResponseDto completeSession(UUID sessionLogId) {
        SessionLogs sessionLog = sessionLogsRepository.findById(sessionLogId)
                .orElseThrow(() -> new RuntimeException("SessionLog not found"));
        sessionLog.setStatus(SessionLogs.LogStatus.Completed);
        sessionLog.setCompletedAt(LocalDateTime.now());
        SessionLogs updated = sessionLogsRepository.save(sessionLog);
        return mapToResponseDto(updated);
    }

    @Transactional
    public SessionLogsResponseDto cancelSession(UUID sessionLogId) {
        SessionLogs sessionLog = sessionLogsRepository.findById(sessionLogId)
                .orElseThrow(() -> new RuntimeException("SessionLog not found"));

        if (sessionLog.getStatus() != SessionLogs.LogStatus.InProgress) {
            throw new IllegalArgumentException(
                    "Can only cancel a training that is in progress. Current status: " + sessionLog.getStatus());
        }

        sessionLog.setStatus(SessionLogs.LogStatus.Cancelled);
        sessionLog.setCompletedAt(LocalDateTime.now());

        SessionLogs updated = sessionLogsRepository.save(sessionLog);
        return mapToResponseDto(updated);
    }

    public List<SessionLogsResponseDto> getAllSessionLogs() {
        return sessionLogsRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public SessionLogsResponseDto getSessionLogById(UUID id) {
        SessionLogs sessionLog = sessionLogsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SessionLog not found"));
        return mapToResponseDto(sessionLog);
    }

    public List<SessionLogsResponseDto> getSessionLogsBySessionId(UUID sessionId) {
        return sessionLogsRepository.findByOriginalSessionId(sessionId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public SessionLogsResponseDto updateSessionLog(UUID id, SessionLogsUpdateDto dto) {
        SessionLogs sessionLog = sessionLogsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SessionLog not found"));

        if (sessionLog.getStatus() == SessionLogs.LogStatus.Completed) {
            throw new IllegalArgumentException("Cannot update a completed training");
        }
        if (sessionLog.getStatus() == SessionLogs.LogStatus.Cancelled) {
            throw new IllegalArgumentException("Cannot update a cancelled training");
        }

        if (dto.getNotes() != null) {
            sessionLog.setNotes(dto.getNotes());
        }
        if (dto.getStatus() != null) {
            sessionLog.setStatus(dto.getStatus());
            if (dto.getStatus() == SessionLogs.LogStatus.Completed && sessionLog.getCompletedAt() == null) {
                sessionLog.setCompletedAt(LocalDateTime.now());
            }
        }
        SessionLogs updated = sessionLogsRepository.save(sessionLog);
        return mapToResponseDto(updated);
    }

    public void deleteSessionLog(UUID id) {
        SessionLogs sessionLog = sessionLogsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SessionLog not found"));

        // Only InProgress sessions can be deleted
        // Completed sessions are permanent records
        if (sessionLog.getStatus() == SessionLogs.LogStatus.Completed) {
            throw new IllegalArgumentException(
                    "Cannot delete a completed workout. Completed sessions are permanent records.");
        }
        if (sessionLog.getStatus() == SessionLogs.LogStatus.Cancelled) {
            throw new IllegalArgumentException(
                    "Cannot delete a cancelled training.");
        }

        sessionLogsRepository.deleteById(id);
    }

    private SessionLogsResponseDto mapToResponseDto(SessionLogs sessionLog) {
        SessionLogsResponseDto dto = new SessionLogsResponseDto();
        dto.setId(sessionLog.getId());
        dto.setSessionID(sessionLog.getSessionID());
        dto.setSessionName(sessionLog.getSessionName());
        dto.setSessionPlanName(sessionLog.getSessionPlanName());
        dto.setSessionPlan(sessionLog.getSessionPlan());
        dto.setStartedAt(sessionLog.getStartedAt());
        dto.setCompletedAt(sessionLog.getCompletedAt());
        dto.setStatus(sessionLog.getStatus());
        dto.setNotes(sessionLog.getNotes());
        dto.setOriginalSessionId(sessionLog.getOriginalSessionId());
        dto.setExecutionLogCount(sessionLog.getExecutionLogs().size());
        return dto;
    }
}
