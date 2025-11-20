import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

export interface ExerciseUpdate {
  name: string;
  category: string;
  muscleGroups: string[];
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class ExerciseProviderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/exercises';

  getAllExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.apiUrl);
  }

  createExercise(exercise: ExerciseCreate): Observable<Exercise> {
    return this.http.post<Exercise>(this.apiUrl, exercise);
  }

  getExerciseById(id: string): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`);
  }

  updateExercise(id: string, exercise: ExerciseUpdate): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.apiUrl}/${id}`, exercise);
  }

  deleteExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
