import { Routes } from '@angular/router';
import { ExercisesOverview } from './pages/exercises/exercises-overview/exercises-overview';
import { ExercisesDetails } from './pages/exercises/exercises-details/exercises-details';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/exercises',
    pathMatch: 'full',
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
    path: '**',
    redirectTo: '/exercises',
  },
];
