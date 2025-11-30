package hs.aalen.fitness_tracker_backend.exercises.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Exercises {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @ElementCollection
    @CollectionTable(name = "exercise_muscle_groups", joinColumns = @JoinColumn(name = "exercise_id"))
    private List<String> muscleGroups;

    private String description;

    @Enumerated(EnumType.STRING)
    private Category category = Category.Unspecified;

    public enum Category {
        Unspecified,
        BodyWeight,
        FreeWeight,
        Equipment;

        public static Category fromString(String value) {
            if (value == null)
                return Unspecified;
            try {
                return Category.valueOf(value);
            } catch (IllegalArgumentException e) {
                return Unspecified;
            }
        }
    }
}