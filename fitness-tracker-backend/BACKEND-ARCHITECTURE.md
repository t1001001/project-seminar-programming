# Backend Architecture & Structure

This document outlines the architecture and structure of the `fitness-tracker-backend` application.

## 📁 Directory Structure

The project follows a **feature-based package structure**, grouping related classes (Controller, Service, Repository, Model, DTO) by domain entity.

```
src/main/java/hs/aalen/fitness_tracker_backend/
├── config/                  # Configuration classes (e.g., CORS, Swagger)
├── plans/                   # Training Plans feature
│   ├── controller/          # REST Controllers
│   ├── dto/                 # Data Transfer Objects
│   ├── model/               # JPA Entities
│   ├── repository/          # JPA Repositories
│   └── service/             # Business Logic
├── sessions/                # Training Sessions feature
├── exercises/               # Exercises feature
├── exerciseexecutions/      # Exercise Executions (Sets/Reps) feature
├── sessionlogs/             # Session Logs (History) feature
└── executionlogs/           # Execution Logs (Set History) feature
```

## 🏗️ Architecture Layers

The application uses a standard Spring Boot layered architecture:

1.  **Controller Layer** (`controller`): Handles HTTP requests, validates input, and maps DTOs.
2.  **Service Layer** (`service`): Contains business logic and transaction management.
3.  **Repository Layer** (`repository`): Handles data access using Spring Data JPA.
4.  **Model Layer** (`model`): Defines the persistent data entities.

## 💾 Data Models & Database Design

### Entity Relationships

- **Plans** (1) ↔ (N) **Sessions**
- **Sessions** (1) ↔ (N) **ExerciseExecutions**
- **ExerciseExecutions** (N) ↔ (1) **Exercises**
- **SessionLogs** (1) ↔ (N) **ExecutionLogs**

**Note:** SessionLogs does NOT have a foreign key relationship to Sessions. It stores the `originalSessionId` as a simple UUID field (not a JPA relationship) to allow logs to persist even if the original Session is deleted.

### Key Design Decisions

#### ID Types
- **UUID**: Used for primary keys of all main entities (`Plans`, `Sessions`, `Exercises`, etc.) to ensure global uniqueness.
- **Integer**: Used for reference IDs in Log entities (`SessionLogs.sessionID`, `ExecutionLogs.exerciseExecutionId`).
    - *Rationale*: These are display counters (e.g., "Session #3"), not foreign keys.

#### Denormalization in Logs (CRITICAL)
The `SessionLogs` and `ExecutionLogs` entities are **static copies/snapshots** of the state at execution time:

1. **SessionLogs copies from Session:**
   - `sessionName` (copied from Session.name)
   - `sessionPlanName` (copied from Plan.name)
   - `sessionPlan` (copied from Plan.description)
   - `originalSessionId` (stored as UUID, NOT a foreign key)

2. **ExecutionLogs copies from ExerciseExecution + Exercise:**
   - `exerciseExecutionId` (orderID), `plannedSets`, `plannedReps`, `plannedWeight`
   - `exerciseId`, `exerciseName`, `exerciseCategory`, `exerciseMuscleGroup`, `exerciseDescription`

**Purpose:** Logs persist as permanent historical records even if the original Session, Plan, or Exercise templates are modified or deleted.

### Entity Definitions

#### `Plans`
Represents a training plan (e.g., "Push/Pull/Legs").
- `id`: UUID
- `name`: String (Unique)
- `description`: String
- `sessions`: List<Sessions>

#### `Sessions`
Represents a single workout session within a plan.
- `id`: UUID
- `plan`: Plans
- `name`: String
- `scheduledDate`: LocalDate
- `status`: Enum (PLANNED, COMPLETED)

#### `Exercises`
Represents a specific exercise definition (Template). This acts as a catalog of available exercises.
- `id`: UUID
- `name`: String (Unique)
- `muscleGroups`: List<String>
- `category`: Enum (BodyWeight, FreeWeight, Equipment, Unspecified)

#### `ExerciseExecutions`
Represents the planned sets/reps for an exercise in a session. This entity links a `Session` to an `Exercise` template, defining the specific parameters for that workout.
- `id`: UUID
- `session`: Sessions
- `exercise`: Exercises
- `plannedSets`, `plannedReps`, `plannedWeight`: Integer

#### `SessionLogs`
Records the actual performance of a session. This is a **static copy** that persists independently.
- `id`: UUID
- `sessionID`: Integer (display counter, e.g., "Session #3")
- `sessionName`: String (copied from Session)
- `sessionPlanName`: String (copied from Plan)
- `sessionPlan`: String (copied from Plan description)
- `originalSessionId`: UUID (for reference only, NOT a foreign key)
- `startedAt`, `completedAt`: LocalDateTime
- `status`: Enum (InProgress, Completed, Cancelled)
- `notes`: String
- `executionLogs`: List<ExecutionLogs>

#### `ExecutionLogs`
Records the actual performance of an exercise execution. This is a **static copy** of ExerciseExecution + Exercise data.
- `id`: UUID
- Copied from ExerciseExecution:
  - `exerciseExecutionId`: Integer (orderID)
  - `exerciseExecutionPlannedSets`, `exerciseExecutionPlannedReps`, `exerciseExecutionPlannedWeight`: Integer
- Copied from Exercise:
  - `exerciseId`: UUID
  - `exerciseName`: String
  - `exerciseCategory`: Enum
  - `exerciseMuscleGroup`: List<String>
  - `exerciseDescription`: String
- Actual execution data:
  - `actualSets`, `actualReps`, `actualWeight`: Integer
  - `completed`: Boolean
  - `notes`: String
