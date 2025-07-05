import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
     const tokenService = inject(AuthService);
     const token = tokenService.getToken(); 
    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${token}`,
        },
    });
    return next(authReq);


    return next(req);
};
