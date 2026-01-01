import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

// Shared refresh state
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export const TokenInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  const authReq = req.clone({
    setHeaders: { Authorization: token ? `Bearer ${token}` : '' },
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired, try refresh
        return from(getValidToken(authService, router)).pipe(
          switchMap((newToken) => {
            if (!newToken) throw error;

            const retriedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });

            return next(retriedReq);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};

async function getValidToken(authService: AuthService, router: Router): Promise<string | null> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = (async () => {
      try {
        const tokens = await authService.refreshToken(); // { token, refreshToken }
        authService.setToken(tokens.token);
        authService.setRefreshToken(tokens.refreshToken);
        return tokens.token;
      } catch (err) {
        console.error('Refresh token failed', err);
        authService.logout();
        router.navigate(['/login']);
        return null;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise!;
}
