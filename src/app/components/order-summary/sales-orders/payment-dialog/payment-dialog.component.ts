import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActionButtons } from '../../../../shared/common/ActionButton';
import { DynamicFormComponent } from "../../../../shared/components/dynamic-form/dynamic-form.component";
import { map, startWith, Subject } from 'rxjs';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];
  private destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      customerName: [data.customerName],
      mobileNo: [data.mobileNo],
      amount: [data.currentAmount],
      amountPaid: [null, Validators.required],
      balanceRemainingToPay: [null],
      paymentMethod: [null, Validators.required],
      transactionRefNo: [null]
    });
  }

  ngOnInit(): void {
    this.initFields();
    this.initActionButtons();
    this.bindPaymentChange();
  }

  private initFields(): void {
    this.fields = [
      { type: 'input', name: 'customerName', label: 'Customer Name', colSpan: 6, maxLength: 50, isReadOnly: true },
      { type: 'input', name: 'mobileNo', label: 'Mobile No', colSpan: 6, maxLength: 10, isReadOnly: true },
      { type: 'input', name: 'amount', label: 'Amount', colSpan: 6, isReadOnly: true },
      { type: 'input', name: 'amountPaid', label: 'Payment', colSpan: 6 },
      {
        type: 'searchable-select', name: 'paymentMethod', label: 'Payment Type ', colSpan: 6,
        options: [{ key: 'Cash Payments', value: 1 }, { key: 'Cheque Payments', value: 2 }, { key: 'Online Payments', value: 3 }],
        clear: (fieldName: string) => {

        }
      },
      { type: 'input', name: 'transactionRefNo', label: 'Transaction Ref No', colSpan: 6 },
      { type: 'display', name: 'balanceRemainingToPay', label: 'Balance Amount:', colSpan: 12, isReadOnly: true },
    ];
  }

  private initActionButtons(): void {
    this.actionButtons = [
      {
        label: 'Save',
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

  private handleCancel(): void {
    this.dialogRef.close();
  }

  private handleSave(params: any): void {
    const formValue = params.form.value;
    if (params.form.invalid) {
      return;
    }
    const payment = {
      amountPaid: Number(formValue.amountPaid),
      balanceRemainingToPay: Number(formValue.balanceRemainingToPay),
      paymentMethod: formValue.paymentMethod.key,
      transactionRefNo: formValue.transactionRefNo
    };

    this.dialogRef.close(payment);
  }

  private bindPaymentChange(): void {
    const paymentControl = this.userForm.get('amountPaid');
    const amountControl = this.userForm.get('amount');
    const balanceControl = this.userForm.get('balanceRemainingToPay');

    paymentControl?.valueChanges.pipe(
      startWith(paymentControl.value || 0),
      map(value => Number(value) || 0)
    ).subscribe(payment => {
      const amount = Number(amountControl?.value) || 0;

      if (payment > amount) {
        paymentControl.setValue(amount); // Auto-correct if over limit
        return;
      }

      const balance = amount - payment;
      balanceControl?.setValue(balance >= 0 ? balance : 0);
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
