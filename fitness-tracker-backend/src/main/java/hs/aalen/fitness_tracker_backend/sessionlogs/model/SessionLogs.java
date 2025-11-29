package hs.aalen.fitness_tracker_backend.sessionlogs.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;

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
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LogStatus status = LogStatus.IN_PROGRESS;
    @Column(length = 1000)
    private String notes;
    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Sessions session;
    @OneToMany(mappedBy = "sessionLog", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ExecutionLogs> executionLogs = new ArrayList<>();
}
