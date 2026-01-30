# Fitness Tracker Backend

[![Build](https://img.shields.io/badge/build-maven-blue)](./mvnw)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)](https://adoptium.net/)
[![License: GPLv3](https://img.shields.io/badge/License-GPLv3-blue.svg)](../LICENSE)

Spring Boot REST API for managing **exercise templates**, **training plans/sessions**, and **user-specific workout logs** (session logs + execution logs).

## Contents

- [System Overview](#system-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Database & Seeding](#database--seeding)
- [Testing](#testing)
- [Docs & Help](#docs--help)
- [Maintainers](#maintainers)

## System Overview

This backend is one part of the Fitness Tracker system:

- **Backend (this folder)**: `http://localhost:8080`
- **Frontend**: `../fitness-tracker-frontend` (Angular app)

For running the full system (frontend + backend), refer to the repository root README.

## Tech Stack

- Java 21 + Spring Boot 3.5
- Spring Web, Spring Data JPA, Spring Validation
- Spring Security (HTTP Basic)
- H2 in-memory database
- ModelMapper + Lombok
- JaCoCo coverage thresholds (`./mvnw verify`)

## Architecture

### Technical Features

- **Feature-based package structure** (domain folders like `exercises/`, `plans/`, `sessions/`, `sessionlogs/`, `executionlogs/`, `users/`).
- **Layered Spring design**: Controller → Service → Repository with DTOs for API I/O.
- **Hybrid template + log model**:
  - Exercises/plans/sessions are treated as reusable “templates”.
  - Workout history is stored as **logs** owned by a user.
- **Snapshot logging** (critical design choice):
  - When a workout is started, the API snapshots session/exercise execution details into log entities so history remains stable even if templates change later.


### API Modules (at a glance)

| Module | Base Path | Purpose |
|---|---|---|
| Users | `/api/v1/val` | Validate credentials / return current username |
| Exercises | `/api/v1/exercises` | Exercise catalog (template CRUD) |
| Plans | `/api/v1/plans` | Training plans (template CRUD) |
| Sessions | `/api/v1/sessions` | Sessions within plans (template CRUD) |
| Exercise Executions | `/api/v1/exercise-executions` | Planned sets/reps/weight within sessions |
| Session Logs | `/api/v1/session-logs` | User workout sessions (history) |
| Execution Logs | `/api/v1/execution-logs` | User exercise performance per session log |

## Getting Started

### Option A: Docker (backend-only)

From this folder (`fitness-tracker-backend/`):

```bash
docker build -t fitness-tracker-backend-app .
docker run --rm -p 8080:8080 fitness-tracker-backend-app
```

### Option B: Local run (Maven Wrapper)

```bash
./mvnw spring-boot:run
```

The API listens on `http://localhost:8080`.

## Authentication

The API uses **HTTP Basic Authentication**.

- Public read access is intended for the “template” resources (exercises/plans/sessions/exercise-executions).
- User workout history (session logs + execution logs) is user-owned and should be accessed with authentication.
- CORS is configured for the frontend origin `http://localhost:4200` (`CorsConfig`).

## Database & Seeding

- Database: **H2 in-memory** (`jdbc:h2:mem:fitnesstrackerdb`) configured in `src/main/resources/application.properties`.
- On startup, `DatabaseSeeder` inserts initial data (users + exercises + plans + sessions + exercise executions).

Default dev users:

- `max` / `passwort123`
- `anna` / `passwort456`

H2 console (dev/debug):

- URL: `http://localhost:8080/h2-console`
- Note: `spring.h2.console.settings.web-allow-others=true` is enabled; treat this as **development-only**.

## Testing

Run unit tests:

```bash
./mvnw test
```

Generate coverage report:

```bash
./mvnw jacoco:report
```

Enforce JaCoCo coverage thresholds (configured in `pom.xml`):

```bash
./mvnw verify
```

## Docs & Help

- Frontend README: [fitness-tracker-frontend/README.md](../fitness-tracker-frontend/README.md)
- Spring Boot docs: <https://spring.io/projects/spring-boot>
- Spring Security docs: <https://spring.io/projects/spring-security>

## Maintainers

Maintained by the Fitness Tracker project team (Project Seminar Programming).
