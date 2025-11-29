package hs.aalen.fitness_tracker_backend.exerciseexecutions.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.dto.ExerciseExecutionsCreateDto;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.dto.ExerciseExecutionsResponseDto;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.dto.ExerciseExecutionsUpdateDto;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.repository.ExerciseExecutionsRepository;
import hs.aalen.fitness_tracker_backend.exercises.repository.ExercisesRepository;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExerciseExecutionsService {
    @Autowired
    private ExerciseExecutionsRepository exerciseExecutionsRepository;
    @Autowired
    private SessionsRepository sessionsRepository;
    @Autowired
    private ExercisesRepository exercisesRepository;

    public ExerciseExecutionsResponseDto createExerciseExecution(ExerciseExecutionsCreateDto dto) {
        ExerciseExecutions execution = new ExerciseExecutions();
        execution.setPlannedSets(dto.getPlannedSets());
        execution.setPlannedReps(dto.getPlannedReps());
        execution.setPlannedWeight(dto.getPlannedWeight());
        execution.setOrderID(dto.getOrderID());

        execution.setSession(sessionsRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found")));
        execution.setExercise(exercisesRepository.findById(dto.getExerciseId())
                .orElseThrow(() -> new RuntimeException("Exercise not found")));
        ExerciseExecutions saved = exerciseExecutionsRepository.save(execution);
        return mapToResponseDto(saved);
    }

    public List<ExerciseExecutionsResponseDto> getAllExerciseExecutions() {
        return exerciseExecutionsRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public ExerciseExecutionsResponseDto getExerciseExecutionById(UUID id) {
        ExerciseExecutions execution = exerciseExecutionsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExerciseExecution not found"));
        return mapToResponseDto(execution);
    }

    public List<ExerciseExecutionsResponseDto> getExerciseExecutionsBySessionId(UUID sessionId) {
        return exerciseExecutionsRepository.findBySessionIdOrderByOrderID(sessionId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public ExerciseExecutionsResponseDto updateExerciseExecution(UUID id, ExerciseExecutionsUpdateDto dto) {
        ExerciseExecutions execution = exerciseExecutionsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ExerciseExecution not found"));
        if (dto.getPlannedSets() != null) {
            execution.setPlannedSets(dto.getPlannedSets());
        }
        if (dto.getPlannedReps() != null) {
            execution.setPlannedReps(dto.getPlannedReps());
        }
        if (dto.getPlannedWeight() != null) {
            execution.setPlannedWeight(dto.getPlannedWeight());
        }
        if (dto.getOrderID() != null) {
            execution.setOrderID(dto.getOrderID());
        }
        if (dto.getExerciseId() != null) {
            execution.setExercise(exercisesRepository.findById(dto.getExerciseId())
                    .orElseThrow(() -> new RuntimeException("Exercise not found")));
        }
        ExerciseExecutions updated = exerciseExecutionsRepository.save(execution);
        return mapToResponseDto(updated);
    }

    public void deleteExerciseExecution(UUID id) {
        exerciseExecutionsRepository.deleteById(id);
    }

    private ExerciseExecutionsResponseDto mapToResponseDto(ExerciseExecutions execution) {
        ExerciseExecutionsResponseDto dto = new ExerciseExecutionsResponseDto();
        dto.setId(execution.getId());
        dto.setPlannedSets(execution.getPlannedSets());
        dto.setPlannedReps(execution.getPlannedReps());
        dto.setPlannedWeight(execution.getPlannedWeight());
        dto.setOrderID(execution.getOrderID());
        dto.setSessionId(execution.getSession().getId());
        dto.setSessionName(execution.getSession().getName());
        dto.setExerciseId(execution.getExercise().getId());
        dto.setExerciseName(execution.getExercise().getName());
        return dto;
    }
}