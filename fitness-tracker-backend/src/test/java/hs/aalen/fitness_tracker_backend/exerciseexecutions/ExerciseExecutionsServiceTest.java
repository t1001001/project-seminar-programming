package hs.aalen.fitness_tracker_backend.exerciseexecutions;

import hs.aalen.fitness_tracker_backend.exerciseexecutions.dto.ExerciseExecutionsCreateDto;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.dto.ExerciseExecutionsResponseDto;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.dto.ExerciseExecutionsUpdateDto;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.service.ExerciseExecutionsService;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.repository.ExerciseExecutionsRepository;
import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.exercises.repository.ExercisesRepository;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExerciseExecutionsServiceTest {

    @Mock
    private ExerciseExecutionsRepository executionsRepository;

    @Mock
    private SessionsRepository sessionsRepository;

    @Mock
    private ExercisesRepository exercisesRepository;

    @InjectMocks
    private ExerciseExecutionsService service;

    private UUID execId;
    private UUID sessionId;
    private UUID exerciseId;
    private Sessions session;
    private Exercises exercise;
    private ExerciseExecutions execution;

    @BeforeEach
    void setup() {
        execId = UUID.randomUUID();
        sessionId = UUID.randomUUID();
        exerciseId = UUID.randomUUID();

        session = new Sessions();
        session.setId(sessionId);
        session.setName("Leg Day");

        exercise = new Exercises();
        exercise.setId(exerciseId);
        exercise.setName("Squat");

        execution = new ExerciseExecutions();
        execution.setId(execId);
        execution.setPlannedSets(3);
        execution.setPlannedReps(10);
        execution.setPlannedWeight(100);
        execution.setOrderID(1);
        execution.setSession(session);
        execution.setExercise(exercise);
    }

    @Test
    void shouldCreateExerciseExecution() {
        ExerciseExecutionsCreateDto dto = new ExerciseExecutionsCreateDto();
        dto.setPlannedSets(3);
        dto.setPlannedReps(10);
        dto.setPlannedWeight(50);
        dto.setSessionId(sessionId);
        dto.setExerciseId(exerciseId);
        dto.setOrderID(1);

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(exercisesRepository.findById(exerciseId)).thenReturn(Optional.of(exercise));
        when(executionsRepository.findBySessionIdOrderByOrderID(sessionId)).thenReturn(List.of());
        when(executionsRepository.save(any())).thenReturn(execution);

        ExerciseExecutionsResponseDto result = service.createExerciseExecution(dto);

        assertEquals(execId, result.getId());
        verify(executionsRepository).save(any());
    }

    @Test
    void shouldThrowWhenSessionNotFoundOnCreate() {
        ExerciseExecutionsCreateDto dto = new ExerciseExecutionsCreateDto();
        dto.setPlannedSets(3);
        dto.setPlannedReps(10);
        dto.setPlannedWeight(50);
        dto.setSessionId(sessionId);
        dto.setExerciseId(exerciseId);

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.createExerciseExecution(dto));
    }

    @Test
    void shouldThrowWhenExerciseNotFoundOnCreate() {
        ExerciseExecutionsCreateDto dto = new ExerciseExecutionsCreateDto();
        dto.setPlannedSets(3);
        dto.setPlannedReps(10);
        dto.setPlannedWeight(50);
        dto.setSessionId(sessionId);
        dto.setExerciseId(exerciseId);

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(exercisesRepository.findById(exerciseId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.createExerciseExecution(dto));
    }

    @Test
    void shouldThrowWhenInvalidPlannedValues() {
        ExerciseExecutionsCreateDto dto = new ExerciseExecutionsCreateDto();
        dto.setPlannedSets(0);
        dto.setPlannedReps(5);
        dto.setPlannedWeight(10);
        dto.setSessionId(sessionId);
        dto.setExerciseId(exerciseId);

        assertThrows(IllegalArgumentException.class, () -> service.createExerciseExecution(dto));
    }

    @Test
    void shouldThrowWhenDuplicateExerciseInSession() {
        ExerciseExecutionsCreateDto dto = new ExerciseExecutionsCreateDto();
        dto.setPlannedSets(3);
        dto.setPlannedReps(10);
        dto.setPlannedWeight(50);
        dto.setSessionId(sessionId);
        dto.setExerciseId(exerciseId);

        execution.setExercise(exercise);

        when(executionsRepository.findBySessionIdOrderByOrderID(sessionId))
                .thenReturn(List.of(execution));

        assertThrows(IllegalArgumentException.class, () -> service.createExerciseExecution(dto));
    }

    @Test
    void shouldThrowWhenOrderAlreadyTaken() {
        ExerciseExecutionsCreateDto dto = new ExerciseExecutionsCreateDto();
        dto.setPlannedSets(3);
        dto.setPlannedReps(10);
        dto.setPlannedWeight(50);
        dto.setSessionId(sessionId);
        dto.setExerciseId(exerciseId);
        dto.setOrderID(1);

        when(executionsRepository.findBySessionIdOrderByOrderID(sessionId))
                .thenReturn(List.of(execution));

        assertThrows(IllegalArgumentException.class, () -> service.createExerciseExecution(dto));
    }

    @Test
    void shouldReturnAllExerciseExecutions() {
        when(executionsRepository.findAll()).thenReturn(List.of(execution));

        List<ExerciseExecutionsResponseDto> result = service.getAllExerciseExecutions();

        assertEquals(1, result.size());
    }

    @Test
    void shouldReturnExecutionById() {
        when(executionsRepository.findById(execId)).thenReturn(Optional.of(execution));

        ExerciseExecutionsResponseDto result = service.getExerciseExecutionById(execId);

        assertEquals(execId, result.getId());
    }

    @Test
    void shouldThrowWhenExecutionNotFoundInGetById() {
        when(executionsRepository.findById(execId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getExerciseExecutionById(execId));
    }

    @Test
    void shouldReturnExecutionsBySessionId() {
        when(executionsRepository.findBySessionIdOrderByOrderID(sessionId)).thenReturn(List.of(execution));

        List<ExerciseExecutionsResponseDto> result = service.getExerciseExecutionsBySessionId(sessionId);

        assertEquals(1, result.size());
    }

    @Test
    void shouldUpdateExerciseExecution() {
        ExerciseExecutionsUpdateDto dto = new ExerciseExecutionsUpdateDto();
        dto.setPlannedSets(5);
        dto.setPlannedReps(12);
        dto.setPlannedWeight(150);

        when(executionsRepository.findById(execId)).thenReturn(Optional.of(execution));
        when(executionsRepository.save(execution)).thenReturn(execution);

        ExerciseExecutionsResponseDto result = service.updateExerciseExecution(execId, dto);

        assertEquals(5, result.getPlannedSets());
        verify(executionsRepository).save(execution);
    }

    @Test
    void shouldSwapOrderIfTargetOrderIsTaken() {
        ExerciseExecutions other = new ExerciseExecutions();
        other.setId(UUID.randomUUID());
        other.setOrderID(2);
        other.setSession(session);
        other.setExercise(exercise);
        other.setPlannedSets(3);
        other.setPlannedReps(10);
        other.setPlannedWeight(100);

        execution.setOrderID(1);
        execution.setExercise(exercise);

        ExerciseExecutionsUpdateDto dto = new ExerciseExecutionsUpdateDto();
        dto.setOrderID(2);

        when(executionsRepository.findById(execId)).thenReturn(Optional.of(execution));
        when(executionsRepository.findBySessionIdOrderByOrderID(sessionId))
                .thenReturn(List.of(execution, other));
        when(executionsRepository.save(any(ExerciseExecutions.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        service.updateExerciseExecution(execId, dto);

        assertEquals(2, execution.getOrderID());
        assertEquals(1, other.getOrderID());
    }

    @Test
    void shouldThrowWhenUpdatingInvalidValues() {
        ExerciseExecutionsUpdateDto dto = new ExerciseExecutionsUpdateDto();
        dto.setPlannedSets(0);

        when(executionsRepository.findById(execId)).thenReturn(Optional.of(execution));

        assertThrows(IllegalArgumentException.class, () -> service.updateExerciseExecution(execId, dto));
    }

    @Test
    void shouldThrowWhenDuplicateExerciseOnUpdate() {
        ExerciseExecutionsUpdateDto dto = new ExerciseExecutionsUpdateDto();
        dto.setExerciseId(UUID.randomUUID());

        ExerciseExecutions duplicate = new ExerciseExecutions();
        duplicate.setId(UUID.randomUUID());
        duplicate.setExercise(exercise);
        duplicate.setSession(session);

        when(executionsRepository.findById(execId)).thenReturn(Optional.of(execution));
        when(executionsRepository.findBySessionIdOrderByOrderID(sessionId))
                .thenReturn(List.of(duplicate));

        assertThrows(RuntimeException.class, () -> service.updateExerciseExecution(execId, dto));
    }

    @Test
    void shouldThrowWhenExerciseNotFoundOnUpdate() {
        ExerciseExecutionsUpdateDto dto = new ExerciseExecutionsUpdateDto();
        dto.setExerciseId(UUID.randomUUID());

        when(executionsRepository.findById(execId)).thenReturn(Optional.of(execution));
        when(exercisesRepository.findById(dto.getExerciseId())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.updateExerciseExecution(execId, dto));
    }

    @Test
    void shouldThrowWhenExecutionNotFoundOnUpdate() {
        ExerciseExecutionsUpdateDto dto = new ExerciseExecutionsUpdateDto();
        dto.setPlannedSets(5);

        when(executionsRepository.findById(execId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.updateExerciseExecution(execId, dto));
    }

    @Test
    void shouldDeleteExerciseExecution() {
        service.deleteExerciseExecution(execId);

        verify(executionsRepository).deleteById(execId);
    }
}
