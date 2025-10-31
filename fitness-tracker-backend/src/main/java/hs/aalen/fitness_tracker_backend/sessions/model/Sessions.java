package hs.aalen.fitness_tracker_backend.sessions.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;
import java.time.LocalTime;

@Entity
@Getter
@Setter
public class Sessions {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private LocalTime scheduledDate;

    @ElementCollection
    @CollectionTable(name = "exercise_executions", joinColumns = @JoinColumn(name = "session_id"))
    private List<String> exerciseExecutions;

}