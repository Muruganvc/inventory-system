import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
export class LoginComponent {
  loginForm: FormGroup;
  private readonly auth = inject(AuthService);
  private readonly commonService = inject(CommonService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.auth.logout();
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.commonService.showErrorMessage('Please fill all fields');
      return;
    }
    const { username, password } = this.loginForm.value;
    const loginRequest: LoginRequest = {
      password: password,
      userName: username
    }
    this.auth.login(loginRequest).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.commonService.showSuccessMessage('Login successful!');
      },
      error: () => this.commonService.showErrorMessage("Invalid credentials")
    });

  }

}
