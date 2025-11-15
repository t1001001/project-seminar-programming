import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise } from '../../domain/models/exercise.model';
import { ExerciseProvider } from '../providers/exercise.provider';

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private readonly provider = inject(ExerciseProvider);

  loadExercises(): Observable<Exercise[]> {
    return this.provider.getExercises();
  }

  createExercise(exercise: Omit<Exercise, 'id'>): void {
    this.provider.addExercise(exercise);
  }

  updateExercise(exercise: Exercise): void {
    this.provider.updateExercise(exercise);
  }

  removeExercise(id: string): void {
    this.provider.deleteExercise(id);
  }
}
