package hs.aalen.fitness_tracker_backend.config;

import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.exercises.repository.ExercisesRepository;
import hs.aalen.fitness_tracker_backend.plans.model.Plans;
import hs.aalen.fitness_tracker_backend.plans.repository.PlansRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DatabaseSeeder {

    private final PlansRepository plansRepository;

    DatabaseSeeder(PlansRepository plansRepository) {
        this.plansRepository = plansRepository;
    }

    @Bean
    CommandLineRunner seedDatabase(ExercisesRepository exerciseRepository) {
        return args -> {
            if (exerciseRepository.count() == 0) {
                Exercises exercisesDummy = new Exercises();
                exercisesDummy.setName("Bankdrücken");
                exercisesDummy.setCategory("Freihantel");
                exercisesDummy.setMuscleGroups(List.of("Brust", "Trizeps", "Schulter"));
                exercisesDummy.setDescription("Drücken der Langhantel von der Brust");
                exerciseRepository.save(exercisesDummy);
            }
            if (plansRepository.count() == 0) {
                Plans plansDummy = new Plans();
                plansDummy.setName("Push Day");
                plansDummy.setDescription("Trainingsplan für Brust, Schulter und Trizeps.");
                plansRepository.save(plansDummy);
            }
        };
    }
}