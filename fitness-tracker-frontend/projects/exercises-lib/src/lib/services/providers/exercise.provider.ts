import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Exercise } from '../../domain/models/exercise.model';

@Injectable({ providedIn: 'root' })
export class ExerciseProvider {
  private exercises$ = new BehaviorSubject<Exercise[]>([
    {
      id: '1',
      name: 'Bench Press',
      category: 'Strength',
      description: 'Classic upper body exercise for building chest strength',
      muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    },
    {
      id: '2',
      name: 'Squats',
      category: 'Strength',
      description: 'Fundamental lower body compound movement',
      muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    },
    {
      id: '3',
      name: 'Running',
      category: 'Cardio',
      description: 'Cardiovascular endurance training',
      muscleGroups: ['Legs', 'Cardiovascular'],
    },
    {
      id: '4',
      name: 'Pull-ups',
      category: 'Strength',
      description: 'Bodyweight exercise for back and arm development',
      muscleGroups: ['Back', 'Biceps', 'Forearms'],
    },
    {
      id: '5',
      name: 'Plank',
      category: 'Core',
      description: 'Isometric core stability exercise',
      muscleGroups: ['Abs', 'Core', 'Shoulders'],
    },
  ]);

  getExercises(): Observable<Exercise[]> {
    return this.exercises$.asObservable();
  }

  addExercise(exercise: Omit<Exercise, 'id'>): void {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString(),
    };
    const current = this.exercises$.value;
    this.exercises$.next([...current, newExercise]);
  }

  updateExercise(exercise: Exercise): void {
    const current = this.exercises$.value;
    const index = current.findIndex(ex => ex.id === exercise.id);
    if (index !== -1) {
      const updated = [...current];
      updated[index] = exercise;
      this.exercises$.next(updated);
    }
  }

  deleteExercise(id: string): void {
    const current = this.exercises$.value;
    this.exercises$.next(current.filter(ex => ex.id !== id));
  }
}
