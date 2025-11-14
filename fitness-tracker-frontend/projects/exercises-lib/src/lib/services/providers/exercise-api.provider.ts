import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Exercise } from '../../domain/models/exercise.model';

@Injectable({ providedIn: 'root' })
export class ExerciseApiProvider {
  /**
   * Placeholder for HTTP backed API call.
   * Replace with HttpClient implementation when backend is ready.
   */
  getExercises(): Observable<Exercise[]> {
    return of([]);
  }
}
