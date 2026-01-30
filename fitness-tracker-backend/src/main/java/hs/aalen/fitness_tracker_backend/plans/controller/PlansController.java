package hs.aalen.fitness_tracker_backend.plans.controller;

import hs.aalen.fitness_tracker_backend.plans.dto.PlansCreateDto;
import hs.aalen.fitness_tracker_backend.plans.dto.PlansResponseDto;
import hs.aalen.fitness_tracker_backend.plans.dto.PlansUpdateDto;
import hs.aalen.fitness_tracker_backend.plans.service.PlansService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/plans")
public class PlansController {

    private final PlansService service;

    public PlansController(PlansService service) {
        this.service = service;
    }

    @GetMapping
    public List<PlansResponseDto> getAllExercises() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlansResponseDto> getExerciseById(
        @PathVariable UUID id
    ) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createExercise(
        @Valid @RequestBody PlansCreateDto dto
    ) {
        try {
            PlansResponseDto created = service.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                e.getMessage()
            );
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
        @Valid @RequestBody PlansUpdateDto dto
    ) {
        try {
            PlansResponseDto updated = service.update(id, dto);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                e.getMessage()
            );
        }
    }
}
