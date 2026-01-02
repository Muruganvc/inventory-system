import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/LoginRequest';
import { CommonService } from '../../shared/services/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ConfigService } from '../../shared/services/config.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private readonly auth = inject(AuthService);
  private readonly commonService = inject(CommonService);
  private readonly dialog = inject(MatDialog);
  private destroy$ = new Subject<void>();
  companyName: string = '';

  constructor(private fb: FormBuilder, private router: Router, private configService: ConfigService) {
    this.auth.logout('/login', false);
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.companyName = this.configService.companyName;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.commonService.showError('Please fill all fields');
      return;
    }
    const { username, password } = this.loginForm.value;
    const loginRequest: LoginRequest = {
      password: password,
      userName: username
    }
    this.auth.login(loginRequest).pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        if (user == null) {
          this.commonService.showError("Invalid credentials");
          return;
        }
        if (!user.invCompanyInfo?.isActive) {
          this.router.navigate(['/company-expired']);
          return;
        }
        this.commonService.setInventoryCompanyInfo(user.invCompanyInfo);
        this.router.navigate(['/dashboard']);
        this.commonService.showSuccess('Login successful!');

        // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        //   width: '100%',
        //   maxWidth: '400px',
        //   disableClose: true,
        //   data: {
        //     title: 'Payment',
        //     okBtn: {
        //       title: 'Yes, Confirm',
        //       isHiden: true
        //     },
        //     cancel: {
        //       title: 'Cancel',
        //       isHiden: true
        //     },
        //     message: 'Do you want to see payment pending details..'
        //   }
        // });
        // dialogRef.afterClosed().subscribe(result => {
        //   if (result) {
        //     this.router.navigate(['order-summary/sales-orders']);
        //   }
        // });
      }
    });
  }
  forgetPassword = (): void => {
    this.dialog.open(ForgetPasswordComponent, {
      width: '100%',
      maxWidth: '400px',
      disableClose: true,
    }).afterClosed().subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
