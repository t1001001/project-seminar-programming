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

## Exercises endpoint

### Get all exercises
**Method:** ```GET```

**Path:** ```api/v1/exercises```

**Request example:**
```
GET api/v1/exercises
```

**Response example:**
```json
[
    {
        "id": "38cb6d7c-9e29-4352-873d-bdf1825b0aad",
        "name": "Bankdrücken",
        "category": "Freihantel",
        "muscleGroups": [
            "Brust",
            "Trizeps",
            "Schulter"
        ],
        "description": "Drücken der Langhantel von der Brust"
    }
]
```

### Get an exercise by ID
**Method:** ```GET```

**Path:** ```api/v1/exercises/{id}```

**Request example:**
```
GET api/v1/exercises/38cb6d7c-9e29-4352-873d-bdf1825b0aad
```

**Response example:**
```json
{
    "id": "38cb6d7c-9e29-4352-873d-bdf1825b0aad",
    "name": "Bankdrücken",
    "category": "Freihantel",
    "muscleGroups": [
        "Brust",
        "Trizeps",
        "Schulter"
    ],
    "description": "Drücken der Langhantel von der Brust"
}
```

### Create an exercise
**Method:** ```POST```

**Path:** ```api/v1/exercises```

**Request example:**
```
POST api/v1/exercises
```
```json
{
    "name": "Kniebeugen",
    "category": "Freihantel",
    "muscleGroups": [
        "Beine",
        "Rücken"
    ],
    "description": "Beugen der Knie mit Langhantel auf den Schultern"
}
```

**Response example:**
```json
{
    "id": "017d0949-34d8-464b-ba07-c74bafba9c02",
    "name": "Kniebeugen",
    "category": "Freihantel",
    "muscleGroups": [
        "Beine",
        "Rücken"
    ],
    "description": "Beugen der Knie mit Langhantel auf den Schultern"
}
```

## Sessions endpoint

### Get all sessions
**Method:** ```GET```

**Path:** ```api/v1/sessions```

**Request example:**
```
GET api/v1/sessions
```

**Response example:**
```json
[
    {
    "id": "303bd884-d55b-43fe-beed-ceea9dadbfe4",
    "planId": null,
    "name": "Leg Day",
    "scheduledDate": "2025-10-30",
    "exerciseExecutions": []
  }
]
```

### Get a session by ID
**Method:** ```GET```

**Path:** ```api/v1/sessions/{id}```

**Request example:**
```
GET api/v1/sessions/303bd884-d55b-43fe-beed-ceea9dadbfe4
```

**Response example:**
```json
{
    "id": "303bd884-d55b-43fe-beed-ceea9dadbfe4",
    "planId": null,
    "name": "Leg Day",
    "scheduledDate": "2025-10-30",
    "exerciseExecutions": []
  }
```

### Create a session

**Method:** ```POST```

**Path:** ```api/v1/sessions```

**Request example:**

```
POST api/v1/sessions
```
```json
{
  "name": "Leg Day",
  "scheduledDate": "2025-10-30"
}
```

**Response example:**
```json
{
  "id": "303bd884-d55b-43fe-beed-ceea9dadbfe4",
  "planId": null,
  "name": "Leg Day",
  "scheduledDate": "2025-10-30",
  "exerciseExecutions": null
}
```