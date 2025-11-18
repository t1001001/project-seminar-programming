package hs.aalen.fitness_tracker_backend.plans.service;

import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.plans.dto.PlansCreateDTO;
import hs.aalen.fitness_tracker_backend.plans.dto.PlansResponseDTO;
import hs.aalen.fitness_tracker_backend.plans.dto.PlansUpdateDto;
import hs.aalen.fitness_tracker_backend.plans.model.Plans;
import hs.aalen.fitness_tracker_backend.plans.repository.PlansRepository;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsResponseDto;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.List;
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
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Plan not found");
        }
        repository.deleteById(id);
    }

    public PlansResponseDTO update(UUID id, PlansUpdateDto dto) {
        Plans existingPlan = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

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