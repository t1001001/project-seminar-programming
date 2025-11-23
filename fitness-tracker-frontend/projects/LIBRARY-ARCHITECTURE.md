# Angular Library Architecture Guide

This document describes the standard architecture pattern for Angular feature libraries in this project, using `exercises-lib` as the reference implementation.

## 📁 Directory Structure

```
projects/
└── [feature]-lib/
    └── src/
        └── lib/
            ├── provider-services/     # HTTP & Backend Communication
            ├── logic-services/        # Business Logic Layer
            ├── ui/                    # Reusable UI Components
            ├── views/                 # Smart Container Components
            └── [feature]-lib.ts       # Barrel file for API exports
```

---

## 🏗️ Architecture Layers

### **1. Provider Services Layer** (`provider-services/`)

**Purpose:** Pure HTTP communication with backend APIs. This is the **data access layer**.

#### **Responsibilities:**
- ✅ Make HTTP requests (`GET`, `POST`, `PUT`, `DELETE`)
- ✅ Define TypeScript interfaces for domain models
- ✅ Handle API endpoint URLs
- ✅ Return raw `Observable` streams
- ❌ **NO** error handling (let errors propagate)
- ❌ **NO** business logic
- ❌ **NO** state management

#### **File Naming Convention:**
```
[entity]-provider.service.ts
```

#### **Example Structure:**
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Domain Models
export interface Exercise {
  id: string;
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
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/exercises';

  // CRUD Operations - Simple HTTP pass-through
  getAllExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(this.apiUrl);
  }

  createExercise(exercise: ExerciseCreate): Observable<Exercise> {
    return this.http.post<Exercise>(this.apiUrl, exercise);
  }

  getExerciseById(id: string): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`);
  }

  updateExercise(id: string, exercise: ExerciseCreate): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.apiUrl}/${id}`, exercise);
  }

  deleteExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

#### **Key Characteristics:**
- Stateless - no `BehaviorSubject` or local caching
- Direct HTTP calls without transformation
- Returns typed observables
- No error handling logic

---

### **2. Logic Services Layer** (`logic-services/`)

**Purpose:** Business logic, error handling, and side effects. This is the **business layer**.

#### **Responsibilities:**
- ✅ Wrap provider service calls
- ✅ **Error handling** with `catchError` operator
- ✅ Transform HTTP errors to user-friendly messages
- ✅ Add logging with `tap` operator
- ✅ Event emission with `Subject` for cross-component communication
- ✅ Data validation and transformation
- ✅ Business rules enforcement
- ❌ **NO** direct HTTP calls
- ❌ **NO** UI concerns (dialogs, routing, etc.)

#### **File Naming Convention:**
```
[entity]-logic.service.ts
```

#### **Example Structure:**
```typescript
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, tap, catchError, throwError } from 'rxjs';
import { Exercise, ExerciseCreate, ExerciseProviderService } from '../provider-services/exercise-provider.service';

@Injectable({ providedIn: 'root' })
export class ExerciseLogicService {
  private exerciseProviderService = inject(ExerciseProviderService);
  
  // Event emission for cross-component communication
  private createdExerciseSubject = new Subject<Exercise>();
  createdExercise$ = this.createdExerciseSubject.asObservable();

  createExercise(exercise: ExerciseCreate): Observable<Exercise> {
    return this.exerciseProviderService.createExercise(exercise).pipe(
      tap((createdExercise) => {
        // Side effect: emit event
        this.createdExerciseSubject.next(createdExercise);
      }),
      catchError((err) => {
        // Error handling: transform HTTP errors
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
        tap((exercises: Exercise[]) => {
          // Side effect: logging
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

  // ... other methods with similar pattern
}
```

#### **Error Handling Pattern:**
1. Use `catchError` operator in every method
2. Map HTTP status codes to user-friendly messages:
   - `404` → "Not found" messages
   - `409` → "Conflict/duplicate" messages
   - `400` → "Validation error" messages
   - `0` → "Network/connection error" messages
3. Return `throwError(() => new Error(message))` with friendly message
4. Components receive `err.message` directly

#### **Key Characteristics:**
- Wraps all provider service calls
- Centralized error handling
- Logging and monitoring hooks
- Event-driven communication
- Business rule validation

---

### **3. UI Components Layer** (`ui/`)

**Purpose:** Reusable, presentational (dumb) components. This is the **presentation layer**.

#### **Responsibilities:**
- ✅ Display data passed via `@Input()` or `input()`
- ✅ Emit events via `@Output()` or `output()`
- ✅ Handle user interactions (clicks, form inputs)
- ✅ Contain component-specific styling
- ✅ Use `OnPush` change detection
- ❌ **NO** service injections (except Router for navigation)
- ❌ **NO** business logic
- ❌ **NO** HTTP calls
- ❌ **NO** state management

#### **Directory Structure:**
```
ui/
├── [component-name]/
│   ├── [component-name].ts
│   ├── [component-name].html
│   ├── [component-name].scss
│   └── [component-name].spec.ts
```

#### **Example: Card Component**
```typescript
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { Exercise } from '../../provider-services/exercise-provider.service';

@Component({
  selector: 'ex-exercise-card',
  imports: [/* Material modules */],
  templateUrl: './exercise-card.html',
  styleUrl: './exercise-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseCardComponent {
  private readonly router = inject(Router);
  
  // Input: data from parent
  exercise = input.required<Exercise>();
  
  // Output: events to parent
  delete = output<string>();

  onCardClick(): void {
    this.router.navigate(['/exercises', this.exercise().id]);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.exercise().id);
  }
}
```

#### **Example: Dialog Component**
```typescript
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ex-exercise-form-dialog',
  imports: [/* Form & Material modules */],
  templateUrl: './exercise-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseFormDialogComponent {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['', [Validators.required]],
    muscleGroups: ['', [Validators.required]],
  });

  onCreate(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
```

#### **Key Characteristics:**
- Stateless and reusable
- Data flows in via inputs
- Events flow out via outputs
- No knowledge of services or backend
- Focused on presentation only

---

### **4. Views Layer** (`views/`)

**Purpose:** Smart container components that orchestrate UI components and services. This is the **orchestration layer**.

#### **Responsibilities:**
- ✅ Inject logic services (NOT provider services)
- ✅ Manage component state and data flow
- ✅ Coordinate multiple UI components
- ✅ Handle routing and navigation
- ✅ Display user notifications (snackbars, toasts)
- ✅ Open dialogs and modals
- ✅ Subscribe to observables
- ✅ Trigger data refresh
- ❌ **NO** HTTP status code handling (done in logic layer)
- ❌ **NO** complex business logic (done in logic layer)

#### **Directory Structure:**
```
views/
├── [view-name]/
│   ├── [view-name].ts
│   ├── [view-name].html
│   ├── [view-name].scss
│   └── [view-name].spec.ts
```

#### **Example: Overview Component**
```typescript
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { ExerciseLogicService } from '../../logic-services/exercise-logic.service';
import { Exercise } from '../../provider-services/exercise-provider.service';

@Component({
  selector: 'ex-exercises-overview',
  imports: [/* UI components */],
  templateUrl: './exercises-overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesOverviewComponent implements OnInit {
  // Inject ONLY logic service (not provider)
  private readonly exerciseService = inject(ExerciseLogicService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  // State management for refresh
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);
  readonly exercises$: Observable<Exercise[]> = this.refreshTrigger$.pipe(
    switchMap(() => this.exerciseService.getAllExercises())
  );

  ngOnInit(): void {
    // Initial load happens automatically via exercises$ observable
  }

  private refreshExercises(): void {
    this.refreshTrigger$.next();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ExerciseFormDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.exerciseService.createExercise(result).subscribe({
          next: () => {
            this.refreshExercises(); // Refresh list
            this.snackBar.open('Exercise created successfully!', 'Close', {
              duration: 3000,
            });
          },
          error: (err) => {
            // Simple error display - message comes from logic service
            this.snackBar.open(err.message, 'Close', {
              duration: 5000,
            });
          }
        });
      }
    });
  }

  onDelete(id: string, name: string): void {
    const dialogRef = this.dialog.open(ExerciseDeleteDialogComponent, {
      data: { exerciseName: name },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.exerciseService.removeExercise(id).subscribe({
          next: () => {
            this.refreshExercises();
            this.snackBar.open('Exercise deleted successfully!', 'Close');
          },
          error: (err) => {
            this.snackBar.open(err.message, 'Close');
          }
        });
      }
    });
  }
}
```

#### **Example: Detail Component**
```typescript
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExerciseLogicService } from '../../logic-services/exercise-logic.service';

@Component({
  selector: 'ex-exercise-detail',
  imports: [/* UI components */],
  templateUrl: './exercise-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly exerciseService = inject(ExerciseLogicService);
  private readonly snackBar = inject(MatSnackBar);

  exercise: Exercise | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadExercise(id);
    }
  }

  private loadExercise(id: string): void {
    this.exerciseService.getExerciseById(id).subscribe({
      next: (exercise) => {
        this.exercise = exercise;
      },
      error: (err) => {
        // Error message comes from logic service
        this.snackBar.open(err.message, 'Close');
      }
    });
  }

  onUpdate(exerciseData: ExerciseCreate): void {
    if (this.exercise) {
      this.exerciseService.updateExercise(this.exercise.id, exerciseData).subscribe({
        next: (updated) => {
          this.exercise = updated;
          this.snackBar.open('Exercise updated successfully!', 'Close');
        },
        error: (err) => {
          this.snackBar.open(err.message, 'Close');
        }
      });
    }
  }
}
```

#### **Key Characteristics:**
- Orchestrates UI components and services
- Manages local component state
- Handles user workflows
- Simple error display (messages from logic layer)
- No HTTP status code knowledge

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

### **Separation of Concerns**
- **Provider**: "How to get data" (HTTP mechanics)
- **Logic**: "What to do with data" (business rules, error handling)
- **UI**: "How to display data" (presentation)
- **View**: "How to coordinate" (orchestration)

### **Error Handling Strategy**
1. **Provider Layer**: No error handling - let errors propagate
2. **Logic Layer**: Catch all errors, transform to user-friendly messages
3. **View Layer**: Display `err.message` from logic layer
4. **Result**: Consistent error messages, no HTTP knowledge in components

### **Dependency Rules**
- Views → Logic Services ✅
- Views → UI Components ✅
- Logic Services → Provider Services ✅
- UI Components → Nothing (except Router) ✅
- Views → Provider Services ❌ (skip logic layer)
- UI Components → Services ❌ (stay presentational)

### **State Management**
- **Provider**: Stateless (no BehaviorSubject)
- **Logic**: Event emission via Subject for cross-component communication
- **View**: Local state with BehaviorSubject + switchMap for refresh patterns
- **UI**: Stateless, data via inputs

---

## 📋 Checklist for New Libraries

When creating a new feature library, ensure:

- [ ] **Provider Service** created with:
  - [ ] Domain model interfaces
  - [ ] CRUD methods returning Observables
  - [ ] No error handling
  - [ ] Stateless implementation

- [ ] **Logic Service** created with:
  - [ ] All provider methods wrapped
  - [ ] `catchError` on every method
  - [ ] User-friendly error messages
  - [ ] Logging with `tap` operator
  - [ ] Event Subjects for communication

- [ ] **UI Components** created with:
  - [ ] `input()` for data
  - [ ] `output()` for events
  - [ ] `OnPush` change detection
  - [ ] No service injections (except Router)

- [ ] **View Components** created with:
  - [ ] Logic service injection (not provider)
  - [ ] Dialog/notification handling
  - [ ] Simple error display (`err.message`)
  - [ ] Refresh mechanisms where needed

- [ ] **Styling** implemented with:
  - [ ] Separate `.scss` files (no inline styles)
  - [ ] Theme variables for all colors
  - [ ] No hardcoded colors
  - [ ] Tested in both light and dark modes

---

## 🎨 Styling & Theme System

### Theme Variables

All components **must** use CSS custom properties for theming to support light and dark modes.

**Required Variables:**

```scss
// Backgrounds
--fitness-bg-page      // Page background
--fitness-bg-card      // Card backgrounds
--fitness-bg-chip      // Chips, badges, tags

// Text
--fitness-text-primary    // Main text
--fitness-text-secondary  // Secondary text, labels
--fitness-text-tertiary   // Muted text, placeholders

// Borders & Shadows
--fitness-border          // Standard borders
--fitness-shadow          // Subtle shadows

// Brand
--fitness-primary         // Primary green (consistent)
```

### Styling Rules for Library Components

**✅ DO:**
```scss
.component {
  background-color: var(--fitness-bg-card);
  color: var(--fitness-text-primary);
  border: 1px solid var(--fitness-border);
}
```

**❌ DON'T:**
```scss
.component {
  background-color: #FFFFFF;  // Hardcoded - breaks dark mode
  color: #111813;             // Hardcoded - breaks dark mode
}
```

### Component Styling Checklist

When creating UI or View components:

1. **Use separate `.scss` files** - Never inline styles
2. **Use theme variables** - No hardcoded colors
3. **Test both themes** - Verify appearance in light and dark modes
4. **Add transitions** - `transition: all 0.2s ease` for interactive elements
5. **Responsive design** - Use `@media (max-width: 768px)` for mobile

### Example Component SCSS

```scss
:host {
  display: block;
}

.my-card {
  background-color: var(--fitness-bg-card);
  border: 1px solid var(--fitness-border);
  border-radius: 12px;
  padding: 1rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.card-title {
  color: var(--fitness-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.card-subtitle {
  color: var(--fitness-text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .my-card {
    padding: 0.75rem;
  }
}
```

---

## 🚀 Benefits of This Architecture

1. **Maintainability**: Clear separation makes code easy to find and modify
2. **Testability**: Each layer can be tested independently
3. **Reusability**: UI components work anywhere, logic is centralized
4. **Consistency**: Error handling and patterns are uniform
5. **Scalability**: Easy to add new features following the same structure
6. **Developer Experience**: Clear guidelines reduce decision fatigue

---


The architecture is **repeatable and predictable** across all feature libraries.

---

**Last Updated:** November 2025  
**Reference Implementation:** `exercises-lib`
