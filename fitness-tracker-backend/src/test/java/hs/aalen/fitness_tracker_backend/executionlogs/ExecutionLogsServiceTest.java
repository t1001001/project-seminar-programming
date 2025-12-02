package hs.aalen.fitness_tracker_backend.executionlogs;

import hs.aalen.fitness_tracker_backend.executionlogs.dto.ExecutionLogsResponseDto;
import hs.aalen.fitness_tracker_backend.executionlogs.dto.ExecutionLogsUpdateDto;
import hs.aalen.fitness_tracker_backend.executionlogs.model.ExecutionLogs;
import hs.aalen.fitness_tracker_backend.executionlogs.service.ExecutionLogsService;
import hs.aalen.fitness_tracker_backend.executionlogs.repository.ExecutionLogsRepository;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.SessionLogs;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExecutionLogsServiceTest {

    @Mock
    private ExecutionLogsRepository repository;

    @InjectMocks
    private ExecutionLogsService service;

    private UUID id;
    private ExecutionLogs log;
    private SessionLogs sessionLog;

    @BeforeEach
    void setup() {
        id = UUID.randomUUID();

        sessionLog = new SessionLogs();
        sessionLog.setId(UUID.randomUUID());
        sessionLog.setStatus(SessionLogs.LogStatus.InProgress);

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
    void shouldReturnAllExecutionLogs() {
        when(repository.findAll()).thenReturn(List.of(log));

        List<ExecutionLogsResponseDto> result = service.getAllExecutionLogs();

        assertEquals(1, result.size());
        assertEquals(id, result.get(0).getId());
        verify(repository).findAll();
    }

    @Test
    void shouldReturnExecutionLogById() {
        when(repository.findById(id)).thenReturn(Optional.of(log));

        ExecutionLogsResponseDto dto = service.getExecutionLogById(id);

        assertEquals(id, dto.getId());
        verify(repository).findById(id);
    }

    @Test
    void shouldThrowWhenExecutionLogNotFoundInGetById() {
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.getExecutionLogById(id));
    }

    @Test
    void shouldReturnExecutionLogsBySessionLogId() {
        when(repository.findBySessionLogId(sessionLog.getId())).thenReturn(List.of(log));

        List<ExecutionLogsResponseDto> result = service.getExecutionLogsBySessionLogId(sessionLog.getId());

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

        when(repository.findById(id)).thenReturn(Optional.of(log));
        when(repository.save(log)).thenReturn(log);

        ExecutionLogsResponseDto result = service.updateExecutionLog(id, dto);

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

        when(repository.findById(id)).thenReturn(Optional.of(log));

        ExecutionLogsUpdateDto dto = new ExecutionLogsUpdateDto();
        dto.setActualSets(8);

        assertThrows(IllegalArgumentException.class, () -> service.updateExecutionLog(id, dto));
    }

    @Test
    void shouldThrowWhenUpdatingCancelledTraining() {
        sessionLog.setStatus(SessionLogs.LogStatus.Cancelled);

        when(repository.findById(id)).thenReturn(Optional.of(log));

        ExecutionLogsUpdateDto dto = new ExecutionLogsUpdateDto();
        dto.setActualSets(8);

        assertThrows(IllegalArgumentException.class, () -> service.updateExecutionLog(id, dto));
    }

    @Test
    void shouldThrowWhenNegativeValuesProvided() {
        when(repository.findById(id)).thenReturn(Optional.of(log));

        ExecutionLogsUpdateDto dto = new ExecutionLogsUpdateDto();
        dto.setActualSets(-1);

        assertThrows(IllegalArgumentException.class, () -> service.updateExecutionLog(id, dto));
    }

    @Test
    void shouldThrowWhenExecutionLogNotFoundOnUpdate() {
        when(repository.findById(id)).thenReturn(Optional.empty());

        ExecutionLogsUpdateDto dto = new ExecutionLogsUpdateDto();
        dto.setActualSets(5);

        assertThrows(RuntimeException.class, () -> service.updateExecutionLog(id, dto));
    }

    @Test
    void shouldDeleteExecutionLog() {
        when(repository.findById(id)).thenReturn(Optional.of(log));

        service.deleteExecutionLog(id);

        verify(repository).deleteById(id);
    }

    @Test
    void shouldThrowWhenDeletingCompletedTraining() {
        sessionLog.setStatus(SessionLogs.LogStatus.Completed);

        when(repository.findById(id)).thenReturn(Optional.of(log));

        assertThrows(IllegalArgumentException.class, () -> service.deleteExecutionLog(id));
    }

    @Test
    void shouldThrowWhenDeletingCancelledTraining() {
        sessionLog.setStatus(SessionLogs.LogStatus.Cancelled);

        when(repository.findById(id)).thenReturn(Optional.of(log));

        assertThrows(IllegalArgumentException.class, () -> service.deleteExecutionLog(id));
    }

    @Test
    void shouldThrowWhenExecutionLogNotFoundOnDelete() {
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.deleteExecutionLog(id));
    }
}
