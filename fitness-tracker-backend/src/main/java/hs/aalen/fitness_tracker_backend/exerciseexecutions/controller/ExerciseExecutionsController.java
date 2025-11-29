package hs.aalen.fitness_tracker_backend.exerciseexecutions.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.dto.ExerciseExecutionsCreateDto;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.dto.ExerciseExecutionsResponseDto;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.dto.ExerciseExecutionsUpdateDto;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.service.ExerciseExecutionsService;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exercise-executions")
public class ExerciseExecutionsController {
    @Autowired
    private ExerciseExecutionsService exerciseExecutionsService;

    @PostMapping
    public ResponseEntity<ExerciseExecutionsResponseDto> createExerciseExecution(
            @RequestBody ExerciseExecutionsCreateDto dto) {
        ExerciseExecutionsResponseDto response = exerciseExecutionsService.createExerciseExecution(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ExerciseExecutionsResponseDto>> getAllExerciseExecutions(
            @RequestParam(required = false) UUID sessionId) {
        List<ExerciseExecutionsResponseDto> executions;
        if (sessionId != null) {
            executions = exerciseExecutionsService.getExerciseExecutionsBySessionId(sessionId);
        } else {
            executions = exerciseExecutionsService.getAllExerciseExecutions();
        }
        return ResponseEntity.ok(executions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseExecutionsResponseDto> getExerciseExecutionById(@PathVariable UUID id) {
        ExerciseExecutionsResponseDto response = exerciseExecutionsService.getExerciseExecutionById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExerciseExecutionsResponseDto> updateExerciseExecution(
            @PathVariable UUID id,
            @RequestBody ExerciseExecutionsUpdateDto dto) {
        ExerciseExecutionsResponseDto response = exerciseExecutionsService.updateExerciseExecution(id, dto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExerciseExecution(@PathVariable UUID id) {
        exerciseExecutionsService.deleteExerciseExecution(id);
        return ResponseEntity.noContent().build();
    }
}