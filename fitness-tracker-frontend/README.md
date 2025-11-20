# Prerequisites

Before running the project, install the following dependencies:

[Node.js](https://nodejs.org/) (v18 or higher)

[Angular CLI](https://angular.dev/tools/cli) (v20.3.9 or higher)

[Docker](https://docs.docker.com/desktop/) (optional, for containerized deployment)


# Usage

## Development Server

To start the development server, run:

```bash
npm install
npm start
```

The application will be available at `http://localhost:4200/`. The app will automatically reload when you modify source files.

## Building for Production

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Running with Docker

You can bundle and serve the compiled Angular app via nginx using the provided Dockerfile.

```bash
docker build -t fitness-tracker-frontend-app .
docker run -p 4200:80 fitness-tracker-frontend-app
```

Open `http://localhost:4200` in your browser once the container is running.


# Project Structure

This Angular application is organized into feature libraries for better modularity and maintainability:

## Libraries

### exercises-lib
Manages exercise data and UI components for browsing, creating, editing, and deleting exercises.

**Key Components:**
- `ExercisesOverviewComponent` - Lists all exercises
- `ExerciseDetailComponent` - Displays individual exercise details
- `ExerciseFormDialogComponent` - Form for creating/editing exercises
- `ExerciseDeleteDialogComponent` - Confirmation dialog for deletion

**Services:**
- `ExerciseLogicService` - Business logic for exercise operations
- `ExerciseProviderService` - HTTP communication with backend API

### plans-lib
Manages training plan data and UI components for creating and organizing workout plans.

**Key Components:**
- `PlansOverviewComponent` - Lists all training plans
- `PlanDetailComponent` - Displays individual plan details
- `PlanFormDialogComponent` - Form for creating/editing plans
- `PlanDeleteDialogComponent` - Confirmation dialog for deletion
- `PlanCardComponent` - Card display for plan summaries

**Services:**
- `PlanLogicService` - Business logic for plan operations
- `PlanProviderService` - HTTP communication with backend API

### sessions-lib
Manages workout session data (planned for future implementation).

### home-lib
Contains the home page and landing components.


# Testing

## Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner:

```bash
npm test
```

## End-to-End Tests

For end-to-end (e2e) testing:

```bash
ng e2e
```

Note: Angular CLI does not include an e2e testing framework by default. You can choose one that suits your needs.


# Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`):

```bash
ng generate --help
```


# Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

For project-specific architecture and library organization, see [LIBRARY-ARCHITECTURE.md](projects/LIBRARY-ARCHITECTURE.md).

For UI styling guidelines and component patterns, see [UI-STYLE-GUIDE.md](UI-STYLE-GUIDE.md).
