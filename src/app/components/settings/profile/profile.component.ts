import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';

import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ActionButtons } from '../../../shared/common/ActionButton';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    DynamicFormComponent,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  formGroup!: FormGroup;
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly commonService = inject(CommonService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.initForm();
    this.initFields();
    this.initActionButtons();
    this.loadUser();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private loadUser(): void {
    const userName = this.authService.getUserName();
    this.userService.getUser(userName).subscribe({
      next: user => {
        if (user) {
          this.formGroup.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            mobileNo: user.mobileNo
          });

          if (user.profileImageBase64) {
            this.imagePreview = user.profileImageBase64;
          }
        }
      }
    });
  }

  private updateUser(form: any): void {
    const userId = this.authService.getUserId();

    const formData = new FormData();
    formData.append('FirstName', form.form.value.firstName);
    formData.append('LastName', form.form.value.lastName);
    formData.append('Email', form.form.value.email);
    formData.append('MobileNo', form.form.value.mobileNo);

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    this.userService.updateUserWithImage(Number(userId), formData).subscribe({
      next: result => {
        if (result) {
          this.commonService.showSuccess("Successfully updated");

          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '100%',
            maxWidth: '400px',
            disableClose: true,
            data: {
              title: 'Reload',
              message: 'Are you sure you want to Reload?',
              okBtn: { title: 'Yes, Confirm', isHiden: true },
              cancel: { title: 'Cancel', isHiden: true }
            }
          });

          dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
              window.location.reload();
            }
          });
        }
      }
    });
  }

  private initForm(): void {
    this.formGroup = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      userName: new FormControl({ value: null, disabled: true }),
      email: new FormControl(null, [Validators.required, Validators.email]),
      mobileNo: new FormControl(null, [Validators.required, Validators.maxLength(10)])
    });
  }

  private initFields(): void {
    this.fields = [
      { type: 'input', name: 'userName', label: 'User Name', colSpan: 12, maxLength: 8 },
      { type: 'input', name: 'firstName', label: 'First Name', colSpan: 6, maxLength: 20 },
      { type: 'input', name: 'lastName', label: 'Last Name', colSpan: 6, maxLength: 20 },
      { type: 'input', name: 'email', label: 'Email', colSpan: 6, maxLength: 50 },
      { type: 'input', name: 'mobileNo', label: 'Mobile No', colSpan: 6, maxLength: 10 }
    ];
  }

  private initActionButtons(): void {
    this.actionButtons = [
      {
        label: 'Update',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: (form: FormGroup) => this.updateUser(form),
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
}
