package hs.aalen.fitness_tracker_backend.sessions.service;

import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsCreateDto;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsResponseDto;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsUpdateDto;
import java.util.Optional;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import java.util.List;
import java.util.UUID;

@Service
@SuppressWarnings("null")
public class SessionsService {

    private final SessionsRepository repository;
    private final ModelMapper mapper = new ModelMapper();

    public SessionsService(SessionsRepository repository) {
        this.repository = repository;
    }

    public List<SessionsResponseDto> getAll() {
        return repository.findAll()
                .stream()
                .map(e -> mapper.map(e, SessionsResponseDto.class))
                .toList();
    }

    public SessionsResponseDto getById(UUID id) {
        Sessions session = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exercise not found"));
        return mapper.map(session, SessionsResponseDto.class);
    }

    // Create Session
    public SessionsResponseDto create(SessionsCreateDto dto) {
        if (repository.findByNameAndScheduledDateAndPlanId(
            dto.getName(), 
            dto.getScheduledDate(),
            dto.getPlanId()
        ).isPresent()) {
        throw new IllegalArgumentException(
            "Session with this name and date already exists in this plan"
        );
    }
    Sessions session = mapper.map(dto, Sessions.class);
    Sessions saved = repository.save(session);
    return mapper.map(saved, SessionsResponseDto.class);
    }

    public SessionsResponseDto update(UUID id, SessionsUpdateDto dto) {
    Sessions existingSession = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Session not found"));
    
    // Check if name and date already exist
    Optional<Sessions> duplicate = repository.findByNameAndScheduledDateAndPlanId(
            dto.getName(), 
            dto.getScheduledDate(),
            dto.getPlanId()
    );
    
    if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
        throw new IllegalArgumentException(
            "Session with this name and date already exists in this plan"
        );
    }
    
    // Update fields
    existingSession.setPlanId(dto.getPlanId());
    existingSession.setName(dto.getName());
    existingSession.setScheduledDate(dto.getScheduledDate());
    existingSession.setExerciseExecutions(dto.getExerciseExecutions());
    
    Sessions saved = repository.save(existingSession);
    return mapper.map(saved, SessionsResponseDto.class);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Session not found");
        }
        repository.deleteById(id);
    }






}
