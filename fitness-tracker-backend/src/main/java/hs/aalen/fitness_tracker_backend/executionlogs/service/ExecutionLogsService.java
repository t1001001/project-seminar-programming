package hs.aalen.fitness_tracker_backend.executionlogs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import hs.aalen.fitness_tracker_backend.executionlogs.dto.ExecutionLogsResponseDto;
import hs.aalen.fitness_tracker_backend.executionlogs.dto.ExecutionLogsUpdateDto;
import hs.aalen.fitness_tracker_backend.executionlogs.model.ExecutionLogs;
import hs.aalen.fitness_tracker_backend.executionlogs.repository.ExecutionLogsRepository;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.SessionLogs;
import hs.aalen.fitness_tracker_backend.sessionlogs.repository.SessionLogsRepository;
import hs.aalen.fitness_tracker_backend.users.model.Users;
import hs.aalen.fitness_tracker_backend.users.repository.UsersRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExecutionLogsService {
    @Autowired
    private ExecutionLogsRepository executionLogsRepository;
    @Autowired
    private SessionLogsRepository sessionLogsRepository;
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
     * Verifies that an ExecutionLog belongs to a SessionLog owned by the user.
     */
    private ExecutionLogs getExecutionLogWithOwnershipCheck(UUID id, String username) {
        Users owner = resolveUser(username);
        ExecutionLogs executionLog = executionLogsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExecutionLog not found"));
        
        // Check ownership through parent SessionLog
        if (!executionLog.getSessionLog().getOwner().getId().equals(owner.getId())) {
            throw new AccessDeniedException("Execution log not found or access denied");
        }
        return executionLog;
    }

    private void validateActualValues(Integer sets, Integer reps, Integer weight) {
        if (sets != null && sets < 0) {
            throw new IllegalArgumentException("Actual sets cannot be negative");
        }
        if (reps != null && reps < 0) {
            throw new IllegalArgumentException("Actual reps cannot be negative");
        }
        if (weight != null && weight < 0) {
            throw new IllegalArgumentException("Actual weight cannot be negative");
        }
    }

    public List<ExecutionLogsResponseDto> getAllExecutionLogs(String username) {
        Users owner = resolveUser(username);
        // Get all session logs owned by user, then collect their execution logs
        return sessionLogsRepository.findByOwner(owner).stream()
                .flatMap(sessionLog -> sessionLog.getExecutionLogs().stream())
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public ExecutionLogsResponseDto getExecutionLogById(UUID id, String username) {
        ExecutionLogs executionLog = getExecutionLogWithOwnershipCheck(id, username);
        return mapToResponseDto(executionLog);
    }

    public List<ExecutionLogsResponseDto> getExecutionLogsBySessionLogId(UUID sessionLogId, String username) {
        Users owner = resolveUser(username);
        // Verify ownership of the session log
        SessionLogs sessionLog = sessionLogsRepository.findByIdAndOwner(sessionLogId, owner)
                .orElseThrow(() -> new AccessDeniedException("Session log not found or access denied"));
        
        return executionLogsRepository.findBySessionLogId(sessionLogId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public ExecutionLogsResponseDto updateExecutionLog(UUID id, ExecutionLogsUpdateDto dto, String username) {
        ExecutionLogs executionLog = getExecutionLogWithOwnershipCheck(id, username);

        if (executionLog.getSessionLog().getStatus() == SessionLogs.LogStatus.Completed) {
            throw new IllegalArgumentException("Cannot update exercises in a completed training");
        }
        if (executionLog.getSessionLog().getStatus() == SessionLogs.LogStatus.Cancelled) {
            throw new IllegalArgumentException("Cannot update exercises in a cancelled training");
        }

        validateActualValues(dto.getActualSets(), dto.getActualReps(), dto.getActualWeight());

        if (dto.getActualSets() != null) {
            executionLog.setActualSets(dto.getActualSets());
        }
        if (dto.getActualReps() != null) {
            executionLog.setActualReps(dto.getActualReps());
        }
        if (dto.getActualWeight() != null) {
            executionLog.setActualWeight(dto.getActualWeight());
        }
        if (dto.getCompleted() != null) {
            executionLog.setCompleted(dto.getCompleted());
        }
        if (dto.getNotes() != null) {
            executionLog.setNotes(dto.getNotes());
        }
        ExecutionLogs updated = executionLogsRepository.save(executionLog);
        return mapToResponseDto(updated);
    }

    public void deleteExecutionLog(UUID id, String username) {
        ExecutionLogs executionLog = getExecutionLogWithOwnershipCheck(id, username);

        if (executionLog.getSessionLog().getStatus() == SessionLogs.LogStatus.Completed) {
            throw new IllegalArgumentException("Cannot delete exercises from a completed training");
        }
        if (executionLog.getSessionLog().getStatus() == SessionLogs.LogStatus.Cancelled) {
            throw new IllegalArgumentException("Cannot delete exercises from a cancelled training");
        }

        executionLogsRepository.deleteById(id);
    }

    private ExecutionLogsResponseDto mapToResponseDto(ExecutionLogs executionLog) {
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
        dto.setSessionLogId(executionLog.getSessionLog().getId());
        return dto;
    }
}
