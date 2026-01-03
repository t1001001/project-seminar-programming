# Angular Library Architecture Guide

This document defines the standard architecture pattern for Angular feature libraries in this project. All new libraries **must** follow these patterns to ensure consistency, maintainability, and scalability.

> **Reference Implementations:** See `common-lib` for shared utilities and `exercises-lib`, `sessions-lib`, `plans-lib`, and `workouts-lib` for feature library examples.

---

## 📁 Directory Structure

Every feature library follows this structure:

```
projects/
├── common-lib/                        # Cross-cutting shared utilities
│   └── src/
│       └── lib/
│           ├── auth/                  # Authentication module
│           │   ├── user.model.ts      # User & LoginRequest interfaces
│           │   ├── user-provider.service.ts  # HTTP calls for auth
│           │   ├── auth.service.ts    # Signal-based auth state
│           │   ├── auth.interceptor.ts  # Authorization header injection
│           │   ├── auth.guard.ts      # Route protection
│           │   └── index.ts           # Barrel file
│           ├── constants/             # Shared constants (snackbar, http-error)
│           ├── utils/                 # Shared utility functions
│           └── common-lib.ts          # Barrel file for exports
│
└── [feature]-lib/                     # Feature-specific library
    └── src/
        └── lib/
            ├── provider-services/     # HTTP & Backend Communication
            ├── logic-services/        # Business Logic Layer
            ├── shared/                # Feature-specific constants, validation, error handling
            ├── ui/                    # Reusable UI Components
            ├── views/                 # Smart Container Components
            └── [feature]-lib.ts       # Barrel file for API exports
```

### Barrel File Template (`[feature]-lib.ts`)

```typescript
// Services
export * from './logic-services/[entity]-logic.service';
export * from './provider-services/[entity]-provider.service';

// Shared (constants, validation, error handling)
export * from './shared';

// UI Components
export * from './ui/[entity]-card/[entity]-card';
export * from './ui/[entity]-form-dialog/[entity]-form-dialog';
export * from './ui/[entity]-delete-dialog/[entity]-delete-dialog';

// View Components
export * from './views/[entity]-overview/[entity]-overview';
export * from './views/[entity]-detail/[entity]-detail';
```

---

## 🏗️ Architecture Layers

### 0. Common Library (`common-lib`)

**Purpose:** Cross-cutting utilities shared across all feature libraries. Eliminates code duplication for generic functionality.

#### Directory Structure

```
common-lib/
└── src/
    └── lib/
        ├── constants/
        │   ├── snackbar.constants.ts     # Snackbar durations and CSS classes
        │   └── http-error.constants.ts   # Common HTTP error messages
        ├── utils/
        │   ├── snackbar.util.ts          # showError(), showSuccess() functions
        │   └── http-error.util.ts        # handleHttpError() utility
        └── common-lib.ts                 # Barrel file
```

#### Exports (`common-lib.ts`)

```typescript
// Authentication
export * from './auth';

// Constants
export * from './constants/snackbar.constants';
export * from './constants/http-error.constants';

// Utilities
export * from './utils/snackbar.util';
export * from './utils/http-error.util';
```

#### Authentication Module (`auth/`)

The authentication module provides signal-based auth state management, HTTP interceptor, and route guards.

##### AuthService

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { UserProviderService } from './user-provider.service';
import { User } from './user.model';

const AUTH_STORAGE_KEY = 'fitness_auth_header';
const USER_STORAGE_KEY = 'fitness_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly userProvider = inject(UserProviderService);

    private readonly currentUserSignal = signal<User | null>(null);
    readonly currentUser = this.currentUserSignal.asReadonly();
    readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

    constructor() {
        this.restoreSession();
    }

    login(username: string, password: string): Observable<string> {
        const authHeader = 'Basic ' + btoa(username + ':' + password);
        return this.userProvider.validateLogin(authHeader).pipe(
            tap((returnedUsername) => {
                localStorage.setItem(AUTH_STORAGE_KEY, authHeader);
                localStorage.setItem(USER_STORAGE_KEY, returnedUsername);
                this.currentUserSignal.set({ username: returnedUsername });
            }),
            catchError((error) => {
                let errorMessage = 'Login failed. Please try again.';
                if (error.status === 401) errorMessage = 'Invalid username or password.';
                else if (error.status === 0) errorMessage = 'Cannot connect to server.';
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    logout(): void {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        this.currentUserSignal.set(null);
    }

    getAuthHeader(): string | null {
        return localStorage.getItem(AUTH_STORAGE_KEY);
    }

    private restoreSession(): void {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser && storedAuth) {
            this.currentUserSignal.set({ username: storedUser });
        }
    }
}
```

##### Auth Interceptor

```typescript
import { HttpInterceptorFn } from '@angular/common/http';

const AUTH_STORAGE_KEY = 'fitness_auth_header';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authHeader = localStorage.getItem(AUTH_STORAGE_KEY);
    if (authHeader) {
        const cloned = req.clone({ setHeaders: { Authorization: authHeader } });
        return next(cloned);
    }
    return next(req);
};
```

##### Auth Guard

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isLoggedIn()) {
        return true;
    }
    return router.createUrlTree(['/login']);
};
```

#### Template: Snackbar Constants

```typescript
export const SNACKBAR_SUCCESS_DURATION = 3000;
export const SNACKBAR_ERROR_DURATION = 5000;
export const SNACKBAR_ERROR_CLASS = 'error-snackbar';
export const SNACKBAR_SUCCESS_CLASS = 'success-snackbar';
```

#### Template: Snackbar Utilities

```typescript
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  SNACKBAR_SUCCESS_DURATION,
  SNACKBAR_ERROR_DURATION,
  SNACKBAR_ERROR_CLASS,
  SNACKBAR_SUCCESS_CLASS,
} from '../constants/snackbar.constants';

export function showError(snackBar: MatSnackBar, message: string): void {
  snackBar.open(message, 'Close', {
    duration: SNACKBAR_ERROR_DURATION,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: [SNACKBAR_ERROR_CLASS],
  });
}

export function showSuccess(snackBar: MatSnackBar, message: string): void {
  snackBar.open(message, 'Close', {
    duration: SNACKBAR_SUCCESS_DURATION,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: [SNACKBAR_SUCCESS_CLASS],
  });
}
```

#### Template: HTTP Error Handler

```typescript
import { throwError, Observable } from 'rxjs';
import { COMMON_ERROR_MESSAGES } from '../constants/http-error.constants';

export interface HttpErrorConfig {
  defaultMessage: string;
  notFoundMessage?: string;
  conflictMessage?: string;
  badRequestMessage?: string;
  connectionMessage?: string;
}

export function handleHttpError(err: any, config: HttpErrorConfig): Observable<never> {
  let errorMessage = config.defaultMessage;

  switch (err?.status) {
    case 404:
      errorMessage = config.notFoundMessage ?? errorMessage;
      break;
    case 409:
      errorMessage = extractErrorMessage(err) || config.conflictMessage || errorMessage;
      break;
    case 400:
      errorMessage = config.badRequestMessage ?? errorMessage;
      break;
    case 0:
      errorMessage = config.connectionMessage ?? COMMON_ERROR_MESSAGES.CONNECTION_ERROR;
      break;
    default:
      if (err?.message) {
        errorMessage = err.message;
      }
  }

  const error = Object.assign(new Error(errorMessage), {
    status: err?.status,
    error: err?.error
  });

  return throwError(() => error);
}
```

---

### Shared Folder (`shared/`)

**Purpose:** Domain-specific constants, validation logic, and error handling for a feature library. Each library has its own `shared/` folder.

#### Directory Structure

```
[feature]-lib/
└── src/
    └── lib/
        └── shared/
            ├── [feature].constants.ts     # Domain-specific constants & error messages
            ├── error-handler.util.ts      # Feature-specific error config factory
            ├── [validation].util.ts       # Domain-specific validation functions (optional)
            └── index.ts                   # Barrel file re-exporting common-lib utilities
```

#### Template: Barrel File (`index.ts`)

```typescript
// Feature-specific exports
export * from './[feature].constants';
export * from './error-handler.util';
export * from './[validation].util';  // if applicable

// Re-export common-lib utilities for convenience
export { showError, showSuccess, handleHttpError } from 'common-lib';
export type { HttpErrorConfig } from 'common-lib';
```

#### Template: Feature Constants

```typescript
export const MAX_ORDER_VALUE = 30;
export const MIN_NAME_LENGTH = 2;

export const ERROR_MESSAGES = {
  [ENTITY]_NOT_FOUND: '[Entity] not found. It may have been deleted.',
  DUPLICATE_[ENTITY]: 'A [entity] with this name already exists.',
  INVALID_[ENTITY]_DATA: 'Invalid [entity] data. Please check all fields.',
  [FIELD]_REQUIRED: '[Field] is required',
} as const;
```

#### Template: Error Handler Utility

```typescript
import { HttpErrorConfig, handleHttpError } from 'common-lib';
import { Observable } from 'rxjs';
import { ERROR_MESSAGES } from './[feature].constants';

export type [Entity]ErrorConfig = HttpErrorConfig;

export function handle[Entity]Error(err: any, config: [Entity]ErrorConfig): Observable<never> {
  return handleHttpError(err, config);
}

export function create[Entity]ErrorConfig(
  operation: 'create' | 'load' | 'loadAll' | 'update' | 'delete'
): [Entity]ErrorConfig {
  return {
    defaultMessage: `Failed to ${operation} [entity]`,
    notFoundMessage: ERROR_MESSAGES.[ENTITY]_NOT_FOUND,
    conflictMessage: ERROR_MESSAGES.DUPLICATE_[ENTITY],
    badRequestMessage: ERROR_MESSAGES.INVALID_[ENTITY]_DATA,
  };
}
```

#### Template: Validation Utility (for complex features)

```typescript
import { throwError, Observable } from 'rxjs';
import { ERROR_MESSAGES } from './[feature].constants';

export interface ValidationResult {
  valid: true;
} | {
  valid: false;
  error: Observable<never>;
}

export function validate[Entity]Fields(payload: [Entity]Payload): ValidationResult {
  if (!payload.name?.trim()) {
    return { 
      valid: false, 
      error: throwError(() => new Error(ERROR_MESSAGES.NAME_REQUIRED)) 
    };
  }
  return { valid: true };
}
```

---

### 1. Provider Services Layer (`provider-services/`)

**Purpose:** Pure HTTP communication with backend APIs. This is the **data access layer**.

#### Responsibilities

| ✅ DO | ❌ DON'T |
|-------|----------|
| Make HTTP requests (GET, POST, PUT, DELETE) | Handle errors |
| Define TypeScript interfaces for domain models | Add business logic |
| Handle API endpoint URLs | Manage state |
| Return raw `Observable` streams | Transform data |

#### File Naming: `[entity]-provider.service.ts`

#### Template: Single-Entity Provider

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Domain Models - Define all interfaces here
export interface [Entity] {
  id: string;
  name: string;
  // ... other fields
}

export interface [Entity]Create {
  name: string;
  // ... fields for creation (no id)
}

export interface [Entity]Update {
  name: string;
  // ... fields for update
}

@Injectable({ providedIn: 'root' })
export class [Entity]ProviderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/[entities]';

  getAll(): Observable<[Entity][]> {
    return this.http.get<[Entity][]>(this.apiUrl);
  }

  getById(id: string): Observable<[Entity]> {
    return this.http.get<[Entity]>(`${this.apiUrl}/${id}`);
  }

  create(entity: [Entity]Create): Observable<[Entity]> {
    return this.http.post<[Entity]>(this.apiUrl, entity);
  }

  update(id: string, entity: [Entity]Update): Observable<[Entity]> {
    return this.http.put<[Entity]>(`${this.apiUrl}/${id}`, entity);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

#### Template: Multi-Entity Provider

When a feature manages multiple related entities:

```typescript
@Injectable({ providedIn: 'root' })
export class [Feature]ProviderService {
  private readonly http = inject(HttpClient);
  private readonly primaryApiUrl = 'http://localhost:8080/api/v1/[primary-entities]';
  private readonly relatedApiUrl = 'http://localhost:8080/api/v1/[related-entities]';

  // Primary entity CRUD
  getAllPrimary(): Observable<[Primary][]> { /* ... */ }
  createPrimary(entity: [Primary]Create): Observable<[Primary]> { /* ... */ }
  
  // Related entity CRUD  
  getRelatedByPrimaryId(primaryId: string): Observable<[Related][]> { /* ... */ }
  createRelated(entity: [Related]Create): Observable<[Related]> { /* ... */ }
}
```

---

### 2. Logic Services Layer (`logic-services/`)

**Purpose:** Business logic, error handling, and orchestration. This is the **business layer**.

#### Responsibilities

| ✅ DO | ❌ DON'T |
|-------|----------|
| Wrap all provider service calls | Make direct HTTP calls |
| Handle errors with `catchError` | Handle UI concerns (dialogs, routing) |
| Transform HTTP errors to user-friendly messages | Skip the provider layer |
| Emit events via `Subject` for cross-component communication | |
| Orchestrate multi-step operations | |
| Validate and enforce business rules | |

#### File Naming: `[entity]-logic.service.ts`

#### Template: Standard Logic Service

```typescript
import { Injectable, inject } from '@angular/core';\nimport { Observable, Subject, tap, catchError } from 'rxjs';
import { [Entity], [Entity]Create, [Entity]ProviderService } from '../provider-services/[entity]-provider.service';
import { handle[Entity]Error, create[Entity]ErrorConfig } from '../shared';

@Injectable({ providedIn: 'root' })
export class [Entity]LogicService {
  private readonly provider = inject([Entity]ProviderService);
  
  // Event emission for cross-component communication
  private readonly createdSubject = new Subject<[Entity]>();
  readonly created$ = this.createdSubject.asObservable();

  create(entity: [Entity]Create): Observable<[Entity]> {
    return this.provider.create(entity).pipe(
      tap((created) => this.createdSubject.next(created)),
      catchError((err) => handle[Entity]Error(err, create[Entity]ErrorConfig('create')))
    );
  }

  getAll(): Observable<[Entity][]> {
    return this.provider.getAll().pipe(
      catchError((err) => handle[Entity]Error(err, create[Entity]ErrorConfig('loadAll')))
    );
  }

  getById(id: string): Observable<[Entity]> {
    return this.provider.getById(id).pipe(
      catchError((err) => handle[Entity]Error(err, create[Entity]ErrorConfig('load')))
    );
  }

  update(id: string, entity: [Entity]Update): Observable<[Entity]> {
    return this.provider.update(id, entity).pipe(
      catchError((err) => handle[Entity]Error(err, create[Entity]ErrorConfig('update')))
    );
  }

  delete(id: string): Observable<void> {
    return this.provider.delete(id).pipe(
      catchError((err) => handle[Entity]Error(err, create[Entity]ErrorConfig('delete')))
    );
  }
}
```

> **Note:** Error handling is centralized in `shared/error-handler.util.ts` which uses `handleHttpError` from `common-lib`. This ensures consistent error messages across all operations.

#### Pattern: Complex Orchestration

When a single user action requires multiple API calls:

```typescript
createWithChildren(payload: [Entity]WithChildrenPayload): Observable<[Entity]> {
  return this.provider.create({
    name: payload.name,
    // ... other fields
  }).pipe(
    switchMap((created) => {
      if (payload.children.length === 0) {
        return of(created);
      }
      // Create all children in parallel
      const childCalls$ = payload.children.map((child, idx) =>
        this.provider.createChild({
          parentId: created.id,
          ...child,
          orderID: idx + 1,
        })
      );
      return forkJoin(childCalls$).pipe(map(() => created));
    }),
    catchError((err) => this.handleError(err, 'create'))
  );
}
```

#### Pattern: Cross-Library Data Enrichment

When enriching data with details from another library:

```typescript
import { OtherProviderService, OtherEntity } from 'other-lib';

@Injectable({ providedIn: 'root' })
export class [Entity]LogicService {
  private readonly provider = inject([Entity]ProviderService);
  private readonly otherProvider = inject(OtherProviderService);

  getDetailWithEnrichment(id: string): Observable<[Entity]Detail> {
    return combineLatest([
      this.provider.getById(id),
      this.otherProvider.getAll()
    ]).pipe(
      map(([entity, others]) => this.enrichEntity(entity, others)),
      catchError((err) => this.handleError(err, 'load'))
    );
  }
}
```

#### Pattern: Multiple Event Subjects

When a service manages different state transitions that components need to react to separately:

```typescript
@Injectable({ providedIn: 'root' })\nexport class WorkoutLogicService {
  private readonly provider = inject(WorkoutProviderService);
  
  // Separate event streams for different state transitions
  private readonly workoutCompletedSubject = new Subject<WorkoutLog>();
  readonly workoutCompleted$ = this.workoutCompletedSubject.asObservable();

  private readonly workoutSavedSubject = new Subject<WorkoutLog>();
  readonly workoutSaved$ = this.workoutSavedSubject.asObservable();

  private readonly workoutCancelledSubject = new Subject<WorkoutLog>();
  readonly workoutCancelled$ = this.workoutCancelledSubject.asObservable();

  // Emit to appropriate subject based on outcome
  saveWorkout(id: string, data: UpdateData): Observable<WorkoutLog> {
    return this.provider.update(id, data).pipe(
      tap((workout) => {
        if (workout.status === 'Completed') {
          this.workoutCompletedSubject.next(workout);
        } else {
          this.workoutSavedSubject.next(workout);
        }
      }),
      catchError((err) => this.handleError(err, 'save'))
    );
  }
}
```

**Benefits:**
- Components can subscribe to specific events they care about
- Clearer intent than a single event stream with status checking
- Enables different UI responses for different state transitions

#### Pattern: Conditional Workflow with Parallel Updates

When updating multiple related entities and conditionally triggering a state change:

```typescript
saveWorkout(
  workoutLogId: string,
  executionUpdates: ExecutionInput[],
  notes?: string
): Observable<WorkoutLog> {
  // Update all execution logs in parallel
  const executionCalls = executionUpdates.map((update) =>
    this.provider.updateExecution(update.id, update)
  );

  // Update parent notes if provided
  const notesCall = notes !== undefined
    ? this.provider.updateWorkoutLog(workoutLogId, { notes })
    : of(null);

  // Check if all items are completed
  const allCompleted = executionUpdates.every((u) => u.completed);

  return forkJoin([notesCall, ...executionCalls]).pipe(
    switchMap(() => {
      if (allCompleted) {
        // Conditionally complete the workflow
        return this.provider.completeWorkout(workoutLogId);
      } else {
        // Just return updated state
        return this.provider.getWorkoutLogById(workoutLogId);
      }
    }),
    tap((workout) => {
      if (workout.status === 'Completed') {
        this.workoutCompletedSubject.next(workout);
      } else {
        this.workoutSavedSubject.next(workout);
      }
    }),
    catchError((err) => this.handleError(err, 'save'))
  );
}
```

**Benefits:**
- Parallel updates for performance (`forkJoin`)
- Conditional state transitions based on data
- Single API call for complex multi-step operations
- Proper event emission based on outcome

#### Pattern: CRUD Synchronization

When updating a parent entity with a collection of child entities (create new, update existing, delete removed):

```typescript
updateSessionWithExercises(
  sessionId: string,
  payload: SessionUpdatePayload
): Observable<Session> {
  // Update parent entity
  const sessionUpdate: SessionUpdate = {
    name: payload.name,
    planId: payload.planId,
    orderID: payload.orderID
  };

  return this.provider.updateSession(sessionId, sessionUpdate).pipe(
    switchMap((updatedSession) =>
      // Fetch existing children
      this.provider.getExerciseExecutionsBySession(sessionId).pipe(
        switchMap((existingExecutions) => {
          const desiredIds = new Set<string>();
          const updateCalls: Observable<ExerciseExecution>[] = [];
          const createCalls: Observable<ExerciseExecution>[] = [];

          // Process each child in the payload
          payload.exercises.forEach((exercise, idx) => {
            const execId = exercise.id;
            const request = {
              exerciseId: exercise.exerciseId,
              plannedSets: exercise.plannedSets,
              plannedReps: exercise.plannedReps,
              plannedWeight: exercise.plannedWeight,
              orderID: exercise.orderID ?? idx + 1,
            };

            if (execId) {
              // Existing child - update it
              desiredIds.add(execId);
              updateCalls.push(
                this.provider.updateExerciseExecution(execId, request)
              );
            } else {
              // New child - create it
              createCalls.push(
                this.provider.createExerciseExecution({
                  ...request,
                  sessionId
                })
              );
            }
          });

          // Delete children not in the desired set
          const deleteCalls = existingExecutions
            .filter(exec => !desiredIds.has(exec.id))
            .map(exec => this.provider.deleteExerciseExecution(exec.id));

          // Execute all operations in parallel
          const allCalls = [...updateCalls, ...createCalls, ...deleteCalls];
          if (!allCalls.length) {
            return of(updatedSession);
          }
          return forkJoin(allCalls).pipe(map(() => updatedSession));
        })
      )
    ),
    catchError((err) => this.handleError(err, 'update'))
  );
}
```

**Benefits:**
- Single operation synchronizes parent and all children
- Automatically handles create/update/delete based on presence of ID
- Parallel execution for performance
- Atomic-like behavior (all or nothing)

**Use Cases:**
- Updating a session with its exercise list
- Updating a plan with its session list
- Any parent-child relationship where children can be added/removed/modified

#### Pattern: Two-Phase Reorder

When reordering items with database unique constraints:

```typescript
reorderItems(items: Item[], parentId: string): Observable<void> {
  const updates = this.getChangedOrders(items);
  if (!updates.length) return of(void 0);
  
  // Buffer to avoid unique constraint conflicts
  const bufferBase = Math.max(...items.map(i => i.orderID ?? 0)) + updates.length + 5;

  // Phase 1: Move to temporary positions
  const moveToTemp$ = forkJoin(
    updates.map((u, idx) => this.provider.update(u.id, { ...u, orderID: bufferBase + idx }))
  );

  // Phase 2: Apply final positions
  const applyFinal$ = forkJoin(
    updates.map(u => this.provider.update(u.id, { ...u, orderID: u.orderID }))
  );

  return moveToTemp$.pipe(
    switchMap(() => applyFinal$),
    map(() => void 0)
  );
}
```

---

### 3. UI Components Layer (`ui/`)

**Purpose:** Reusable, presentational components. This is the **presentation layer**.

#### Responsibilities

| ✅ DO | ❌ DON'T |
|-------|----------|
| Display data via `input()` | Make HTTP calls |
| Emit events via `output()` | Inject provider services directly |
| Handle user interactions | Contain business logic |
| Use `OnPush` change detection | |
| Contain component-specific styling | |

#### Service Injection Rules

| Component Type | Allowed Injections |
|----------------|-------------------|
| **Simple UI** (cards, chips) | `Router`, `AuthService` (for conditional rendering) |
| **Form Dialogs** (create) | `MatDialogRef`, `FormBuilder`, `MAT_DIALOG_DATA` |
| **Confirmation Dialogs** | `MatDialogRef`, `MAT_DIALOG_DATA` |
| **Edit Dialogs** (complex) | Logic services, `MatDialogRef`, `FormBuilder`, `MatSnackBar`, `MAT_DIALOG_DATA` |

#### Template: Card Component (with Auth)

```typescript
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'common-lib';

@Component({
  selector: 'lib-[entity]-card',
  imports: [/* Material modules */],
  templateUrl: './[entity]-card.html',
  styleUrl: './[entity]-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class [Entity]CardComponent {
  private readonly router = inject(Router);
  public readonly authService = inject(AuthService);
  
  entity = input.required<[Entity]>();
  delete = output<[Entity]>();

  onCardClick(): void {
    this.router.navigate(['/[entities]', this.entity().id]);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.entity());
  }
}
```

#### Template: Card HTML (Conditional Actions)

```html
<mat-card class="entity-card" (click)="onCardClick()">
  <div class="card-content">
    <h3>{{ entity().name }}</h3>
    <!-- Other content -->
    
    @if (authService.isLoggedIn()) {
    <button mat-raised-button class="delete-btn" (click)="onDelete($event)">
      <mat-icon>delete</mat-icon>
      Delete
    </button>
    }
  </div>
</mat-card>
```

#### Template: Form Dialog

```typescript
@Component({
  selector: 'lib-[entity]-form-dialog',
  imports: [/* Form & Material modules */],
  templateUrl: './[entity]-form-dialog.html',
  styleUrl: './[entity]-form-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class [Entity]FormDialogComponent {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly fb = inject(FormBuilder);
  readonly data = inject<[Entity] | null>(MAT_DIALOG_DATA, { optional: true });

  readonly form = this.fb.group({
    name: [this.data?.name ?? '', [Validators.required, Validators.minLength(2)]],
    // ... other fields
  });

  get isEditMode(): boolean {
    return !!this.data;
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
```

#### Pattern: Dirty Tracking (for Edit Dialogs)

```typescript
export class [Entity]EditDialogComponent implements OnInit {
  private readonly initialSnapshot = JSON.stringify(this.data);
  isDirty = false;

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => this.updateDirtyFlag());
  }

  private updateDirtyFlag(): void {
    const current = JSON.stringify({ ...this.data, ...this.form.value });
    this.isDirty = current !== this.initialSnapshot;
  }
}
```

---

### 4. Views Layer (`views/`)

**Purpose:** Smart container components that orchestrate UI and services. This is the **orchestration layer**.

#### Responsibilities

| ✅ DO | ❌ DON'T |
|-------|----------|
| Inject logic services (NOT providers) | Handle HTTP status codes |
| Inject `AuthService` for conditional UI | Contain complex business logic |
| Manage component state | |
| Coordinate UI components | |
| Handle routing and navigation | |
| Display notifications (snackbars) | |
| Open dialogs and modals | |
| Conditionally render actions based on auth | |

#### Template: Overview Component (Observable-based)

```typescript
@Component({
  selector: 'lib-[entities]-overview',
  imports: [/* UI components, AsyncPipe */],
  templateUrl: './[entities]-overview.html',
  styleUrl: './[entities]-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class [Entities]OverviewComponent {
  private readonly service = inject([Entity]LogicService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);
  readonly entities$ = this.refreshTrigger$.pipe(
    switchMap(() => this.service.getAll())
  );

  onCreate(): void {
    const dialogRef = this.dialog.open([Entity]FormDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.service.create(result).subscribe({
          next: () => {
            this.refresh();
            this.snackBar.open('[Entity] created successfully!', 'Close', { duration: 3000 });
          },
          error: (err) => this.snackBar.open(err.message, 'Close', { duration: 5000 }),
        });
      }
    });
  }

  onDelete(entity: [Entity]): void {
    const dialogRef = this.dialog.open([Entity]DeleteDialogComponent, {
      data: { name: entity.name },
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.service.delete(entity.id).subscribe({
          next: () => {
            this.refresh();
            this.snackBar.open('[Entity] deleted successfully!', 'Close', { duration: 3000 });
          },
          error: (err) => this.snackBar.open(err.message, 'Close', { duration: 5000 }),
        });
      }
    });
  }

  refresh(): void {
    this.refreshTrigger$.next();
  }
}
```

#### Template: Overview Component (Signal-based)

```typescript
@Component({
  selector: 'lib-[entities]-overview',
  imports: [/* UI components */],
  templateUrl: './[entities]-overview.html',
  styleUrl: './[entities]-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class [Entities]OverviewComponent {
  private readonly service = inject([Entity]LogicService);
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  private readonly entities = toSignal(
    this.refreshTrigger$.pipe(
      switchMap(() => this.service.getAll().pipe(
        catchError((err) => {
          this.snackBar.open(err.message, 'Close');
          return of([] as [Entity][]);
        })
      )),
      shareReplay(1)
    ),
    { initialValue: [] as [Entity][] }
  );

  // Derived state via computed signals
  readonly searchControl = new FormControl('');
  private readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(200)),
    { initialValue: '' }
  );

  readonly filteredEntities = computed(() => {
    const term = (this.searchTerm() || '').toLowerCase();
    return this.entities().filter(e => e.name.toLowerCase().includes(term));
  });

  readonly totalCount = computed(() => this.entities().length);

  refresh(): void {
    this.refreshTrigger$.next();
  }
}
```

#### Template: Detail Component

```typescript
@Component({
  selector: 'lib-[entity]-detail',
  imports: [/* UI components, AsyncPipe */],
  templateUrl: './[entity]-detail.html',
  styleUrl: './[entity]-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class [Entity]DetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject([Entity]LogicService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);
  entity$: Observable<[Entity] | null> | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entity$ = this.refreshTrigger$.pipe(
        switchMap(() => this.service.getById(id)),
        catchError((err) => {
          this.snackBar.open(err.message, 'Close', { duration: 5000 });
          this.router.navigate(['/[entities]']);
          return of(null);
        })
      );
    }
  }

  onBack(): void {
    this.router.navigate(['/[entities]']);
  }

  onEdit(entity: [Entity]): void {
    const dialogRef = this.dialog.open([Entity]EditDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { entity }
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.refreshTrigger$.next();
        this.snackBar.open('[Entity] updated successfully!', 'Close', { duration: 3000 });
      }
    });
  }
}
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         VIEW LAYER                          │
│  (Smart Components - Orchestration & User Interaction)      │
│                                                             │
│  • Inject Logic Services                                    │
│  • Display UI Components                                    │
│  • Handle routing & dialogs                                 │
│  • Show notifications                                       │
│  • Display err.message from logic layer                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                      LOGIC LAYER                            │
│     (Business Logic, Error Handling, Side Effects)          │
│                                                             │
│  • Wrap provider calls                                      │
│  • catchError: Transform HTTP errors → user messages        │
│  • tap: Add logging & side effects                          │
│  • Subject: Emit events for communication                   │
│  • Validate & enforce business rules                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    PROVIDER LAYER                           │
│          (HTTP Communication with Backend)                  │
│                                                             │
│  • HttpClient for REST API calls                            │
│  • Return raw Observables                                   │
│  • No error handling (let errors propagate)                 │
│  • Stateless pass-through                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ↓
                  Backend API
```

---

## 🎯 Key Principles

### Separation of Concerns

| Layer | Responsibility |
|-------|----------------|
| **Common-lib** | "What everyone needs" (shared utilities) |
| **Shared** | "What this feature needs" (domain constants, validation) |
| **Provider** | "How to get data" (HTTP mechanics) |
| **Logic** | "What to do with data" (business rules, error handling) |
| **UI** | "How to display data" (presentation) |
| **View** | "How to coordinate" (orchestration) |

### Error Handling Strategy

1. **Provider Layer**: No handling — let errors propagate
2. **Logic Layer**: Catch all errors, transform to user-friendly messages
3. **View Layer**: Display `err.message` from logic layer
4. **Result**: Consistent error messages, no HTTP knowledge in components

### Dependency Rules

| Allowed | Forbidden |
|---------|-----------|
| All Feature Libs → `common-lib` ✅ | Views → Provider Services ❌ |
| `shared/` → `common-lib` ✅ | UI Components → Provider Services ❌ |
| Logic Services → `shared/` ✅ | Direct HTTP error handling in components ❌ |
| Views → Logic Services ✅ | |
| Views → UI Components ✅ | |
| Views → `AuthService` ✅ | |
| UI Cards → `AuthService` ✅ | |
| Logic Services → Provider Services ✅ | |
| Edit Dialogs → Logic Services ✅ | |

### State Management

| Layer | State Pattern |
|-------|---------------|
| **Provider** | Stateless (no caching) |
| **Logic** | Event emission via `Subject` |
| **View** | `BehaviorSubject` + `switchMap` or `toSignal` + `computed` |
| **UI** | Stateless (data via inputs) |

---

## 📋 Checklist for New Libraries

When creating a new feature library `[feature]-lib`:

### Provider Service
- [ ] File: `[entity]-provider.service.ts`
- [ ] Domain model interfaces defined
- [ ] CRUD methods returning `Observable`
- [ ] No error handling
- [ ] Stateless implementation

### Logic Service
- [ ] File: `[entity]-logic.service.ts`
- [ ] All provider methods wrapped
- [ ] `catchError` using `shared/error-handler.util.ts`
- [ ] User-friendly error messages via `ERROR_MESSAGES` constants
- [ ] Event `Subject` for cross-component communication

### Shared Folder
- [ ] Directory: `shared/`
- [ ] `[feature].constants.ts` with `ERROR_MESSAGES` object
- [ ] `error-handler.util.ts` using `handleHttpError` from `common-lib`
- [ ] `index.ts` barrel file re-exporting `showError`, `showSuccess` from `common-lib`
- [ ] Validation utilities (if applicable)

### UI Components
- [ ] Directory: `ui/[component-name]/`
- [ ] `input()` for data, `output()` for events
- [ ] `ChangeDetectionStrategy.OnPush`
- [ ] Service injections follow rules (see table above)
- [ ] `AuthService` injected for conditional action rendering
- [ ] `@if (authService.isLoggedIn())` wraps Create/Edit/Delete buttons

### View Components
- [ ] Directory: `views/[view-name]/`
- [ ] Inject logic service (not provider)
- [ ] Inject `AuthService` for conditional UI
- [ ] Dialog/notification handling
- [ ] Refresh mechanism (`BehaviorSubject` or signals)
- [ ] Create/Edit FAB buttons wrapped with `@if (authService.isLoggedIn())`

### Styling
- [ ] Separate `.scss` files
- [ ] Theme variables only (no hardcoded colors)
- [ ] Tested in light and dark modes
- [ ] Responsive breakpoints

### Exports
- [ ] Barrel file exports all public APIs
- [ ] Verify library builds: `ng build [feature]-lib`

---

## 🎨 Styling Requirements

### Theme Variables (Required)

```scss
// Backgrounds
background-color: var(--fitness-bg-card);
background-color: var(--fitness-bg-page);
background-color: var(--fitness-bg-chip);

// Text
color: var(--fitness-text-primary);
color: var(--fitness-text-secondary);
color: var(--fitness-text-tertiary);

// Borders & Shadows
border: 1px solid var(--fitness-border);
box-shadow: var(--fitness-shadow);

// Brand
background-color: var(--fitness-primary);
```

### Component SCSS Template

```scss
:host {
  display: block;
}

.card {
  background-color: var(--fitness-bg-card);
  border: 1px solid var(--fitness-border);
  border-radius: 12px;
  padding: 1rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.title {
  color: var(--fitness-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.subtitle {
  color: var(--fitness-text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .card {
    padding: 0.75rem;
  }
}
```

> **Full styling details:** See `UI-STYLE-GUIDE.md` for complete color palette, button styles, and component patterns.

---

## 🚀 Benefits of This Architecture

1. **Maintainability**: Clear separation makes code easy to find and modify
2. **Testability**: Each layer can be tested independently
3. **Reusability**: UI components work anywhere, logic is centralized
4. **Consistency**: Error handling and patterns are uniform across all libraries
5. **Scalability**: Easy to add new features following the same structure
6. **Developer Experience**: Clear guidelines reduce decision fatigue
7. **DRY Compliance**: `common-lib` eliminates code duplication for shared utilities
8. **Clean Code**: Domain-specific constants and validation in `shared/` folders

---

The architecture is **repeatable and predictable** across all feature libraries.

---

**Last Updated:** January 2026  
**Shared Utilities:** `common-lib` (includes Authentication module)  
**Feature Libraries:** `exercises-lib`, `sessions-lib`, `plans-lib`, `workouts-lib`, `home-lib`

