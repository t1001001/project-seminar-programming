package hs.aalen.fitness_tracker_backend.sessions.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;

@Data
public class SessionsUpdateDto {

    private UUID planId;

    @NotBlank
    private String name;

    @NotNull
    private LocalDate scheduledDate;

    private List<Exercises> exerciseExecutions;
}
