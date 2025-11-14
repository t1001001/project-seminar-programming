import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HomeFeature } from '../../domain/models/home-feature.model';

@Injectable({ providedIn: 'root' })
export class HomeContentProvider {
  getFeatures(): Observable<HomeFeature[]> {
    return of([
      {
        title: 'Track your progress',
        description: 'Monitor exercises, plans, and sessions from a single dashboard.',
        icon: '📈',
      },
      {
        title: 'Stay motivated',
        description: 'Set goals and celebrate milestones as you advance.',
        icon: '💪',
      },
      {
        title: 'Build better habits',
        description: 'Plan ahead and keep your routine consistent.',
        icon: '📅',
      },
    ]);
  }
}
