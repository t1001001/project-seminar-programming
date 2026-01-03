package hs.aalen.fitness_tracker_backend.sessions;

import hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions;
import hs.aalen.fitness_tracker_backend.plans.model.Plans;
import hs.aalen.fitness_tracker_backend.plans.repository.PlansRepository;
import hs.aalen.fitness_tracker_backend.sessionlogs.repository.SessionLogsRepository;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsCreateDto;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsUpdateDto;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;
import hs.aalen.fitness_tracker_backend.sessions.service.SessionsService;
import hs.aalen.fitness_tracker_backend.users.repository.UsersRepository;
import jakarta.persistence.EntityNotFoundException;
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
class SessionsServiceTest {

    @Mock
    private SessionsRepository sessionsRepository;

    @Mock
    private PlansRepository plansRepository;

    @Mock
    private SessionLogsRepository sessionLogsRepository;

    @Mock
    private UsersRepository usersRepository;

    @InjectMocks
    private SessionsService service;

    private UUID planId;
    private Plans plan;
    private Sessions session;
    private UUID sessionId;

    @BeforeEach
    void setup() {
        planId = UUID.randomUUID();
        sessionId = UUID.randomUUID();

        plan = new Plans();
        plan.setId(planId);
        plan.setSessions(new ArrayList<>());

        session = new Sessions();
        session.setId(sessionId);
        session.setName("Session 1");
        session.setPlan(plan);
        session.setOrderID(1);
        plan.getSessions().add(session);
    }

    @Test
    void shouldCreateSession() {
        SessionsCreateDto dto = new SessionsCreateDto();
        dto.setName("New Session");
        dto.setPlanId(planId);
        dto.setOrderID(2);

        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));
        when(sessionsRepository.findByNameAndPlan_Id(dto.getName(), planId)).thenReturn(Optional.empty());
        when(sessionsRepository.save(any(Sessions.class))).thenAnswer(i -> i.getArgument(0));

        var created = service.create(dto);

        assertEquals("New Session", created.getName());
        assertEquals(planId, created.getPlanId());
        assertEquals(2, created.getOrderID());
        verify(sessionsRepository).save(any(Sessions.class));
    }

    @Test
    void shouldThrowExceptionWhenDuplicateNameOnCreate() {
        SessionsCreateDto dto = new SessionsCreateDto();
        dto.setName("Session 1");
        dto.setPlanId(planId);
        dto.setOrderID(1);

        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));
        when(sessionsRepository.findByNameAndPlan_Id(dto.getName(), planId))
                .thenReturn(Optional.of(session));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.create(dto));

        assertEquals("Session with this name already exists in this plan", ex.getMessage());
    }

    @Test
    void shouldUpdateSessionAndSwapOrder() {
        Sessions otherSession = new Sessions();
        otherSession.setId(UUID.randomUUID());
        otherSession.setPlan(plan);
        otherSession.setOrderID(2);
        plan.getSessions().add(otherSession);

        session.setOrderID(1);

        SessionsUpdateDto dto = new SessionsUpdateDto();
        dto.setName("Updated Session");
        dto.setPlanId(planId);
        dto.setOrderID(2);

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));
        when(sessionsRepository.findByNameAndPlan_Id(dto.getName(), planId)).thenReturn(Optional.empty());

        when(sessionsRepository.save(any(Sessions.class))).thenAnswer(invocation -> {
            Sessions saved = invocation.getArgument(0);
            if (saved.getId().equals(sessionId) && saved.getOrderID() == 2) {
                otherSession.setOrderID(1);
            }
            return saved;
        });

        var updated = service.update(sessionId, dto);

        assertEquals("Updated Session", updated.getName());
        assertEquals(2, updated.getOrderID());
        assertEquals(1, otherSession.getOrderID());
    }

    @Test
    void shouldDeleteSession() {
        when(sessionsRepository.existsById(sessionId)).thenReturn(true);
        service.delete(sessionId);
        verify(sessionsRepository).deleteById(sessionId);
    }

    @Test
    void shouldThrowEntityNotFoundOnDelete() {
        when(sessionsRepository.existsById(sessionId)).thenReturn(false);
        assertThrows(EntityNotFoundException.class, () -> service.delete(sessionId));
    }

    @Test
    void shouldGetAllSessions() {
        when(sessionsRepository.findAll()).thenReturn(List.of(session));
        var result = service.getAll(null);
        assertEquals(1, result.size());
        assertEquals("Session 1", result.get(0).getName());
    }

    @Test
    void shouldGetSessionById() {
        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        var result = service.getById(sessionId, null);
        assertEquals("Session 1", result.getName());
    }

    @Test
    void shouldThrowEntityNotFoundWhenGettingById() {
        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> service.getById(sessionId, null));
    }

    @Test
    void shouldThrowExceptionForOrderTooLow() {
        SessionsCreateDto dto = new SessionsCreateDto();
        dto.setName("Test");
        dto.setPlanId(planId);
        dto.setOrderID(0); // < 1

        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));

        assertThrows(IllegalArgumentException.class, () -> service.create(dto));
    }

    @Test
    void shouldThrowExceptionForOrderTooHigh() {
        SessionsCreateDto dto = new SessionsCreateDto();
        dto.setName("Test");
        dto.setPlanId(planId);
        dto.setOrderID(31); // > 30

        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));

        assertThrows(IllegalArgumentException.class, () -> service.create(dto));
    }

    @Test
    void shouldThrowExceptionWhenMaxSessionsReached() {
        List<Sessions> sessions = new ArrayList<>();
        for (int i = 1; i <= 30; i++) {
            Sessions s = new Sessions();
            s.setId(UUID.randomUUID());
            sessions.add(s);
        }
        SessionsCreateDto dto = new SessionsCreateDto();
        dto.setName("New");
        dto.setPlanId(planId);

        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));
        when(sessionsRepository.findByPlan_Id(planId)).thenReturn(sessions);

        assertThrows(IllegalArgumentException.class, () -> service.create(dto));
    }

    @Test
    void shouldUpdateSessionWithPlanChange() {
        Plans newPlan = new Plans();
        UUID newPlanId = UUID.randomUUID();
        newPlan.setId(newPlanId);
        newPlan.setSessions(new ArrayList<>());

        SessionsUpdateDto dto = new SessionsUpdateDto();
        dto.setName("Updated");
        dto.setPlanId(newPlanId);

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(plansRepository.findById(newPlanId)).thenReturn(Optional.of(newPlan));
        when(sessionsRepository.findByNameAndPlan_Id(dto.getName(), newPlanId)).thenReturn(Optional.empty());
        when(sessionsRepository.save(any(Sessions.class))).thenAnswer(i -> i.getArgument(0));

        var updated = service.update(sessionId, dto);

        assertEquals(newPlanId, updated.getPlanId());
        assertTrue(newPlan.getSessions().contains(session));
    }

    @Test
    void shouldThrowExceptionForInvalidOrderRange_Null() {
        SessionsUpdateDto dto = new SessionsUpdateDto();
        dto.setName("Updated");
        dto.setPlanId(planId);
        dto.setOrderID(null);

        session.setOrderID(1);

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));
        when(sessionsRepository.findByNameAndPlan_Id(dto.getName(), planId)).thenReturn(Optional.empty());

        when(sessionsRepository.save(any(Sessions.class))).thenAnswer(i -> i.getArgument(0));

        var updated = service.update(sessionId, dto);

        assertEquals(1, updated.getOrderID());
    }

    @Test
    void shouldThrowExceptionForInvalidOrderRange_TooLow() {
        SessionsCreateDto dto = new SessionsCreateDto();
        dto.setName("New Session");
        dto.setPlanId(planId);
        dto.setOrderID(0);

        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));

        assertThrows(IllegalArgumentException.class, () -> service.create(dto));
    }

    @Test
    void shouldThrowExceptionForInvalidOrderRange_TooHigh() {
        SessionsCreateDto dto = new SessionsCreateDto();
        dto.setName("New Session");
        dto.setPlanId(planId);
        dto.setOrderID(31);

        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));

        assertThrows(IllegalArgumentException.class, () -> service.create(dto));
    }

    @Test
    void shouldThrowExceptionWhenOrderAlreadyTaken() {
        Sessions otherSession = new Sessions();
        otherSession.setId(UUID.randomUUID());
        otherSession.setPlan(plan);
        otherSession.setOrderID(2);
        plan.getSessions().add(otherSession);

        SessionsCreateDto dto = new SessionsCreateDto();
        dto.setName("Another Session");
        dto.setPlanId(planId);
        dto.setOrderID(2);

        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));
        when(sessionsRepository.findByNameAndPlan_Id(dto.getName(), planId)).thenReturn(Optional.empty());

        when(sessionsRepository.findByPlan_Id(planId)).thenReturn(plan.getSessions());

        assertThrows(IllegalArgumentException.class, () -> service.create(dto));
    }

    @Test
    void shouldHandlePlanChangeOnUpdate() {
        Plans newPlan = new Plans();
        UUID newPlanId = UUID.randomUUID();
        newPlan.setId(newPlanId);
        newPlan.setSessions(new ArrayList<>());

        SessionsUpdateDto dto = new SessionsUpdateDto();
        dto.setName("Updated Session");
        dto.setPlanId(newPlanId);
        dto.setOrderID(1);

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(plansRepository.findById(newPlanId)).thenReturn(Optional.of(newPlan));
        when(sessionsRepository.findByNameAndPlan_Id(dto.getName(), newPlanId)).thenReturn(Optional.empty());
        when(sessionsRepository.save(any(Sessions.class))).thenAnswer(i -> i.getArgument(0));

        var updated = service.update(sessionId, dto);

        assertEquals(newPlanId, updated.getPlanId());
        assertTrue(newPlan.getSessions().contains(session));
        assertFalse(plan.getSessions().contains(session));
    }

    @Test
    void shouldNotSwapOrderWhenOrderIsUnchanged() {
        SessionsUpdateDto dto = new SessionsUpdateDto();
        dto.setName("Same Order");
        dto.setPlanId(planId);
        dto.setOrderID(1);

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));
        when(sessionsRepository.findByNameAndPlan_Id(dto.getName(), planId))
                .thenReturn(Optional.empty());
        when(sessionsRepository.save(any(Sessions.class)))
                .thenAnswer(i -> i.getArgument(0));

        var updated = service.update(sessionId, dto);

        assertEquals(1, updated.getOrderID());
    }

    @Test
    void shouldUpdateOrderWhenTargetOrderIsFree() {
        SessionsUpdateDto dto = new SessionsUpdateDto();
        dto.setName("Free Order");
        dto.setPlanId(planId);
        dto.setOrderID(5);

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));
        when(sessionsRepository.findByNameAndPlan_Id(dto.getName(), planId))
                .thenReturn(Optional.empty());
        when(sessionsRepository.findByPlan_Id(planId))
                .thenReturn(plan.getSessions());
        when(sessionsRepository.save(any(Sessions.class)))
                .thenAnswer(i -> i.getArgument(0));

        var updated = service.update(sessionId, dto);

        assertEquals(5, updated.getOrderID());
    }

    @Test
    void shouldThrowEntityNotFoundWhenPlanIdIsNull() {
        SessionsCreateDto dto = new SessionsCreateDto();
        dto.setName("No Plan");
        dto.setPlanId(null);

        assertThrows(EntityNotFoundException.class, () -> service.create(dto));
    }

    @Test
    void shouldAllowCreateWithNullOrder() {
        SessionsCreateDto dto = new SessionsCreateDto();
        dto.setName("No Order");
        dto.setPlanId(planId);
        dto.setOrderID(1);

        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));
        when(sessionsRepository.findByNameAndPlan_Id(dto.getName(), planId))
                .thenReturn(Optional.empty());
        when(sessionsRepository.save(any(Sessions.class)))
                .thenAnswer(i -> i.getArgument(0));

        var created = service.create(dto);

        assertEquals(1, created.getOrderID());
    }

    @Test
    void shouldMapExerciseExecutionsAndSessionLogCount() {
        var exercise = new ExerciseExecutions();
        exercise.setId(UUID.randomUUID());
        exercise.setOrderID(1);
        exercise.setPlannedSets(3);
        exercise.setPlannedReps(10);
        exercise.setPlannedWeight(50);
        exercise.setSession(session);

        session.setExerciseExecutions(List.of(exercise));

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));

        // Without a username, sessionLogCount should be 0
        var result = service.getById(sessionId, null);

        assertEquals(0, result.getSessionLogCount());
        assertEquals(1, result.getExerciseExecutions().size());
        assertEquals(exercise.getId(), result.getExerciseExecutions().get(0).getId());
    }

    @Test
    void shouldThrowExceptionWhenUpdatingOrderToTaken() {
        Sessions otherSession = new Sessions();
        otherSession.setId(UUID.randomUUID());
        otherSession.setPlan(plan);
        otherSession.setOrderID(2);
        plan.getSessions().add(otherSession);

        SessionsUpdateDto dto = new SessionsUpdateDto();
        dto.setName("Session 1");
        dto.setPlanId(planId);
        dto.setOrderID(2);

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(plansRepository.findById(planId)).thenReturn(Optional.of(plan));
        when(sessionsRepository.findByNameAndPlan_Id(dto.getName(), planId))
                .thenReturn(Optional.of(session));
        when(sessionsRepository.findByPlan_Id(planId)).thenReturn(plan.getSessions());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> service.update(sessionId, dto));

        assertEquals("Order 2 is already used in this plan", ex.getMessage());
    }

    @Test
    void shouldReturnSessionLogCountWithAuthenticatedUser() {
        var user = new hs.aalen.fitness_tracker_backend.users.model.Users();
        user.setId(UUID.randomUUID());
        user.setUsername("testUser");

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(usersRepository.findByUsername("testUser")).thenReturn(Optional.of(user));
        when(sessionLogsRepository.countByOwnerAndOriginalSessionId(user, sessionId)).thenReturn(5L);

        var result = service.getById(sessionId, "testUser");

        assertEquals(5, result.getSessionLogCount());
    }

    @Test
    void shouldReturnZeroSessionLogCountWhenUserNotFound() {
        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(usersRepository.findByUsername("unknownUser")).thenReturn(Optional.empty());

        var result = service.getById(sessionId, "unknownUser");

        assertEquals(0, result.getSessionLogCount());
    }

    @Test
    void shouldHandleSessionWithNullPlan() {
        session.setPlan(null);
        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));

        var result = service.getById(sessionId, null);

        assertNull(result.getPlanId());
    }

    @Test
    void shouldHandleUpdateWithNullPlanId() {
        SessionsUpdateDto dto = new SessionsUpdateDto();
        dto.setName("Updated Name");
        dto.setPlanId(null);

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(sessionsRepository.save(any(Sessions.class))).thenAnswer(i -> i.getArgument(0));

        var result = service.update(sessionId, dto);

        assertEquals("Updated Name", result.getName());
    }

    @Test
    void shouldHandleUpdateToDifferentPlanWhenOriginalPlanIsNull() {
        session.setPlan(null);

        Plans newPlan = new Plans();
        UUID newPlanId = UUID.randomUUID();
        newPlan.setId(newPlanId);
        newPlan.setSessions(new ArrayList<>());

        SessionsUpdateDto dto = new SessionsUpdateDto();
        dto.setName("Updated");
        dto.setPlanId(newPlanId);
        dto.setOrderID(1);

        when(sessionsRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(plansRepository.findById(newPlanId)).thenReturn(Optional.of(newPlan));
        when(sessionsRepository.findByNameAndPlan_Id(dto.getName(), newPlanId)).thenReturn(Optional.empty());
        when(sessionsRepository.save(any(Sessions.class))).thenAnswer(i -> i.getArgument(0));

        var result = service.update(sessionId, dto);

        assertEquals(newPlanId, result.getPlanId());
        assertTrue(newPlan.getSessions().contains(session));
    }

}
