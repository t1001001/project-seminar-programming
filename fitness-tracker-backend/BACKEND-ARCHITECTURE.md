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
- **Sessions** (1) ↔ (N) **SessionLogs**
- **SessionLogs** (1) ↔ (N) **ExecutionLogs**

### Key Design Decisions

#### ID Types
- **UUID**: Used for primary keys of all main entities (`Plans`, `Sessions`, `Exercises`, etc.) to ensure global uniqueness.
- **Integer**: Used for foreign key references in Log entities (`SessionLogs.sessionID`, `ExecutionLogs.exerciseExecutionId`).
    - *Rationale*: Logs serve as a historical snapshot. Using simple Integers allows for lightweight lookup or decoupling from the live entity lifecycle, effectively "copying" the reference ID.

#### Denormalization in Logs
The `SessionLogs` and `ExecutionLogs` entities are designed to be **snapshots** of the state at the time of execution. They duplicate certain data (like names and planned values) to preserve history even if the original Plan or Session is modified or deleted.

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
Represents a specific exercise definition.
- `id`: UUID
- `name`: String (Unique)
- `muscleGroups`: List<String>
- `category`: Enum (BodyWeight, FreeWeight, Equipment, Unspecified)

#### `ExerciseExecutions`
Represents the planned sets/reps for an exercise in a session.
- `id`: UUID
- `session`: Sessions
- `exercise`: Exercises
- `plannedSets`, `plannedReps`, `plannedWeight`: Integer

#### `SessionLogs`
Records the actual performance of a session.
- `id`: UUID
- `sessionID`: Integer (Reference to Session)
- `startedAt`, `completedAt`: LocalDateTime
- `status`: Enum (IN_PROGRESS, COMPLETED)

#### `ExecutionLogs`
Records the actual performance of an exercise execution.
- `id`: UUID
- `exerciseExecutionId`: Integer (Reference to ExerciseExecution)
- `actualSets`, `actualReps`, `actualWeight`: Integer
- `completed`: Boolean
