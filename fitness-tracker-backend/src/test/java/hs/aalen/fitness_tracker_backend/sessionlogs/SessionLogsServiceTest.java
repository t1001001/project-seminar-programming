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
import hs.aalen.fitness_tracker_backend.users.model.Users;
import hs.aalen.fitness_tracker_backend.users.repository.UsersRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

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

        @Mock
        private UsersRepository usersRepository;

        @InjectMocks
        private SessionLogsService service;

        private UUID sessionId;
        private Sessions session;
        private ExerciseExecutions execution;
        private Users testUser;
        private Users otherUser;
        private static final String TEST_USERNAME = "testUser";
        private static final String OTHER_USERNAME = "otherUser";

        @BeforeEach
        void setup() {
                // Setup test users
                testUser = new Users();
                testUser.setId(UUID.randomUUID());
                testUser.setUsername(TEST_USERNAME);
                testUser.setPassword("password");

                otherUser = new Users();
                otherUser.setId(UUID.randomUUID());
                otherUser.setUsername(OTHER_USERNAME);
                otherUser.setPassword("password");

                sessionId = UUID.randomUUID();
                session = new Sessions();
                session.setId(sessionId);
                session.setName("Morning Session");
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

        private SessionLogs createSessionLogWithOwner(Users owner) {
                SessionLogs log = new SessionLogs();
                log.setId(UUID.randomUUID());
                log.setSessionName("Test Session");
                log.setSessionPlanName("Test Plan");
                log.setStatus(SessionLogs.LogStatus.InProgress);
                log.setOwner(owner);
                log.setOriginalSessionId(sessionId);
                return log;
        }

        @Test
        void shouldStartSessionSuccessfully() {
                when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
                when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
                when(exerciseExecutionsRepository.findBySessionIdOrderByOrderID(sessionId))
                                .thenReturn(List.of(execution));

                when(sessionLogsRepository.save(any(SessionLogs.class)))
                                .thenAnswer(invocation -> {
                                        SessionLogs sl = invocation.getArgument(0);
                                        assertEquals(testUser, sl.getOwner());
                                        return sl;
                                });

                SessionLogsResponseDto dto = service.startSession(sessionId, TEST_USERNAME);

                assertEquals("Morning Session", dto.getSessionName());
                assertEquals(1, dto.getExecutionLogCount());
                assertEquals(SessionLogs.LogStatus.InProgress, dto.getStatus());
                verify(sessionLogsRepository, times(2)).save(any(SessionLogs.class));
        }

        @Test
        void shouldSetOwnerWhenStartingSession() {
                when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
                when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
                when(exerciseExecutionsRepository.findBySessionIdOrderByOrderID(sessionId))
                                .thenReturn(List.of(execution));

                when(sessionLogsRepository.save(any(SessionLogs.class)))
                                .thenAnswer(invocation -> {
                                        SessionLogs sl = invocation.getArgument(0);
                                        assertNotNull(sl.getOwner());
                                        assertEquals(testUser.getId(), sl.getOwner().getId());
                                        return sl;
                                });

                service.startSession(sessionId, TEST_USERNAME);
                verify(sessionLogsRepository, times(2)).save(any(SessionLogs.class));
        }

        @Test
        void shouldThrowWhenSessionHasNoExercises() {
                when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
                when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
                when(exerciseExecutionsRepository.findBySessionIdOrderByOrderID(sessionId))
                                .thenReturn(Collections.emptyList());

                IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                                () -> service.startSession(sessionId, TEST_USERNAME));
                assertTrue(ex.getMessage().contains("Session must contain at least one exercise"));
        }

        @Test
        void shouldThrowWhenSessionNotFound() {
                when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
                when(sessionsRepository.findById(sessionId)).thenReturn(Optional.empty());
                RuntimeException ex = assertThrows(RuntimeException.class,
                                () -> service.startSession(sessionId, TEST_USERNAME));
                assertEquals("Session not found", ex.getMessage());
        }

        @Test
        void shouldCompleteSession() {
                SessionLogs log = createSessionLogWithOwner(testUser);

                when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
                when(sessionLogsRepository.findByIdAndOwner(log.getId(), testUser))
                                .thenReturn(Optional.of(log));
                when(sessionLogsRepository.save(any(SessionLogs.class)))
                                .thenAnswer(invocation -> invocation.getArgument(0));

                SessionLogsResponseDto updated = service.completeSession(log.getId(), TEST_USERNAME);

                assertEquals(SessionLogs.LogStatus.Completed, updated.getStatus());
                assertNotNull(updated.getCompletedAt());
        }

        @Test
        void shouldUpdateNotesAndStatus() {
                SessionLogs log = createSessionLogWithOwner(testUser);
                log.setStatus(SessionLogs.LogStatus.InProgress);

                SessionLogsUpdateDto dto = new SessionLogsUpdateDto();
                dto.setNotes("New notes");
                dto.setStatus(SessionLogs.LogStatus.Completed);

                when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
                when(sessionLogsRepository.findByIdAndOwner(log.getId(), testUser))
                                .thenReturn(Optional.of(log));
                when(sessionLogsRepository.save(any(SessionLogs.class)))
                                .thenAnswer(invocation -> invocation.getArgument(0));

                SessionLogsResponseDto updated = service.updateSessionLog(log.getId(), dto, TEST_USERNAME);

                assertEquals("New notes", updated.getNotes());
                assertEquals(SessionLogs.LogStatus.Completed, updated.getStatus());
                assertNotNull(updated.getCompletedAt());
        }

        @Test
        void shouldDeleteSessionLogWhenNotCompleted() {
                SessionLogs log = createSessionLogWithOwner(testUser);
                log.setStatus(SessionLogs.LogStatus.InProgress);

                when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
                when(sessionLogsRepository.findByIdAndOwner(log.getId(), testUser))
                                .thenReturn(Optional.of(log));

                service.deleteSessionLog(log.getId(), TEST_USERNAME);

                verify(sessionLogsRepository).deleteById(log.getId());
        }

        @Test
        void shouldThrowDeleteWhenCompleted() {
                SessionLogs log = createSessionLogWithOwner(testUser);
                log.setStatus(SessionLogs.LogStatus.Completed);

                when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
                when(sessionLogsRepository.findByIdAndOwner(log.getId(), testUser))
                                .thenReturn(Optional.of(log));

                IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                                () -> service.deleteSessionLog(log.getId(), TEST_USERNAME));
                assertEquals(
                                "Cannot delete a completed workout. Completed sessions are permanent records.",
                                ex.getMessage());
        }

        @Test
        void shouldStartSessionWithoutPlan() {
                session.setPlan(null);

                when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
                when(sessionsRepository.findById(sessionId))
                                .thenReturn(Optional.of(session));

                when(exerciseExecutionsRepository.findBySessionIdOrderByOrderID(sessionId))
                                .thenReturn(List.of(execution));

                when(sessionLogsRepository.save(any(SessionLogs.class)))
                                .thenAnswer(invocation -> invocation.getArgument(0));

                SessionLogsResponseDto dto = service.startSession(sessionId, TEST_USERNAME);

                assertEquals("No Plan", dto.getSessionPlanName());
                assertEquals("", dto.getSessionPlan());
        }

        @Test
        void shouldReturnOnlyOwnSessionLogs() {
                SessionLogs log = createSessionLogWithOwner(testUser);

                when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
                when(sessionLogsRepository.findByOwner(testUser)).thenReturn(List.of(log));

                List<SessionLogsResponseDto> results = service.getAllSessionLogs(TEST_USERNAME);

                assertFalse(results.isEmpty());
                assertEquals(1, results.size());
                assertEquals("Test Session", results.get(0).getSessionName());
        }

        @Test
        void shouldReturnSessionLogById() {
                SessionLogs log = createSessionLogWithOwner(testUser);

                when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
                when(sessionLogsRepository.findByIdAndOwner(log.getId(), testUser))
                                .thenReturn(Optional.of(log));

                SessionLogsResponseDto result = service.getSessionLogById(log.getId(), TEST_USERNAME);

                assertNotNull(result);
                assertEquals(log.getId(), result.getId());
        }

        @Test
        void shouldThrowWhenAccessingAnotherUsersLog() {
                SessionLogs log = createSessionLogWithOwner(testUser);

                when(usersRepository.findByUsername(OTHER_USERNAME)).thenReturn(Optional.of(otherUser));
                when(sessionLogsRepository.findByIdAndOwner(log.getId(), otherUser))
                                .thenReturn(Optional.empty());

                AccessDeniedException ex = assertThrows(AccessDeniedException.class,
                                () -> service.getSessionLogById(log.getId(), OTHER_USERNAME));
                assertTrue(ex.getMessage().contains("access denied"));
        }

        @Test
        void shouldReturnSessionLogsBySessionId() {
                UUID originalSessionId = UUID.randomUUID();
                SessionLogs log = createSessionLogWithOwner(testUser);
                log.setOriginalSessionId(originalSessionId);

                when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
                when(sessionLogsRepository.findByOwnerAndOriginalSessionId(testUser, originalSessionId))
                                .thenReturn(List.of(log));

                List<SessionLogsResponseDto> results = service.getSessionLogsBySessionId(
                                originalSessionId, TEST_USERNAME);

                assertFalse(results.isEmpty());
                assertEquals(originalSessionId, results.get(0).getOriginalSessionId());
        }
}
