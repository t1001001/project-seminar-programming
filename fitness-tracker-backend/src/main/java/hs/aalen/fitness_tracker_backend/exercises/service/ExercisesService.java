package hs.aalen.fitness_tracker_backend.exercises.service;

import hs.aalen.fitness_tracker_backend.exercises.dto.ExerciseCreateDto;
import hs.aalen.fitness_tracker_backend.exercises.dto.ExerciseResponseDto;
import hs.aalen.fitness_tracker_backend.exercises.dto.ExercisesUpdateDto;
import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.exercises.repository.ExercisesRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ExercisesService {

    private final ExercisesRepository repository;
    private final hs.aalen.fitness_tracker_backend.exerciseexecutions.repository.ExerciseExecutionsRepository exerciseExecutionsRepository;
    private final ModelMapper mapper = new ModelMapper();

    public ExercisesService(ExercisesRepository repository,
            hs.aalen.fitness_tracker_backend.exerciseexecutions.repository.ExerciseExecutionsRepository exerciseExecutionsRepository) {
        this.repository = repository;
        this.exerciseExecutionsRepository = exerciseExecutionsRepository;
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
        exercise.setCategory(Exercises.Category.fromString(dto.getCategory()));
        Exercises saved = repository.save(exercise);
        return mapper.map(saved, ExerciseResponseDto.class);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Exercise not found");
        }

        // Remove dependent executions to avoid orphaned records
        List<hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions> executions = exerciseExecutionsRepository
                .findByExerciseId(id);

        if (!executions.isEmpty()) {
            exerciseExecutionsRepository.deleteAll(executions);
        }

        repository.deleteById(id);
    }

    public ExerciseResponseDto update(UUID id, ExercisesUpdateDto dto) {
        Exercises existingExercises = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exercise not found"));
        Optional<Exercises> duplicate = repository.findByNameIgnoreCase(
                dto.getName());
        if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
            throw new IllegalArgumentException("Exercise with this name already exists");
        }
        existingExercises.setName(dto.getName());
        existingExercises.setCategory(Exercises.Category.fromString(dto.getCategory()));
        existingExercises.setMuscleGroups(dto.getMuscleGroups());
        existingExercises.setDescription(dto.getDescription());
        Exercises saved = repository.save(existingExercises);
        return mapper.map(saved, ExerciseResponseDto.class);
    }
}
