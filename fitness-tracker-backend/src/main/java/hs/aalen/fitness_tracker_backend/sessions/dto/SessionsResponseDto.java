package hs.aalen.fitness_tracker_backend.sessions.dto;

import lombok.Data;
import java.util.List;
import java.util.UUID;
import java.time.LocalDate;
import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;

@Data
public class SessionsResponseDto {
    private UUID id;
    private UUID planId;
    private String name;
    private LocalDate scheduledDate;
    private List<Exercises> exerciseExecutions;

}
