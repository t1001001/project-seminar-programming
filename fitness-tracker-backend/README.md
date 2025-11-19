# Prerequisites

Before running the project, install the following dependencies:

[Docker](https://docs.docker.com/desktop/)


# Usage

In order to run the backend, simply build and run the Docker container.

```bash
docker build -t fitness-tracker-backend-app .
docker run -p 8080:8080 fitness-tracker-backend-app
```

# Endpoints

## Exercises Endpoint

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
**Method:** `POST`

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
**Method:** `PUT`

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
**Method:** `DELETE`

**Path:** `api/v1/exercises/{id}`

**Request example:**
```
DELETE api/v1/exercises/017d0949-34d8-464b-ba07-c74bafba9c02
```

**Response:** `204 No Content`

---

## Plans Endpoint

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
**Method:** `POST`

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
**Method:** `PUT`

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
**Method:** `DELETE`

**Path:** `api/v1/plans/{id}`

**Request example:**
```
DELETE api/v1/plans/b72b2159-ffbe-4a4b-9398-c72f32452f8d
```

**Response:** `204 No Content`

---

## Sessions Endpoint

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
**Method:** `POST`

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
**Method:** `PUT`

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
**Method:** `DELETE`

**Path:** `api/v1/sessions/{id}`

**Request example:**
```
DELETE api/v1/sessions/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

**Response:** `204 No Content`