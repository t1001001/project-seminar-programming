package hs.aalen.fitness_tracker_backend.config;

import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.exercises.repository.ExercisesRepository;
import hs.aalen.fitness_tracker_backend.plans.model.Plans;
import hs.aalen.fitness_tracker_backend.plans.repository.PlansRepository;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DatabaseSeeder {

    private final PlansRepository plansRepository;
    private final SessionsRepository sessionsRepository;

    DatabaseSeeder(PlansRepository plansRepository, SessionsRepository sessionsRepository) {
        this.plansRepository = plansRepository;
        this.sessionsRepository = sessionsRepository;
    }

    @Bean
    CommandLineRunner seedDatabase(ExercisesRepository exerciseRepository) {
        return args -> {
            // Create 3 exercises
            if (exerciseRepository.count() == 0) {
                Exercises exercise1 = new Exercises();
                exercise1.setName("Bench Press");
                exercise1.setCategory("Free Weight");
                exercise1.setMuscleGroups(List.of("Chest", "Triceps", "Shoulders"));
                exercise1.setDescription("Pressing the barbell from the chest");
                exerciseRepository.save(exercise1);
                
                Exercises exercise2 = new Exercises();
                exercise2.setName("Squats");
                exercise2.setCategory("Free Weight");
                exercise2.setMuscleGroups(List.of("Legs", "Glutes", "Core"));
                exercise2.setDescription("Deep squats with barbell on shoulders");
                exerciseRepository.save(exercise2);
                
                Exercises exercise3 = new Exercises();
                exercise3.setName("Pull-ups");
                exercise3.setCategory("Bodyweight");
                exercise3.setMuscleGroups(List.of("Back", "Biceps", "Shoulders"));
                exercise3.setDescription("Pulling the body up to the pull-up bar");
                exerciseRepository.save(exercise3);
            
                // Create 2 plans
                Plans plan1 = new Plans();
                plan1.setName("Push Day");
                plan1.setDescription("Training plan for chest, shoulders and triceps.");
                plansRepository.save(plan1);
                
                Plans plan2 = new Plans();
                plan2.setName("Full Body Workout");
                plan2.setDescription("Full body training for all muscle groups.");
                plansRepository.save(plan2);
            
                // Create 1 session with 2 exercises and associate with plan1
                Sessions session1 = new Sessions();
                session1.setName("Monday Training");
                session1.setScheduledDate(LocalDate.now());
                session1.setPlan(plan1);
                session1.setExerciseExecutions(List.of(exercise1, exercise2));
                sessionsRepository.save(session1);
            }
        };
    }
}