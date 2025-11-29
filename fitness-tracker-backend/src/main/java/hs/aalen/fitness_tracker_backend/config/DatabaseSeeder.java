package hs.aalen.fitness_tracker_backend.config;

import hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.repository.ExerciseExecutionsRepository;
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

    @Bean
    CommandLineRunner seedDatabase(
            ExercisesRepository exercisesRepository,
            PlansRepository plansRepository,
            SessionsRepository sessionsRepository,
            ExerciseExecutionsRepository exerciseExecutionsRepository) {
        return args -> {
            // Only seed if database is empty
            if (exercisesRepository.count() > 0) {
                return;
            }

            // ===== CREATE EXERCISES =====

            // Chest Exercises
            Exercises benchPress = new Exercises();
            benchPress.setName("Bench Press");
            benchPress.setCategory(Exercises.Category.FreeWeight);
            benchPress.setMuscleGroups(List.of("Chest", "Triceps", "Shoulders"));
            benchPress.setDescription("Barbell bench press for chest development");
            exercisesRepository.save(benchPress);

            Exercises inclinePress = new Exercises();
            inclinePress.setName("Incline Dumbbell Press");
            inclinePress.setCategory(Exercises.Category.FreeWeight);
            inclinePress.setMuscleGroups(List.of("Chest", "Shoulders", "Triceps"));
            inclinePress.setDescription("Incline dumbbell press targeting upper chest");
            exercisesRepository.save(inclinePress);

            Exercises pushUps = new Exercises();
            pushUps.setName("Push-ups");
            pushUps.setCategory(Exercises.Category.BodyWeight);
            pushUps.setMuscleGroups(List.of("Chest", "Triceps", "Core"));
            pushUps.setDescription("Classic bodyweight push-ups");
            exercisesRepository.save(pushUps);

            // Back Exercises
            Exercises deadlift = new Exercises();
            deadlift.setName("Deadlift");
            deadlift.setCategory(Exercises.Category.FreeWeight);
            deadlift.setMuscleGroups(List.of("Back", "Hamstrings", "Glutes", "Core"));
            deadlift.setDescription("Conventional barbell deadlift");
            exercisesRepository.save(deadlift);

            Exercises pullUps = new Exercises();
            pullUps.setName("Pull-ups");
            pullUps.setCategory(Exercises.Category.BodyWeight);
            pullUps.setMuscleGroups(List.of("Back", "Biceps", "Shoulders"));
            pullUps.setDescription("Bodyweight pull-ups for back development");
            exercisesRepository.save(pullUps);

            Exercises bentOverRow = new Exercises();
            bentOverRow.setName("Bent Over Row");
            bentOverRow.setCategory(Exercises.Category.FreeWeight);
            bentOverRow.setMuscleGroups(List.of("Back", "Biceps", "Core"));
            bentOverRow.setDescription("Barbell bent over row");
            exercisesRepository.save(bentOverRow);

            // Leg Exercises
            Exercises squats = new Exercises();
            squats.setName("Barbell Squats");
            squats.setCategory(Exercises.Category.FreeWeight);
            squats.setMuscleGroups(List.of("Quadriceps", "Glutes", "Hamstrings", "Core"));
            squats.setDescription("Back squats with barbell");
            exercisesRepository.save(squats);

            Exercises legPress = new Exercises();
            legPress.setName("Leg Press");
            legPress.setCategory(Exercises.Category.Equipment);
            legPress.setMuscleGroups(List.of("Quadriceps", "Glutes", "Hamstrings"));
            legPress.setDescription("Machine leg press");
            exercisesRepository.save(legPress);

            Exercises lunges = new Exercises();
            lunges.setName("Walking Lunges");
            lunges.setCategory(Exercises.Category.BodyWeight);
            lunges.setMuscleGroups(List.of("Quadriceps", "Glutes", "Hamstrings"));
            lunges.setDescription("Bodyweight walking lunges");
            exercisesRepository.save(lunges);

            // Shoulder Exercises
            Exercises overheadPress = new Exercises();
            overheadPress.setName("Overhead Press");
            overheadPress.setCategory(Exercises.Category.FreeWeight);
            overheadPress.setMuscleGroups(List.of("Shoulders", "Triceps", "Core"));
            overheadPress.setDescription("Standing barbell overhead press");
            exercisesRepository.save(overheadPress);

            Exercises lateralRaise = new Exercises();
            lateralRaise.setName("Lateral Raises");
            lateralRaise.setCategory(Exercises.Category.FreeWeight);
            lateralRaise.setMuscleGroups(List.of("Shoulders"));
            lateralRaise.setDescription("Dumbbell lateral raises");
            exercisesRepository.save(lateralRaise);

            // Arm Exercises
            Exercises bicepCurls = new Exercises();
            bicepCurls.setName("Bicep Curls");
            bicepCurls.setCategory(Exercises.Category.FreeWeight);
            bicepCurls.setMuscleGroups(List.of("Biceps"));
            bicepCurls.setDescription("Dumbbell bicep curls");
            exercisesRepository.save(bicepCurls);

            Exercises tricepDips = new Exercises();
            tricepDips.setName("Tricep Dips");
            tricepDips.setCategory(Exercises.Category.BodyWeight);
            tricepDips.setMuscleGroups(List.of("Triceps", "Chest", "Shoulders"));
            tricepDips.setDescription("Bodyweight tricep dips");
            exercisesRepository.save(tricepDips);

            // Core Exercises
            Exercises plank = new Exercises();
            plank.setName("Plank");
            plank.setCategory(Exercises.Category.BodyWeight);
            plank.setMuscleGroups(List.of("Core", "Shoulders"));
            plank.setDescription("Isometric plank hold");
            exercisesRepository.save(plank);

            // ===== CREATE PLANS =====

            Plans pushPullLegs = new Plans();
            pushPullLegs.setName("Push Pull Legs");
            pushPullLegs.setDescription("Classic 6-day split focusing on push, pull, and leg movements");
            plansRepository.save(pushPullLegs);

            Plans fullBody = new Plans();
            fullBody.setName("Full Body Strength");
            fullBody.setDescription("3-day full body workout for overall strength development");
            plansRepository.save(fullBody);

            Plans upperLower = new Plans();
            upperLower.setName("Upper Lower Split");
            upperLower.setDescription("4-day split alternating between upper and lower body");
            plansRepository.save(upperLower);

            // ===== CREATE SESSIONS WITH EXERCISE EXECUTIONS =====

            // Session 1: Push Day (from Push Pull Legs)
            Sessions pushDay = new Sessions();
            pushDay.setName("Push Day - Chest & Shoulders");
            pushDay.setScheduledDate(LocalDate.now().minusDays(7));
            pushDay.setPlan(pushPullLegs);
            pushDay.setOrderID(1);
            sessionsRepository.save(pushDay);

            ExerciseExecutions pushEx1 = new ExerciseExecutions();
            pushEx1.setSession(pushDay);
            pushEx1.setExercise(benchPress);
            pushEx1.setPlannedSets(4);
            pushEx1.setPlannedReps(8);
            pushEx1.setPlannedWeight(80);
            pushEx1.setOrderID(1);
            exerciseExecutionsRepository.save(pushEx1);

            ExerciseExecutions pushEx2 = new ExerciseExecutions();
            pushEx2.setSession(pushDay);
            pushEx2.setExercise(inclinePress);
            pushEx2.setPlannedSets(3);
            pushEx2.setPlannedReps(10);
            pushEx2.setPlannedWeight(30);
            pushEx2.setOrderID(2);
            exerciseExecutionsRepository.save(pushEx2);

            ExerciseExecutions pushEx3 = new ExerciseExecutions();
            pushEx3.setSession(pushDay);
            pushEx3.setExercise(overheadPress);
            pushEx3.setPlannedSets(3);
            pushEx3.setPlannedReps(10);
            pushEx3.setPlannedWeight(50);
            pushEx3.setOrderID(3);
            exerciseExecutionsRepository.save(pushEx3);

            ExerciseExecutions pushEx4 = new ExerciseExecutions();
            pushEx4.setSession(pushDay);
            pushEx4.setExercise(lateralRaise);
            pushEx4.setPlannedSets(3);
            pushEx4.setPlannedReps(12);
            pushEx4.setPlannedWeight(12);
            pushEx4.setOrderID(4);
            exerciseExecutionsRepository.save(pushEx4);

            // Session 2: Pull Day (from Push Pull Legs)
            Sessions pullDay = new Sessions();
            pullDay.setName("Pull Day - Back & Biceps");
            pullDay.setScheduledDate(LocalDate.now().minusDays(6));
            pullDay.setPlan(pushPullLegs);
            pullDay.setOrderID(2);
            sessionsRepository.save(pullDay);

            ExerciseExecutions pullEx1 = new ExerciseExecutions();
            pullEx1.setSession(pullDay);
            pullEx1.setExercise(deadlift);
            pullEx1.setPlannedSets(4);
            pullEx1.setPlannedReps(6);
            pullEx1.setPlannedWeight(120);
            pullEx1.setOrderID(1);
            exerciseExecutionsRepository.save(pullEx1);

            ExerciseExecutions pullEx2 = new ExerciseExecutions();
            pullEx2.setSession(pullDay);
            pullEx2.setExercise(pullUps);
            pullEx2.setPlannedSets(4);
            pullEx2.setPlannedReps(10);
            pullEx2.setPlannedWeight(0);
            pullEx2.setOrderID(2);
            exerciseExecutionsRepository.save(pullEx2);

            ExerciseExecutions pullEx3 = new ExerciseExecutions();
            pullEx3.setSession(pullDay);
            pullEx3.setExercise(bentOverRow);
            pullEx3.setPlannedSets(3);
            pullEx3.setPlannedReps(10);
            pullEx3.setPlannedWeight(60);
            pullEx3.setOrderID(3);
            exerciseExecutionsRepository.save(pullEx3);

            ExerciseExecutions pullEx4 = new ExerciseExecutions();
            pullEx4.setSession(pullDay);
            pullEx4.setExercise(bicepCurls);
            pullEx4.setPlannedSets(3);
            pullEx4.setPlannedReps(12);
            pullEx4.setPlannedWeight(15);
            pullEx4.setOrderID(4);
            exerciseExecutionsRepository.save(pullEx4);

            // Session 3: Leg Day (from Push Pull Legs)
            Sessions legDay = new Sessions();
            legDay.setName("Leg Day - Quads & Glutes");
            legDay.setScheduledDate(LocalDate.now().minusDays(5));
            legDay.setPlan(pushPullLegs);
            legDay.setOrderID(3);
            sessionsRepository.save(legDay);

            ExerciseExecutions legEx1 = new ExerciseExecutions();
            legEx1.setSession(legDay);
            legEx1.setExercise(squats);
            legEx1.setPlannedSets(4);
            legEx1.setPlannedReps(8);
            legEx1.setPlannedWeight(100);
            legEx1.setOrderID(1);
            exerciseExecutionsRepository.save(legEx1);

            ExerciseExecutions legEx2 = new ExerciseExecutions();
            legEx2.setSession(legDay);
            legEx2.setExercise(legPress);
            legEx2.setPlannedSets(3);
            legEx2.setPlannedReps(12);
            legEx2.setPlannedWeight(150);
            legEx2.setOrderID(2);
            exerciseExecutionsRepository.save(legEx2);

            ExerciseExecutions legEx3 = new ExerciseExecutions();
            legEx3.setSession(legDay);
            legEx3.setExercise(lunges);
            legEx3.setPlannedSets(3);
            legEx3.setPlannedReps(15);
            legEx3.setPlannedWeight(0);
            legEx3.setOrderID(3);
            exerciseExecutionsRepository.save(legEx3);

            // Session 4: Full Body Workout
            Sessions fullBodySession = new Sessions();
            fullBodySession.setName("Full Body - Day 1");
            fullBodySession.setScheduledDate(LocalDate.now());
            fullBodySession.setPlan(fullBody);
            fullBodySession.setOrderID(1);
            sessionsRepository.save(fullBodySession);

            ExerciseExecutions fbEx1 = new ExerciseExecutions();
            fbEx1.setSession(fullBodySession);
            fbEx1.setExercise(squats);
            fbEx1.setPlannedSets(3);
            fbEx1.setPlannedReps(10);
            fbEx1.setPlannedWeight(90);
            fbEx1.setOrderID(1);
            exerciseExecutionsRepository.save(fbEx1);

            ExerciseExecutions fbEx2 = new ExerciseExecutions();
            fbEx2.setSession(fullBodySession);
            fbEx2.setExercise(benchPress);
            fbEx2.setPlannedSets(3);
            fbEx2.setPlannedReps(10);
            fbEx2.setPlannedWeight(70);
            fbEx2.setOrderID(2);
            exerciseExecutionsRepository.save(fbEx2);

            ExerciseExecutions fbEx3 = new ExerciseExecutions();
            fbEx3.setSession(fullBodySession);
            fbEx3.setExercise(bentOverRow);
            fbEx3.setPlannedSets(3);
            fbEx3.setPlannedReps(10);
            fbEx3.setPlannedWeight(55);
            fbEx3.setOrderID(3);
            exerciseExecutionsRepository.save(fbEx3);

            ExerciseExecutions fbEx4 = new ExerciseExecutions();
            fbEx4.setSession(fullBodySession);
            fbEx4.setExercise(overheadPress);
            fbEx4.setPlannedSets(3);
            fbEx4.setPlannedReps(10);
            fbEx4.setPlannedWeight(45);
            fbEx4.setOrderID(4);
            exerciseExecutionsRepository.save(fbEx4);

            ExerciseExecutions fbEx5 = new ExerciseExecutions();
            fbEx5.setSession(fullBodySession);
            fbEx5.setExercise(plank);
            fbEx5.setPlannedSets(3);
            fbEx5.setPlannedReps(60);
            fbEx5.setPlannedWeight(0);
            fbEx5.setOrderID(5);
            exerciseExecutionsRepository.save(fbEx5);

            // Session 5: Upper Body (from Upper Lower Split)
            Sessions upperBody = new Sessions();
            upperBody.setName("Upper Body Strength");
            upperBody.setScheduledDate(LocalDate.now().plusDays(1));
            upperBody.setPlan(upperLower);
            upperBody.setOrderID(1);
            sessionsRepository.save(upperBody);

            ExerciseExecutions upEx1 = new ExerciseExecutions();
            upEx1.setSession(upperBody);
            upEx1.setExercise(benchPress);
            upEx1.setPlannedSets(4);
            upEx1.setPlannedReps(6);
            upEx1.setPlannedWeight(85);
            upEx1.setOrderID(1);
            exerciseExecutionsRepository.save(upEx1);

            ExerciseExecutions upEx2 = new ExerciseExecutions();
            upEx2.setSession(upperBody);
            upEx2.setExercise(pullUps);
            upEx2.setPlannedSets(4);
            upEx2.setPlannedReps(8);
            upEx2.setPlannedWeight(0);
            upEx2.setOrderID(2);
            exerciseExecutionsRepository.save(upEx2);

            ExerciseExecutions upEx3 = new ExerciseExecutions();
            upEx3.setSession(upperBody);
            upEx3.setExercise(overheadPress);
            upEx3.setPlannedSets(3);
            upEx3.setPlannedReps(8);
            upEx3.setPlannedWeight(55);
            upEx3.setOrderID(3);
            exerciseExecutionsRepository.save(upEx3);

            ExerciseExecutions upEx4 = new ExerciseExecutions();
            upEx4.setSession(upperBody);
            upEx4.setExercise(tricepDips);
            upEx4.setPlannedSets(3);
            upEx4.setPlannedReps(12);
            upEx4.setPlannedWeight(0);
            upEx4.setOrderID(4);
            exerciseExecutionsRepository.save(upEx4);

            // Session 6: Bodyweight Circuit
            Sessions bodyweightCircuit = new Sessions();
            bodyweightCircuit.setName("Bodyweight Circuit");
            bodyweightCircuit.setScheduledDate(LocalDate.now().plusDays(3));
            bodyweightCircuit.setPlan(fullBody);
            bodyweightCircuit.setOrderID(2);
            sessionsRepository.save(bodyweightCircuit);

            ExerciseExecutions bwEx1 = new ExerciseExecutions();
            bwEx1.setSession(bodyweightCircuit);
            bwEx1.setExercise(pushUps);
            bwEx1.setPlannedSets(4);
            bwEx1.setPlannedReps(15);
            bwEx1.setPlannedWeight(0);
            bwEx1.setOrderID(1);
            exerciseExecutionsRepository.save(bwEx1);

            ExerciseExecutions bwEx2 = new ExerciseExecutions();
            bwEx2.setSession(bodyweightCircuit);
            bwEx2.setExercise(pullUps);
            bwEx2.setPlannedSets(4);
            bwEx2.setPlannedReps(10);
            bwEx2.setPlannedWeight(0);
            bwEx2.setOrderID(2);
            exerciseExecutionsRepository.save(bwEx2);

            ExerciseExecutions bwEx3 = new ExerciseExecutions();
            bwEx3.setSession(bodyweightCircuit);
            bwEx3.setExercise(lunges);
            bwEx3.setPlannedSets(3);
            bwEx3.setPlannedReps(20);
            bwEx3.setPlannedWeight(0);
            bwEx3.setOrderID(3);
            exerciseExecutionsRepository.save(bwEx3);

            ExerciseExecutions bwEx4 = new ExerciseExecutions();
            bwEx4.setSession(bodyweightCircuit);
            bwEx4.setExercise(tricepDips);
            bwEx4.setPlannedSets(3);
            bwEx4.setPlannedReps(15);
            bwEx4.setPlannedWeight(0);
            bwEx4.setOrderID(4);
            exerciseExecutionsRepository.save(bwEx4);

            ExerciseExecutions bwEx5 = new ExerciseExecutions();
            bwEx5.setSession(bodyweightCircuit);
            bwEx5.setExercise(plank);
            bwEx5.setPlannedSets(3);
            bwEx5.setPlannedReps(90);
            bwEx5.setPlannedWeight(0);
            bwEx5.setOrderID(5);
            exerciseExecutionsRepository.save(bwEx5);

            System.out.println("✅ Database seeded successfully!");
            System.out.println("   - 14 Exercises created");
            System.out.println("   - 3 Plans created");
            System.out.println("   - 6 Sessions created with exercise executions");
        };
    }
}