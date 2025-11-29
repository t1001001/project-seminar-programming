package hs.aalen.fitness_tracker_backend.sessions.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions;
import hs.aalen.fitness_tracker_backend.plans.model.Plans;
import hs.aalen.fitness_tracker_backend.sessionlogs.model.SessionLogs;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = { "plan_id", "name", "scheduled_date" })
})
public class Sessions {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = true)
    @JsonBackReference
    private Plans plan;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private LocalDate scheduledDate;
    @Column(nullable = false)
    private Integer orderID = 0;
    @Column(nullable = false)
    private Integer sessionLogCount = 0;
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ExerciseExecutions> exerciseExecutions = new ArrayList<>();
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<SessionLogs> sessionLogs = new ArrayList<>();
    @Enumerated(EnumType.STRING)
    private SessionStatus status = SessionStatus.PLANNED;

    public enum SessionStatus {
        PLANNED,
        COMPLETED
    }
}
