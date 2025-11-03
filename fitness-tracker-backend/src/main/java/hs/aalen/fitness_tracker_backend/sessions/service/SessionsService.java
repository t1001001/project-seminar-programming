package hs.aalen.fitness_tracker_backend.sessions.service;

import hs.aalen.fitness_tracker_backend.plans.model.Plans;
import hs.aalen.fitness_tracker_backend.plans.repository.PlansRepository;
import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.exercises.repository.ExercisesRepository;
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
    private final ExercisesRepository exercisesRepository;
    private final ModelMapper mapper = new ModelMapper();

    public SessionsService(SessionsRepository sessionsRepository, PlansRepository plansRepository, ExercisesRepository exercisesRepository) {
        this.sessionsRepository = sessionsRepository;
        this.plansRepository = plansRepository;
        this.exercisesRepository = exercisesRepository;
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
        return mapper.map(session, SessionsResponseDto.class);
    }

    // Create Session
    public SessionsResponseDto create(SessionsCreateDto dto) {
        if (sessionsRepository.findByNameAndScheduledDateAndPlan_Id(
                dto.getName(),
                dto.getScheduledDate(),
                dto.getPlanId()
        ).isPresent()) {
            throw new IllegalArgumentException(
                    "Session with this name and date already exists in this plan"
            );
        }
        Plans plan = plansRepository.findById(dto.getPlanId())
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));
        List<Exercises> exercises = dto.getExerciseExecutions().stream()
            .map(id -> exercisesRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exercise not found")))
            .toList();
        Sessions session = mapper.map(dto, Sessions.class);
        session.setId(null);
        session.setPlan(plan);
        plan.getSessions().add(session);
        session.setExerciseExecutions(exercises);
        Sessions saved = sessionsRepository.save(session);
        SessionsResponseDto response = mapper.map(saved, SessionsResponseDto.class);
        response.setPlanId(saved.getPlan().getId());
        response.setExerciseExecutions(saved.getExerciseExecutions());
        return response;
    }

    public SessionsResponseDto update(UUID id, SessionsUpdateDto dto) {
        Sessions existingSession = sessionsRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Session not found"));

        // Check if name and date already exist
        Optional<Sessions> duplicate = sessionsRepository.findByNameAndScheduledDateAndPlan_Id(
                dto.getName(),
                dto.getScheduledDate(),
                dto.getPlanId()
        );

        if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
            throw new IllegalArgumentException(
                    "Session with this name and date already exists in this plan"
            );
        }

        Plans plan = plansRepository.findById(dto.getPlanId())
                .orElseThrow(() -> new EntityNotFoundException("Plan not found"));

        List<Exercises> exercises = dto.getExerciseExecutions().stream()
            .map(exerciseId -> exercisesRepository.findById(exerciseId)
                .orElseThrow(() -> new EntityNotFoundException("Exercise not found")))
            .toList();

        if (!existingSession.getPlan().equals(plan)) {
            existingSession.getPlan().getSessions().remove(existingSession);
            plan.getSessions().add(existingSession);
            existingSession.setPlan(plan);
        }

        // Update fields
        existingSession.setName(dto.getName());
        existingSession.setScheduledDate(dto.getScheduledDate());
        existingSession.setExerciseExecutions(exercises);

        Sessions saved = sessionsRepository.save(existingSession);
        return mapper.map(saved, SessionsResponseDto.class);
    }

    public void delete(UUID id) {
        if (!sessionsRepository.existsById(id)) {
            throw new EntityNotFoundException("Session not found");
        }
        sessionsRepository.deleteById(id);
    }
}
