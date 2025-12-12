import { Injectable, inject } from '@angular/core';
import { Observable, catchError, combineLatest, forkJoin, map, of, switchMap, throwError } from 'rxjs';
import {
  SessionProviderService,
  Session,
  PlanSummary,
  ExerciseExecution,
  SessionCreate,
  SessionUpdate,
  ExerciseExecutionCreate,
  ExerciseExecutionUpdate
} from '../provider-services/session-provider.service';
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

export interface SessionExerciseInput {
  id?: string;
  exerciseId: string;
  plannedSets: number;
  plannedReps: number;
  plannedWeight: number;
  orderID?: number;
  category?: Exercise['category'];
}

export interface SessionCreatePayload extends SessionCreate {
  exercises: SessionExerciseInput[];
}

export interface SessionUpdatePayload extends SessionUpdate {
  exercises: SessionExerciseInput[];
}

@Injectable({ providedIn: 'root' })
export class SessionLogicService {
  private readonly sessionProvider = inject(SessionProviderService);
  private readonly exerciseProvider = inject(ExerciseProviderService);

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

  deleteSession(id: string): Observable<void> {
    return this.sessionProvider.deleteSession(id).pipe(
      catchError((err) => {
        let errorMessage = 'Failed to delete session';

        if (err.status === 404) {
          errorMessage = 'Session not found. It may have been already deleted.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  createSession(payload: SessionCreate): Observable<Session> {
    const name = payload.name?.trim();
    if (!name) {
      return throwError(() => new Error('Session name is required'));
    }
    if (!payload.planId) {
      return throwError(() => new Error('Plan is required to create a session'));
    }
    if (payload.orderID == null || payload.orderID < 1 || payload.orderID > 30) {
      return throwError(() => new Error('Order must be between 1 and 30'));
    }

    const sessionRequest: SessionCreate = {
      name,
      planId: payload.planId,
      orderID: payload.orderID
    };

    return this.sessionProvider.createSession(sessionRequest).pipe(
      catchError((err) => {
        let errorMessage = 'Failed to create session';
        const positionLabel = sessionRequest.orderID ?? payload.orderID;
        const conflictMessage = typeof err?.error === 'string' && err.error.trim()
          ? err.error
          : '';

        if (err?.status === 409) {
          const positionText = positionLabel != null
            ? `A session with position ${positionLabel} already exists in this plan.`
            : 'A session with this position already exists in this plan.';
          errorMessage = conflictMessage || positionText;
        } else if (err?.status === 400) {
          errorMessage = 'Invalid session data. Please check all fields.';
        } else if (err?.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        } else if (err?.message) {
          errorMessage = err.message;
        }

        const error = Object.assign(new Error(errorMessage), { status: err?.status, error: err?.error });
        return throwError(() => error);
      })
    );
  }

  createSessionWithExercises(payload: SessionCreatePayload): Observable<Session> {
    const name = payload.name?.trim();
    if (!name) {
      return throwError(() => new Error('Session name is required'));
    }
    if (!payload.planId) {
      return throwError(() => new Error('Plan is required to create a session'));
    }
    if (payload.orderID == null || payload.orderID < 1 || payload.orderID > 30) {
      return throwError(() => new Error('Order must be between 1 and 30'));
    }

    const exerciseIds = new Set<string>();
    for (const exercise of payload.exercises || []) {
      if (exerciseIds.has(exercise.exerciseId)) {
        return throwError(() => new Error('Each exercise can only be added once to the session'));
      }
      exerciseIds.add(exercise.exerciseId);

      if (!exercise.plannedSets || exercise.plannedSets <= 0) {
        return throwError(() => new Error('Sets must be greater than 0'));
      }
      if (!exercise.plannedReps || exercise.plannedReps <= 0) {
        return throwError(() => new Error('Reps must be greater than 0'));
      }
      if (exercise.plannedWeight == null || exercise.plannedWeight < 0) {
        return throwError(() => new Error('Weight must be 0 or greater'));
      }
      if (exercise.category !== 'BodyWeight' && exercise.plannedWeight <= 0) {
        return throwError(() => new Error('Weight must be greater than 0 for this exercise'));
      }
    }

    const sessionRequest: SessionCreate = {
      name,
      planId: payload.planId,
      orderID: payload.orderID
    };

    return this.sessionProvider.createSession(sessionRequest).pipe(
      switchMap((createdSession) => {
        if (!payload.exercises?.length) {
          return of(createdSession);
        }

        const executionRequests: ExerciseExecutionCreate[] = payload.exercises.map((exercise, index) => ({
          sessionId: createdSession.id,
          exerciseId: exercise.exerciseId,
          plannedSets: exercise.plannedSets,
          plannedReps: exercise.plannedReps,
          plannedWeight: exercise.plannedWeight,
          orderID: exercise.orderID ?? index + 1,
        }));

        return forkJoin(executionRequests.map(req => this.sessionProvider.createExerciseExecution(req))).pipe(
          map(() => createdSession)
        );
      }),
      catchError((err) => {
        let errorMessage = 'Failed to create session';
        const positionLabel = sessionRequest.orderID ?? payload.orderID;
        const conflictMessage = typeof err?.error === 'string' && err.error.trim()
          ? err.error
          : '';

        if (err?.status === 409) {
          const positionText = positionLabel != null
            ? `A session with position ${positionLabel} already exists in this plan.`
            : 'A session with this position already exists in this plan.';
          errorMessage = conflictMessage || positionText;
        } else if (err?.status === 400) {
          errorMessage = 'Invalid session data. Please check all fields.';
        } else if (err?.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        } else if (err?.message) {
          errorMessage = err.message;
        }

        const error = Object.assign(new Error(errorMessage), { status: err?.status, error: err?.error });
        return throwError(() => error);
      })
    );
  }

  updateSessionWithExercises(sessionId: string, payload: SessionUpdatePayload): Observable<Session> {
    const name = payload.name?.trim();
    if (!name) {
      return throwError(() => new Error('Session name is required'));
    }
    if (!payload.planId) {
      return throwError(() => new Error('Plan is required to update a session'));
    }
    if (payload.orderID == null || payload.orderID < 1 || payload.orderID > 30) {
      return throwError(() => new Error('Order must be between 1 and 30'));
    }

    const exerciseIds = new Set<string>();
    for (const exercise of payload.exercises || []) {
      if (exerciseIds.has(exercise.exerciseId)) {
        return throwError(() => new Error('Each exercise can only be added once to the session'));
      }
      exerciseIds.add(exercise.exerciseId);

      if (!exercise.plannedSets || exercise.plannedSets <= 0) {
        return throwError(() => new Error('Sets must be greater than 0'));
      }
      if (!exercise.plannedReps || exercise.plannedReps <= 0) {
        return throwError(() => new Error('Reps must be greater than 0'));
      }
      if (exercise.plannedWeight == null || exercise.plannedWeight < 0) {
        return throwError(() => new Error('Weight must be 0 or greater'));
      }
    }

    const sessionUpdate: SessionUpdate = {
      name,
      planId: payload.planId,
      orderID: payload.orderID
    };

    return this.sessionProvider.updateSession(sessionId, sessionUpdate).pipe(
      switchMap((updatedSession) =>
        this.sessionProvider.getExerciseExecutionsBySession(sessionId).pipe(
          switchMap((existingExecutions) => {
            const desiredIds = new Set<string>();
            const updateCalls: Observable<ExerciseExecution>[] = [];
            const createCalls: Observable<ExerciseExecution>[] = [];

            payload.exercises.forEach((exercise, idx) => {
              const execId = exercise.id;
              const request: ExerciseExecutionUpdate | ExerciseExecutionCreate = {
                exerciseId: exercise.exerciseId,
                plannedSets: exercise.plannedSets,
                plannedReps: exercise.plannedReps,
                plannedWeight: exercise.plannedWeight,
                orderID: exercise.orderID ?? idx + 1,
              };

              if (execId) {
                desiredIds.add(execId);
                updateCalls.push(this.sessionProvider.updateExerciseExecution(execId, request));
              } else {
                createCalls.push(this.sessionProvider.createExerciseExecution({
                  ...(request as ExerciseExecutionCreate),
                  sessionId
                }));
              }
            });

            const deleteCalls = existingExecutions
              .filter(exec => !desiredIds.has(exec.id))
              .map(exec => this.sessionProvider.deleteExerciseExecution(exec.id));

            const allCalls = [...updateCalls, ...createCalls, ...deleteCalls];
            if (!allCalls.length) {
              return of(updatedSession);
            }
            return forkJoin(allCalls).pipe(map(() => updatedSession));
          })
        )
      ),
      catchError((err) => {
        let errorMessage = 'Failed to update session';
        const positionLabel = payload.orderID;
        const conflictMessage = typeof err?.error === 'string' && err.error.trim()
          ? err.error
          : '';

        if (err?.status === 409) {
          const positionText = positionLabel != null
            ? `A session with position ${positionLabel} already exists in this plan.`
            : 'A session with this position already exists in this plan.';
          errorMessage = conflictMessage || positionText;
        } else if (err?.status === 400) {
          errorMessage = 'Invalid session data. Please check all fields.';
        } else if (err?.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        } else if (err?.message) {
          errorMessage = err.message;
        }

        const error = Object.assign(new Error(errorMessage), { status: err?.status, error: err?.error });
        return throwError(() => error);
      })
    );
  }

  getNextAvailablePosition(planId: string, excludeSessionId?: string): Observable<number> {
    if (!planId) {
      return of(1);
    }

    return this.sessionProvider.getAllSessions().pipe(
      map((sessions) => {
        const usedPositions = (sessions || [])
          .filter((session) => session.planId === planId && session.id !== excludeSessionId)
          .map((session) => session.orderID)
          .filter((orderId): orderId is number => typeof orderId === 'number' && orderId > 0);

        if (!usedPositions.length) {
          return 1;
        }

        const taken = new Set(usedPositions);
        for (let i = 1; i <= 30; i++) {
          if (!taken.has(i)) {
            return i;
          }
        }

        const max = Math.max(...usedPositions);
        return Math.min(max + 1, 30);
      }),
      catchError(() => of(1))
    );
  }
}
