package hs.aalen.fitness_tracker_backend.plans.service;

import hs.aalen.fitness_tracker_backend.plans.dto.PlansCreateDTO;
import hs.aalen.fitness_tracker_backend.plans.dto.PlansResponseDTO;
import hs.aalen.fitness_tracker_backend.plans.dto.PlansUpdateDto;
import hs.aalen.fitness_tracker_backend.plans.model.Plans;
import hs.aalen.fitness_tracker_backend.plans.repository.PlansRepository;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PlansService {

    private final PlansRepository repository;
    private final SessionsRepository sessionsRepository;
    private final ModelMapper mapper = new ModelMapper();

    public PlansService(PlansRepository repository, SessionsRepository sessionsRepository) {
        this.repository = repository;
        this.sessionsRepository = sessionsRepository;
    }

    public List<PlansResponseDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(e -> mapper.map(e, PlansResponseDTO.class))
                .toList();
    }

    public PlansResponseDTO getById(UUID id) {
        Plans plans = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        return mapper.map(plans, PlansResponseDTO.class);
    }

    public PlansResponseDTO create(PlansCreateDTO dto) {
        if (repository.findByNameIgnoreCase(dto.getName()).isPresent()) {
            throw new IllegalArgumentException("Plan with this name already exists");
        }

        Plans plans = mapper.map(dto, Plans.class);
        Plans saved = repository.save(plans);
        return mapper.map(saved, PlansResponseDTO.class);
    }

    public void delete(UUID id) {
        Plans plan = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

        // Orphan all sessions by setting their plan reference to null
        for (Sessions session : plan.getSessions()) {
            session.setPlan(null);
        }
        plan.getSessions().clear();

        repository.delete(plan);
    }

    public PlansResponseDTO update(UUID id, PlansUpdateDto dto) {
        Plans existingPlan = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

        Optional<Plans> duplicate = repository.findByNameIgnoreCase(
                dto.getName());

        if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
            throw new IllegalArgumentException("Plan with this name already exists");
        }

        List<Sessions> sessions = dto.getSessions().stream()
                .map(sessionId -> sessionsRepository.findById(sessionId)
                        .orElseThrow(() -> new EntityNotFoundException("Session not found")))
                .collect(Collectors.toCollection(ArrayList::new));

        existingPlan.setName(dto.getName());
        existingPlan.setDescription(dto.getDescription());

        existingPlan.getSessions().clear();
        existingPlan.getSessions().addAll(sessions);

        Plans saved = repository.save(existingPlan);
        return mapper.map(saved, PlansResponseDTO.class);
    }
}
