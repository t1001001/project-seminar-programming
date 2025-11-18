package hs.aalen.fitness_tracker_backend.plans.controller;

import hs.aalen.fitness_tracker_backend.plans.dto.PlansCreateDTO;
import hs.aalen.fitness_tracker_backend.plans.dto.PlansResponseDTO;
import hs.aalen.fitness_tracker_backend.plans.service.PlansService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/plans")
public class PlansController {

    private final PlansService service;

    public PlansController(PlansService service) {
        this.service = service;
    }

    @GetMapping
    public List<PlansResponseDTO> getAllExercises() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlansResponseDTO> getExerciseById(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createExercise(@Valid @RequestBody PlansCreateDTO dto) {
        try {
            PlansResponseDTO created = service.create(dto);
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
}