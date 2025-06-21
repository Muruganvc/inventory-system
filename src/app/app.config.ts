import { ApplicationConfig, ErrorHandler, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { LoaderInterceptor } from './shared/Interceptor/LoaderInterceptor';
import { TokenInterceptor } from './shared/Interceptor/TokenInterceptor';
import { ErrorInterceptor } from './shared/Interceptor/ErrorInterceptor';
import { GlobalErrorHandler } from './shared/common/GlobalErrorHandler';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideHttpClient(
      withInterceptors([
        LoaderInterceptor,
        TokenInterceptor,
        ErrorInterceptor
      ])
    ),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      BrowserAnimationsModule, // ✅ Required for ngx-toastr
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
        timeOut: 3000,
        preventDuplicates: true,
      })
    )
  ]
};
