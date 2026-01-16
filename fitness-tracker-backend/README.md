# Fitness Tracker Backend

A Spring Boot REST API for managing workout plans, sessions, and exercise tracking with user-specific workout logging.

## Tech Stack

- **Java 21** with **Spring Boot 3.5.6**
- **Spring Data JPA** with **H2** in-memory database
- **Spring Security** with HTTP Basic Authentication
- **Lombok** for boilerplate reduction
- **ModelMapper** for DTO conversions
- **JaCoCo** for code coverage (80% line, 70% branch minimum)

## Prerequisites

Before running the project, install the following dependencies:

- [Docker](https://docs.docker.com/desktop/)

## Usage

Build and run the Docker container:

```bash
docker build -t fitness-tracker-backend-app .
docker run -p 8080:8080 fitness-tracker-backend-app
```

The API will be available at `http://localhost:8080`.

## Running Tests

```bash
mvn clean test
mvn jacoco:report
```

Coverage reports are generated in `target/site/jacoco/`.

---

## Authentication & Security

The API uses **HTTP Basic Authentication** with a hybrid public/private access model:

### Public Endpoints (No Authentication Required)
- `GET /api/v1/exercises/**` - Browse exercise catalog
- `GET /api/v1/plans/**` - View training plans
- `GET /api/v1/sessions/**` - View session templates
- `GET /api/v1/exercise-executions/**` - View exercise execution templates

### Protected Endpoints (Authentication Required)
- All write operations (POST, PUT, DELETE)
- `/api/v1/session-logs/**` - User-specific workout logs
- `/api/v1/execution-logs/**` - User-specific exercise logs
- `/api/v1/val` - User validation

**Authentication Header:**
```
Authorization: Basic <base64(username:password)>
```

---

# API Endpoints

## Exercises Endpoint

Base path: `/api/v1/exercises`

### Get all exercises
**Method:** `GET`

**Path:** `api/v1/exercises`

**Request example:**
```
GET api/v1/exercises
```

**Response example:**
```json
[
    {
        "id": "38cb6d7c-9e29-4352-873d-bdf1825b0aad",
        "name": "Deadlift",
        "category": "Barbell",
        "muscleGroups": [
            "Back",
            "Hamstrings",
            "Glutes"
        ],
        "description": "Lifting a loaded barbell from the ground to hip level"
    }
]
```

### Get an exercise by ID
**Method:** `GET`

**Path:** `api/v1/exercises/{id}`

**Request example:**
```
GET api/v1/exercises/38cb6d7c-9e29-4352-873d-bdf1825b0aad
```

**Response example:**
```json
{
    "id": "38cb6d7c-9e29-4352-873d-bdf1825b0aad",
    "name": "Deadlift",
    "category": "Barbell",
    "muscleGroups": [
        "Back",
        "Hamstrings",
        "Glutes"
    ],
    "description": "Lifting a loaded barbell from the ground to hip level"
}
```

### Create an exercise
**Method:** `POST` 🔒

**Path:** `api/v1/exercises`

**Request example:**
```
POST api/v1/exercises
```
```json
{
    "name": "Overhead Press",
    "category": "Barbell",
    "muscleGroups": [
        "Shoulders",
        "Triceps",
        "Core"
    ],
    "description": "Pressing a barbell overhead from shoulder height"
}
```

**Response example:**
```json
{
    "id": "017d0949-34d8-464b-ba07-c74bafba9c02",
    "name": "Overhead Press",
    "category": "Barbell",
    "muscleGroups": [
        "Shoulders",
        "Triceps",
        "Core"
    ],
    "description": "Pressing a barbell overhead from shoulder height"
}
```

### Update an exercise
**Method:** `PUT` 🔒

**Path:** `api/v1/exercises/{id}`

**Request example:**
```
PUT api/v1/exercises/017d0949-34d8-464b-ba07-c74bafba9c02
```
```json
{
    "name": "Military Press",
    "category": "Barbell",
    "muscleGroups": [
        "Shoulders",
        "Triceps",
        "Upper Chest"
    ],
    "description": "Strict overhead press with feet together"
}
```

**Response example:**
```json
{
    "id": "017d0949-34d8-464b-ba07-c74bafba9c02",
    "name": "Military Press",
    "category": "Barbell",
    "muscleGroups": [
        "Shoulders",
        "Triceps",
        "Upper Chest"
    ],
    "description": "Strict overhead press with feet together"
}
```

### Delete an exercise
**Method:** `DELETE` 🔒

**Path:** `api/v1/exercises/{id}`

**Request example:**
```
DELETE api/v1/exercises/017d0949-34d8-464b-ba07-c74bafba9c02
```

**Response:** `204 No Content`

---

## Plans Endpoint

Base path: `/api/v1/plans`

### Get all plans
**Method:** `GET`

**Path:** `api/v1/plans`

**Request example:**
```
GET api/v1/plans
```

**Response example:**
```json
[
  {
    "id": "ca8a5e76-f8ae-4b55-9bf6-7efbaedcac7d",
    "name": "Upper Body Strength",
    "description": "Focus on building upper body strength and muscle mass.",
    "sessions": []
  }
]
```

### Get a plan by ID
**Method:** `GET`

**Path:** `api/v1/plans/{id}`

**Request example:**
```
GET api/v1/plans/ca8a5e76-f8ae-4b55-9bf6-7efbaedcac7d
```

**Response example:**
```json
{
  "id": "ca8a5e76-f8ae-4b55-9bf6-7efbaedcac7d",
  "name": "Upper Body Strength",
  "description": "Focus on building upper body strength and muscle mass.",
  "sessions": []
}
```

### Create a plan
**Method:** `POST` 🔒

**Path:** `api/v1/plans`

**Request example:**
```
POST api/v1/plans
```
```json
{
    "name": "Lower Body Power",
    "description": "Explosive lower body training program"
}
```

**Note:** There is an optional field `sessions` which takes a list of session IDs.

**Response example:**
```json
{
    "id": "b72b2159-ffbe-4a4b-9398-c72f32452f8d",
    "name": "Lower Body Power",
    "description": "Explosive lower body training program",
    "sessions": []
}
```

### Update a plan
**Method:** `PUT` 🔒

**Path:** `api/v1/plans/{id}`

**Request example:**
```
PUT api/v1/plans/b72b2159-ffbe-4a4b-9398-c72f32452f8d
```
```json
{
    "name": "Lower Body Hypertrophy",
    "description": "Muscle building program for legs and glutes",
    "sessions": []
}
```

**Response example:**
```json
{
    "id": "b72b2159-ffbe-4a4b-9398-c72f32452f8d",
    "name": "Lower Body Hypertrophy",
    "description": "Muscle building program for legs and glutes",
    "sessions": []
}
```

### Delete a plan
**Method:** `DELETE` 🔒

**Path:** `api/v1/plans/{id}`

**Request example:**
```
DELETE api/v1/plans/b72b2159-ffbe-4a4b-9398-c72f32452f8d
```

**Response:** `204 No Content`

---

## Sessions Endpoint

Base path: `/api/v1/sessions`

### Get all sessions
**Method:** `GET`

**Path:** `api/v1/sessions`

**Request example:**
```
GET api/v1/sessions
```

**Response example:**
```json
[
    {
        "id": "303bd884-d55b-43fe-beed-ceea9dadbfe4",
        "planId": "ca8a5e76-f8ae-4b55-9bf6-7efbaedcac7d",
        "name": "Wednesday Workout",
        "scheduledDate": "2025-11-20",
        "exerciseExecutions": []
    }
]
```

### Get a session by ID
**Method:** `GET`

**Path:** `api/v1/sessions/{id}`

**Request example:**
```
GET api/v1/sessions/303bd884-d55b-43fe-beed-ceea9dadbfe4
```

**Response example:**
```json
{
    "id": "303bd884-d55b-43fe-beed-ceea9dadbfe4",
    "planId": "ca8a5e76-f8ae-4b55-9bf6-7efbaedcac7d",
    "name": "Wednesday Workout",
    "scheduledDate": "2025-11-20",
    "exerciseExecutions": []
}
```

### Create a session
**Method:** `POST` 🔒

**Path:** `api/v1/sessions`

**Request example:**
```
POST api/v1/sessions
```
```json
{
    "planId": "ca8a5e76-f8ae-4b55-9bf6-7efbaedcac7d",
    "name": "Friday Session",
    "scheduledDate": "2025-11-22",
    "exerciseExecutions": [
        "38cb6d7c-9e29-4352-873d-bdf1825b0aad",
        "017d0949-34d8-464b-ba07-c74bafba9c02"
    ]
}
```

**Note:** Both `planId` and `exerciseExecutions` are optional fields.

**Response example:**
```json
{
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "planId": "ca8a5e76-f8ae-4b55-9bf6-7efbaedcac7d",
    "name": "Friday Session",
    "scheduledDate": "2025-11-22",
    "exerciseExecutions": [
        {
            "id": "38cb6d7c-9e29-4352-873d-bdf1825b0aad",
            "name": "Deadlift",
            "category": "Barbell",
            "muscleGroups": ["Back", "Hamstrings", "Glutes"],
            "description": "Lifting a loaded barbell from the ground to hip level"
        },
        {
            "id": "017d0949-34d8-464b-ba07-c74bafba9c02",
            "name": "Overhead Press",
            "category": "Barbell",
            "muscleGroups": ["Shoulders", "Triceps", "Core"],
            "description": "Pressing a barbell overhead from shoulder height"
        }
    ]
}
```

### Update a session
**Method:** `PUT` 🔒

**Path:** `api/v1/sessions/{id}`

**Request example:**
```
PUT api/v1/sessions/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```
```json
{
    "planId": "ca8a5e76-f8ae-4b55-9bf6-7efbaedcac7d",
    "name": "Friday Evening Session",
    "scheduledDate": "2025-11-22",
    "exerciseExecutions": [
        "38cb6d7c-9e29-4352-873d-bdf1825b0aad"
    ]
}
```

**Response example:**
```json
{
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "planId": "ca8a5e76-f8ae-4b55-9bf6-7efbaedcac7d",
    "name": "Friday Evening Session",
    "scheduledDate": "2025-11-22",
    "exerciseExecutions": [
        {
            "id": "38cb6d7c-9e29-4352-873d-bdf1825b0aad",
            "name": "Deadlift",
            "category": "Barbell",
            "muscleGroups": ["Back", "Hamstrings", "Glutes"],
            "description": "Lifting a loaded barbell from the ground to hip level"
        }
    ]
}
```

### Delete a session
**Method:** `DELETE` 🔒

**Path:** `api/v1/sessions/{id}`

**Request example:**
```
DELETE api/v1/sessions/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response:** `204 No Content`

---

## Exercise Executions Endpoint

Base path: `/api/v1/exercise-executions`

Exercise executions define the planned sets, reps, and weight for a specific exercise within a session.

### Get all exercise executions
**Method:** `GET`

**Path:** `api/v1/exercise-executions`

**Query Parameters:**
- `sessionId` (optional): Filter by session UUID

**Request example:**
```
GET api/v1/exercise-executions
GET api/v1/exercise-executions?sessionId=303bd884-d55b-43fe-beed-ceea9dadbfe4
```

**Response example:**
```json
[
    {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "plannedSets": 3,
        "plannedReps": 10,
        "plannedWeight": 60,
        "orderID": 1,
        "sessionId": "303bd884-d55b-43fe-beed-ceea9dadbfe4",
        "sessionName": "Wednesday Workout",
        "exerciseId": "38cb6d7c-9e29-4352-873d-bdf1825b0aad",
        "exerciseName": "Deadlift"
    }
]
```

### Get an exercise execution by ID
**Method:** `GET`

**Path:** `api/v1/exercise-executions/{id}`

**Request example:**
```
GET api/v1/exercise-executions/f47ac10b-58cc-4372-a567-0e02b2c3d479
```

**Response example:**
```json
{
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "plannedSets": 3,
    "plannedReps": 10,
    "plannedWeight": 60,
    "orderID": 1,
    "sessionId": "303bd884-d55b-43fe-beed-ceea9dadbfe4",
    "sessionName": "Wednesday Workout",
    "exerciseId": "38cb6d7c-9e29-4352-873d-bdf1825b0aad",
    "exerciseName": "Deadlift"
}
```

### Create an exercise execution
**Method:** `POST` 🔒

**Path:** `api/v1/exercise-executions`

**Request example:**
```
POST api/v1/exercise-executions
```
```json
{
    "plannedSets": 4,
    "plannedReps": 8,
    "plannedWeight": 100,
    "orderID": 2,
    "sessionId": "303bd884-d55b-43fe-beed-ceea9dadbfe4",
    "exerciseId": "38cb6d7c-9e29-4352-873d-bdf1825b0aad"
}
```

**Required fields:** `plannedSets`, `plannedReps`, `plannedWeight`, `sessionId`, `exerciseId`

**Response:** `201 Created`
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "plannedSets": 4,
    "plannedReps": 8,
    "plannedWeight": 100,
    "orderID": 2,
    "sessionId": "303bd884-d55b-43fe-beed-ceea9dadbfe4",
    "sessionName": "Wednesday Workout",
    "exerciseId": "38cb6d7c-9e29-4352-873d-bdf1825b0aad",
    "exerciseName": "Deadlift"
}
```

### Update an exercise execution
**Method:** `PUT` 🔒

**Path:** `api/v1/exercise-executions/{id}`

**Request example:**
```
PUT api/v1/exercise-executions/550e8400-e29b-41d4-a716-446655440000
```
```json
{
    "plannedSets": 5,
    "plannedReps": 5,
    "plannedWeight": 120,
    "orderID": 1
}
```

**Response:** `200 OK`

### Delete an exercise execution
**Method:** `DELETE` 🔒

**Path:** `api/v1/exercise-executions/{id}`

**Request example:**
```
DELETE api/v1/exercise-executions/550e8400-e29b-41d4-a716-446655440000
```

**Response:** `204 No Content`

---

## Session Logs Endpoint 🔒

Base path: `/api/v1/session-logs`

> **All endpoints require authentication.** Session logs are user-specific workout history records.

Session logs record actual workout performances and persist independently from session templates.

### Start a session (Create Session Log)
**Method:** `POST` 🔒

**Path:** `api/v1/session-logs/start/{sessionId}`

Creates a new session log based on an existing session template.

**Request example:**
```
POST api/v1/session-logs/start/303bd884-d55b-43fe-beed-ceea9dadbfe4
```

**Response:** `201 Created`
```json
{
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "sessionName": "Wednesday Workout",
    "sessionPlanName": "Upper Body Strength",
    "sessionPlan": "Focus on building upper body strength and muscle mass.",
    "startedAt": "2025-11-20T10:30:00Z",
    "completedAt": null,
    "status": "InProgress",
    "notes": null,
    "originalSessionId": "303bd884-d55b-43fe-beed-ceea9dadbfe4",
    "executionLogs": [],
    "executionLogCount": 0
}
```

### Complete a session
**Method:** `PUT` 🔒

**Path:** `api/v1/session-logs/{id}/complete`

Marks a session log as completed and sets the `completedAt` timestamp.

**Request example:**
```
PUT api/v1/session-logs/7c9e6679-7425-40de-944b-e07fc1f90ae7/complete
```

**Response:** `200 OK`
```json
{
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "sessionName": "Wednesday Workout",
    "sessionPlanName": "Upper Body Strength",
    "sessionPlan": "Focus on building upper body strength and muscle mass.",
    "startedAt": "2025-11-20T10:30:00Z",
    "completedAt": "2025-11-20T11:45:00Z",
    "status": "Completed",
    "notes": null,
    "originalSessionId": "303bd884-d55b-43fe-beed-ceea9dadbfe4",
    "executionLogs": [],
    "executionLogCount": 3
}
```

### Get all session logs
**Method:** `GET` 🔒

**Path:** `api/v1/session-logs`

**Query Parameters:**
- `sessionId` (optional): Filter by original session UUID

**Request example:**
```
GET api/v1/session-logs
GET api/v1/session-logs?sessionId=303bd884-d55b-43fe-beed-ceea9dadbfe4
```

**Response example:**
```json
[
    {
        "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "sessionName": "Wednesday Workout",
        "sessionPlanName": "Upper Body Strength",
        "sessionPlan": "Focus on building upper body strength and muscle mass.",
        "startedAt": "2025-11-20T10:30:00Z",
        "completedAt": "2025-11-20T11:45:00Z",
        "status": "Completed",
        "notes": "Great workout!",
        "originalSessionId": "303bd884-d55b-43fe-beed-ceea9dadbfe4",
        "executionLogs": [],
        "executionLogCount": 3
    }
]
```

### Get a session log by ID
**Method:** `GET` 🔒

**Path:** `api/v1/session-logs/{id}`

**Request example:**
```
GET api/v1/session-logs/7c9e6679-7425-40de-944b-e07fc1f90ae7
```

**Response:** Same structure as above.

### Update a session log
**Method:** `PUT` 🔒

**Path:** `api/v1/session-logs/{id}`

**Request example:**
```
PUT api/v1/session-logs/7c9e6679-7425-40de-944b-e07fc1f90ae7
```
```json
{
    "notes": "Felt strong today, increased weights",
    "status": "Completed"
}
```

**Response:** `200 OK`

### Delete a session log
**Method:** `DELETE` 🔒

**Path:** `api/v1/session-logs/{id}`

**Request example:**
```
DELETE api/v1/session-logs/7c9e6679-7425-40de-944b-e07fc1f90ae7
```

**Response:** `204 No Content`

---

## Execution Logs Endpoint 🔒

Base path: `/api/v1/execution-logs`

> **All endpoints require authentication.** Execution logs are user-specific exercise performance records.

Execution logs track actual performance for each exercise within a session log.

### Get all execution logs
**Method:** `GET` 🔒

**Path:** `api/v1/execution-logs`

**Query Parameters:**
- `sessionLogId` (optional): Filter by session log UUID

**Request example:**
```
GET api/v1/execution-logs
GET api/v1/execution-logs?sessionLogId=7c9e6679-7425-40de-944b-e07fc1f90ae7
```

**Response example:**
```json
[
    {
        "id": "8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d",
        "exerciseExecutionId": 1,
        "exerciseExecutionPlannedSets": 3,
        "exerciseExecutionPlannedReps": 10,
        "exerciseExecutionPlannedWeight": 60,
        "exerciseId": "38cb6d7c-9e29-4352-873d-bdf1825b0aad",
        "exerciseName": "Deadlift",
        "exerciseCategory": "Barbell",
        "exerciseMuscleGroup": ["Back", "Hamstrings", "Glutes"],
        "exerciseDescription": "Lifting a loaded barbell from the ground to hip level",
        "actualSets": 3,
        "actualReps": 10,
        "actualWeight": 65,
        "completed": true,
        "notes": "Increased weight by 5kg",
        "sessionLogId": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
    }
]
```

### Get an execution log by ID
**Method:** `GET` 🔒

**Path:** `api/v1/execution-logs/{id}`

**Request example:**
```
GET api/v1/execution-logs/8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d
```

**Response:** Same structure as above.

### Update an execution log
**Method:** `PUT` 🔒

**Path:** `api/v1/execution-logs/{id}`

**Request example:**
```
PUT api/v1/execution-logs/8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d
```
```json
{
    "actualSets": 4,
    "actualReps": 8,
    "actualWeight": 70,
    "completed": true,
    "notes": "Added extra set"
}
```

**Response:** `200 OK`

### Delete an execution log
**Method:** `DELETE` 🔒

**Path:** `api/v1/execution-logs/{id}`

**Request example:**
```
DELETE api/v1/execution-logs/8a9b0c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d
```

**Response:** `204 No Content`

---

## User Validation Endpoint 🔒

Base path: `/api/v1/val`

### Validate current user
**Method:** `GET` 🔒

**Path:** `api/v1/val`

Returns the username of the currently authenticated user.

**Request example:**
```
GET api/v1/val
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

**Response example:**
```
john_doe
```

---

## H2 Console

The H2 database console is available at `/h2-console` for debugging purposes.

**Connection settings:**
- JDBC URL: `jdbc:h2:mem:fitnesstrackerdb`
- Username: `sa`
- Password: (empty)

---

## Legend

- 🔒 = Requires Authentication (HTTP Basic)