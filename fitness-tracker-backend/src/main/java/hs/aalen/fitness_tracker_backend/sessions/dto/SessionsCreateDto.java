package hs.aalen.fitness_tracker_backend.sessions.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class SessionsCreateDto {

    @NotNull(message = "Plan ID is required")
    private UUID planId;

    @NotBlank
    private String name;

    @NotNull(message = "Order is required")
    @Min(value = 1, message = "Order must be between 1 and 30")
    @Max(value = 30, message = "Order must be between 1 and 30")
    private Integer orderID;
}
