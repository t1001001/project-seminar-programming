import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ExercisesOverview } from './pages/exercises/exercises-overview/exercises-overview';
import { ExercisesDetails } from './pages/exercises/exercises-details/exercises-details';
import { PlansOverview } from './pages/plans/plans-overview/plans-overview';
import { PlansDetails } from './pages/plans/plans-details/plans-details';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
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
    path: '**',
    redirectTo: '/home',
  },
];
