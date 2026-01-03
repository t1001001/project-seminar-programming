package hs.aalen.fitness_tracker_backend.executionlogs;

import hs.aalen.fitness_tracker_backend.executionlogs.dto.ExecutionLogsResponseDto;
import hs.aalen.fitness_tracker_backend.executionlogs.dto.ExecutionLogsUpdateDto;
import hs.aalen.fitness_tracker_backend.executionlogs.model.ExecutionLogs;
import hs.aalen.fitness_tracker_backend.executionlogs.service.ExecutionLogsService;
import hs.aalen.fitness_tracker_backend.executionlogs.repository.ExecutionLogsRepository;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.SessionLogs;
import hs.aalen.fitness_tracker_backend.sessionlogs.repository.SessionLogsRepository;
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
class ExecutionLogsServiceTest {

    @Mock
    private ExecutionLogsRepository repository;

    @Mock
    private SessionLogsRepository sessionLogsRepository;

    @Mock
    private UsersRepository usersRepository;

    @InjectMocks
    private ExecutionLogsService service;

    private UUID id;
    private ExecutionLogs log;
    private SessionLogs sessionLog;
    private Users testUser;
    private static final String TEST_USERNAME = "testUser";

    @BeforeEach
    void setup() {
        id = UUID.randomUUID();

        testUser = new Users();
        testUser.setId(UUID.randomUUID());
        testUser.setUsername(TEST_USERNAME);
        testUser.setPassword("password");

        sessionLog = new SessionLogs();
        sessionLog.setId(UUID.randomUUID());
        sessionLog.setStatus(SessionLogs.LogStatus.InProgress);
        sessionLog.setOwner(testUser);

        log = new ExecutionLogs();
        log.setId(id);
        log.setSessionLog(sessionLog);
        log.setActualSets(5);
        log.setActualReps(10);
        log.setActualWeight(50);
        log.setCompleted(false);
        log.setNotes("test");
    }

    @Test
    void shouldReturnAllExecutionLogsForUser() {
        sessionLog.setExecutionLogs(List.of(log));
        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(sessionLogsRepository.findByOwner(testUser)).thenReturn(List.of(sessionLog));

        List<ExecutionLogsResponseDto> result = service.getAllExecutionLogs(TEST_USERNAME);

        assertEquals(1, result.size());
        assertEquals(id, result.get(0).getId());
    }

    @Test
    void shouldReturnExecutionLogById() {
        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.of(log));

        ExecutionLogsResponseDto dto = service.getExecutionLogById(id, TEST_USERNAME);

        assertEquals(id, dto.getId());
        verify(repository).findById(id);
    }

    @Test
    void shouldThrowWhenExecutionLogNotFoundInGetById() {
        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getExecutionLogById(id, TEST_USERNAME));
    }

    @Test
    void shouldThrowWhenAccessingAnotherUsersExecutionLog() {
        Users otherUser = new Users();
        otherUser.setId(UUID.randomUUID());
        otherUser.setUsername("otherUser");

        SessionLogs otherSessionLog = new SessionLogs();
        otherSessionLog.setOwner(otherUser);
        log.setSessionLog(otherSessionLog);

        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.of(log));

        assertThrows(AccessDeniedException.class, () -> service.getExecutionLogById(id, TEST_USERNAME));
    }

    @Test
    void shouldReturnExecutionLogsBySessionLogId() {
        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(sessionLogsRepository.findByIdAndOwner(sessionLog.getId(), testUser))
                .thenReturn(Optional.of(sessionLog));
        when(repository.findBySessionLogId(sessionLog.getId())).thenReturn(List.of(log));

        List<ExecutionLogsResponseDto> result = service.getExecutionLogsBySessionLogId(
                sessionLog.getId(), TEST_USERNAME);

        assertEquals(1, result.size());
        assertEquals(id, result.get(0).getId());
    }

    @Test
    void shouldUpdateExecutionLogWhenValid() {
        ExecutionLogsUpdateDto dto = new ExecutionLogsUpdateDto();
        dto.setActualSets(8);
        dto.setActualReps(12);
        dto.setActualWeight(60);
        dto.setCompleted(true);
        dto.setNotes("updated");

        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.of(log));
        when(repository.save(log)).thenReturn(log);

        ExecutionLogsResponseDto result = service.updateExecutionLog(id, dto, TEST_USERNAME);

        assertEquals(8, result.getActualSets());
        assertEquals(12, result.getActualReps());
        assertEquals(60, result.getActualWeight());
        assertTrue(result.getCompleted());
        assertEquals("updated", result.getNotes());
        verify(repository).save(log);
    }

    @Test
    void shouldThrowWhenUpdatingCompletedTraining() {
        sessionLog.setStatus(SessionLogs.LogStatus.Completed);

        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.of(log));

        ExecutionLogsUpdateDto dto = new ExecutionLogsUpdateDto();
        dto.setActualSets(8);

        assertThrows(IllegalArgumentException.class,
                () -> service.updateExecutionLog(id, dto, TEST_USERNAME));
    }

    @Test
    void shouldThrowWhenUpdatingCancelledTraining() {
        sessionLog.setStatus(SessionLogs.LogStatus.Cancelled);

        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.of(log));

        ExecutionLogsUpdateDto dto = new ExecutionLogsUpdateDto();
        dto.setActualSets(8);

        assertThrows(IllegalArgumentException.class,
                () -> service.updateExecutionLog(id, dto, TEST_USERNAME));
    }

    @Test
    void shouldThrowWhenNegativeValuesProvided() {
        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.of(log));

        ExecutionLogsUpdateDto dto = new ExecutionLogsUpdateDto();
        dto.setActualSets(-1);

        assertThrows(IllegalArgumentException.class,
                () -> service.updateExecutionLog(id, dto, TEST_USERNAME));
    }

    @Test
    void shouldThrowWhenExecutionLogNotFoundOnUpdate() {
        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.empty());

        ExecutionLogsUpdateDto dto = new ExecutionLogsUpdateDto();
        dto.setActualSets(5);

        assertThrows(RuntimeException.class,
                () -> service.updateExecutionLog(id, dto, TEST_USERNAME));
    }

    @Test
    void shouldDeleteExecutionLog() {
        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.of(log));

        service.deleteExecutionLog(id, TEST_USERNAME);

        verify(repository).deleteById(id);
    }

    @Test
    void shouldThrowWhenDeletingCompletedTraining() {
        sessionLog.setStatus(SessionLogs.LogStatus.Completed);

        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.of(log));

        assertThrows(IllegalArgumentException.class,
                () -> service.deleteExecutionLog(id, TEST_USERNAME));
    }

    @Test
    void shouldThrowWhenDeletingCancelledTraining() {
        sessionLog.setStatus(SessionLogs.LogStatus.Cancelled);

        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.of(log));

        assertThrows(IllegalArgumentException.class,
                () -> service.deleteExecutionLog(id, TEST_USERNAME));
    }

    @Test
    void shouldThrowWhenExecutionLogNotFoundOnDelete() {
        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> service.deleteExecutionLog(id, TEST_USERNAME));
    }

    @Test
    void shouldUpdateExecutionLogWithAllNullValues() {
        ExecutionLogsUpdateDto dto = new ExecutionLogsUpdateDto();

        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.of(log));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        ExecutionLogsResponseDto result = service.updateExecutionLog(id, dto, TEST_USERNAME);

        assertEquals(5, result.getActualSets());
        assertEquals(10, result.getActualReps());
        assertEquals(50, result.getActualWeight());
        assertFalse(result.getCompleted());
        assertEquals("test", result.getNotes());
    }

    @Test
    void shouldAllowZeroActualValues() {
        ExecutionLogsUpdateDto dto = new ExecutionLogsUpdateDto();
        dto.setActualSets(0);
        dto.setActualReps(0);
        dto.setActualWeight(0);

        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.of(log));
        when(repository.save(any())).thenAnswer(i -> i.getArgument(0));

        ExecutionLogsResponseDto result = service.updateExecutionLog(id, dto, TEST_USERNAME);

        assertEquals(0, result.getActualSets());
        assertEquals(0, result.getActualReps());
        assertEquals(0, result.getActualWeight());
    }

    @Test
    void shouldDeleteExecutionLogWhenTrainingInProgress() {
        sessionLog.setStatus(SessionLogs.LogStatus.InProgress);

        when(usersRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
        when(repository.findById(id)).thenReturn(Optional.of(log));

        service.deleteExecutionLog(id, TEST_USERNAME);

        verify(repository).deleteById(id);
    }
}
