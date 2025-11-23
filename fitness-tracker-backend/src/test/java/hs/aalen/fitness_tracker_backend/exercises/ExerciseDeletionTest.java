package hs.aalen.fitness_tracker_backend.exercises;

import hs.aalen.fitness_tracker_backend.exercises.model.Exercises;
import hs.aalen.fitness_tracker_backend.exercises.repository.ExercisesRepository;
import hs.aalen.fitness_tracker_backend.exercises.service.ExercisesService;
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

    @InjectMocks
    private ExercisesService exercisesService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testDeleteExerciseRemovesFromSessions() {
        UUID exerciseId = UUID.randomUUID();
        Exercises exercise = new Exercises();
        exercise.setId(exerciseId);

        Sessions session = new Sessions();
        session.setId(UUID.randomUUID());
        session.setExerciseExecutions(new ArrayList<>(List.of(exercise)));

        when(exercisesRepository.existsById(exerciseId)).thenReturn(true);
        when(sessionsRepository.findByExerciseExecutions_Id(exerciseId)).thenReturn(List.of(session));

        exercisesService.delete(exerciseId);

        // Verify exercise was removed from session
        assert session.getExerciseExecutions().isEmpty();

        // Verify session was saved
        verify(sessionsRepository).save(session);

        // Verify exercise was deleted
        verify(exercisesRepository).deleteById(exerciseId);
    }
}
