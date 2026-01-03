# Fitness Tracker Frontend

An Angular 20 application for managing workout plans, sessions, exercises, and tracking workouts. Built with a modular library architecture and Angular Material.

## Tech Stack

- **Angular 20.3.12** with standalone components
- **Angular Material 20.2.13** for UI components
- **Angular CDK** for accessibility and utilities
- **RxJS 7.8** for reactive programming
- **GSAP 3.13** for animations
- **TypeScript 5.9**
- **Karma/Jasmine** for unit testing

## Prerequisites

Before running the project, install the following:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Angular CLI](https://angular.dev/tools/cli) (v20.3.9 or higher)
- [Docker](https://docs.docker.com/desktop/) (optional, for containerized deployment)

## Usage

### Development Server

```bash
npm install
npm start
```

The application will be available at `http://localhost:4200/`.

### Building for Production

```bash
npm run build
```

Build artifacts are stored in the `dist/` directory.

### Running with Docker

```bash
docker build -t fitness-tracker-frontend-app .
docker run -p 4200:80 fitness-tracker-frontend-app
```

---

## Application Routes

| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/login` | LoginComponent | ❌ |
| `/home` | HomeLanding | ❌ |
| `/exercises` | ExercisesOverview | ❌ |
| `/exercises/:id` | ExercisesDetails | ❌ |
| `/plans` | PlansOverview | ❌ |
| `/plans/:id` | PlansDetails | ❌ |
| `/sessions` | SessionsOverview | ❌ |
| `/sessions/:id` | SessionsDetails | ❌ |
| `/workouts` | WorkoutsOverview | ✅ |
| `/workouts/:id` | WorkoutsDetails | ✅ |

---

## Project Structure

```
fitness-tracker-frontend/
├── src/
│   └── app/
│       ├── pages/            # Route components
│       │   ├── exercises/
│       │   ├── plans/
│       │   ├── sessions/
│       │   ├── workouts/
│       │   ├── home/
│       │   └── login/
│       ├── services/         # App-level services
│       ├── app.routes.ts     # Route configuration
│       └── app.ts            # Root component
├── projects/                 # Angular libraries
│   ├── common-lib/           # Shared utilities & auth
│   ├── exercises-lib/        # Exercise management
│   ├── plans-lib/            # Training plans
│   ├── sessions-lib/         # Workout sessions
│   ├── workouts-lib/         # Workout tracking
│   └── home-lib/             # Landing page
└── public/                   # Static assets
```

---

## Libraries

The application uses a **feature-based library architecture**. Each library follows a layered pattern:

```
[feature]-lib/
└── src/lib/
    ├── provider-services/    # HTTP communication
    ├── logic-services/       # Business logic
    ├── ui/                   # Reusable UI components
    ├── views/                # Smart container components
    └── shared/               # Constants & utilities
```

### common-lib

Cross-cutting utilities shared across all feature libraries.

**Key Features:**
- **Authentication** - Signal-based auth state, HTTP interceptor, route guards
- **Snackbar Utilities** - `showError()`, `showSuccess()` helpers
- **HTTP Error Handling** - Centralized error handler with user-friendly messages

**Exports:**
- `AuthService` - Login/logout, session persistence
- `authGuard` - Route protection for authenticated routes
- `authInterceptor` - Automatic Authorization header injection

### exercises-lib

Manages the exercise catalog - browsing, creating, editing, and deleting exercises.

**Components:**
- `ExercisesOverviewComponent` - List all exercises
- `ExerciseDetailComponent` - Individual exercise details
- `ExerciseFormDialogComponent` - Create/edit dialog
- `ExerciseDeleteDialogComponent` - Delete confirmation

**Services:**
- `ExerciseLogicService` - Business logic
- `ExerciseProviderService` - HTTP communication

### plans-lib

Manages training plans and their organization.

**Components:**
- `PlansOverviewComponent` - List all plans
- `PlanDetailComponent` - Plan details with sessions
- `PlanFormDialogComponent` - Create/edit dialog
- `PlanDeleteDialogComponent` - Delete confirmation
- `PlanCardComponent` - Plan summary card

**Services:**
- `PlanLogicService` - Business logic
- `PlanProviderService` - HTTP communication

### sessions-lib

Manages workout sessions within training plans.

**Components:**
- `SessionsOverviewComponent` - List all sessions
- `SessionDetailComponent` - Session details with exercises
- `SessionFormDialogComponent` - Create/edit dialog
- `SessionDeleteDialogComponent` - Delete confirmation
- `SessionCardComponent` - Session summary card

**Services:**
- `SessionLogicService` - Business logic, exercise execution management
- `SessionProviderService` - HTTP communication

### workouts-lib

Manages active workout tracking and history (user-authenticated).

**Components:**
- `WorkoutsOverviewComponent` - List user's workout logs
- `WorkoutDetailComponent` - Active workout tracking
- `WorkoutCardComponent` - Workout summary card

**Services:**
- `WorkoutLogicService` - Workout state management, completion tracking
- `WorkoutProviderService` - HTTP communication for session logs & execution logs

**Features:**
- Start/complete workout sessions
- Track actual sets, reps, and weight
- Add notes to workouts and exercises
- View workout history

### home-lib

Landing page and home components.

**Components:**
- `HomeLandingComponent` - Welcome page

---

## Authentication

The app uses HTTP Basic Authentication with the backend API.

- **Login** - Enter credentials on `/login` page
- **Session Persistence** - Auth token stored in localStorage
- **Protected Routes** - `/workouts/**` requires authentication
- **Auto-header** - `authInterceptor` automatically adds Authorization header

---

## Testing

### Unit Tests

```bash
npm test
```

Runs tests with [Karma](https://karma-runner.github.io).

### End-to-End Tests

```bash
ng e2e
```

---

## Code Scaffolding

Generate new components:

```bash
ng generate component component-name
ng generate --help  # See all schematics
```

---

## Additional Resources

- [LIBRARY-ARCHITECTURE.md](projects/LIBRARY-ARCHITECTURE.md) - Detailed library patterns and templates
- [UI-STYLE-GUIDE.md](UI-STYLE-GUIDE.md) - UI styling guidelines
- [ANGULAR-BEST-PRACTICES.md](ANGULAR-BEST-PRACTICES.md) - Angular coding conventions
- [Angular CLI Documentation](https://angular.dev/tools/cli)
