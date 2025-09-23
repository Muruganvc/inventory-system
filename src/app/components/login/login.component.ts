import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private readonly auth = inject(AuthService);
  private readonly commonService = inject(CommonService);
  private readonly dialog = inject(MatDialog);

  companyName: string = '';

  constructor(private fb: FormBuilder, private router: Router, private configService: ConfigService) {
    this.auth.logout();
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
    this.auth.login(loginRequest).subscribe({
      next: (user) => {
        if (user == null) {
          this.commonService.showError("Invalid credentials");
          return;
        }
        // if (!user.invCompanyInfo?.isActive) {
        //   this.router.navigate(['/company-expired']);
        //   return;
        // }
        this.commonService.setInvCompanyInfoData(user.invCompanyInfo);
        this.router.navigate(['/dashboard']);
        this.commonService.showSuccess('Login successful!');
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

}
