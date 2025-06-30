import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';  
import { ProductsResponse } from '../../../models/ProductsResponse'; 
import { AuthService } from '../../../services/auth.service'; 
import { ActionButtons } from '../../../shared/common/ActionButton'; 
import { CommonService } from '../../../shared/services/common.service';
import { DynamicFormComponent } from "../../../shared/components/dynamic-form/dynamic-form.component";
import { NewUserRequest } from '../../../models/NewUserRequest';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './new-user.component.html',
  styleUrl: './new-user.component.scss'
})
export class NewUserComponent implements OnInit { 
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly commonService = inject(CommonService);
  private readonly userService = inject(UserService);
  errorHtml: string;
  formGroup!: FormGroup;
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];
  pageHeader = 'New User';
  productResponse: ProductsResponse;

  ngOnInit(): void {
    this.initForm();
    this.initFields();
    this.initActionButtons();
  }
 

  private initForm(): void {
    this.formGroup = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      userName: new FormControl(null,Validators.required),
      email: new FormControl(null, Validators.required),
      role: new FormControl(null, Validators.required),
    });
  }

  private initFields(): void {
    const isAdmin = !this.authService.hasRole(["Admin"])
    this.fields = [
      { type: 'input', name: 'firstName', label: 'First Name', colSpan: 6, maxLength: 20 },
      { type: 'input', name: 'lastName', label: 'Last Name', colSpan: 6, maxLength: 20 },
      { type: 'input', name: 'userName', label: 'User Name', colSpan: 6, maxLength: 20 },
      { type: 'input', name: 'email', label: 'Email', colSpan: 6, maxLength: 20 },
      {
        type: 'radio', name: 'role', label: 'Role', colSpan: 6, isReadOnly: false,
        options: [
          { label: 'Admin', value: 1 },
          { label: 'User', value: 2 },
        ]
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
        isHidden: false
      },
      {
        label: 'Clear',
        icon: 'fas fa-broom',
        class: 'btn-clear',
        callback: this.handleClear.bind(this),
        validate: false,
        isHidden: false
      },
      {
        label: 'Back',
        icon: 'fas fa-arrow-left',
        class: 'btn-back',
        callback: this.handleBack.bind(this),
        validate: false,
        isHidden: false
      }
    ];
  }

  handleSave = (form: any): void => {
    const user: NewUserRequest = {
      emailId:form.form.value.email,
      firstName: form.form.value.firstName,
      lastName: form.form.value.lastName,
      role: +form.form.value.role,
      userName: form.form.value.userName
    };

    this.userService.createNewUser(user).subscribe({
      next: result => {
          if(!!result){
            this.commonService.showSuccess("New User Created.");
          }
      }
    });
  }
  handleClear = (): void => {
    this.formGroup.reset();

  }

  handleBack = (): void => {
   this.router.navigate(['/setting/user-list'])
  }

}