import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Exercise {
  id: string; // UUID from backend
  name: string;
  category: string;
  muscleGroups: string[];
  description?: string;
}

export interface ExerciseCreate {
  name: string;
  category: string;
  muscleGroups: string[];
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ExerciseProviderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/exercises';
  
  private exercises$ = new BehaviorSubject<Exercise[]>([]);

  getExercises(): Observable<Exercise[]> {
    return this.exercises$.asObservable();
  }

  loadExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.apiUrl).pipe(
      tap(exercises => this.exercises$.next(exercises))
    );
  }

  addExercise(exercise: ExerciseCreate): Observable<Exercise> {
    return this.http.post<Exercise>(this.apiUrl, exercise).pipe(
      tap(newExercise => {
        const current = this.exercises$.value;
        this.exercises$.next([...current, newExercise]);
      })
    );
  }

  updateExercise(id: string, exercise: ExerciseCreate): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.apiUrl}/${id}`, exercise).pipe(
      tap(updatedExercise => {
        const current = this.exercises$.value;
        const index = current.findIndex(ex => ex.id === id);
        if (index !== -1) {
          const updated = [...current];
          updated[index] = updatedExercise;
          this.exercises$.next(updated);
        }
      })
    );
  }

  deleteExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.exercises$.value;
        this.exercises$.next(current.filter(ex => ex.id !== id));
      })
    );
  }
}
