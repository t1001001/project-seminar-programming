package hs.aalen.fitness_tracker_backend.exercises;

import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.exercises.repository.ExercisesRepository;
import hs.aalen.fitness_tracker_backend.exercises.service.ExercisesService;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.model.ExerciseExecutions;
import hs.aalen.fitness_tracker_backend.exerciseexecutions.repository.ExerciseExecutionsRepository;
import hs.aalen.fitness_tracker_backend.sessions.model.Sessions;
import hs.aalen.fitness_tracker_backend.sessions.repository.SessionsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ExerciseDeletionTest {

    @Mock
    private ExercisesRepository exercisesRepository;

    @Mock
    private SessionsRepository sessionsRepository;

    @Mock
    private ExerciseExecutionsRepository exerciseExecutionsRepository;

    @InjectMocks
    private ExercisesService exercisesService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testDeleteExerciseRemovesExerciseExecutions() {
        UUID exerciseId = UUID.randomUUID();
        Exercises exercise = new Exercises();
        exercise.setId(exerciseId);

        ExerciseExecutions execution = new ExerciseExecutions();
        execution.setId(UUID.randomUUID());
        execution.setExercise(exercise);

        when(exercisesRepository.existsById(exerciseId)).thenReturn(true);
        when(exerciseExecutionsRepository.findByExerciseId(exerciseId)).thenReturn(List.of(execution));

        exercisesService.delete(exerciseId);

        // Verify exercise executions were deleted
        verify(exerciseExecutionsRepository).deleteAll(anyList());

        // Verify exercise was deleted
        verify(exercisesRepository).deleteById(exerciseId);
    }
}
