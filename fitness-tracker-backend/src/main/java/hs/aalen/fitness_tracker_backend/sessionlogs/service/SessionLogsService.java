package hs.aalen.fitness_tracker_backend.sessionlogs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hs.aalen.fitness_tracker_backend.executionlogs.model.ExecutionLogs;
import hs.aalen.fitness_tracker_backend.executionlogs.dto.ExecutionLogsResponseDto;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.repository.ExerciseExecutionsRepository;
import hs.aalen.fitness_tracker_backend.sessionlogs.dto.SessionLogsResponseDto;
import hs.aalen.fitness_tracker_backend.sessionlogs.dto.SessionLogsUpdateDto;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.SessionLogs;
import hs.aalen.fitness_tracker_backend.sessionlogs.repository.SessionLogsRepository;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;
import hs.aalen.fitness_tracker_backend.users.model.Users;
import hs.aalen.fitness_tracker_backend.users.repository.UsersRepository;

import java.time.Instant;
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
    @Autowired
    private UsersRepository usersRepository;

    /**
     * Resolves the authenticated username to a Users entity.
     */
    private Users resolveUser(String username) {
        return usersRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    /**
     * Fetches a SessionLog by ID and verifies ownership.
     * 
     * @throws AccessDeniedException if the session log does not belong to the user
     */
    private SessionLogs getSessionLogWithOwnershipCheck(UUID id, String username) {
        Users owner = resolveUser(username);
        return sessionLogsRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new AccessDeniedException(
                        "Session log not found or access denied"));
    }

    @Transactional
    public SessionLogsResponseDto startSession(UUID sessionId, String username) {
        Users owner = resolveUser(username);

        Sessions session = sessionsRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Check if session has at least one exercise
        List<ExerciseExecutions> executions = exerciseExecutionsRepository.findBySessionIdOrderByOrderID(sessionId);
        if (executions.isEmpty()) {
            throw new IllegalArgumentException(
                    "Cannot start training: Session must contain at least one exercise");
        }

        // Create SessionLogs with denormalized data
        SessionLogs sessionLog = new SessionLogs();
        sessionLog.setSessionName(session.getName());
        sessionLog.setSessionPlanName(session.getPlan() != null ? session.getPlan().getName() : "No Plan");
        sessionLog.setSessionPlan(session.getPlan() != null ? session.getPlan().getDescription() : "");
        sessionLog.setStartedAt(Instant.now());
        sessionLog.setStatus(SessionLogs.LogStatus.InProgress);
        sessionLog.setOriginalSessionId(session.getId());
        // Set the owner - this is the key change for user isolation
        sessionLog.setOwner(owner);

        // Save session log first to get ID
        SessionLogs savedLog = sessionLogsRepository.save(sessionLog);

        // Create execution logs for each exercise execution
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
        return mapToResponseDto(finalLog);
    }

    @Transactional
    public SessionLogsResponseDto completeSession(UUID sessionLogId, String username) {
        SessionLogs sessionLog = getSessionLogWithOwnershipCheck(sessionLogId, username);
        sessionLog.setStatus(SessionLogs.LogStatus.Completed);
        sessionLog.setCompletedAt(Instant.now());
        SessionLogs updated = sessionLogsRepository.save(sessionLog);
        return mapToResponseDto(updated);
    }

    @Transactional
    public SessionLogsResponseDto cancelSession(UUID sessionLogId, String username) {
        SessionLogs sessionLog = getSessionLogWithOwnershipCheck(sessionLogId, username);

        if (sessionLog.getStatus() != SessionLogs.LogStatus.InProgress) {
            throw new IllegalArgumentException(
                    "Can only cancel a training that is in progress. Current status: " + sessionLog.getStatus());
        }

        sessionLog.setStatus(SessionLogs.LogStatus.Cancelled);
        sessionLog.setCompletedAt(Instant.now());

        SessionLogs updated = sessionLogsRepository.save(sessionLog);
        return mapToResponseDto(updated);
    }

    public List<SessionLogsResponseDto> getAllSessionLogs(String username) {
        Users owner = resolveUser(username);
        return sessionLogsRepository.findByOwner(owner).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public SessionLogsResponseDto getSessionLogById(UUID id, String username) {
        SessionLogs sessionLog = getSessionLogWithOwnershipCheck(id, username);
        return mapToResponseDto(sessionLog);
    }

    public List<SessionLogsResponseDto> getSessionLogsBySessionId(UUID sessionId, String username) {
        Users owner = resolveUser(username);
        return sessionLogsRepository.findByOwnerAndOriginalSessionId(owner, sessionId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public SessionLogsResponseDto updateSessionLog(UUID id, SessionLogsUpdateDto dto, String username) {
        SessionLogs sessionLog = getSessionLogWithOwnershipCheck(id, username);

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
                sessionLog.setCompletedAt(Instant.now());
            }
        }
        SessionLogs updated = sessionLogsRepository.save(sessionLog);
        return mapToResponseDto(updated);
    }

    @Transactional
    public void deleteSessionLog(UUID id, String username) {
        SessionLogs sessionLog = getSessionLogWithOwnershipCheck(id, username);

        // Only InProgress sessions can be deleted
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
        dto.setSessionName(sessionLog.getSessionName());
        dto.setSessionPlanName(sessionLog.getSessionPlanName());
        dto.setSessionPlan(sessionLog.getSessionPlan());
        dto.setStartedAt(sessionLog.getStartedAt());
        dto.setCompletedAt(sessionLog.getCompletedAt());
        dto.setStatus(sessionLog.getStatus());
        dto.setNotes(sessionLog.getNotes());
        dto.setOriginalSessionId(sessionLog.getOriginalSessionId());
        List<ExecutionLogsResponseDto> executionLogs = mapExecutionLogs(sessionLog);
        dto.setExecutionLogs(executionLogs);
        dto.setExecutionLogCount(executionLogs.size());
        return dto;
    }

    private List<ExecutionLogsResponseDto> mapExecutionLogs(SessionLogs sessionLog) {
        return sessionLog.getExecutionLogs().stream()
                .map(this::mapExecutionLog)
                .collect(Collectors.toList());
    }

    private ExecutionLogsResponseDto mapExecutionLog(ExecutionLogs executionLog) {
        ExecutionLogsResponseDto dto = new ExecutionLogsResponseDto();
        dto.setId(executionLog.getId());
        dto.setExerciseExecutionId(executionLog.getExerciseExecutionId());
        dto.setExerciseExecutionPlannedSets(executionLog.getExerciseExecutionPlannedSets());
        dto.setExerciseExecutionPlannedReps(executionLog.getExerciseExecutionPlannedReps());
        dto.setExerciseExecutionPlannedWeight(executionLog.getExerciseExecutionPlannedWeight());
        dto.setExerciseId(executionLog.getExerciseId());
        dto.setExerciseName(executionLog.getExerciseName());
        dto.setExerciseCategory(executionLog.getExerciseCategory());
        dto.setExerciseMuscleGroup(executionLog.getExerciseMuscleGroup());
        dto.setExerciseDescription(executionLog.getExerciseDescription());
        dto.setActualSets(executionLog.getActualSets());
        dto.setActualReps(executionLog.getActualReps());
        dto.setActualWeight(executionLog.getActualWeight());
        dto.setCompleted(executionLog.getCompleted());
        dto.setNotes(executionLog.getNotes());
        dto.setSessionLogId(executionLog.getSessionLog() != null ? executionLog.getSessionLog().getId() : null);
        return dto;
    }
}
