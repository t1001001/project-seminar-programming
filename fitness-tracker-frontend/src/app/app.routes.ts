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

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeLanding,
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
  },
  {
    path: 'workouts/:id',
    component: WorkoutsDetails,
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
