import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DynamicFormComponent } from "../../../shared/components/dynamic-form/dynamic-form.component";
import { ActionButtons } from '../../../shared/common/ActionButton';

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
    public dialogRef: MatDialogRef<ForgetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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

  handleSave() {

  }
   handleCancel = (): void => {
    this.dialogRef.close(this.userForm.value);
  }

}
