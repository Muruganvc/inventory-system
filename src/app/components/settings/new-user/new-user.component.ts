import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { CommonService } from '../../../shared/services/common.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

import { ActionButtons } from '../../../shared/common/ActionButton';
import { NewUserRequest } from '../../../models/NewUserRequest';
import { ProductsResponse } from '../../../models/ProductsResponse';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss',
})
export class NewUserComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly commonService = inject(CommonService);
  private readonly userService = inject(UserService);

  formGroup!: FormGroup;
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];
  pageHeader = 'New User';
  productResponse!: ProductsResponse;

  ngOnInit(): void {
    this.initForm();
    this.initFields();
    this.initActionButtons();
  }

  private initForm(): void {
    this.formGroup = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      userName: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      role: new FormControl(null, Validators.required),
      mobileNo: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
    });
  }

  private initFields(): void {
    const isAdmin = !this.authService.hasRole(['Admin']);

    this.fields = [
      { type: 'input', name: 'firstName', label: 'First Name', colSpan: 6, maxLength: 20 },
      { type: 'input', name: 'lastName', label: 'Last Name', colSpan: 6, maxLength: 20 },
      { type: 'input', name: 'userName', label: 'User Name', colSpan: 12, maxLength: 20 },
      { type: 'input', name: 'email', label: 'Email', colSpan: 6, maxLength: 50 },
      { type: 'input', name: 'mobileNo', label: 'Mobile No', colSpan: 6, maxLength: 10 },
      {
        type: 'radio',
        name: 'role',
        label: 'Role',
        colSpan: 6,
        isReadOnly: isAdmin,
        options: [
          { label: 'Admin', value: 2 },
          { label: 'User', value: 3 },
        ],
      },
    ];
  }

  private initActionButtons(): void {
    this.actionButtons = [
      {
        label: 'Save',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: (form: FormGroup) => this.handleSave(form),
        params: { form: this.formGroup },
        validate: true,
        isHidden: false,
      },
      {
        label: 'Clear',
        icon: 'fas fa-broom',
        class: 'btn-clear',
        callback: this.handleClear.bind(this),
        validate: false,
        isHidden: false,
      },
      {
        label: 'Back',
        icon: 'fas fa-arrow-left',
        class: 'btn-back',
        callback: this.handleBack.bind(this),
        validate: false,
        isHidden: false,
      },
    ];
  }

  private handleSave(form: any): void {
    const value = form.form.value;
    const newUser: NewUserRequest = {
      emailId: value.email,
      firstName: value.firstName,
      lastName: value.lastName,
      role: +value.role,
      userName: value.userName,
      mobileNo: value.mobileNo,
    };

    this.userService.createNewUser(newUser).subscribe({
      next: result => {
        if (result) {
          this.commonService.showSuccess('New User Created.');
          this.formGroup.reset();
        }
      },
    });
  }

  private handleClear(): void {
    this.formGroup.reset();
  }

  private handleBack(): void {
    this.router.navigate(['/setting/user-list']);
  }
}
