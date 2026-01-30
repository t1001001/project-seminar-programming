# Fitness Tracker Frontend

[![Build](https://img.shields.io/badge/build-npm-blue)](./package.json)
[![Angular](https://img.shields.io/badge/Angular-20.3.12-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](./Dockerfile)
[![License: GPLv3](https://img.shields.io/badge/License-GPLv3-blue.svg)](../LICENSE)

Angular 20 (standalone) frontend for the Fitness Tracker system. The codebase is intentionally split into a small **app shell** (`src/`) and a set of reusable **feature libraries** (`projects/*`) that encapsulate domain logic and UI.

## Contents

- [System Overview](#system-overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [Routes](#routes)
- [Project Structure](#project-structure)
- [Docs & Help](#docs--help)
- [Maintainers](#maintainers)

## System Overview

This frontend is part of a 2-service setup:

- **Backend**: Spring Boot REST API (Java 21), Spring Security (HTTP Basic), H2 in-memory DB → `http://localhost:8080`
- **Frontend**: Angular app (this folder) → `http://localhost:4200`

The frontend calls the backend via REST endpoints under `http://localhost:8080/api/v1/**`.

Note: Backend URLs are currently **hardcoded** to `http://localhost:8080` inside the feature library provider services (e.g. `projects/*/src/lib/provider-services/*`).

For running the full system (frontend + backend), refer to the repository root README.

## Tech Stack

- Angular 20 (standalone) + Angular Router + HttpClient
- Angular Material/CDK
- TypeScript + RxJS
- Karma/Jasmine unit tests
- GSAP animations (home/landing)

## Architecture

### Technical Features

- **Standalone-first Angular**: bootstrapped with `bootstrapApplication` and `ApplicationConfig`.
- **Modular monorepo-style libraries**: `projects/*` are buildable Angular libraries (via `ng-packagr`) and are imported by name using TS path mappings.
- **Containerized frontend**: Docker image serves a production build (`ng build`) via nginx.

### App Shell (`src/`)

The app shell is intentionally thin:

- Bootstrap: `src/main.ts`
- Global providers: `src/app/app.config.ts` (router, animations, HttpClient + interceptor)
- Routes: `src/app/app.routes.ts`
- Global layout + `<router-outlet />`: `src/app/app.ts` / `src/app/app.html`

### Routing Strategy

`src/app/app.routes.ts` maps routes to **page wrapper components** located in `src/app/pages/**`. These wrappers usually import exactly one library view component, for example:

- `src/app/pages/exercises/**` → components from `projects/exercises-lib`
- `src/app/pages/plans/**` → components from `projects/plans-lib`

This keeps the app shell stable while feature libraries evolve independently.

Lazy loading can be introduced via `loadComponent` / `loadChildren` as needed; routes are currently defined via eager `component:` mappings.

### Library Architecture (`projects/*`)

Feature libraries follow a consistent layering:

```
[feature]-lib/src/lib/
├── provider-services/    # HTTP communication (API calls)
├── logic-services/       # orchestration + error handling + view models
├── ui/                   # reusable presentational components
├── views/                # smart/container components used by the app wrappers
└── shared/               # feature-specific constants, validators, error mapping
```

#### Conventions (from `projects/LIBRARY-ARCHITECTURE.md`)

- **Data flow**: `views/` → `logic-services/` → `provider-services/` → backend.
- **Error handling**:
  - Provider layer: no `catchError` (errors bubble up).
  - Logic layer: `catchError` + feature-specific `shared/error-handler.util.ts` (built on `handleHttpError` from `common-lib`) to map HTTP errors to user-friendly messages.
  - View layer: display `err.message` and show notifications via `showError` / `showSuccess` (commonly re-exported from `shared/`).
- **Dependency rules** (high-level): views inject logic services (not providers), UI components stay presentational, `common-lib` is the only cross-cutting dependency.
- **State management**: views use `signal()` + `computed()`. For refreshable lists a common pattern is `refreshTrigger: signal(number)` → `toObservable()` → `switchMap(fetch)` → `toSignal()`.
- **Templates**: use signal function-call syntax (`entity()`) and modern control flow (`@if`, `@for`); write actions are commonly wrapped with `@if (authService.isLoggedIn())`.
- **Exports**: each library exposes a single public surface via its barrel file (`[feature]-lib.ts`); `shared/index.ts` can re-export `common-lib` helpers for convenience.
- **Styling**: prefer theme CSS variables from `src/styles.scss` (no hardcoded colors); verify light + dark mode.

**`common-lib`** is cross-cutting and is consumed by the app shell and all feature libs:

- `AuthService`: auth state + session persistence
- `authInterceptor`: injects `Authorization` header
- `authGuard`: route protection
- shared snackbar + HTTP error helpers

Feature libraries:

- `exercises-lib`: exercise catalog CRUD
- `plans-lib`: training plan CRUD + editing flows
- `sessions-lib`: session templates + exercise executions
- `workouts-lib`: user-specific workout logging (guarded routes)
- `home-lib`: landing/dashboard UI (GSAP hero animation)

## Getting Started

### Option A: Docker (frontend-only)

From this folder (`fitness-tracker-frontend/`):

```bash
docker build -t fitness-tracker-frontend-app .
docker run --rm -p 4200:80 fitness-tracker-frontend-app
```

### Option B: Local Dev Server

Prerequisites:

- Node.js (LTS recommended)
- Backend running on `http://localhost:8080` (start `../fitness-tracker-backend`)

```bash
npm ci
npm start
```

### Scripts

```bash
npm start      # dev server
npm test       # unit tests (Karma/Jasmine)
npm run build  # production build into dist/
```

## Authentication

The app uses **HTTP Basic Authentication** against the backend.

- Login UI: `/login`
- Session persistence: stored in `localStorage` by `AuthService` (`common-lib`)
- Auto-header: `authInterceptor` adds the `Authorization` header to API calls
- Guarded routes: `/workouts/**` uses `authGuard`

Default dev credentials (seeded by backend on startup via `DatabaseSeeder`):

- Username: `max`
- Password: `passwort123`

## Routes

| Route | Auth Required |
|---|---|
| `/login` | ❌ |
| `/home` | ❌ |
| `/exercises` | ❌ |
| `/exercises/:id` | ❌ |
| `/plans` | ❌ |
| `/plans/:id` | ❌ |
| `/sessions` | ❌ |
| `/sessions/:id` | ❌ |
| `/workouts` | ✅ |
| `/workouts/:id` | ✅ |

## Project Structure

```
fitness-tracker-frontend/
├── src/                   # app shell (routing + layout)
│   └── app/
│       ├── pages/          # route wrapper components
│       ├── services/       # app-level services (e.g. theming)
│       ├── app.routes.ts
│       └── app.ts
├── projects/               # buildable Angular libraries (domain features)
│   ├── common-lib/
│   ├── exercises-lib/
│   ├── plans-lib/
│   ├── sessions-lib/
│   ├── workouts-lib/
│   └── home-lib/
└── public/                 # static assets
```

## Docs & Help

- Backend README: [fitness-tracker-backend/README.md](../fitness-tracker-backend/README.md)
- Angular docs: <https://angular.dev/>
- Angular Material: <https://material.angular.io/>

## Maintainers

Maintained by the Fitness Tracker project team (Project Seminar Programming).
