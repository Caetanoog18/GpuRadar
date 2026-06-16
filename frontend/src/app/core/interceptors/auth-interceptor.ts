import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthRequest =
    request.url.includes('/api/auth/login') || request.url.includes('/api/auth/register');

  if (isAuthRequest) {
    return next(request);
  }

  const authorization = authService.getAuthorizationHeader();

  const authenticatedRequest = authorization
    ? request.clone({
        setHeaders: {
          Authorization: authorization,
        },
      })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        void router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
