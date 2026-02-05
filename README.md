# Fitness Tracker

<p align="center">
  <img src="fitness-tracker-frontend/src/assets/logo-with-text-dark.svg" alt="FitTrack" width="360" />
</p>

[![Build](https://img.shields.io/badge/build-docker--compose-blue)](./docker-compose.yml)
[![Frontend](https://img.shields.io/badge/Angular-20.3.12-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![Backend](https://img.shields.io/badge/Spring%20Boot-3.5.6-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)](https://adoptium.net/)
[![License: GPLv3](https://img.shields.io/badge/License-GPLv3-blue.svg)](./LICENSE)

Full-stack fitness tracking system for managing **exercise templates**, **training plans/sessions**, and **user-specific workout logging** (history of performed sessions + exercise execution results).

## Contents

- [System Overview](#system-overview)
- [Demo Video](#demo-video)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Quick Start (Docker Compose)](#quick-start-docker-compose)
- [Access URLs](#access-urls)
- [Seed Data](#seed-data)
- [Database](#database)
- [Project Structure](#project-structure)
- [Docs & Help](#docs--help)
- [Maintainers](#maintainers)
- [License](#license)

## System Overview

The system runs as two services:

- **Frontend** (Angular): `http://localhost:4200`
- **Backend** (Spring Boot API): `http://localhost:8080`

The frontend calls the backend via REST endpoints under `http://localhost:8080/api/v1/**`.

Note: The frontend currently assumes the backend is available at `http://localhost:8080` (API URLs are hardcoded in the frontend provider services).
When running via Docker, the frontend is served by **nginx** inside the container on port `80` and is published to the host as `http://localhost:4200` via Docker port mapping.

## Demo Video

<a href="https://www.youtube.com/watch?v=iMviRGk6YoQ" target="_blank" rel="noopener noreferrer">
  <img src="https://img.youtube.com/vi/iMviRGk6YoQ/hqdefault.jpg" width="450" alt="Fitness Tracker demo video (YouTube)" />
</a>

## Architecture

### Technical Features

- **Modular frontend (Angular 20 standalone)**: a thin app shell plus reusable feature libraries.
- **Layered backend (Spring Boot)**: Controller → Service → Repository with DTOs.
- **Template + history separation**:
  - “Templates”: exercises, plans, sessions, exercise executions.
  - “History”: session logs + execution logs (user-owned workout data).
- **Snapshot logging** (backend): when a workout is started, the API snapshots template data into log entities so history stays stable if templates change later.

### Frontend Structure (high level)

- App shell: bootstrapping + routing + layout (`fitness-tracker-frontend/src`)
- Feature libraries: domain logic + UI (`fitness-tracker-frontend/projects/*`)
  - `common-lib`: auth/interceptor/guard + shared helpers
  - `exercises-lib`, `plans-lib`, `sessions-lib`, `workouts-lib`, `home-lib`: feature modules

### Backend Structure (high level)

- Feature packages under `fitness-tracker-backend/src/main/java/hs/aalen/fitness_tracker_backend/`:
  - `exercises`, `plans`, `sessions`, `exerciseexecutions`, `sessionlogs`, `executionlogs`, `users`, `config`

## Tech Stack

- **Frontend:** Angular 20 (standalone) + Angular Material
- **Backend:** Spring Boot 3.5 (Java 21), Spring Security (HTTP Basic), Spring Data JPA
- **Database:** H2 in-memory (dev/default)
- **Containerization:** Docker + Docker Compose

## Requirements

- Docker (includes Docker Compose v2 via `docker compose`)

## Quick Start (Docker Compose)

Clone and start the application using Docker Compose:

```bash
git clone https://github.com/t1001001/project-seminar-programming
cd project-seminar-programming
docker compose up --build
```

Stop the stack:

```bash
docker compose down
```

## Access URLs

- Frontend: `http://localhost:4200`
- Backend API: `http://localhost:8080`

### Docker Port Mapping (host → container)

- Frontend: `4200 → 80` (nginx serves the production build)
- Backend: `8080 → 8080` (Spring Boot)

If you want to restrict exposure to localhost only, bind explicitly in `docker-compose.yml`, e.g. `127.0.0.1:4200:80` and `127.0.0.1:8080:8080`.

## Seed Data

The backend seeds initial data on startup (users + example exercises/plans/sessions).

Authentication uses **HTTP Basic Authentication**.

Default users:

- `max` / `passwort123`
- `anna` / `passwort456`

## Database

- Backend uses an **H2 in-memory** database by default.
- H2 console (dev/debug): `http://localhost:8080/h2-console`

## Project Structure

| Directory | Description |
|-----------|-------------|
| [fitness-tracker-frontend](./fitness-tracker-frontend/README.md) | Angular 20 frontend (standalone + feature libraries) |
| [fitness-tracker-backend](./fitness-tracker-backend/README.md) | Spring Boot REST API (Java 21) |

## Docs & Help

- Angular docs: <https://angular.dev/>
- Angular Material: <https://material.angular.io/>
- Spring Boot docs: <https://spring.io/projects/spring-boot>
- Spring Security docs: <https://spring.io/projects/spring-security>

## Contributors

Donauer, Marc · Kohnle, Philipp · Krieger, Leonie · Nguyen, Tobias · Schulz, Lukas · Sorg, Luca

## Maintainers

Maintained by the Fitness Tracker project team (Project Seminar Programming).

## License

GPL-3.0. See `LICENSE`.
