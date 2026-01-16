import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserProviderService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8080/api/v1/val';

    validateLogin(authHeader: string): Observable<string> {
        const headers = new HttpHeaders().set('Authorization', authHeader);
        return this.http.get(this.apiUrl, {
            headers,
            responseType: 'text',
        });
    }
}
