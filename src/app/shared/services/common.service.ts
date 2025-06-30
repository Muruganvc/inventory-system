import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private readonly snackBar = inject(MatSnackBar);
  private toastr = inject(ToastrService);

  showSuccess = (message: string): void => {
    this.toastr.success(message, 'Success');
  }

  showError = (message: string): void => {
    this.toastr.error(message, 'Error');
  }

  showInfo = (message: string): void => {
    this.toastr.info(message, 'Information');
  }

  showWarning = (message: string): void => {
    this.toastr.warning(message, 'Warning');
  }

  // showSuccessMessage(message: string) {
  //   this.snackBar.open(message, 'Close', {
  //     duration: 3000,
  //     verticalPosition: 'top',
  //     horizontalPosition: 'center',
  //     panelClass: ['success-snackbar']
  //   });
  // }

  // showErrorMessage(message: string) {
  //   this.snackBar.open(message, 'Dismiss', {
  //     duration: 4000,
  //     verticalPosition: 'bottom',
  //     horizontalPosition: 'center',
  //     panelClass: ['error-snackbar']
  //   });
  // }
}
