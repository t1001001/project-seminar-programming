import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from '../../domain/models/session.model';
import { SessionApiProvider } from '../providers/session-api.provider';

@Injectable({ providedIn: 'root' })
export class SessionManagerService {
  private readonly provider = inject(SessionApiProvider);

  loadSessions(): Observable<Session[]> {
    return this.provider.getSessions();
  }
}
