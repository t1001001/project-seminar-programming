# Angular Best Practices Guide

This document outlines the best practices and coding standards for Angular development in this project.

## Table of Contents

- [TypeScript Best Practices](#typescript-best-practices)
- [Angular Best Practices](#angular-best-practices)
- [Component Structure](#component-structure)
- [Components](#components)
- [State Management](#state-management)
- [Templates](#templates)
- [Services](#services)
- [File Organization](#file-organization)

---

## TypeScript Best Practices

### Type Safety
- **Use strict type checking** - Enable strict mode in `tsconfig.json`
- **Prefer type inference** when the type is obvious
- **Avoid the `any` type** - Use `unknown` when type is uncertain
- Use interfaces for object shapes and types for unions/intersections

```typescript
// ✅ Good
const name: string = 'John'; // Type is obvious, inference works
const data: unknown = fetchData(); // Type uncertain, use unknown

// ❌ Bad
const data: any = fetchData(); // Avoid any
```

---

## Angular Best Practices

### Core Principles
- **Always use standalone components** over NgModules
- **Do NOT set `standalone: true`** inside Angular decorators (it's the default)
- **Use signals for state management** instead of RxJS BehaviorSubjects where appropriate
- **Implement lazy loading** for feature routes
- **Do NOT use `@HostBinding` and `@HostListener` decorators** - Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- **Use `NgOptimizedImage`** for all static images (Note: does not work for inline base64 images)

```typescript
// ✅ Good - Host bindings in decorator
@Component({
  selector: 'app-example',
  host: {
    '(click)': 'onClick()',
    '[class.active]': 'isActive()',
  },
})

// ❌ Bad - Using decorators
@Component({
  selector: 'app-example',
})
export class ExampleComponent {
  @HostListener('click')
  onClick() {}
  
  @HostBinding('class.active')
  isActive = true;
}
```

---

## Component Structure

### File Organization

Every component **MUST** have four separate files:

```
component-name/
├── component-name.ts       # Component logic
├── component-name.html     # Template
├── component-name.scss     # Styles
└── component-name.spec.ts  # Tests
```

### Component Template (.ts)

```typescript
import { ChangeDetectionStrategy, Component, inject, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-component-name',
  imports: [CommonModule],
  templateUrl: './component-name.html',
  styleUrl: './component-name.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentNameComponent {
  // Inject services using inject() function
  private readonly service = inject(SomeService);
  
  // Use input() for component inputs
  data = input.required<DataType>();
  optionalData = input<string>('default value');
  
  // Use output() for component outputs
  itemSelected = output<string>();
  
  // Use signals for local state
  private count = signal(0);
  
  // Use computed() for derived state
  doubleCount = computed(() => this.count() * 2);
  
  // Methods
  onAction(): void {
    this.count.update(c => c + 1);
    this.itemSelected.emit('value');
  }
}
```

### Template (.html)

**Keep templates simple and avoid complex logic. Use dynamic data binding instead of hardcoded values.**

```html
<!-- ✅ Good - Dynamic data binding -->
<mat-card>
  <mat-card-header>
    <mat-card-title>{{ data().name }}</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <p><strong>Category:</strong> {{ data().category }}</p>
    <p><strong>Description:</strong> {{ data().description }}</p>
    
    @if (data().items.length) {
      <div class="items-list">
        @for (item of data().items; track item.id) {
          <span class="item-chip">{{ item.name }}</span>
        }
      </div>
    }
  </mat-card-content>
</mat-card>

<!-- ❌ Bad - Hardcoded values -->
<mat-card>
  <mat-card-title>Exercise Name</mat-card-title>
  <p>Category: Strength</p>
</mat-card>
```

### Styles (.scss)

```scss
// Component-specific styles
.component-name {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

// Use CSS variables for theming
.primary-button {
  background-color: var(--primary-color);
  color: var(--text-color);
}

// Responsive design
@media (max-width: 768px) {
  .component-name {
    padding: 0.5rem;
  }
}
```

### Tests (.spec.ts)

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentNameComponent } from './component-name.component';

describe('ComponentNameComponent', () => {
  let component: ComponentNameComponent;
  let fixture: ComponentFixture<ComponentNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

---

## Components

### Component Guidelines

- **Keep components small** and focused on a single responsibility
- **Use `input()` and `output()` functions** instead of `@Input()` and `@Output()` decorators
- **Use `computed()` for derived state** instead of getters
- **Set `changeDetection: ChangeDetectionStrategy.OnPush`** in `@Component` decorator
- **Prefer external templates** (`.html` files) for better maintainability
- **Prefer Reactive forms** instead of Template-driven ones
- **Do NOT use `ngClass`** - Use `class` bindings instead
- **Do NOT use `ngStyle`** - Use `style` bindings instead

```typescript
// ✅ Good - Using signals and computed
export class UserCardComponent {
  user = input.required<User>();
  fullName = computed(() => `${this.user().firstName} ${this.user().lastName}`);
}

// ❌ Bad - Using getters
export class UserCardComponent {
  @Input() user!: User;
  
  get fullName(): string {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
}
```

### Class and Style Bindings

```html
<!-- ✅ Good - Direct bindings -->
<div 
  [class.active]="isActive()"
  [class.disabled]="isDisabled()"
  [style.color]="textColor()"
  [style.font-size.px]="fontSize()"
>
  Content
</div>

<!-- ❌ Bad - Using ngClass and ngStyle -->
<div 
  [ngClass]="{ active: isActive(), disabled: isDisabled() }"
  [ngStyle]="{ color: textColor(), 'font-size': fontSize() + 'px' }"
>
  Content
</div>
```

---

## State Management

### Signal-Based State

- **Use signals for local component state**
- **Use `computed()` for derived state**
- **Keep state transformations pure and predictable**
- **Do NOT use `mutate` on signals** - Use `update` or `set` instead

```typescript
export class CounterComponent {
  // Local state with signals
  private count = signal(0);
  private multiplier = signal(2);
  
  // Derived state with computed
  result = computed(() => this.count() * this.multiplier());
  isEven = computed(() => this.count() % 2 === 0);
  
  // ✅ Good - Using update
  increment(): void {
    this.count.update(c => c + 1);
  }
  
  // ✅ Good - Using set
  reset(): void {
    this.count.set(0);
  }
  
  // ❌ Bad - Using mutate (avoid)
  // mutateCount(): void {
  //   this.count.mutate(c => c++);
  // }
}
```

---

## Templates

### Template Best Practices

- **Keep templates simple** and avoid complex logic
- **Use native control flow** (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- **Use the async pipe** to handle observables
- **Use track expressions** in `@for` loops for performance

```html
<!-- ✅ Good - Native control flow -->
@if (user(); as currentUser) {
  <div class="user-info">
    <h2>{{ currentUser.name }}</h2>
    
    @if (currentUser.isAdmin) {
      <span class="badge">Admin</span>
    } @else {
      <span class="badge">User</span>
    }
  </div>
}

@for (item of items(); track item.id) {
  <div class="item">{{ item.name }}</div>
} @empty {
  <p>No items available</p>
}

<!-- ❌ Bad - Old structural directives -->
<div *ngIf="user$ | async as currentUser" class="user-info">
  <h2>{{ currentUser.name }}</h2>
  <span *ngIf="currentUser.isAdmin; else userBadge" class="badge">Admin</span>
  <ng-template #userBadge>
    <span class="badge">User</span>
  </ng-template>
</div>

<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>
```

### Async Pipe Usage

```html
<!-- ✅ Good - Using async pipe -->
@if (data$ | async; as data) {
  <div>{{ data.value }}</div>
}

<!-- ❌ Bad - Manual subscription -->
<div>{{ data.value }}</div>
```

---

## Services

### Service Guidelines

- **Design services around a single responsibility**
- **Use `providedIn: 'root'`** for singleton services
- **Use the `inject()` function** instead of constructor injection

```typescript
// ✅ Good - Using inject() function
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);
  
  getData(): Observable<Data[]> {
    return this.http.get<Data[]>(this.config.apiUrl);
  }
}

// ❌ Bad - Constructor injection
@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}
  
  getData(): Observable<Data[]> {
    return this.http.get<Data[]>(this.config.apiUrl);
  }
}
```

### Service Layer Architecture

For libraries, use a two-tier service architecture:

1. **Provider Services** - Handle HTTP communication with backend APIs
2. **Logic Services** - Handle business logic, error handling, and side effects

```typescript
// provider-services/exercise-provider.service.ts
// ✅ Define models in provider service (co-located)
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

  // Stateless HTTP pass-through - no error handling
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

// logic-services/exercise-logic.service.ts
// ✅ Import model and service from provider
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
    return this.exerciseProviderService.getAllExercises().pipe(
      tap((exercises: Exercise[]) => {
        console.log(exercises); // Logging side effect
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
```

**Benefits:**
- Clear separation of concerns
- Provider handles HTTP communication (stateless)
- Logic handles error transformation and business rules
- Centralized error handling with user-friendly messages
- Models co-located with the data they represent
- Easy to test and maintain
- Components receive simple `err.message` strings

---

## File Organization

### Application Structure

For the main Angular application, use a simple, flat structure:

```
src/
├── app/
│   ├── services/                # App-level services (e.g., theme, auth)
│   │   └── service-name.service.ts
│   ├── components/              # App-level components (e.g., theme-toggle)
│   │   └── component-name/
│   │       ├── component-name.ts
│   │       ├── component-name.html
│   │       └── component-name.scss
│   ├── pages/                   # Page components (route targets)
│   │   └── feature-name/
│   │       ├── page-name/
│   │       │   ├── page-name.ts
│   │       │   ├── page-name.html
│   │       │   ├── page-name.scss
│   │       │   └── page-name.spec.ts
│   ├── app.ts                   # Root component
│   ├── app.html                 # Root template
│   ├── app.scss                 # Root styles
│   ├── app.routes.ts            # Route configuration
│   └── app.config.ts            # App configuration
├── assets/                      # Static assets
└── main.ts                      # Bootstrap file
```

**Key Principles:**
- **services/**: App-level services used across the entire application (e.g., ThemeService, AuthService)
- **components/**: App-level UI components used in the app shell (e.g., ThemeToggleComponent, HeaderComponent)
- **pages/**: Contains page-level components that are route targets
- **Flat structure**: Pages import components from libraries (e.g., `exercises-lib`)
- **Thin pages**: Page components are simple wrappers that compose library components
- **No business logic in app**: All logic lives in libraries

**Example Page Component:**
```typescript
// pages/exercises/exercises-overview/exercises-overview.ts
import { Component } from '@angular/core';
import { ExercisesOverviewComponent } from 'exercises-lib';

@Component({
  selector: 'app-exercises-overview',
  imports: [ExercisesOverviewComponent],
  template: `<ex-exercises-overview />`,
  styleUrl: './exercises-overview.scss',
})
export class ExercisesOverview {}
```

**Example Routes:**
```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { ExercisesOverview } from './pages/exercises/exercises-overview/exercises-overview';
import { ExercisesDetails } from './pages/exercises/exercises-details/exercises-details';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/exercises',
    pathMatch: 'full',
  },
  {
    path: 'exercises',
    component: ExercisesOverview,
  },
  {
    path: 'exercises/:id',
    component: ExercisesDetails,
  },
];
```

---

### Library Structure (for Angular libraries)

```
projects/
├── library-name/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── logic-services/      # Business logic services
│   │   │   │   ├── service-name.service.ts
│   │   │   │   └── service-name.service.spec.ts
│   │   │   ├── provider-services/   # Data providers (models defined here)
│   │   │   │   ├── provider-name.service.ts
│   │   │   │   └── provider-name.service.spec.ts
│   │   │   ├── ui/                  # Reusable UI components
│   │   │   │   └── component-name/
│   │   │   │       ├── component-name.ts
│   │   │   │       ├── component-name.html
│   │   │   │       ├── component-name.scss
│   │   │   │       └── component-name.spec.ts
│   │   │   ├── views/               # Page-level components
│   │   │   │   └── view-name/
│   │   │   │       ├── view-name.ts
│   │   │   │       ├── view-name.html
│   │   │   │       ├── view-name.scss
│   │   │   │       └── view-name.spec.ts
│   │   │   └── library-name.ts      # Barrel export file
│   │   └── public-api.ts            # Public API (exports from library-name.ts)
```

**Key Principles:**
- **logic-services/**: Contains business logic that orchestrates data operations
- **provider-services/**: Contains data providers and model interfaces (co-located)
- **ui/**: Reusable, presentation-focused components (cards, dialogs, forms)
- **views/**: Page-level components that compose UI components
- **Barrel exports**: Use a central `library-name.ts` file to re-export all public APIs
- **No separate models folder**: Define interfaces in the service files where they're used

### Barrel Export Pattern

Use a barrel file to centralize all library exports:

```typescript
// lib/library-name.ts
// Services
export * from './logic-services/exercise-logic.service';
export * from './provider-services/exercise-provider.service';

// UI Components
export * from './ui/component-name/component-name';

// View Components
export * from './views/view-name/view-name';
```

```typescript
// public-api.ts
/*
 * Public API Surface of library-name
 */

export * from './lib/library-name';
```

This approach:
- Centralizes all exports in one place
- Makes it easier to manage what's public vs internal
- Simplifies the public API surface
- Matches Angular CLI conventions

---

## Theme System & Styling

### Using Theme Variables

The application supports **light and dark modes**. All components must use CSS custom properties for theming.

**✅ ALWAYS use theme variables:**
```scss
.my-component {
  background-color: var(--fitness-bg-card);
  color: var(--fitness-text-primary);
  border: 1px solid var(--fitness-border);
  box-shadow: 0 2px 8px var(--fitness-shadow);
}
```

**❌ NEVER use hardcoded colors:**
```scss
.my-component {
  background-color: #FFFFFF;  // Won't adapt to dark mode
  color: #111813;             // Won't adapt to dark mode
  border: 1px solid rgba(0, 0, 0, 0.1);  // Won't adapt to dark mode
}
```

### Available Theme Variables

**Backgrounds:**
- `--fitness-bg-page` - Page background
- `--fitness-bg-card` - Card backgrounds
- `--fitness-bg-chip` - Chips, badges, tags
- `--fitness-bg-input` - Input field backgrounds

**Text:**
- `--fitness-text-primary` - Main text
- `--fitness-text-secondary` - Secondary text, labels
- `--fitness-text-tertiary` - Muted text, placeholders

**Borders & Shadows:**
- `--fitness-border` - Standard borders
- `--fitness-border-strong` - Emphasized borders
- `--fitness-shadow` - Subtle shadows
- `--fitness-shadow-strong` - Emphasized shadows

**Brand:**
- `--fitness-primary` - Primary green (consistent across themes)
- `--fitness-primary-hover` - Hover state

### Theme Service

To programmatically control themes:

```typescript
import { ThemeService } from './services/theme.service';

export class MyComponent {
  private readonly themeService = inject(ThemeService);
  
  toggleTheme() {
    this.themeService.toggleTheme();
  }
  
  getCurrentTheme() {
    return this.themeService.currentTheme(); // 'light' | 'dark'
  }
}
```

### Styling Best Practices

1. **Component Styles:**
   - Use separate `.scss` files (never inline styles)
   - Use theme variables for all colors
   - Avoid `!important` unless absolutely necessary
   - Use BEM or similar naming convention

2. **Responsive Design:**
   - Use media queries for responsive behavior
   - Standard breakpoint: `@media (max-width: 768px)`
   - Test both light and dark modes at all breakpoints

3. **Transitions:**
   - Theme changes have 0.3s transitions on `background-color` and `color`
   - Add transitions to interactive elements: `transition: all 0.2s ease`

---

## Summary Checklist

When creating a new component, ensure:

- ✅ Four separate files: `.ts`, `.html`, `.scss`, `.spec.ts`
- ✅ Using `templateUrl` and `styleUrl` (not inline)
- ✅ Using `input()` and `output()` functions
- ✅ Using signals for state management
- ✅ Using `computed()` for derived state
- ✅ Using `inject()` for dependency injection
- ✅ Using `ChangeDetectionStrategy.OnPush`
- ✅ Using native control flow (`@if`, `@for`, `@switch`)
- ✅ Using dynamic data binding (no hardcoded values)
- ✅ Using `class` and `style` bindings (not `ngClass`/`ngStyle`)
- ✅ Keeping templates simple and logic-free
- ✅ Following single responsibility principle
- ✅ Using theme variables for all colors (no hardcoded colors)
- ✅ Testing in both light and dark modes

---

## Additional Resources

- [Angular Official Documentation](https://angular.dev)
- [Angular Style Guide](https://angular.dev/style-guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)