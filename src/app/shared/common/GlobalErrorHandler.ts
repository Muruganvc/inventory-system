import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toastr = inject(ToastrService);

  handleError(error: any): void {
    let message = 'An unexpected error occurred.';
    
    if (error?.rejection?.error?.message) {
      message = error.rejection.error.message;
    } else if (error?.message) {
      message = error.message;
    }

    // Show a clean user-facing error
    this.toastr.error(message, 'Error', {
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      closeButton: true,
    });

    console.error('[Global Error]', error);
  }
}
