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
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(tap((response) => this.saveSession(response)));
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
    localStorage.removeItem(this.storageKey);
    this.sessionSignal.set(null);
  }

  private saveSession(response: AuthResponse): void {
    localStorage.setItem(this.storageKey, JSON.stringify(response));

    this.sessionSignal.set(response);
  }

  private restoreSession(): AuthResponse | null {
    const storedSession = localStorage.getItem(this.storageKey);

    if (!storedSession) {
      return null;
    }

    try {
      return JSON.parse(storedSession) as AuthResponse;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
