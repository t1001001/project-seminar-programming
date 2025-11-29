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
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@SuppressWarnings("null")
public class SessionsService {

    private final SessionsRepository sessionsRepository;
    private final PlansRepository plansRepository;
    private final ModelMapper mapper = new ModelMapper();

    public SessionsService(SessionsRepository sessionsRepository, PlansRepository plansRepository) {
        this.sessionsRepository = sessionsRepository;
        this.plansRepository = plansRepository;
    }

    private void validateSessionOrder(UUID planId, Integer orderID, UUID excludeSessionId) {
        if (orderID == null || orderID < 1 || orderID > 30) {
            throw new IllegalArgumentException("Order must be between 1 and 30");
        }

        if (planId != null) {
            sessionsRepository.findAll().stream()
                    .filter(s -> s.getPlan() != null && s.getPlan().getId().equals(planId))
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
            long count = sessionsRepository.findAll().stream()
                    .filter(s -> s.getPlan() != null && s.getPlan().getId().equals(planId))
                    .count();

            if (count >= 30) {
                throw new IllegalArgumentException(
                        "Maximum of 30 sessions per plan reached");
            }
        }
    }

    public List<SessionsResponseDto> getAll() {
        return sessionsRepository.findAll()
                .stream()
                .map(e -> mapper.map(e, SessionsResponseDto.class))
                .toList();
    }

    public SessionsResponseDto getById(UUID id) {
        Sessions session = sessionsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exercise not found"));
        SessionsResponseDto response = mapper.map(session, SessionsResponseDto.class);
        response.setExerciseCount(session.getExerciseExecutions().size());
        return response;
    }

    // Create Session
    public SessionsResponseDto create(SessionsCreateDto dto) {
        if (sessionsRepository.findByNameAndScheduledDateAndPlan_Id(
                dto.getName(),
                dto.getScheduledDate(),
                dto.getPlanId()).isPresent()) {
            throw new IllegalArgumentException(
                    "Session with this name and date already exists in this plan");
        }

        validateSessionOrder(dto.getPlanId(), dto.getOrderID(), null);
        validateMaxSessionsInPlan(dto.getPlanId());

        Plans plan = null;
        if (dto.getPlanId() != null) {
            plan = plansRepository.findById(dto.getPlanId())
                    .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        }

        Sessions session = mapper.map(dto, Sessions.class);
        session.setId(null);
        session.setPlan(plan);

        if (session.getOrderID() == null) {
            session.setOrderID(0);
        }

        if (plan != null) {
            plan.getSessions().add(session);
        }

        Sessions saved = sessionsRepository.save(session);
        SessionsResponseDto response = mapper.map(saved, SessionsResponseDto.class);
        response.setPlanId(saved.getPlan() != null ? saved.getPlan().getId() : null);
        response.setExerciseCount(saved.getExerciseExecutions().size());
        return response;
    }

    public SessionsResponseDto update(UUID id, SessionsUpdateDto dto) {
        Sessions existingSession = sessionsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));

        // Check if name and date already exist
        Optional<Sessions> duplicate = sessionsRepository.findByNameAndScheduledDateAndPlan_Id(
                dto.getName(),
                dto.getScheduledDate(),
                dto.getPlanId());

        if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
            throw new IllegalArgumentException(
                    "Session with this name and date already exists in this plan");
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

        // Update fields
        existingSession.setName(dto.getName());
        existingSession.setScheduledDate(dto.getScheduledDate());

        if (dto.getOrderID() != null) {
            existingSession.setOrderID(dto.getOrderID());
        }

        Sessions saved = sessionsRepository.save(existingSession);
        SessionsResponseDto response = mapper.map(saved, SessionsResponseDto.class);
        response.setExerciseCount(saved.getExerciseExecutions().size());
        return response;
    }

    public void delete(UUID id) {
        if (!sessionsRepository.existsById(id)) {
            throw new EntityNotFoundException("Session not found");
        }
        sessionsRepository.deleteById(id);
    }
}
