import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise, ExerciseCreate, ExerciseProviderService } from '../provider-services/exercise-provider.service';

@Injectable({ providedIn: 'root' })
export class ExerciseLogicService {
  private readonly provider = inject(ExerciseProviderService);

  getExercises(): Observable<Exercise[]> {
    return this.provider.getExercises();
  }

  loadExercises(): Observable<Exercise[]> {
    return this.provider.loadExercises();
  }

  createExercise(exercise: ExerciseCreate): Observable<Exercise> {
    return this.provider.addExercise(exercise);
  }

  updateExercise(id: string, exercise: ExerciseCreate): Observable<Exercise> {
    return this.provider.updateExercise(id, exercise);
  }

  removeExercise(id: string): Observable<void> {
    return this.provider.deleteExercise(id);
  }
}
