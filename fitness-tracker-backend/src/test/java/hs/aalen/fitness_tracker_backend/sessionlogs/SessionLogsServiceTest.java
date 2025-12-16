package hs.aalen.fitness_tracker_backend.sessionlogs;

import hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions;
import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.repository.ExerciseExecutionsRepository;
import hs.aalen.fitness_tracker_backend.sessionlogs.dto.SessionLogsResponseDto;
import hs.aalen.fitness_tracker_backend.sessionlogs.dto.SessionLogsUpdateDto;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.SessionLogs;
import hs.aalen.fitness_tracker_backend.sessionlogs.repository.SessionLogsRepository;
import hs.aalen.fitness_tracker_backend.sessionlogs.service.SessionLogsService;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.plans.model.Plans;
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
class SessionLogsServiceTest {

    @Mock
    private SessionLogsRepository sessionLogsRepository;

    @Mock
    private SessionsRepository sessionsRepository;

    @Mock
    private ExerciseExecutionsRepository exerciseExecutionsRepository;

    @InjectMocks
    private SessionLogsService service;

    private UUID sessionId;
    private Sessions session;
    private ExerciseExecutions execution;

    @BeforeEach
    void setup() {
        sessionId = UUID.randomUUID();
        session = new Sessions();
        session.setId(sessionId);
        session.setName("Morning Session");
        session.setSessionLogCount(0);
        session.setPlan(new Plans());
        session.getPlan().setName("Plan A");
        session.getPlan().setDescription("Desc A");

        execution = new ExerciseExecutions();
        Exercises exercise = new Exercises();
        exercise.setId(UUID.randomUUID());
        exercise.setName("Bench Press");
        exercise.setCategory(Exercises.Category.FreeWeight);
        exercise.setMuscleGroups(List.of("Chest"));
        exercise.setDescription("Press the bar");

        execution.setExercise(exercise);
        execution.setPlannedSets(3);
        execution.setPlannedReps(10);
        execution.setPlannedWeight(50);
        execution.setOrderID(1);
        execution.setSession(session);
    }

    @Test
    void shouldStartSessionSuccessfully() {
        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(exerciseExecutionsRepository.findBySessionIdOrderByOrderID(sessionId))
                .thenReturn(List.of(execution));

        when(sessionLogsRepository.save(any(SessionLogs.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        SessionLogsResponseDto dto = service.startSession(sessionId);

        assertEquals("Morning Session", dto.getSessionName());
        assertEquals(1, dto.getExecutionLogCount());
        assertEquals(SessionLogs.LogStatus.InProgress, dto.getStatus());
        verify(sessionLogsRepository, times(2)).save(any(SessionLogs.class));
        verify(sessionsRepository).save(session);
    }

    @Test
    void shouldThrowWhenSessionHasNoExercises() {
        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(exerciseExecutionsRepository.findBySessionIdOrderByOrderID(sessionId))
                .thenReturn(Collections.emptyList());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.startSession(sessionId));
        assertTrue(ex.getMessage().contains("Session must contain at least one exercise"));
    }

    @Test
    void shouldThrowWhenSessionNotFound() {
        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> service.startSession(sessionId));
        assertEquals("Session not found", ex.getMessage());
    }

@Test
void shouldCompleteSession() {
    Sessions session = new Sessions();
    session.setId(UUID.randomUUID());
    session.setName("Test Session");

    SessionLogs log = new SessionLogs();
    log.setId(UUID.randomUUID());
    log.setStatus(SessionLogs.LogStatus.InProgress);
    log.setSession(session);

    when(sessionLogsRepository.findById(log.getId())).thenReturn(Optional.of(log));
    when(sessionLogsRepository.save(any(SessionLogs.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

    SessionLogsResponseDto updated = service.completeSession(log.getId());

    assertEquals(SessionLogs.LogStatus.Completed, updated.getStatus());
    assertNotNull(updated.getCompletedAt());
}

    @Test
    void shouldCancelSessionWhenInProgress() {
        Sessions session = new Sessions();
        session.setId(UUID.randomUUID());
        session.setName("Test Session");

        SessionLogs log = new SessionLogs();
        log.setId(UUID.randomUUID());
        log.setStatus(SessionLogs.LogStatus.InProgress);
        log.setSession(session); 

        when(sessionLogsRepository.findById(log.getId())).thenReturn(Optional.of(log));
        when(sessionLogsRepository.save(any(SessionLogs.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        SessionLogsResponseDto cancelled = service.cancelSession(log.getId());

        assertEquals(SessionLogs.LogStatus.Cancelled, cancelled.getStatus());
        assertNotNull(cancelled.getCompletedAt());
    }

    @Test
    void shouldThrowCancelWhenNotInProgress() {
        SessionLogs log = new SessionLogs();
        log.setId(UUID.randomUUID());
        log.setStatus(SessionLogs.LogStatus.Completed);

        when(sessionLogsRepository.findById(log.getId())).thenReturn(Optional.of(log));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.cancelSession(log.getId()));
        assertTrue(ex.getMessage().contains("Can only cancel a training that is in progress"));
    }

    @Test
    void shouldUpdateNotesAndStatus() {
        Sessions session = new Sessions();
        session.setId(UUID.randomUUID());
        session.setName("Test Session");
        
        SessionLogs log = new SessionLogs();
        log.setId(UUID.randomUUID());
        log.setStatus(SessionLogs.LogStatus.InProgress);
        log.setSession(session);

        SessionLogsUpdateDto dto = new SessionLogsUpdateDto();
        dto.setNotes("New notes");
        dto.setStatus(SessionLogs.LogStatus.Completed);

        when(sessionLogsRepository.findById(log.getId())).thenReturn(Optional.of(log));
        when(sessionLogsRepository.save(any(SessionLogs.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        SessionLogsResponseDto updated = service.updateSessionLog(log.getId(), dto);

        assertEquals("New notes", updated.getNotes());
        assertEquals(SessionLogs.LogStatus.Completed, updated.getStatus());
        assertNotNull(updated.getCompletedAt());
    }

    @Test
    void shouldThrowUpdateWhenCompletedOrCancelled() {
        SessionLogs log = new SessionLogs();
        log.setId(UUID.randomUUID());
        log.setStatus(SessionLogs.LogStatus.Completed);

        SessionLogsUpdateDto dto = new SessionLogsUpdateDto();
        dto.setNotes("Test");

        when(sessionLogsRepository.findById(log.getId())).thenReturn(Optional.of(log));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.updateSessionLog(log.getId(), dto));
        assertEquals("Cannot update a completed training", ex.getMessage());
    }

    @Test
    void shouldDeleteSessionLogWhenNotCompleted() {
        SessionLogs log = new SessionLogs();
        log.setId(UUID.randomUUID());
        log.setStatus(SessionLogs.LogStatus.InProgress);

        when(sessionLogsRepository.findById(log.getId())).thenReturn(Optional.of(log));

        service.deleteSessionLog(log.getId());

        verify(sessionLogsRepository).deleteById(log.getId());
    }

    @Test
    void shouldThrowDeleteWhenCompleted() {
        SessionLogs log = new SessionLogs();
        log.setId(UUID.randomUUID());
        log.setStatus(SessionLogs.LogStatus.Completed);

        when(sessionLogsRepository.findById(log.getId())).thenReturn(Optional.of(log));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.deleteSessionLog(log.getId()));
        assertTrue(ex.getMessage().contains("Cannot delete a completed training"));
    }

    @Test
    void shouldThrowUpdateWhenCancelled() {
        SessionLogs log = new SessionLogs();
        log.setId(UUID.randomUUID());
        log.setStatus(SessionLogs.LogStatus.Cancelled);

        SessionLogsUpdateDto dto = new SessionLogsUpdateDto();
        dto.setNotes("Should fail");

        when(sessionLogsRepository.findById(log.getId()))
                .thenReturn(Optional.of(log));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.updateSessionLog(log.getId(), dto)
        );

        assertEquals("Cannot update a cancelled training", ex.getMessage());
    }

    @Test
    void shouldStartSessionWithoutPlan() {
        session.setPlan(null);

        when(sessionsRepository.findById(sessionId))
                .thenReturn(Optional.of(session));

        when(exerciseExecutionsRepository.findBySessionIdOrderByOrderID(sessionId))
                .thenReturn(List.of(execution));

        when(sessionLogsRepository.save(any(SessionLogs.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        SessionLogsResponseDto dto = service.startSession(sessionId);

        assertEquals("No Plan", dto.getSessionPlanName());
        assertEquals("", dto.getSessionPlan());
    }
}
