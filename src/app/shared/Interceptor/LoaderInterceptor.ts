import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';
export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
    const loader = inject(LoaderService); 
    loader.show();
    return next(req).pipe(finalize(() => loader.hide()));
};
