import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise } from '../../domain/models/exercise.model';
import { ExerciseApiProvider } from '../providers/exercise-api.provider';

@Injectable({ providedIn: 'root' })
export class ExerciseManagerService {
  private readonly provider = inject(ExerciseApiProvider);

  loadExercises(): Observable<Exercise[]> {
    return this.provider.getExercises();
  }
}
