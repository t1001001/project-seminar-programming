package hs.aalen.fitness_tracker_backend.sessionlogs.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import hs.aalen.fitness_tracker_backend.executionlogs.model.ExecutionLogs;

@Entity
@Getter
@Setter
public class SessionLogs {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private Integer sessionID;
    @Column(nullable = false)
    private String sessionName;
    @Column(nullable = false)
    private String sessionPlanName;
    @Column(length = 1000)
    private String sessionPlan;

    @Column(nullable = false)
    private UUID originalSessionId;

    @Column(nullable = false)
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionLogs.LogStatus status = SessionLogs.LogStatus.InProgress;

    @Column(length = 1000)
    private String notes;

    @OneToMany(mappedBy = "sessionLog", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ExecutionLogs> executionLogs = new ArrayList<>();

    public enum LogStatus {
        InProgress,
        Completed,
        Cancelled
    }
}
