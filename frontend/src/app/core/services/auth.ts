import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { AuthResponse } from '../models/auth/auth-response';
import { LoginRequest } from '../models/auth/login-request';
import { RegisterRequest } from '../models/auth/register-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = '/api/auth';

  private readonly storageKey = 'gpu-radar-auth';

  private readonly sessionSignal = signal<AuthResponse | null>(this.restoreSession());

  readonly session = this.sessionSignal.asReadonly();

  readonly isAuthenticated = computed(() => Boolean(this.sessionSignal()?.token));

  readonly currentUser = computed(() => {
    const session = this.sessionSignal();

    if (!session) {
      return null;
    }

    return {
      id: session.userId,
      name: session.name,
      email: session.email,
    };
  });

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(tap((response) => this.saveSession(response)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  getAuthorizationHeader(): string | null {
    const session = this.sessionSignal();

    if (!session?.token) {
      return null;
    }

    const tokenType = session.tokenType?.trim() || 'Bearer';

    return `${tokenType} ${session.token}`;
  }

  logout(): void {
    sessionStorage.removeItem(this.storageKey);

    localStorage.removeItem(this.storageKey);

    this.sessionSignal.set(null);
  }

  private saveSession(response: AuthResponse): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(response));

    this.sessionSignal.set(response);
  }

  private restoreSession(): AuthResponse | null {
    localStorage.removeItem(this.storageKey);

    const storedSession = sessionStorage.getItem(this.storageKey);

    if (!storedSession) {
      return null;
    }

    try {
      return JSON.parse(storedSession) as AuthResponse;
    } catch {
      sessionStorage.removeItem(this.storageKey);

      return null;
    }
  }
}
