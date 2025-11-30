package hs.aalen.fitness_tracker_backend.sessions.service;

import hs.aalen.fitness_tracker_backend.plans.model.Plans;
import hs.aalen.fitness_tracker_backend.plans.repository.PlansRepository;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsCreateDto;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsResponseDto;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsUpdateDto;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@SuppressWarnings("null")
public class SessionsService {

    private final SessionsRepository sessionsRepository;
    private final PlansRepository plansRepository;

    public SessionsService(SessionsRepository sessionsRepository, PlansRepository plansRepository) {
        this.sessionsRepository = sessionsRepository;
        this.plansRepository = plansRepository;
    }

    private void validateOrderRange(Integer orderID) {
        if (orderID == null || orderID < 1 || orderID > 30) {
            throw new IllegalArgumentException("Order must be between 1 and 30");
        }
    }

    private Optional<Sessions> findSessionWithOrder(UUID planId, Integer orderID, UUID excludeSessionId) {
        return sessionsRepository.findByPlan_Id(planId).stream()
                .filter(s -> excludeSessionId == null || !s.getId().equals(excludeSessionId))
                .filter(s -> s.getOrderID().equals(orderID))
                .findFirst();
    }

    private void validateOrderNotTaken(UUID planId, Integer orderID) {
        validateOrderRange(orderID);
        findSessionWithOrder(planId, orderID, null)
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

    private SessionsResponseDto toResponseDto(Sessions session) {
        SessionsResponseDto response = new SessionsResponseDto();
        response.setId(session.getId());
        response.setName(session.getName());
        response.setPlanId(session.getPlan() != null ? session.getPlan().getId() : null);
        response.setOrderID(session.getOrderID());
        response.setExerciseExecutionsCount(session.getExerciseExecutions().size());
        response.setSessionLogCount(session.getSessionLogCount());
        return response;
    }

    public List<SessionsResponseDto> getAll() {
        return sessionsRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    public SessionsResponseDto getById(UUID id) {
        Sessions session = sessionsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));
        return toResponseDto(session);
    }

    public SessionsResponseDto create(SessionsCreateDto dto) {
        Plans plan = plansRepository.findById(dto.getPlanId())
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

        validateMaxSessionsInPlan(dto.getPlanId());

        if (sessionsRepository.findByNameAndPlan_Id(dto.getName(), dto.getPlanId()).isPresent()) {
            throw new IllegalArgumentException(
                    "Session with this name already exists in this plan");
        }

        if (dto.getOrderID() != null) {
            validateOrderNotTaken(dto.getPlanId(), dto.getOrderID());
        }

        Sessions session = new Sessions();
        session.setName(dto.getName());
        session.setPlan(plan);
        if (dto.getOrderID() != null) {
            session.setOrderID(dto.getOrderID());
        }
        plan.getSessions().add(session);

        Sessions saved = sessionsRepository.save(session);
        return toResponseDto(saved);
    }

    public SessionsResponseDto update(UUID id, SessionsUpdateDto dto) {
        Sessions existingSession = sessionsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));

        Plans plan = plansRepository.findById(dto.getPlanId())
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

        Optional<Sessions> duplicate = sessionsRepository.findByNameAndPlan_Id(
                dto.getName(), dto.getPlanId());

        if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
            throw new IllegalArgumentException(
                    "Session with this name already exists in this plan");
        }

        if (dto.getOrderID() != null) {
            validateOrderRange(dto.getOrderID());
        }

        // Handle plan change
        if (existingSession.getPlan() != null && !existingSession.getPlan().getId().equals(dto.getPlanId())) {
            existingSession.getPlan().getSessions().remove(existingSession);
            plan.getSessions().add(existingSession);
        }

        // Swap order numbers if another session has the target order
        if (dto.getOrderID() != null) {
            Integer oldOrder = existingSession.getOrderID();
            Integer newOrder = dto.getOrderID();

            if (!oldOrder.equals(newOrder)) {
                Optional<Sessions> sessionWithTargetOrder = findSessionWithOrder(dto.getPlanId(), newOrder, id);
                if (sessionWithTargetOrder.isPresent()) {
                    Sessions otherSession = sessionWithTargetOrder.get();
                    otherSession.setOrderID(oldOrder);
                    sessionsRepository.save(otherSession);
                }
            }
            existingSession.setOrderID(newOrder);
        }

        existingSession.setPlan(plan);
        existingSession.setName(dto.getName());

        Sessions saved = sessionsRepository.save(existingSession);
        return toResponseDto(saved);
    }

    public void delete(UUID id) {
        if (!sessionsRepository.existsById(id)) {
            throw new EntityNotFoundException("Session not found");
        }
        sessionsRepository.deleteById(id);
    }
}
