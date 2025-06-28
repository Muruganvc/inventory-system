import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActionButtons } from '../../shared/common/ActionButton';
import { DynamicFormComponent } from "../../shared/components/dynamic-form/dynamic-form.component";
import { CustomTableComponent } from "../../shared/components/custom-table/custom-table.component";
import { ProductEntry } from '../../models/ProductEntry';
import { ProductService } from '../../services/product.service';
import { ProductsResponse } from '../../models/ProductsResponse';
import { KeyValuePair } from '../../shared/common/KeyValuePair';
import { MatDialog } from '@angular/material/dialog';
import { SalesConfirmDialogComponent } from './sales-confirm-dialog/sales-confirm-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { OrderService } from '../../services/order.service';
import { OrderCreateRequest } from '../../models/CustomerRequest';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [DynamicFormComponent, CustomTableComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly orderService = inject(OrderService);

  formGroup!: FormGroup;
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];

  pageHeader = 'Sales Details';
  showHeader = false;

  products: ProductsResponse[] = [];
  productsList: KeyValuePair[] = [];
  productSales: ProductEntry[] = [];

  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean }[] = [
    { key: 'productName', label: 'Prod. Name', align: 'left', isHidden: false },
    { key: 'mrp', label: 'MRP ₹', align: 'left', isHidden: false },
    { key: 'taxPercent', label: 'Tax %', align: 'left', isHidden: false },
    { key: 'price', label: 'Price ₹', align: 'left', isHidden: false },
    { key: 'quantity', label: 'Quantity', align: 'left', isHidden: false },
    { key: 'totalAmount', label: 'Amount ₹', align: 'left', isHidden: false }
  ];

  ngOnInit(): void {
    this.initForm();
    this.initFields();
    this.initActionButtons();
    this.getProducts();
    this.bindProductChange();
    this.bindTotalAmountChange();
  }

  /** -------------------- INIT -------------------- */

  private initForm(): void {
    this.formGroup = new FormGroup({
      product: new FormControl(null, [Validators.required]),
      mrp: new FormControl({ value: null, disabled: true }, Validators.required),
      price: new FormControl(null, Validators.required),
      quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
      availableQuantity: new FormControl({ value: null, disabled: true }),
      taxPercent: new FormControl({ value: null, disabled: true }),
      totalAmount: new FormControl({ value: null, disabled: true }),
      netAmount: new FormControl({ value: null, disabled: true })
    });
  }

  private initFields(): void {
    const isAdmin = false;
    this.fields = [
      { type: 'searchable-select', name: 'product', label: 'Product Name', colSpan: 6, options: [] },
      { type: 'input', name: 'availableQuantity', label: 'Available Qty', colSpan: 2, isReadOnly: true },
      { type: 'input', name: 'mrp', label: 'MRP ₹', colSpan: 2, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'taxPercent', label: 'Tax %', colSpan: isAdmin ? 3 : 2, isNumOnly: true, maxLength: 2,isNumberOnly: true  },
      { type: 'input', name: 'price', label: 'Price ₹', colSpan: 2, isNumOnly: true, maxLength: 8,isNumberOnly: true  },
      { type: 'input', name: 'quantity', label: 'Quantity', colSpan: 2, isNumOnly: true, maxLength: 8,isNumberOnly: true  },
      { type: 'input', name: 'totalAmount', label: 'Total Amount ₹', colSpan: 2, isReadOnly: true }
    ];
  }

  
  tableActions =
    [
      {
        iconClass: 'fas fa-pencil-alt',
        color: 'green',
        tooltip: 'Edit',
        action: 'edit',
        condition: (row: any) => !row.isEditing
      },
      {
        iconClass: 'fas fa-trash-alt',
        color: 'red',
        tooltip: 'Delete',
        action: 'delete',
        condition: (row: any) => !row.isEditing
      }
    ];



  private initActionButtons(): void {
    this.actionButtons = [
      {
        label: 'Add to List',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: this.handleSave.bind(this),
        params: { form: this.formGroup },
        validate: true,
        isHidden: false
      },
      {
        label: 'Clear',
        icon: 'fas fa-broom',
        class: 'btn-clear',
        callback: this.handleCancel.bind(this),
        validate: false,
        isHidden: false
      },
      {
        label: 'Confirm',
        icon: 'fas fa-thumbs-up',
        class: 'btn-confirm',
        callback: this.handleConfirm.bind(this),
        validate: false,
        isHidden: false
      }
    ];
  }


  onAction(event: { row: ProductEntry; action: string }) {
    const { row, action } = event;
    switch (action) {
      case 'edit': this.onEdit(row); break;
      case 'delete': this.handleCancel(); break;
    }
  }


  /** -------------------- DATA BINDING -------------------- */

  private getProducts(): void {
    this.productService.getProducts('sales').subscribe({
      next: res => {
        this.products = res;
        this.productsList = this.products.map(p => ({
          key: p.productName,
          value: p.productId
        }));
        this.updateFieldOptions('product', this.productsList);
      },
      error: err => {
        console.error('Failed to load products:', err);
        this.productsList = [];
      }
    });
  }

  private updateFieldOptions(fieldName: string, options: KeyValuePair[]): void {
    const field = this.fields.find(f => f.name === fieldName);
    if (field) field.options = options;
  }

  private bindProductChange(): void {
    this.formGroup.get('product')?.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(value => !!value)
      )
      .subscribe(selected => {
        const selectedProduct = this.products.find(p => p.productId === selected.value);
        if (selectedProduct) {
          this.patchForm(selectedProduct);
        }
      });
  }

  private bindTotalAmountChange(): void {
    const priceControl = this.formGroup.get('price');
    const quantityControl = this.formGroup.get('quantity');
    const mrpControl = this.formGroup.get('mrp');
    const availableQuantityControl = this.formGroup.get('availableQuantity');
    const totalAmountControl = this.formGroup.get('totalAmount');
    if (!priceControl || !quantityControl || !mrpControl || !availableQuantityControl || !totalAmountControl) {
      return;
    }
    const getNumberValue = (control: AbstractControl | null): number =>
      control ? +control.value || 0 : 0;
    merge(priceControl.valueChanges, quantityControl.valueChanges, mrpControl.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        const price = getNumberValue(priceControl);
        const quantity = getNumberValue(quantityControl);
        const mrp = getNumberValue(mrpControl);
        const availableQty = getNumberValue(availableQuantityControl);
        if (price > mrp) {
          priceControl.setValue(mrp, { emitEvent: false });
          return;
        }
        if (quantity > availableQty) {
          quantityControl.setValue(availableQty, { emitEvent: false });
          return;
        }
        const total = price * quantity;
        totalAmountControl.setValue(total, { emitEvent: false });
      });
  }

  private patchForm(product: ProductsResponse): void {
    this.formGroup.patchValue({
      mrp: product.mrp,
      availableQuantity: product.quantity,
      taxPercent: product.taxPercent,
      totalAmount: 0
    });
  }

  /** -------------------- GST -------------------- */

  private calculateGSTFromBasePrice(basePrice: number, gstRate: number) {
    const gstAmount = (basePrice * gstRate) / 100;
    const totalPrice = basePrice + gstAmount;
    return { basePrice, gstAmount, totalPrice };
  }

  /** -------------------- ACTIONS -------------------- */

  private handleSave(params: any): void {
    this.addProduct(params.form.value);
    const netAmount = this.formGroup.get('netAmount')?.value;
    this.formGroup.reset();
    this.formGroup.patchValue({ 'netAmount': netAmount }, { emitEvent: false });
  }

  private handleCancel(): void {
    if (this.productSales.length > 0) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '100%',
        maxWidth: '350px',
        disableClose: true,
        data: {
          title: 'Sale Items',
          message: 'Are you sure do you want to clear?..',
          okBtn: {
            title: 'Yes, Confirm',
            isHiden: true
          },
          cancel: {
            title: 'Cancel',
            isHiden: true
          }
        }
      });
      dialogRef.afterClosed().subscribe({
        next: result => {
          if (result) {
            this.productSales.splice(0);
            this.productSales = [...this.productSales];
            this.formGroup.reset();
          }
        }
      });
    }
  }
  private handleConfirm(): void {
    if (this.productSales.length === 0) {
      this.dialog.open(ConfirmDialogComponent, {
        width: '100%',
        maxWidth: '400px',
        disableClose: true,
        data: {
          title: 'Sale Items',
          message: 'No sales item found. Please add.',
          okBtn: { title: 'Ok', isHiden: true },
          cancel: { title: 'Cancel', isHiden: false }
        }
      }).afterClosed().subscribe();
      return;
    }

    const totalAmount = this.productSales.reduce((sum, item) => sum + item.totalAmount, 0);

    const dialogRef = this.dialog.open(SalesConfirmDialogComponent, {
      width: '90%',
      maxWidth: '600px',
      height: '550px',
      disableClose: true,
      panelClass: 'no-radius-dialog',
      data: {
        name: '',
        mobileNo: '',
        address: '',
        orderItems: this.productSales,
        totalItems: this.productSales.length,
        netTotal: totalAmount
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const request: OrderCreateRequest = {
        customer: result.customer,
        orderItemRequests: result.orderItems,
        balanceAmount : result.balanceAmount
      };
      this.orderService.createOrder(request).subscribe({
        next: response => {
          console.log('✅ Order created successfully:', response);
          // TODO: Reset state, show success notification, etc.
        },
        error: error => {
          console.error('❌ Order creation failed:', error);
          // TODO: Show error notification to user
        }
      });
      console.log('📝 User confirmed order:', result);
    });
  }



  /** -------------------- PRODUCT ADD -------------------- */

  private addProduct(form: any): void {
    const selectedProduct = this.products.find(p => p.productId === form.product.value);
    if (!selectedProduct) return;
    const totalAmount = Number(this.calculateGSTFromBasePrice((form.price * form.quantity), selectedProduct.taxPercent).totalPrice.toFixed(2));

    const newProduct: ProductEntry = {
      productName: selectedProduct.productName,
      mrp: selectedProduct.mrp,
      taxPercent: selectedProduct.taxPercent,
      price: form.price,
      quantity: form.quantity,
      totalAmount : (form.price * form.quantity),
      productId: selectedProduct.productId,
      id: form.product.value
    };

    this.productSales = [...this.productSales, newProduct];
  }

  /** -------------------- TABLE EVENTS -------------------- */

  onEdit(entry: ProductEntry): void {
    this.productSales = this.productSales.filter(p => p.id !== entry.id);
    const selectedProduct = this.products.find(p => p.productId === entry.id);
    this.formGroup.patchValue({
      product: { key: entry.productName, value: entry.id },
      mrp: entry.mrp,
      taxPercent: entry.taxPercent,
      price: entry.price,
      quantity: entry.quantity,
      totalAmount: entry.price * entry.quantity,
      availableQuantity: selectedProduct?.quantity
    });
  }


  onDelete(entry: ProductEntry): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '100%',
      maxWidth: '400px',
      disableClose: true,
      data: {
        title: 'Sale Items',
        message: 'Are you sure do you want delete..',
        okBtn: {
          title: 'Yes, Confirm',
          isHiden: true
        },
        cancel: {
          title: 'Cancel',
          isHiden: true
        }
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if (result) {
          this.productSales = this.productSales.filter(p => p.id !== entry.id);
        }
      }
    });
  }

  handleFieldChange(event: any): void {
    // Future: handle dynamic field change
  }
}
