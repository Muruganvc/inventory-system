import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { from, throwError } from 'rxjs';
import { switchMap, catchError, map, take, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const commonService = inject(CommonService);
    const token = authService.getToken();
    const router = inject(Router);
    // Clone the request and add the Authorization header with the token
    let authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });

    return next(authReq).pipe(
        tap(() => {
            commonService.sharedInvCompanyInfoData$.pipe(take(1)).subscribe(result => {
                if (!result?.isActive) {
                    router.navigate(['/company-expired']);
                }
            });
        }),
        catchError((error: HttpErrorResponse) => {
            if (error.status === 0) {  // Use 401 if it's for auth, 0 is usually network failure
                console.warn('Token expired or connection issue. Attempting to refresh...');

                return from(authService.refreshToken()).pipe(
                    switchMap(newTokens => {
                        authService.setRefreshToken(newTokens.refreshToken);

                        const newAuthReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newTokens.token}`,
                            },
                        });

                        return next(newAuthReq);
                    }),
                    catchError(err => {
                        authService.logout();
                        return throwError(() => err);
                    })
                );
            }

            return throwError(() => error);
        })
    );

};
