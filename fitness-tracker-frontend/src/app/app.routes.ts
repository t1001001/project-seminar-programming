import { Routes } from '@angular/router';
import { ExercisesOverview } from './pages/exercises/exercises-overview/exercises-overview';
import { ExercisesDetails } from './pages/exercises/exercises-details/exercises-details';
import { PlansOverview } from './pages/plans/plans-overview/plans-overview';
import { PlansDetails } from './pages/plans/plans-details/plans-details';
import { SessionsOverview } from './pages/sessions/sessions-overview/sessions-overview';
import { SessionsDetails } from './pages/sessions/sessions-details/sessions-details';
import { WorkoutsOverview } from './pages/workouts/workouts-overview/workouts-overview';
import { WorkoutsDetails } from './pages/workouts/workouts-details/workouts-details';
import { HomeLanding } from './pages/home/home-landing/home-landing';
import { LoginComponent } from './pages/login/login';
import { authGuard } from 'common-lib';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeLanding,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'exercises',
    component: ExercisesOverview,
  },
  {
    path: 'exercises/:id',
    component: ExercisesDetails,
  },
  {
    path: 'plans',
    component: PlansOverview,
  },
  {
    path: 'plans/:id',
    component: PlansDetails,
  },
  {
    path: 'sessions',
    component: SessionsOverview,
  },
  {
    path: 'sessions/:id',
    component: SessionsDetails,
  },
  {
    path: 'workouts',
    component: WorkoutsOverview,
    canActivate: [authGuard],
  },
  {
    path: 'workouts/:id',
    component: WorkoutsDetails,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];

