import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { from, throwError } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
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

                // Call the async refreshToken() method using from()
                return from(authService.refreshToken()).pipe(
                    switchMap((newTokens) => {
                        // Update tokens
                        authService.setRefreshToken(newTokens.refreshToken);

                        // Clone original request with new token
                        const newAuthReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newTokens.token}`,
                            },
                        });

                        // Retry the failed request with new token
                        return next(newAuthReq);
                    }),
                    catchError((err) => {
                        authService.logout();
                        return throwError(() => err);
                    })
                );
            }
            // If the error is not 401, propagate the error as usual
            return throwError(() => error);
        })
    );
};
