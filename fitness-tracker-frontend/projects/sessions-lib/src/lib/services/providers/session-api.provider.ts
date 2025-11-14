import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Session } from '../../domain/models/session.model';

@Injectable({ providedIn: 'root' })
export class SessionApiProvider {
  getSessions(): Observable<Session[]> {
    return of([]);
  }
}
