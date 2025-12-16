package hs.aalen.fitness_tracker_backend.plans;

import hs.aalen.fitness_tracker_backend.plans.dto.PlansCreateDTO;
import hs.aalen.fitness_tracker_backend.plans.dto.PlansResponseDTO;
import hs.aalen.fitness_tracker_backend.plans.dto.PlansUpdateDto;
import hs.aalen.fitness_tracker_backend.plans.model.Plans;
import hs.aalen.fitness_tracker_backend.plans.repository.PlansRepository;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;
import hs.aalen.fitness_tracker_backend.plans.service.PlansService;

import jakarta.persistence.EntityNotFoundException;
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
class PlansServiceTest {

    @Mock
    private PlansRepository repository;

    @Mock
    private SessionsRepository sessionsRepository;

    @InjectMocks
    private PlansService service;

    private UUID planId;
    private Plans plan;

    @BeforeEach
    void setup() {
        planId = UUID.randomUUID();
        plan = new Plans();
        plan.setId(planId);
        plan.setName("Plan A");
        plan.setDescription("Description A");
        plan.setSessions(new ArrayList<>());
    }

    @Test
    void shouldReturnAllPlans() {
        when(repository.findAll()).thenReturn(List.of(plan));

        List<PlansResponseDTO> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("Plan A", result.get(0).getName());
        verify(repository).findAll();
    }

    @Test
    void shouldReturnPlanWhenIdExists() {
        when(repository.findById(planId)).thenReturn(Optional.of(plan));

        PlansResponseDTO result = service.getById(planId);

        assertEquals("Plan A", result.getName());
        verify(repository).findById(planId);
    }

    @Test
    void shouldThrowExceptionWhenPlanNotFound() {
        when(repository.findById(planId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.getById(planId));
    }

    @Test
    void shouldCreatePlanWhenNameIsUnique() {
        PlansCreateDTO dto = new PlansCreateDTO();
        dto.setName("Plan B");
        dto.setDescription("Desc B");

        when(repository.findByNameIgnoreCase("Plan B")).thenReturn(Optional.empty());
        when(repository.save(any(Plans.class))).thenReturn(plan);

        PlansResponseDTO created = service.create(dto);

        assertEquals("Plan A", created.getName());
        verify(repository).save(any(Plans.class));
    }

    @Test
    void shouldThrowExceptionWhenPlanNameAlreadyExists() {
        PlansCreateDTO dto = new PlansCreateDTO();
        dto.setName("Plan A");
        dto.setDescription("Desc");

        when(repository.findByNameIgnoreCase("Plan A")).thenReturn(Optional.of(plan));

        assertThrows(IllegalArgumentException.class, () -> service.create(dto));
    }

    @Test
    void shouldDeletePlanAndOrphanSessions() {
        Sessions session = new Sessions();
        session.setId(UUID.randomUUID());
        plan.getSessions().add(session);

        when(repository.findById(planId)).thenReturn(Optional.of(plan));

        service.delete(planId);

        assertTrue(plan.getSessions().isEmpty());
        verify(repository).delete(plan);
    }

    @Test
    void shouldThrowExceptionWhenPlanNotFoundOnDelete() {
        when(repository.findById(planId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.delete(planId));
    }

    @Test
    void shouldUpdatePlanSuccessfully() {
        UUID sessionId = UUID.randomUUID();
        Sessions session = new Sessions();
        session.setId(sessionId);

        PlansUpdateDto dto = new PlansUpdateDto();
        dto.setName("Plan Updated");
        dto.setDescription("New Desc");
        dto.setSessions(List.of(sessionId));

        when(repository.findById(planId)).thenReturn(Optional.of(plan));
        when(repository.findByNameIgnoreCase("Plan Updated")).thenReturn(Optional.empty());
        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(repository.save(any(Plans.class))).thenReturn(plan);

        PlansResponseDTO updated = service.update(planId, dto);

        assertEquals("Plan Updated", updated.getName());
        assertEquals(1, plan.getSessions().size());
        verify(repository).save(plan);
    }

    @Test
    void shouldThrowExceptionWhenPlanNameDuplicateOnUpdate() {
        PlansUpdateDto dto = new PlansUpdateDto();
        dto.setName("Plan B");
        dto.setDescription("Desc");
        dto.setSessions(List.of());

        Plans duplicate = new Plans();
        duplicate.setId(UUID.randomUUID());

        when(repository.findById(planId)).thenReturn(Optional.of(plan));
        when(repository.findByNameIgnoreCase("Plan B")).thenReturn(Optional.of(duplicate));

        assertThrows(IllegalArgumentException.class, () -> service.update(planId, dto));
    }

    @Test
    void shouldThrowExceptionWhenSessionNotFoundOnUpdate() {
        UUID sessionId = UUID.randomUUID();
        PlansUpdateDto dto = new PlansUpdateDto();
        dto.setName("Plan Updated");
        dto.setDescription("Desc");
        dto.setSessions(List.of(sessionId));

        when(repository.findById(planId)).thenReturn(Optional.of(plan));
        when(repository.findByNameIgnoreCase("Plan Updated")).thenReturn(Optional.empty());
        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.update(planId, dto));
    }
}
