import { Injectable, inject } from '@angular/core';
import { Observable, catchError, combineLatest, concat, last, map, of, switchMap } from 'rxjs';
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
import {
  handleHttpError,
  createSessionErrorConfig,
  validateSessionFields,
  validateSessionWithExercises,
  SessionExerciseInput
} from '../shared';

export interface SessionOverview extends Session {
  planName?: string;
}

export interface SessionDetail extends SessionOverview {
  exercises: SessionExerciseDetail[];
}

export interface SessionExerciseDetail extends ExerciseExecution {
  category?: string;
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
        if (!sessions?.length) return of([] as SessionOverview[]);

        return combineLatest([
          of(sessions),
          this.sessionProvider.getPlans().pipe(catchError(() => of([] as PlanSummary[])))
        ]).pipe(
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
      catchError((err) => handleHttpError(err, createSessionErrorConfig('load')))
    );
  }

  getSessionDetail(sessionId: string): Observable<SessionDetail> {
    return this.sessionProvider.getSessionById(sessionId).pipe(
      switchMap((session) => combineLatest([
        of(session),
        this.sessionProvider.getPlans().pipe(catchError(() => of([] as PlanSummary[]))),
        this.sessionProvider.getExerciseExecutionsBySession(sessionId).pipe(
          map((exercises) => [...exercises].sort((a, b) => (a.orderID ?? 0) - (b.orderID ?? 0))),
          catchError(() => of([] as ExerciseExecution[]))
        ),
        this.exerciseProvider.getAllExercises().pipe(catchError(() => of([] as Exercise[])))
      ]).pipe(
        map(([baseSession, plans, exercises, exerciseDefinitions]) => {
          const planName = plans.find(plan => plan.id === baseSession.planId)?.name ?? 'No plan';
          const exerciseMap = new Map(exerciseDefinitions.map((item) => [item.id, item]));

          return {
            ...baseSession,
            planName,
            orderID: baseSession.orderID ?? 0,
            exerciseExecutionsCount: baseSession.exerciseExecutionsCount ?? exercises.length,
            sessionLogCount: baseSession.sessionLogCount ?? 0,
            exercises: exercises.map((exercise) => ({
              ...exercise,
              category: exercise.exerciseId ? exerciseMap.get(exercise.exerciseId)?.category : undefined
            }))
          };
        })
      )),
      catchError((err) => handleHttpError(err, createSessionErrorConfig('load')))
    );
  }

  deleteSession(id: string): Observable<void> {
    return this.sessionProvider.deleteSession(id).pipe(
      catchError((err) => handleHttpError(err, createSessionErrorConfig('delete')))
    );
  }

  updateSession(id: string, session: SessionUpdate): Observable<Session> {
    return this.sessionProvider.updateSession(id, session).pipe(
      catchError((err) => handleHttpError(err, createSessionErrorConfig('update')))
    );
  }

  createSession(payload: SessionCreate): Observable<Session> {
    const validation = validateSessionFields(payload, 'create');
    if (!validation.valid) return validation.error;

    const sessionRequest: SessionCreate = {
      name: payload.name!.trim(),
      planId: payload.planId!,
      orderID: payload.orderID!
    };

    return this.sessionProvider.createSession(sessionRequest).pipe(
      catchError((err) => handleHttpError(err, createSessionErrorConfig('create')))
    );
  }

  createSessionWithExercises(payload: SessionCreatePayload): Observable<Session> {
    const validation = validateSessionWithExercises(payload, 'create');
    if (!validation.valid) return validation.error;

    const sessionRequest: SessionCreate = {
      name: payload.name!.trim(),
      planId: payload.planId!,
      orderID: payload.orderID!
    };

    return this.sessionProvider.createSession(sessionRequest).pipe(
      switchMap((createdSession) => {
        if (!payload.exercises?.length) return of(createdSession);

        const executionRequests: ExerciseExecutionCreate[] = payload.exercises.map((exercise, index) => ({
          sessionId: createdSession.id,
          exerciseId: exercise.exerciseId,
          plannedSets: exercise.plannedSets,
          plannedReps: exercise.plannedReps,
          plannedWeight: exercise.plannedWeight,
          orderID: exercise.orderID ?? index + 1,
        }));

        const createCalls = executionRequests.map(req => this.sessionProvider.createExerciseExecution(req));
        return concat(...createCalls).pipe(last(), map(() => createdSession));
      }),
      catchError((err) => handleHttpError(err, createSessionErrorConfig('create')))
    );
  }

  updateSessionWithExercises(sessionId: string, payload: SessionUpdatePayload): Observable<Session> {
    const validation = validateSessionWithExercises(payload, 'update');
    if (!validation.valid) return validation.error;

    const sessionUpdate: SessionUpdate = {
      name: payload.name!.trim(),
      ...(payload.planId && { planId: payload.planId }),
      ...(payload.orderID && { orderID: payload.orderID })
    };

    return this.sessionProvider.updateSession(sessionId, sessionUpdate).pipe(
      switchMap((updatedSession) =>
        this.sessionProvider.getExerciseExecutionsBySession(sessionId).pipe(
          switchMap((existingExecutions) =>
            this.syncExerciseExecutions(sessionId, payload.exercises, existingExecutions, updatedSession)
          )
        )
      ),
      catchError((err) => handleHttpError(err, createSessionErrorConfig('update')))
    );
  }

  getNextAvailablePosition(planId: string, excludeSessionId?: string): Observable<number> {
    if (!planId) return of(1);

    return this.sessionProvider.getAllSessions().pipe(
      map((sessions) => {
        const usedPositions = (sessions || [])
          .filter((session) => session.planId === planId && session.id !== excludeSessionId)
          .map((session) => session.orderID)
          .filter((orderId): orderId is number => typeof orderId === 'number' && orderId > 0);

        if (!usedPositions.length) return 1;

        const taken = new Set(usedPositions);
        for (let i = 1; i <= 30; i++) {
          if (!taken.has(i)) return i;
        }
        return Math.min(Math.max(...usedPositions) + 1, 30);
      }),
      catchError(() => of(1))
    );
  }

  getPlans(): Observable<PlanSummary[]> {
    return this.sessionProvider.getPlans().pipe(
      catchError((err) => handleHttpError(err, { defaultMessage: 'Failed to load plans' }))
    );
  }

  getAllExercises(): Observable<Exercise[]> {
    return this.exerciseProvider.getAllExercises().pipe(
      catchError((err) => handleHttpError(err, { defaultMessage: 'Failed to load exercises' }))
    );
  }

  private syncExerciseExecutions(
    sessionId: string,
    exercises: SessionExerciseInput[],
    existingExecutions: ExerciseExecution[],
    updatedSession: Session
  ): Observable<Session> {
    const desiredIds = new Set<string>();
    const updateCalls: Observable<ExerciseExecution>[] = [];
    const createCalls: Observable<ExerciseExecution>[] = [];

    exercises.forEach((exercise, idx) => {
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

    const allCalls = [...deleteCalls, ...updateCalls, ...createCalls];
    if (!allCalls.length) return of(updatedSession);

    return concat(...allCalls).pipe(last(), map(() => updatedSession));
  }
}
