import {
    HttpInterceptorFn,
    HttpErrorResponse,
    HttpRequest,
    HttpHandlerFn,
    HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { from, lastValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

// --- Shared state to coordinate refresh ---
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return from(handleRequestAsync(req, next, authService, router));
};

async function handleRequestAsync(
    req: HttpRequest<any>,
    next: HttpHandlerFn,
    authService: AuthService,
    router: Router
): Promise<HttpEvent<any>> {
    try {
        const token = authService.getToken();

        // Attach the current token
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });

        return await lastValueFrom(next(authReq));
    } catch (error) {
        // Only handle 401 (unauthorized)
        if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 0)) {
            console.warn('Access token expired — attempting refresh...');

            try {
                const newToken = await getValidToken(authService, router);
                if (!newToken) throw new Error('Token refresh failed');

                const retriedReq = req.clone({
                    setHeaders: { Authorization: `Bearer ${newToken}` },
                });

                // Retry original request with new token
                return await lastValueFrom(next(retriedReq));
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                authService.logout();
                router.navigate(['/login']);
                throw refreshError;
            }
        }

        throw error; // rethrow other errors
    }
}

/**
 * Ensures only one refresh request happens at a time.
 * Other requests will wait until it resolves.
 */
async function getValidToken(
    authService: AuthService,
    router: Router
): Promise<string | null> {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = (async () => {
            try {
                const tokens = await authService.refreshToken(); // should return { token, refreshToken }
                authService.setToken(tokens.token);
                authService.setRefreshToken(tokens.refreshToken);
                return tokens.token;
            } catch (err) {
                console.error('Refresh token request failed:', err);
                authService.logout();
                router.navigate(['/login']);
                return null;
            } finally {
                isRefreshing = false;
                refreshPromise = null;
            }
        })();
    }

    // If another request already started refreshing, just wait for it
    return refreshPromise!;
}
