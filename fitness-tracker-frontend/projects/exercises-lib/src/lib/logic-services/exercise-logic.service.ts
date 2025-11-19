import { Injectable, inject } from '@angular/core';
import { Observable, Subject, tap, catchError, throwError } from 'rxjs';
import { Exercise, ExerciseCreate, ExerciseProviderService } from '../provider-services/exercise-provider.service';

@Injectable({ providedIn: 'root' })
export class ExerciseLogicService {
  private exerciseProviderService = inject(ExerciseProviderService);
  
  private createdExerciseSubject = new Subject<Exercise>();
  createdExercise$ = this.createdExerciseSubject.asObservable();

  createExercise(exercise: ExerciseCreate): Observable<Exercise> {
    return this.exerciseProviderService.createExercise(exercise).pipe(
      tap((createdExercise) => {
        this.createdExerciseSubject.next(createdExercise);
      }),
      catchError((err) => {
        let errorMessage = 'Failed to create exercise';
        
        if (err.status === 409) {
          errorMessage = err.error || 'Exercise with this name already exists';
        } else if (err.status === 400) {
          errorMessage = 'Invalid exercise data. Please check all required fields.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getAllExercises(): Observable<Exercise[]> {
    return this.exerciseProviderService.getAllExercises()
      .pipe(
        tap(
          (exercises: Exercise[]) => {
            console.log(exercises);
          }),
        catchError((err) => {
          let errorMessage = 'Failed to load exercises';
          
          if (err.status === 0) {
            errorMessage = 'Cannot connect to server. Please check your connection.';
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getExerciseById(id: string): Observable<Exercise> {
    return this.exerciseProviderService.getExerciseById(id).pipe(
      catchError((err) => {
        let errorMessage = 'Failed to load exercise details';
        
        if (err.status === 404) {
          errorMessage = 'Exercise not found. It may have been deleted.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updateExercise(id: string, exercise: ExerciseCreate): Observable<Exercise> {
    return this.exerciseProviderService.updateExercise(id, exercise).pipe(
      catchError((err) => {
        let errorMessage = 'Failed to update exercise';
        
        if (err.status === 404) {
          errorMessage = 'Exercise not found. It may have been deleted.';
        } else if (err.status === 409) {
          errorMessage = err.error || 'Exercise with this name already exists';
        } else if (err.status === 400) {
          errorMessage = 'Invalid exercise data. Please check all required fields.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  removeExercise(id: string): Observable<void> {
    return this.exerciseProviderService.deleteExercise(id).pipe(
      catchError((err) => {
        let errorMessage = 'Failed to delete exercise';
        
        if (err.status === 404) {
          errorMessage = 'Exercise not found. It may have been already deleted.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
