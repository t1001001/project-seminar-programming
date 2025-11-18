package hs.aalen.fitness_tracker_backend.plans.service;

import hs.aalen.fitness_tracker_backend.plans.dto.PlansCreateDTO;
import hs.aalen.fitness_tracker_backend.plans.dto.PlansResponseDTO;
import hs.aalen.fitness_tracker_backend.plans.model.Plans;
import hs.aalen.fitness_tracker_backend.plans.repository.PlansRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import java.util.List;
import java.util.UUID;

@Service
public class PlansService {

    private final PlansRepository repository;
    private final ModelMapper mapper = new ModelMapper();

    public PlansService(PlansRepository repository) {
        this.repository = repository;
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
}