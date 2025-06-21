import { HttpInterceptorFn } from '@angular/common/http';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
    // const tokenService = inject(Auth);
    // const token = tokenService.getToken();
    console.log("TOken Interceptor triggered...")
    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ABC`,
        },
    });
    return next(authReq);


    return next(req);
};
