import { Injectable, inject } from '@angular/core';
import { Observable, Subject, tap, catchError } from 'rxjs';
import { Exercise, ExerciseCreate, ExerciseUpdate, ExerciseProviderService } from '../provider-services/exercise-provider.service';
import { handleExerciseError, createExerciseErrorConfig } from '../shared';

@Injectable({ providedIn: 'root' })
export class ExerciseLogicService {
  private exerciseProviderService = inject(ExerciseProviderService);

  private createdExerciseSubject = new Subject<Exercise>();
  createdExercise$ = this.createdExerciseSubject.asObservable();

  createExercise(exercise: ExerciseCreate): Observable<Exercise> {
    return this.exerciseProviderService.createExercise(exercise).pipe(
      tap((createdExercise) => this.createdExerciseSubject.next(createdExercise)),
      catchError((err) => handleExerciseError(err, createExerciseErrorConfig('create')))
    );
  }

  getAllExercises(): Observable<Exercise[]> {
    return this.exerciseProviderService.getAllExercises().pipe(
      catchError((err) => handleExerciseError(err, createExerciseErrorConfig('loadAll')))
    );
  }

  getExerciseById(id: string): Observable<Exercise> {
    return this.exerciseProviderService.getExerciseById(id).pipe(
      catchError((err) => handleExerciseError(err, createExerciseErrorConfig('load')))
    );
  }

  updateExercise(id: string, exercise: ExerciseUpdate): Observable<Exercise> {
    return this.exerciseProviderService.updateExercise(id, exercise).pipe(
      catchError((err) => handleExerciseError(err, createExerciseErrorConfig('update')))
    );
  }

  removeExercise(id: string): Observable<void> {
    return this.exerciseProviderService.deleteExercise(id).pipe(
      catchError((err) => handleExerciseError(err, createExerciseErrorConfig('delete')))
    );
  }
}
