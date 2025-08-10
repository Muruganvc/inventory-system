import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    // Clone the request and add the Authorization header with the token
    let authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // If 401 Unauthorized, the token might be expired
            if (error.status === 0) { //0  for testing
                console.error('Token expired, regenerating...');
                return authService.refreshToken().pipe(
                    switchMap((newTokens) => {
                        // Store the new refresh token in localStorage
                        authService.setRefreshToken(newTokens.refreshToken);

                        // Retry the original request with the new access token
                        authReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newTokens.token}`,
                            },
                        });
                        return next(authReq);
                    }),
                    catchError((err) => {
                        // If refresh token fails, log out and navigate to login
                        authService.logout();
                        return throwError(() => err);  // Return the error to propagate it
                    })
                );
            }
            // If the error is not 401, propagate the error as usual
            return throwError(() => error);
        })
    );
};
