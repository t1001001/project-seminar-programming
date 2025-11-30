package hs.aalen.fitness_tracker_backend.sessions.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class SessionsUpdateDto {

    @NotNull(message = "Plan ID is required")
    private UUID planId;

    @NotBlank
    private String name;

    private Integer orderID;
}
