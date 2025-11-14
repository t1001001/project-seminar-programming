import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeFeature } from '../../domain/models/home-feature.model';
import { HomeContentProvider } from '../providers/home-content.provider';

@Injectable({ providedIn: 'root' })
export class HomeContentService {
  private readonly provider = inject(HomeContentProvider);

  loadFeatures(): Observable<HomeFeature[]> {
    return this.provider.getFeatures();
  }
}
