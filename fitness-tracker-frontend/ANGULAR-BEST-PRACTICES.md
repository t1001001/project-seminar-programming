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
├── component-name.component.ts       # Component logic
├── component-name.component.html     # Template
├── component-name.component.scss     # Styles
└── component-name.component.spec.ts  # Tests
```

### Component Template (.ts)

```typescript
import { ChangeDetectionStrategy, Component, inject, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-component-name',
  imports: [CommonModule],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.scss',
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

---

## File Organization

### Project Structure

```
src/
├── app/
│   ├── core/                    # Singleton services, guards, interceptors
│   │   ├── services/
│   │   ├── guards/
│   │   └── interceptors/
│   ├── shared/                  # Shared components, directives, pipes
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/
│   ├── features/                # Feature modules (lazy loaded)
│   │   ├── feature-name/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── feature-name.routes.ts
│   └── app.routes.ts
└── assets/
```

### Library Structure (for Angular libraries)

```
projects/
├── library-name/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── domain/          # Models, interfaces
│   │   │   ├── services/        # Business logic
│   │   │   │   ├── business/
│   │   │   │   └── providers/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   │   └── component-name/
│   │   │   │       ├── component-name.component.ts
│   │   │   │       ├── component-name.component.html
│   │   │   │       ├── component-name.component.scss
│   │   │   │       └── component-name.component.spec.ts
│   │   │   └── views/           # Page-level components
│   │   │       └── view-name/
│   │   │           ├── view-name.component.ts
│   │   │           ├── view-name.component.html
│   │   │           ├── view-name.component.scss
│   │   │           └── view-name.component.spec.ts
│   │   └── public-api.ts
```

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

---

## Additional Resources

- [Angular Official Documentation](https://angular.dev)
- [Angular Style Guide](https://angular.dev/style-guide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
