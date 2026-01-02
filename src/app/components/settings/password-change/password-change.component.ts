import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UpdateUserRequest } from '../../../models/UpdateUserRequest';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { ActionButtons } from '../../../shared/common/ActionButton';
import { CommonService } from '../../../shared/services/common.service';
import { DynamicFormComponent } from "../../../shared/components/dynamic-form/dynamic-form.component";
import { ChangePasswordRequest } from '../../../models/ChangePasswordRequest';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-password-change',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './password-change.component.html',
  styleUrl: './password-change.component.scss'
})
export class PasswordChangeComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  private destroy$ = new Subject<void>();
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly commonService = inject(CommonService);
  ngOnInit(): void {
    this.initForm();
    this.initFields();
    this.initFields();
    this.initActionButtons();
  }
  private readonly PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  private validatePassword(password: string): boolean {
    return this.PASSWORD_PATTERN.test(password);
  }

  update(form: any): void {
    const { password, currentPassword, confirmPassword } = form.form.value;
    const userId = this.authService.getUserId();

    if (password !== confirmPassword) {
      this.commonService.showWarning("Password and Confirm Password do not match.");
      return;
    }

    if (!this.validatePassword(password)) {
      this.commonService.showWarning("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.")
      return;
    }

    const userUpdate: ChangePasswordRequest = {
      passwordHash: password,
      currentPassword: currentPassword,
    };

    this.userService.updatePassword(Number(userId), userUpdate).pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        if (result) {
          this.commonService.showSuccess("Password changed successfully.");
          this.authService.logout('/login',true);
        } else {
          this.commonService.showError("Failed to update password.");
        }
      }
    });
  }

  private initForm(): void {
    this.formGroup = new FormGroup({
      currentPassword: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required),
      userName: new FormControl({ value: this.authService.getUserName(), disabled: true })
    });
  }
  private initFields(): void {
    this.fields = [
      { type: 'input', name: 'userName', label: 'User Name', colSpan: 6, maxLength: 8 },
      { type: 'password', name: 'currentPassword', label: 'Current Password', colSpan: 6, maxLength: 20 },
      { type: 'password', name: 'password', label: 'Password', colSpan: 6, maxLength: 20 },
      { type: 'password', name: 'confirmPassword', label: 'Confirm Password', colSpan: 6, maxLength: 50 }
    ];
  }
  private initActionButtons(): void {
    this.actionButtons = [
      {
        label: 'Update',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: (form: FormGroup) => this.update(form),
        params: { form: this.formGroup },
        validate: true,
        isHidden: false
      },
      {
        label: 'Cancel',
        icon: 'fas fa-times mr-2',
        class: 'btn-cancel',
        callback: () => this.router.navigate(['/dashboard']),
        validate: false,
        isHidden: false
      }
    ];
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
