package hs.aalen.fitness_tracker_backend.sessions.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class SessionsCreateDto {

    private UUID planId;

    @NotBlank
    private String name;

    @NotNull
    private LocalDate scheduledDate;

    private Integer orderID;

    private hs.aalen.fitness_tracker_backend.sessions.model.Sessions.SessionStatus status;
}