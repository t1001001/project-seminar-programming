import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise, ExerciseProviderService } from '../provider-services/exercise-provider.service';

@Injectable({ providedIn: 'root' })
export class ExerciseLogicService {
  private readonly provider = inject(ExerciseProviderService);

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
