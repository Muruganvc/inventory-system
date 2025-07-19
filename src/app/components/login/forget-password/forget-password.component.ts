import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DynamicFormComponent } from "../../../shared/components/dynamic-form/dynamic-form.component";
import { ActionButtons } from '../../../shared/common/ActionButton';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<ForgetPasswordComponent>
  ) {

    this.userForm = new FormGroup({
      userName: new FormControl(null, [Validators.required]),
      mobileNo: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]{10}$/) // ensures only digits
      ])
    });

  }
  ngOnInit(): void {
    this.initFields();
    this.initActionButtons();
  }
  fields: any[] = [];
  userForm: FormGroup;
  actionButtons: ActionButtons[] = [];
  initFields = (): void => {
    this.fields = [
      { type: 'input', name: 'userName', label: 'User Name', colSpan: 12, isNumOnly: true, maxLength: 50 },
      { type: 'input', name: 'mobileNo', label: 'Mobile No.', colSpan: 12, isNumOnly: true, maxLength: 10 }
    ];
  }


  initActionButtons = (): void => {
    this.actionButtons = [
      {
        label: 'Update',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: this.handleSave.bind(this),
        params: { form: this.userForm },
        validate: true,
        isHidden: false
      },
      {
        label: 'Cancel',
        icon: 'fas fa-broom',
        class: 'btn-cancel',
        callback: this.handleCancel.bind(this),
        validate: false,
        isHidden: false
      }
    ];
  }

  handleSave(form: any): void {
    const { userName, mobileNo } = form.form.value;

    if (!userName || !mobileNo) {
      this.commonService.showError("Username and Mobile No are required.");
      return;
    }

    this.userService.forgetPassword(userName, mobileNo).subscribe({
      next: (result) => {
        if (result) {
          this.commonService.showSuccess("Password has been changed. Please contact the support team.");
          this.userForm.reset();
          this.dialogRef.close(null);
        }
      }
    });
  }

  handleCancel = (): void => {
    this.dialogRef.close(this.userForm.value);
  }

}
