import { Injectable, inject } from '@angular/core';
import { Observable, catchError, combineLatest, map, of, switchMap, throwError } from 'rxjs';
import { SessionProviderService, Session, PlanSummary, ExerciseExecution } from '../provider-services/session-provider.service';
import { ExerciseProviderService, Exercise } from 'exercises-lib';

export interface SessionOverview extends Session {
  planName?: string;
}

export interface SessionDetail extends SessionOverview {
  exercises: SessionExerciseDetail[];
}

export interface SessionExerciseDetail extends ExerciseExecution {
  category?: string;
}

@Injectable({ providedIn: 'root' })
export class SessionLogicService {
  private sessionProvider = inject(SessionProviderService);
  private exerciseProvider = inject(ExerciseProviderService);

  getAllSessions(): Observable<SessionOverview[]> {
    return this.sessionProvider.getAllSessions().pipe(
      switchMap((sessions) => {
        if (!sessions || sessions.length === 0) {
          return of([] as SessionOverview[]);
        }

        const plan$ = this.sessionProvider.getPlans().pipe(
          catchError(() => of([] as PlanSummary[]))
        );

        return combineLatest([of(sessions), plan$]).pipe(
          map(([sessionList, plans]) => {
            const planMap = new Map(plans.map(plan => [plan.id, plan.name]));

            return sessionList.map((session) => ({
              ...session,
              planName: planMap.get(session.planId ?? '') ?? 'No plan',
              orderID: session.orderID ?? 0,
              exerciseExecutionsCount: session.exerciseExecutionsCount ?? 0,
              sessionLogCount: session.sessionLogCount ?? 0
            }));
          })
        );
      }),
      catchError((err) => {
        let errorMessage = 'Failed to load sessions';

        if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getSessionDetail(sessionId: string): Observable<SessionDetail> {
    return this.sessionProvider.getAllSessions().pipe(
      switchMap((sessions) => {
        const session = sessions?.find((item) => item.id === sessionId);
        if (!session) {
          return throwError(() => new Error('Session not found'));
        }

        const plan$ = this.sessionProvider.getPlans()
          .pipe(catchError(() => of([] as PlanSummary[])));

        const exercises$ = this.sessionProvider.getExerciseExecutionsBySession(sessionId).pipe(
          map((exercises) => [...exercises].sort((a, b) => (a.orderID ?? 0) - (b.orderID ?? 0))),
          catchError(() => of([] as ExerciseExecution[]))
        );

        const exerciseDefinitions$ = this.exerciseProvider.getAllExercises().pipe(
          catchError(() => of([] as Exercise[]))
        );

        return combineLatest([of(session), plan$, exercises$, exerciseDefinitions$]).pipe(
          map(([baseSession, plans, exercises, exerciseDefinitions]) => {
            const planName = plans.find(plan => plan.id === baseSession.planId)?.name ?? 'No plan';
            const exerciseMap = new Map(exerciseDefinitions.map((item) => [item.id, item]));

            const detailedExercises: SessionExerciseDetail[] = exercises.map((exercise) => {
              const exerciseDefinition = exercise.exerciseId ? exerciseMap.get(exercise.exerciseId) : undefined;
              return {
                ...exercise,
                category: exerciseDefinition?.category
              };
            });

            return {
              ...baseSession,
              planName,
              orderID: baseSession.orderID ?? 0,
              exerciseExecutionsCount: baseSession.exerciseExecutionsCount ?? exercises.length,
              sessionLogCount: baseSession.sessionLogCount ?? 0,
              exercises: detailedExercises
            };
          })
        );
      }),
      catchError((err) => {
        let errorMessage = 'Failed to load session';

        if (err?.message) {
          errorMessage = err.message;
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
