package hs.aalen.fitness_tracker_backend.exercises.service;

import hs.aalen.fitness_tracker_backend.exercises.dto.ExerciseCreateDto;
import hs.aalen.fitness_tracker_backend.exercises.dto.ExerciseResponseDto;
import hs.aalen.fitness_tracker_backend.exercises.dto.ExercisesUpdateDto;
import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.exercises.repository.ExercisesRepository;
import hs.aalen.fitness_tracker_backend.sessions.dto.SessionsResponseDto;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ExercisesService {

    private final ExercisesRepository repository;
    private final ModelMapper mapper = new ModelMapper();

    public ExercisesService(ExercisesRepository repository) {
        this.repository = repository;
    }

    public List<ExerciseResponseDto> getAll() {
        return repository.findAll()
                .stream()
                .map(e -> mapper.map(e, ExerciseResponseDto.class))
                .toList();
    }

    public ExerciseResponseDto getById(UUID id) {
        Exercises exercise = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exercise not found"));
        return mapper.map(exercise, ExerciseResponseDto.class);
    }

    public ExerciseResponseDto create(ExerciseCreateDto dto) {
        if (repository.findByNameIgnoreCase(dto.getName()).isPresent()) {
            throw new IllegalArgumentException("Exercise with this name already exists");
        }

        Exercises exercise = mapper.map(dto, Exercises.class);
        Exercises saved = repository.save(exercise);
        return mapper.map(saved, ExerciseResponseDto.class);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Session not found");
        }
        repository.deleteById(id);
    }

    public ExerciseResponseDto update(UUID id, ExercisesUpdateDto dto) {
        Exercises existingExercises = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Exercise not found"));
        Optional<Exercises> duplicate = repository.findByNameIgnoreCase(
                dto.getName()
        );
        if (duplicate.isPresent()) {
            throw new IllegalArgumentException("Exercise with this name already exists");
        }
        existingExercises.setName(dto.getName());
        existingExercises.setCategory(dto.getCategory());
        existingExercises.setMuscleGroups(dto.getMuscleGroups());
        existingExercises.setDescription(dto.getDescription());
        Exercises saved = repository.save(existingExercises);
        return mapper.map(saved, ExerciseResponseDto.class);
    }  
}