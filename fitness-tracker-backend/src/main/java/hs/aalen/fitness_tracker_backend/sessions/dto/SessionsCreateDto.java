package hs.aalen.fitness_tracker_backend.sessions.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
public class SessionsCreateDto {

    // TODO: planId (referenzierter trainingsplan)

    @NotBlank
    private String name;

    @NotBlank
    private LocalTime scheduledDate;

    @NotEmpty
    private List<String> exerciseExecutions;
}