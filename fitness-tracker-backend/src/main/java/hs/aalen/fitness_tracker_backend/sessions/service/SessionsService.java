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

    private void validateSessionOrder(UUID planId, Integer orderID, UUID excludeSessionId) {
        if (orderID == null || orderID < 1 || orderID > 30) {
            throw new IllegalArgumentException("Order must be between 1 and 30");
        }

        if (planId != null) {
            sessionsRepository.findByPlan_Id(planId).stream()
                    .filter(s -> excludeSessionId == null || !s.getId().equals(excludeSessionId))
                    .filter(s -> s.getOrderID().equals(orderID))
                    .findFirst()
                    .ifPresent(s -> {
                        throw new IllegalArgumentException(
                                "Order " + orderID + " is already used in this plan");
                    });
        }
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
        if (sessionsRepository.findByNameAndPlan_Id(dto.getName(), dto.getPlanId()).isPresent()) {
            throw new IllegalArgumentException(
                    "Session with this name already exists in this plan");
        }

        if (dto.getOrderID() != null) {
            validateSessionOrder(dto.getPlanId(), dto.getOrderID(), null);
        }
        validateMaxSessionsInPlan(dto.getPlanId());

        Plans plan = null;
        if (dto.getPlanId() != null) {
            plan = plansRepository.findById(dto.getPlanId())
                    .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        }

        Sessions session = new Sessions();
        session.setName(dto.getName());
        session.setPlan(plan);
        session.setOrderID(dto.getOrderID() != null ? dto.getOrderID() : 0);

        if (plan != null) {
            plan.getSessions().add(session);
        }

        Sessions saved = sessionsRepository.save(session);
        return toResponseDto(saved);
    }

    public SessionsResponseDto update(UUID id, SessionsUpdateDto dto) {
        Sessions existingSession = sessionsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));

        Optional<Sessions> duplicate = sessionsRepository.findByNameAndPlan_Id(
                dto.getName(), dto.getPlanId());

        if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
            throw new IllegalArgumentException(
                    "Session with this name already exists in this plan");
        }

        if (dto.getOrderID() != null) {
            validateSessionOrder(dto.getPlanId(), dto.getOrderID(), id);
        }

        Plans plan = null;
        if (dto.getPlanId() != null) {
            plan = plansRepository.findById(dto.getPlanId())
                    .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        }

        // Handle plan change
        if (existingSession.getPlan() != null && !existingSession.getPlan().equals(plan)) {
            existingSession.getPlan().getSessions().remove(existingSession);
        }

        if (plan != null && !plan.equals(existingSession.getPlan())) {
            plan.getSessions().add(existingSession);
        }

        existingSession.setPlan(plan);
        existingSession.setName(dto.getName());

        if (dto.getOrderID() != null) {
            existingSession.setOrderID(dto.getOrderID());
        }

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
