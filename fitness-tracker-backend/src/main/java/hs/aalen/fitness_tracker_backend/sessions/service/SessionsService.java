package hs.aalen.fitness_tracker_backend.sessions.service;

import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsCreateDto;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsCreateDto;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import java.util.List;
import java.util.UUID;

@Service
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

    public SessionsResponseDto create(SessionsCreateDto dto) {
        if (repository.findByNameIgnoreCase(dto.getName()).isPresent()) {
            throw new IllegalArgumentException("Session with this name already exists");
        }

        Sessions session = mapper.map(dto, Sessions.class);
        Sessions saved = repository.save(session);
        return mapper.map(saved, SessionsResponseDto.class);
    }
}