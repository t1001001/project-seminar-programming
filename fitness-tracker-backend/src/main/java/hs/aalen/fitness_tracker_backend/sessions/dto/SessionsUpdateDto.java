package hs.aalen.fitness_tracker_backend.sessions.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class SessionsUpdateDto {

    private UUID planId;

    @NotBlank
    private String name;

    private Integer orderID;
}
