import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActionButtons } from '../../../shared/common/ActionButton';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserService } from '../../../services/user.service';
import { Customer } from '../../../models/Customer';
import { KeyValuePair } from '../../../shared/common/KeyValuePair';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, filter, merge, startWith } from 'rxjs';
import { CustomerRequest, OrderItemRequest } from '../../../models/CustomerRequest';
import { ProductEntry } from '../../../models/ProductEntry';

@Component({
  selector: 'app-sales-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule,
    NgSelectModule, DynamicFormComponent
  ],
  templateUrl: './sales-confirm-dialog.component.html',
  styleUrl: './sales-confirm-dialog.component.scss'
})
export class SalesConfirmDialogComponent implements OnInit {
  userForm: FormGroup;
  pageHeader: 'Customer Information';
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];
  customers: Customer[] = [];
  customerDropDown: KeyValuePair[] = [];
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SalesConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = new FormGroup({
      customerName: new FormControl(null, [Validators.required]),
      mobileNo: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]{10}$/) // ensures only digits
      ]),
      address: new FormControl(null),
      disCountPercent: new FormControl(null),
      taxPercent: new FormControl({ value: null, disabled: false }),
      finalTotal: new FormControl({ value: data.netTotal, disabled: true }),
      netTotal: new FormControl({ value: data.netTotal, disabled: true }),
      disCountAmount: new FormControl({ value: data.netTotal, disabled: true }),
      givenAmount: new FormControl({ value: null, disabled: false }),
      balanceAmount: new FormControl({ value: data.netTotal, disabled: true }),
    });
  }
  ngOnInit(): void {
    this.initFields();
    this.initActionButtons();
    this.getCustomers();
    this.bindCustomerEvent();
    this.bindFinalTotalCalculation();
    this.bindCalculateBalance();
  }

  private getCustomers = (): void => {
    this.userService.getCustomers().subscribe({
      next: result => {
        this.customers = result;
        result.map(m => {
          this.customerDropDown.push({
            key: m.customerName,
            value: m.customerId
          });
        });
        this.updateFieldOptions('customerName', this.customerDropDown)
      }
    })
  }


  bindCustomerEvent = (): void => {
    const customerNameControl = this.userForm.get('customerName');
    if (!customerNameControl) return;
    merge(customerNameControl.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        const cust = this.customers.find(a => a.customerId == result.value);
        this.userForm.get('mobileNo')?.setValue(cust?.phone, { emitEvent: false });
        this.userForm.get('address')?.setValue(cust?.address, { emitEvent: false });
      });
  }

  private updateFieldOptions(fieldName: string, options: KeyValuePair[]): void {
    const field = this.fields.find(f => f.name === fieldName);
    if (field) field.options = options;
  }

  initActionButtons = (): void => {
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

  private handleSave(params: any): void {
    const formValue = params.form.value;
    const hasCustomerId = typeof formValue.customerName?.value !== 'undefined';
    const customer: CustomerRequest = {
      address: formValue.address,
      customerId: hasCustomerId ? formValue.customerName.value : 0,
      customerName: formValue.customerName.key,
      phone: formValue.mobileNo
    };

    const orderItems: OrderItemRequest[] = this.data.orderItems.map((item: ProductEntry) => ({
      discountPercent: formValue.disCountPercent,
      productId: item.productId,
      quantity: item.quantity,
      remarks: formValue.remarks,
      unitPrice: item.price
    }));

    const result = {
      ...this.userForm.value,
      customer,
      orderItems
    };

    this.dialogRef.close(result);
  }

  handleCancel = (): void => {
    this.dialogRef.close(this.userForm.value);
  }

  initFields = (): void => {
    this.fields = [
      {
        type: 'searchable-select', name: 'customerName', label: 'Customer Name', colSpan: 6, options: [],
        addTag: true,
      },
      { type: 'input', name: 'mobileNo', label: 'Mobile No.', colSpan: 6, isNumOnly: true, maxLength: 10 },
      { type: 'input', name: 'address', label: 'Address', colSpan: 12 },
      { type: 'input', name: 'disCountPercent', label: 'Discount Percent %', colSpan: 4, isNumOnly: true, maxLength: 2 },
      { type: 'input', name: 'givenAmount', label: 'Given Amount %', colSpan: 4, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'balanceAmount', label: 'Balance Amount %', colSpan: 4, isNumOnly: true, maxLength: 8 },
      { type: 'textarea', name: 'remarks', label: 'Remarks', colSpan: 12 }
    ];
  }


  private bindCalculateBalance = (): void => {
    const givenAmountControl = this.userForm.get('givenAmount');
    const finalTotalControl = this.userForm.get('finalTotal');

    if (!givenAmountControl || !finalTotalControl) return;

    givenAmountControl.valueChanges
      .pipe(
        filter(value => value !== null && value !== undefined),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        const givenAmount = +value;
        const finalAmount = +finalTotalControl.value || 0;

        // Cap the given amount to final amount if it exceeds
        if (givenAmount > finalAmount) {
          this.userForm.patchValue({
            givenAmount: finalAmount,
            balanceAmount: 0
          }, { emitEvent: false });
          return;
        }

        const balanceAmount = Number((finalAmount - givenAmount).toFixed(2));

        this.userForm.patchValue(
          { balanceAmount },
          { emitEvent: false }
        );
      });
  };


  private bindFinalTotalCalculation(): void {
    const discountPercentControl = this.userForm.get('disCountPercent');
    if (!discountPercentControl) return;

    discountPercentControl.valueChanges
      .pipe(
        startWith(discountPercentControl.value || 0),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((discountPercent) => {
        const netTotal = +this.data?.netTotal || 0;
        const discount = +discountPercent || 0;
        const total = this.applyDiscountWithGST(netTotal, discount, 0);
        var givenAmount = this.userForm.get('givenAmount')?.value || 0;
        const balanceAmount = Number((total.finalAmount - +givenAmount).toFixed(2));
        this.userForm.patchValue({
          disCountAmount: total.discountAmount,
          finalTotal: total.finalAmount,
          balanceAmount: balanceAmount > 0 ? balanceAmount : total.finalAmount
        }, { emitEvent: false });
      });
  }


  applyDiscountWithGST(totalAmountWithGST: number, discountPercent: number, discountTaxPercent: number) {
    const discountAmount = totalAmountWithGST * discountPercent / 100;
    const discountTaxAmount = discountAmount * discountTaxPercent / 100;
    const finalAmount = totalAmountWithGST - discountAmount - discountTaxAmount;

    return {
      totalAmountWithGST: +totalAmountWithGST.toFixed(2),
      discountAmount: +discountAmount.toFixed(2),
      discountTaxAmount: +discountTaxAmount.toFixed(2),
      finalAmount: +finalAmount.toFixed(2)
    };
  }
}
