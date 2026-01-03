package hs.aalen.fitness_tracker_backend.sessions.service;

import hs.aalen.fitness_tracker_backend.exerciseexecutions.dto.ExerciseExecutionsResponseDto;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions;
import hs.aalen.fitness_tracker_backend.plans.model.Plans;
import hs.aalen.fitness_tracker_backend.plans.repository.PlansRepository;
import hs.aalen.fitness_tracker_backend.sessionlogs.repository.SessionLogsRepository;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsCreateDto;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsResponseDto;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsUpdateDto;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;
import hs.aalen.fitness_tracker_backend.users.model.Users;
import hs.aalen.fitness_tracker_backend.users.repository.UsersRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Comparator;
import java.util.Optional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@SuppressWarnings("null")
public class SessionsService {

    private final SessionsRepository sessionsRepository;
    private final PlansRepository plansRepository;
    private final SessionLogsRepository sessionLogsRepository;
    private final UsersRepository usersRepository;

    public SessionsService(
            SessionsRepository sessionsRepository,
            PlansRepository plansRepository,
            SessionLogsRepository sessionLogsRepository,
            UsersRepository usersRepository) {
        this.sessionsRepository = sessionsRepository;
        this.plansRepository = plansRepository;
        this.sessionLogsRepository = sessionLogsRepository;
        this.usersRepository = usersRepository;
    }

    private void validateOrderRange(Integer orderID) {
        if (orderID == null || orderID < 1 || orderID > 30) {
            throw new IllegalArgumentException("Order must be between 1 and 30");
        }
    }

    private Optional<Sessions> findSessionWithOrder(UUID planId, Integer orderID, UUID excludeSessionId) {
        return sessionsRepository.findByPlan_Id(planId).stream()
                .filter(s -> excludeSessionId == null || !s.getId().equals(excludeSessionId))
                .filter(s -> s.getOrderID() != null && s.getOrderID().equals(orderID))
                .findFirst();
    }

    private void validateOrderNotTaken(UUID planId, Integer orderID, UUID excludeSessionId) {
        validateOrderRange(orderID);
        findSessionWithOrder(planId, orderID, excludeSessionId)
                .ifPresent(s -> {
                    throw new IllegalArgumentException(
                            "Order " + orderID + " is already used in this plan");
                });
    }

    private void validateMaxSessionsInPlan(UUID planId) {
        if (planId != null) {
            long count = sessionsRepository.findByPlan_Id(planId).size();

            if (count >= 30) {
                throw new IllegalArgumentException(
                        "Maximum of 30 sessions per plan reached");
            }
        }
    }

    private SessionsResponseDto toResponseDto(Sessions session, String username) {
        SessionsResponseDto response = new SessionsResponseDto();
        response.setId(session.getId());
        response.setName(session.getName());
        response.setPlanId(session.getPlan() != null ? session.getPlan().getId() : null);
        response.setOrderID(session.getOrderID());
        response.setExerciseExecutionsCount(session.getExerciseExecutions().size());
        response.setExerciseExecutions(session.getExerciseExecutions().stream()
                .sorted(Comparator.comparing(
                        ExerciseExecutions::getOrderID,
                        Comparator.nullsLast(Comparator.naturalOrder())))
                .map(this::toExerciseExecutionDto)
                .toList());

        // Compute sessionLogCount dynamically per-user
        int sessionLogCount = 0;
        if (username != null) {
            Users owner = usersRepository.findByUsername(username).orElse(null);
            if (owner != null) {
                sessionLogCount = (int) sessionLogsRepository.countByOwnerAndOriginalSessionId(owner, session.getId());
            }
        }
        response.setSessionLogCount(sessionLogCount);
        return response;
    }

    private ExerciseExecutionsResponseDto toExerciseExecutionDto(ExerciseExecutions execution) {
        ExerciseExecutionsResponseDto dto = new ExerciseExecutionsResponseDto();
        dto.setId(execution.getId());
        dto.setPlannedSets(execution.getPlannedSets());
        dto.setPlannedReps(execution.getPlannedReps());
        dto.setPlannedWeight(execution.getPlannedWeight());
        dto.setOrderID(execution.getOrderID());
        dto.setSessionId(execution.getSession() != null ? execution.getSession().getId() : null);
        dto.setSessionName(execution.getSession() != null ? execution.getSession().getName() : null);
        dto.setExerciseId(execution.getExercise() != null ? execution.getExercise().getId() : null);
        dto.setExerciseName(execution.getExercise() != null ? execution.getExercise().getName() : null);
        return dto;
    }

    public List<SessionsResponseDto> getAll(String username) {
        return sessionsRepository.findAll()
                .stream()
                .map(session -> toResponseDto(session, username))
                .toList();
    }

    public SessionsResponseDto getById(UUID id, String username) {
        Sessions session = sessionsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));
        return toResponseDto(session, username);
    }

    public SessionsResponseDto create(SessionsCreateDto dto) {
        Plans plan = plansRepository.findById(dto.getPlanId())
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

        validateMaxSessionsInPlan(dto.getPlanId());

        if (dto.getOrderID() == null) {
            throw new IllegalArgumentException("Order must be between 1 and 30");
        }

        if (sessionsRepository.findByNameAndPlan_Id(dto.getName(), dto.getPlanId()).isPresent()) {
            throw new IllegalArgumentException(
                    "Session with this name already exists in this plan");
        }

        if (dto.getOrderID() != null) {
            validateOrderNotTaken(dto.getPlanId(), dto.getOrderID(), null);
        }

        Sessions session = new Sessions();
        session.setName(dto.getName());
        session.setPlan(plan);
        if (dto.getOrderID() != null) {
            session.setOrderID(dto.getOrderID());
        }
        plan.getSessions().add(session);

        Sessions saved = sessionsRepository.save(session);
        return toResponseDto(saved, null);
    }

    public SessionsResponseDto update(UUID id, SessionsUpdateDto dto) {
        Sessions existingSession = sessionsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));

        Plans plan = null;
        if (dto.getPlanId() != null) {
            plan = plansRepository.findById(dto.getPlanId())
                    .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        }

        if (plan != null) {
            boolean planChanged = existingSession.getPlan() == null
                    || !existingSession.getPlan().getId().equals(dto.getPlanId());
            if (planChanged) {
                validateMaxSessionsInPlan(dto.getPlanId());
            }

            Optional<Sessions> duplicate = sessionsRepository.findByNameAndPlan_Id(
                    dto.getName(), dto.getPlanId());

            if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
                throw new IllegalArgumentException(
                        "Session with this name already exists in this plan");
            }

            Integer targetOrder = dto.getOrderID() != null ? dto.getOrderID() : existingSession.getOrderID();
            if (targetOrder == null) {
                throw new IllegalArgumentException("Order must be between 1 and 30");
            }
            validateOrderNotTaken(dto.getPlanId(), targetOrder, id);

            if (planChanged && existingSession.getPlan() != null) {
                existingSession.getPlan().getSessions().remove(existingSession);
                plan.getSessions().add(existingSession);
            } else if (planChanged) {
                plan.getSessions().add(existingSession);
            }

            existingSession.setPlan(plan);
            if (dto.getOrderID() != null) {
                existingSession.setOrderID(dto.getOrderID());
            }
        }

        existingSession.setName(dto.getName());

        Sessions saved = sessionsRepository.save(existingSession);
        return toResponseDto(saved, null);
    }

    public void delete(UUID id) {
        if (!sessionsRepository.existsById(id)) {
            throw new EntityNotFoundException("Session not found");
        }
        sessionsRepository.deleteById(id);
    }
}
