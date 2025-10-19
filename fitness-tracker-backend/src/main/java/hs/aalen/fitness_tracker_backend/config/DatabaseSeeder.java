package hs.aalen.fitness_tracker_backend.config;

import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.exercises.repository.ExercisesRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner seedDatabase(ExercisesRepository exerciseRepository) {
        return args -> {
            if (exerciseRepository.count() == 0) {
                Exercises dummy = new Exercises();
                dummy.setName("Bankdrücken");
                dummy.setCategory("Freihantel");
                dummy.setMuscleGroups(List.of("Brust", "Trizeps", "Schulter"));
                dummy.setDescription("Drücken der Langhantel von der Brust");
                exerciseRepository.save(dummy);
            }
        };
    }
}