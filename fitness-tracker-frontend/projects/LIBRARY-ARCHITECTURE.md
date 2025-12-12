# Angular Library Architecture Guide

This document defines the standard architecture pattern for Angular feature libraries in this project. All new libraries **must** follow these patterns to ensure consistency, maintainability, and scalability.

> **Reference Implementations:** See `exercises-lib`, `sessions-lib`, and `plans-lib` for working examples.

---

## 📁 Directory Structure

Every feature library follows this structure:

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

### Barrel File Template (`[feature]-lib.ts`)

```typescript
// Services
export * from './logic-services/[entity]-logic.service';
export * from './provider-services/[entity]-provider.service';

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
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, tap, catchError, throwError } from 'rxjs';
import { [Entity], [Entity]Create, [Entity]ProviderService } from '../provider-services/[entity]-provider.service';

@Injectable({ providedIn: 'root' })
export class [Entity]LogicService {
  private readonly provider = inject([Entity]ProviderService);
  
  // Event emission for cross-component communication
  private readonly createdSubject = new Subject<[Entity]>();
  readonly created$ = this.createdSubject.asObservable();

  create(entity: [Entity]Create): Observable<[Entity]> {
    return this.provider.create(entity).pipe(
      tap((created) => this.createdSubject.next(created)),
      catchError((err) => this.handleError(err, 'create'))
    );
  }

  getAll(): Observable<[Entity][]> {
    return this.provider.getAll().pipe(
      catchError((err) => this.handleError(err, 'load'))
    );
  }

  getById(id: string): Observable<[Entity]> {
    return this.provider.getById(id).pipe(
      catchError((err) => this.handleError(err, 'load'))
    );
  }

  update(id: string, entity: [Entity]Update): Observable<[Entity]> {
    return this.provider.update(id, entity).pipe(
      catchError((err) => this.handleError(err, 'update'))
    );
  }

  delete(id: string): Observable<void> {
    return this.provider.delete(id).pipe(
      catchError((err) => this.handleError(err, 'delete'))
    );
  }

  private handleError(err: any, operation: string): Observable<never> {
    let message = `Failed to ${operation} [entity]`;
    
    if (err.status === 404) {
      message = '[Entity] not found. It may have been deleted.';
    } else if (err.status === 409) {
      message = err.error || '[Entity] with this name already exists.';
    } else if (err.status === 400) {
      message = 'Invalid data. Please check all required fields.';
    } else if (err.status === 0) {
      message = 'Cannot connect to server. Please check your connection.';
    }
    
    return throwError(() => new Error(message));
  }
}
```

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
| **Simple UI** (cards, chips) | `Router` only |
| **Form Dialogs** (create) | `MatDialogRef`, `FormBuilder`, `MAT_DIALOG_DATA` |
| **Confirmation Dialogs** | `MatDialogRef`, `MAT_DIALOG_DATA` |
| **Edit Dialogs** (complex) | Logic services, `MatDialogRef`, `FormBuilder`, `MatSnackBar`, `MAT_DIALOG_DATA` |

#### Template: Card Component

```typescript
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-[entity]-card',
  imports: [/* Material modules */],
  templateUrl: './[entity]-card.html',
  styleUrl: './[entity]-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class [Entity]CardComponent {
  private readonly router = inject(Router);
  
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
| Manage component state | Contain complex business logic |
| Coordinate UI components | |
| Handle routing and navigation | |
| Display notifications (snackbars) | |
| Open dialogs and modals | |

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
| Views → Logic Services ✅ | Views → Provider Services ❌ |
| Views → UI Components ✅ | UI Components → Provider Services ❌ |
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
- [ ] `catchError` on every method
- [ ] User-friendly error messages
- [ ] Event `Subject` for cross-component communication

### UI Components
- [ ] Directory: `ui/[component-name]/`
- [ ] `input()` for data, `output()` for events
- [ ] `ChangeDetectionStrategy.OnPush`
- [ ] Service injections follow rules (see table above)

### View Components
- [ ] Directory: `views/[view-name]/`
- [ ] Inject logic service (not provider)
- [ ] Dialog/notification handling
- [ ] Refresh mechanism (`BehaviorSubject` or signals)

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
4. **Consistency**: Error handling and patterns are uniform
5. **Scalability**: Easy to add new features following the same structure
6. **Developer Experience**: Clear guidelines reduce decision fatigue

---

The architecture is **repeatable and predictable** across all feature libraries.

---

**Last Updated:** December 2025  
**Reference Implementations:** `exercises-lib`, `sessions-lib`, `plans-lib`
