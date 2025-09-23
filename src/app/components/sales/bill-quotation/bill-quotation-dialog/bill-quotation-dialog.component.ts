import { Component, Inject } from '@angular/core';
import { DynamicFormComponent } from "../../../../shared/components/dynamic-form/dynamic-form.component";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionButtons } from '../../../../shared/common/ActionButton';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-bill-quotation-dialog',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './bill-quotation-dialog.component.html',
  styleUrl: './bill-quotation-dialog.component.scss'
})
export class BillQuotationDialogComponent {
  userForm: FormGroup;
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BillQuotationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = new FormGroup({
      customerName: new FormControl(null, [Validators.required]),
      mobileNo: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]{10}$/), Validators.minLength(10),
      Validators.maxLength(10)]),
      address: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.initFields();
    this.initActionButtons();
  }

  initFields = (): void => {
    this.fields = [
      { type: 'input', name: 'customerName', label: 'Customer Name', colSpan: 6, maxLength: 50 },
      { type: 'input', name: 'mobileNo', label: 'Mobile No', colSpan: 6, maxLength: 10 },
      { type: 'input', name: 'address', label: 'Address', colSpan: 12 },
    ];
  }

  initActionButtons = (): void => {
    this.actionButtons = [
      {
        label: 'Print',
        icon: 'fas fa-print',
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
  handleCancel = (): void => {
    this.dialogRef.close();
  }

  private handleSave(params: any): void {
    const formValue = params.form.value;
    if (!formValue.customerName?.trim() || !formValue.mobileNo?.trim()) {
      return;
    }
    const customer: any = {
      address: formValue.address,
      customerName: formValue.customerName,
      phone: formValue.mobileNo ?? ''
    };
    // Close dialog and return result
    this.dialogRef.close(customer);
  }
}
