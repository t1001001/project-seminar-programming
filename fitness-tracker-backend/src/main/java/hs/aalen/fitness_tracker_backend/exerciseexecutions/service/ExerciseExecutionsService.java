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

    private void validatePlannedValues(Integer sets, Integer reps, Integer weight) {
        if (sets == null || sets <= 0) {
            throw new IllegalArgumentException("Planned sets must be greater than 0");
        }
        if (reps == null || reps <= 0) {
            throw new IllegalArgumentException("Planned reps must be greater than 0");
        }
        if (weight == null || weight < 0) {
            throw new IllegalArgumentException("Planned weight must be greater than or equal to 0");
        }
    }

    private void checkDuplicateExerciseInSession(UUID sessionId, UUID exerciseId, UUID excludeId) {
        boolean exists = exerciseExecutionsRepository.findBySessionIdOrderByOrderID(sessionId).stream()
                .filter(ee -> excludeId == null || !ee.getId().equals(excludeId))
                .anyMatch(ee -> ee.getExercise().getId().equals(exerciseId));

        if (exists) {
            throw new IllegalArgumentException(
                    "This exercise is already added to this session. Each exercise can only be added once per session.");
        }
    }

    private java.util.Optional<ExerciseExecutions> findExecutionWithOrder(UUID sessionId, Integer orderID, UUID excludeId) {
        return exerciseExecutionsRepository.findBySessionIdOrderByOrderID(sessionId).stream()
                .filter(ee -> excludeId == null || !ee.getId().equals(excludeId))
                .filter(ee -> ee.getOrderID().equals(orderID))
                .findFirst();
    }

    private void validateOrderNotTaken(UUID sessionId, Integer orderID) {
        findExecutionWithOrder(sessionId, orderID, null)
                .ifPresent(ee -> {
                    throw new IllegalArgumentException(
                            "Order " + orderID + " is already used in this session");
                });
    }

    public ExerciseExecutionsResponseDto createExerciseExecution(ExerciseExecutionsCreateDto dto) {
        validatePlannedValues(dto.getPlannedSets(), dto.getPlannedReps(), dto.getPlannedWeight());
        checkDuplicateExerciseInSession(dto.getSessionId(), dto.getExerciseId(), null);

        if (dto.getOrderID() != null) {
            validateOrderNotTaken(dto.getSessionId(), dto.getOrderID());
        }

        ExerciseExecutions execution = new ExerciseExecutions();
        execution.setPlannedSets(dto.getPlannedSets());
        execution.setPlannedReps(dto.getPlannedReps());
        execution.setPlannedWeight(dto.getPlannedWeight());
        execution.setOrderID(dto.getOrderID() != null ? dto.getOrderID() : 0);

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

        Integer newSets = dto.getPlannedSets() != null ? dto.getPlannedSets() : execution.getPlannedSets();
        Integer newReps = dto.getPlannedReps() != null ? dto.getPlannedReps() : execution.getPlannedReps();
        Integer newWeight = dto.getPlannedWeight() != null ? dto.getPlannedWeight() : execution.getPlannedWeight();

        validatePlannedValues(newSets, newReps, newWeight);

        if (dto.getPlannedSets() != null) {
            execution.setPlannedSets(dto.getPlannedSets());
        }
        if (dto.getPlannedReps() != null) {
            execution.setPlannedReps(dto.getPlannedReps());
        }
        if (dto.getPlannedWeight() != null) {
            execution.setPlannedWeight(dto.getPlannedWeight());
        }

        // Swap order numbers if another execution has the target order
        if (dto.getOrderID() != null) {
            Integer oldOrder = execution.getOrderID();
            Integer newOrder = dto.getOrderID();

            if (!oldOrder.equals(newOrder)) {
                java.util.Optional<ExerciseExecutions> executionWithTargetOrder = 
                        findExecutionWithOrder(execution.getSession().getId(), newOrder, id);
                if (executionWithTargetOrder.isPresent()) {
                    ExerciseExecutions otherExecution = executionWithTargetOrder.get();
                    otherExecution.setOrderID(oldOrder);
                    exerciseExecutionsRepository.save(otherExecution);
                }
            }
            execution.setOrderID(newOrder);
        }

        if (dto.getExerciseId() != null) {
            checkDuplicateExerciseInSession(
                    execution.getSession().getId(),
                    dto.getExerciseId(),
                    id);

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