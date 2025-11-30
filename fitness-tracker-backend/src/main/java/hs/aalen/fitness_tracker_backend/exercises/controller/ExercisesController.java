package hs.aalen.fitness_tracker_backend.exercises.controller;

import hs.aalen.fitness_tracker_backend.exercises.dto.ExerciseCreateDto;
import hs.aalen.fitness_tracker_backend.exercises.dto.ExerciseResponseDto;
import hs.aalen.fitness_tracker_backend.exercises.dto.ExercisesUpdateDto;
import hs.aalen.fitness_tracker_backend.exercises.service.ExercisesService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;

@RestController
@RequestMapping("/api/v1/exercises")
public class ExercisesController {

    private final ExercisesService service;

    public ExercisesController(ExercisesService service) {
        this.service = service;
    }

    @GetMapping
    public List<ExerciseResponseDto> getAllExercises() {
        return service.getAll();
    }

    @GetMapping("/categories")
    public List<String> getAvailableCategories() {
        return Arrays.stream(Exercises.Category.values())
                .filter(category -> category != Exercises.Category.Unspecified)
                .map(Enum::name)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseResponseDto> getExerciseById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createExercise(@Valid @RequestBody ExerciseCreateDto dto) {
        try {
            ExerciseResponseDto created = service.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable UUID id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSession(
            @PathVariable UUID id,
            @Valid @RequestBody ExercisesUpdateDto dto) {
        try {
            ExerciseResponseDto updated = service.update(id, dto);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }
}