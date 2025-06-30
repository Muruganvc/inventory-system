import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicFormComponent } from "../../../shared/components/dynamic-form/dynamic-form.component";
import { ActionButtons } from '../../../shared/common/ActionButton';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { UpdateUserRequest } from '../../../models/UpdateUserRequest';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  formGroup!: FormGroup;
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
    this.getUser();
  }

  getUser = (): void => {
    const userName = this.authService.getUserName();
    this.userService.getUser(userName).subscribe({
      next: result => {
        if (!!result) {
          this.formGroup.patchValue({
            firstName: result.firstName,
            lastName: result.lastName,
            userName: result.userName,
            email: result.email
          });
        }
      }
    });
  }

  update = (form: any): void => {
    const userId = this.authService.getUserId();

    const userUpdate: UpdateUserRequest = {
      email: form.form.value.email,
      firstName: form.form.value.firstName,
      lastName: form.form.value.lastName,
    };

    this.userService.updateUser(Number(userId), userUpdate).subscribe({
      next: (result) => {
        if (result) {
          this.commonService.showSuccessMessage("Successfully updated");
        }
      },
      error: (error) => {
        console.error('Update failed', error);
      }
    });
  };



  private initForm(): void {
    this.formGroup = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      userName: new FormControl({ value: null, disabled: true }),
      email: new FormControl(null, Validators.required)
    });
  }
  private initFields(): void {
    this.fields = [
      { type: 'input', name: 'firstName', label: 'First Name', colSpan: 6, maxLength: 20 },
      { type: 'input', name: 'lastName', label: 'Last Name', colSpan: 6, maxLength: 20 },
      { type: 'input', name: 'userName', label: 'User Name', colSpan: 6, maxLength: 8 },
      { type: 'input', name: 'email', label: 'Email', colSpan: 6, maxLength: 50 }
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
}
