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

@Entity
@Getter
@Setter
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = { "plan_id", "name" })
})
public class Sessions {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = true)
    @JsonBackReference
    private Plans plan;

    @Column(nullable = false)
    private Integer orderID = 0;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ExerciseExecutions> exerciseExecutions = new ArrayList<>();

    @Column(nullable = false)
    private Integer sessionLogCount = 0;
}
