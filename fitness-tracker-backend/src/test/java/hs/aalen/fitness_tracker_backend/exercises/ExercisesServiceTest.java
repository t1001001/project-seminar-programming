package hs.aalen.fitness_tracker_backend.exercises;

import hs.aalen.fitness_tracker_backend.exercises.dto.ExerciseCreateDto;
import hs.aalen.fitness_tracker_backend.exercises.dto.ExerciseResponseDto;
import hs.aalen.fitness_tracker_backend.exercises.dto.ExercisesUpdateDto;
import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.exercises.service.ExercisesService;
import hs.aalen.fitness_tracker_backend.exercises.repository.ExercisesRepository;

import hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.repository.ExerciseExecutionsRepository;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExercisesServiceTest {

    @Mock
    private ExercisesRepository repository;

    @Mock
    private ExerciseExecutionsRepository executionsRepository;

    @InjectMocks
    private ExercisesService service;

    private UUID id;
    private Exercises exercise;

    @BeforeEach
    void setup() {
        id = UUID.randomUUID();

        exercise = new Exercises();
        exercise.setId(id);
        exercise.setName("Bench Press");
        exercise.setCategory(Exercises.Category.BodyWeight);
        exercise.setDescription("Chest exercise");
        exercise.setMuscleGroups(List.of("Chest"));
    }

    @Test
    void shouldReturnAllExercises() {
        when(repository.findAll()).thenReturn(List.of(exercise));

        List<ExerciseResponseDto> result = service.getAll();

        assertEquals(1, result.size());
        assertEquals("Bench Press", result.get(0).getName());
        verify(repository).findAll();
    }

    @Test
    void shouldReturnExerciseWhenIdExists() {
        when(repository.findById(id)).thenReturn(Optional.of(exercise));

        ExerciseResponseDto result = service.getById(id);

        assertEquals("Bench Press", result.getName());
        verify(repository).findById(id);
    }

    @Test
    void shouldThrowExceptionWhenExerciseNotFoundInGetById() {
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.getById(id));
    }

    @Test
    void shouldCreateExerciseWhenNameIsUnique() {
        ExerciseCreateDto dto = new ExerciseCreateDto();
        dto.setName("Bench Press");
        dto.setCategory("STRENGTH");
        dto.setMuscleGroups(List.of("Chest"));
        dto.setDescription("Press the bar");

        when(repository.findByNameIgnoreCase("Bench Press")).thenReturn(Optional.empty());
        when(repository.save(any(Exercises.class))).thenReturn(exercise);

        ExerciseResponseDto created = service.create(dto);

        assertEquals("Bench Press", created.getName());
        verify(repository).save(any(Exercises.class));
    }

    @Test
    void shouldThrowExceptionWhenExerciseNameAlreadyExistsOnCreate() {
        ExerciseCreateDto dto = new ExerciseCreateDto();
        dto.setName("Bench Press");
        dto.setCategory("STRENGTH");
        dto.setMuscleGroups(List.of("Chest"));
        dto.setDescription("Press the bar");

        when(repository.findByNameIgnoreCase("Bench Press"))
                .thenReturn(Optional.of(exercise));

        assertThrows(IllegalArgumentException.class, () -> service.create(dto));
    }

    @Test
    void shouldDeleteExerciseAndExecutions() {
        ExerciseExecutions exec = new ExerciseExecutions();
        exec.setId(UUID.randomUUID());

        when(repository.existsById(id)).thenReturn(true);
        when(executionsRepository.findByExerciseId(id)).thenReturn(List.of(exec));

        service.delete(id);

        verify(executionsRepository).deleteAll(anyList());
        verify(repository).deleteById(id);
    }

    @Test
    void shouldDeleteExerciseWithoutExecutions() {
        when(repository.existsById(id)).thenReturn(true);
        when(executionsRepository.findByExerciseId(id)).thenReturn(Collections.emptyList());

        service.delete(id);

        verify(executionsRepository, never()).deleteAll(anyList());
        verify(repository).deleteById(id);
    }

    @Test
    void shouldThrowExceptionWhenExerciseNotFoundOnDelete() {
        when(repository.existsById(id)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> service.delete(id));
    }

    @Test
    void shouldUpdateExerciseWhenValid() {
        ExercisesUpdateDto dto = new ExercisesUpdateDto();
        dto.setName("Updated Name");
        dto.setCategory("STRENGTH");
        dto.setMuscleGroups(List.of("Chest", "Triceps"));
        dto.setDescription("New Desc");

        when(repository.findById(id)).thenReturn(Optional.of(exercise));
        when(repository.findByNameIgnoreCase("Updated Name")).thenReturn(Optional.empty());
        when(repository.save(exercise)).thenReturn(exercise);

        ExerciseResponseDto result = service.update(id, dto);

        assertEquals("Updated Name", result.getName());
        verify(repository).save(exercise);
    }

    @Test
    void shouldThrowExceptionWhenNewNameAlreadyExistsAndDifferentId() {
        ExercisesUpdateDto dto = new ExercisesUpdateDto();
        dto.setName("Duplicate");
        dto.setCategory("STRENGTH");
        dto.setMuscleGroups(List.of("Chest"));
        dto.setDescription("desc");

        Exercises duplicate = new Exercises();
        duplicate.setId(UUID.randomUUID());

        when(repository.findById(id)).thenReturn(Optional.of(exercise));
        when(repository.findByNameIgnoreCase("Duplicate")).thenReturn(Optional.of(duplicate));

        assertThrows(IllegalArgumentException.class, () -> service.update(id, dto));
    }

    @Test
    void shouldThrowExceptionWhenExerciseNotFoundOnUpdate() {
        ExercisesUpdateDto dto = new ExercisesUpdateDto();
        dto.setName("Update");
        dto.setCategory("STRENGTH");
        dto.setMuscleGroups(List.of("Chest"));
        dto.setDescription("desc");

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.update(id, dto));
    }
}
