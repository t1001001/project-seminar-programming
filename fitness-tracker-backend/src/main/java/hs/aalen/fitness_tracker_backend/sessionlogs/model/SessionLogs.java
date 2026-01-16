package hs.aalen.fitness_tracker_backend.sessionlogs.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import hs.aalen.fitness_tracker_backend.executionlogs.model.ExecutionLogs;
import hs.aalen.fitness_tracker_backend.users.model.Users;

@Entity
@Getter
@Setter
public class SessionLogs {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String sessionName;
    @Column(nullable = false)
    private String sessionPlanName;
    @Column(length = 1000)
    private String sessionPlan;

    @Column(nullable = false)
    private UUID originalSessionId;

    @Column(nullable = false)
    private Instant startedAt;
    private Instant completedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionLogs.LogStatus status = SessionLogs.LogStatus.InProgress;

    @Column(length = 1000)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false, updatable = false)
    private Users owner;

    @OneToMany(mappedBy = "sessionLog", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ExecutionLogs> executionLogs = new ArrayList<>();

    public enum LogStatus {
        InProgress,
        Completed
    }
}
