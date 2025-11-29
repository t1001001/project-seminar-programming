package hs.aalen.fitness_tracker_backend.executionlogs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import hs.aalen.fitness_tracker_backend.executionlogs.dto.ExecutionLogsResponseDto;
import hs.aalen.fitness_tracker_backend.executionlogs.dto.ExecutionLogsUpdateDto;
import hs.aalen.fitness_tracker_backend.executionlogs.model.ExecutionLogs;
import hs.aalen.fitness_tracker_backend.executionlogs.repository.ExecutionLogsRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExecutionLogsService {
    @Autowired
    private ExecutionLogsRepository executionLogsRepository;

    public List<ExecutionLogsResponseDto> getAllExecutionLogs() {
        return executionLogsRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public ExecutionLogsResponseDto getExecutionLogById(UUID id) {
        ExecutionLogs executionLog = executionLogsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExecutionLog not found"));
        return mapToResponseDto(executionLog);
    }

    public List<ExecutionLogsResponseDto> getExecutionLogsBySessionLogId(UUID sessionLogId) {
        return executionLogsRepository.findBySessionLogId(sessionLogId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public ExecutionLogsResponseDto updateExecutionLog(UUID id, ExecutionLogsUpdateDto dto) {
        ExecutionLogs executionLog = executionLogsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExecutionLog not found"));
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

    public void deleteExecutionLog(UUID id) {
        executionLogsRepository.deleteById(id);
    }

    private ExecutionLogsResponseDto mapToResponseDto(ExecutionLogs executionLog) {
        ExecutionLogsResponseDto dto = new ExecutionLogsResponseDto();
        dto.setId(executionLog.getId());
        dto.setExerciseExecutionId(executionLog.getExerciseExecutionId());
        dto.setExerciseExecutionPlannedSets(executionLog.getExerciseExecutionPlannedSets());
        dto.setExerciseExecutionPlannedReps(executionLog.getExerciseExecutionPlannedReps());
        dto.setExerciseExecutionPlannedWeight(executionLog.getExerciseExecutionPlannedWeight());
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
