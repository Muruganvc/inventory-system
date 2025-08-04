import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';

import { DynamicFormComponent } from '../../shared/components/dynamic-form/dynamic-form.component';
import { CustomTableComponent } from '../../shared/components/custom-table/custom-table.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { InvoiceComponent } from '../order-summary/invoice/invoice.component';
import { SalesConfirmDialogComponent } from './sales-confirm-dialog/sales-confirm-dialog.component';

import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { CommonService } from '../../shared/services/common.service';

import { ActionButtons } from '../../shared/common/ActionButton';
import { KeyValuePair } from '../../shared/common/KeyValuePair';
import { ProductEntry } from '../../models/ProductEntry';
import { ProductsResponse } from '../../models/ProductsResponse';
import { OrderCreateRequest } from '../../models/CustomerRequest';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [DynamicFormComponent, CustomTableComponent, InvoiceComponent],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss'
})
export class SalesComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly commonService = inject(CommonService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('printFrame', { static: true }) printFrame!: ElementRef;
  @ViewChild(InvoiceComponent) invoiceComponent!: InvoiceComponent;

  isPrint = false;
  formGroup!: FormGroup;

  pageHeader = 'Sales Details';
  showHeader = false;

  fields: any[] = [];
  actionButtons: ActionButtons[] = [];
  products: ProductsResponse[] = [];
  productsList: KeyValuePair[] = [];
  productSales: ProductEntry[] = [];

	 columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean }[] = [
    { key: 'productName', label: 'Prod. Name', align: 'left', isHidden: false },
    { key: 'serialNo', label: 'Serial No.', align: 'left', isHidden: false },
    { key: 'mrp', label: 'MRP ₹', align: 'left', isHidden: false },
    { key: 'salesPrice', label: 'Sales Price', align: 'left', isHidden: false },
    { key: 'price', label: 'Price ₹', align: 'left', isHidden: false },
    { key: 'quantity', label: 'Quantity', align: 'left', isHidden: false },
    { key: 'totalAmount', label: 'Amount ₹', align: 'left', isHidden: false }
  ];

  tableActions = [
    { iconClass: 'fas fa-pencil-alt', color: 'green', tooltip: 'Edit', action: 'edit', condition: (row: any) => !row.isEditing },
    { iconClass: 'fas fa-trash-alt', color: 'red', tooltip: 'Delete', action: 'delete', condition: (row: any) => !row.isEditing }
  ];

  ngOnInit(): void {
    this.initForm();
    this.initFields();
    this.initActionButtons();
    this.getProducts();
    this.bindProductChange();
    this.bindTotalAmountChange();
  }

  private initForm(): void {
    this.formGroup = new FormGroup({
      product: new FormControl(null, Validators.required),
      mrp: new FormControl({ value: null, disabled: true }, Validators.required),
      price: new FormControl(null, Validators.required),
      quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
      availableQuantity: new FormControl({ value: null, disabled: true }),
      salesPrice: new FormControl({ value: null, disabled: true }),
      totalAmount: new FormControl({ value: null, disabled: true }),
      netAmount: new FormControl({ value: null, disabled: true }),
      landingPrice: new FormControl({ value: null, disabled: true }),
      serialNo: new FormControl(null)
    });
  }

  private initFields(): void {
    const isAdmin = false;
    this.fields = [
      { type: 'searchable-select', name: 'product', label: 'Product Name', colSpan: 6, options: [] },
      { type: 'input', name: 'mrp', label: 'MRP ₹', colSpan: 2, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'salesPrice', label: 'Sales Price', colSpan: isAdmin ? 3 : 2 },
      { type: 'input', name: 'landingPrice', label: 'Landing Price', colSpan: isAdmin ? 3 : 2 },
      { type: 'input', name: 'serialNo', label: 'Serial No', colSpan: 4, maxLength: 15 },
      { type: 'input', name: 'price', label: 'Price ₹', colSpan: 2, isNumOnly: true, maxLength: 8, isNumberOnly: true },
      { type: 'input', name: 'availableQuantity', label: 'Available Qty', colSpan: 2, isReadOnly: true },
      { type: 'input', name: 'quantity', label: 'Quantity', colSpan: 2, isNumOnly: true, maxLength: 8, isNumberOnly: true },
      { type: 'input', name: 'totalAmount', label: 'Total Amount ₹', colSpan: 2, isReadOnly: true }
    ];
  }

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

  private getProducts(): void {
    this.productService.getProducts('sales').subscribe(res => {
      this.products = res;
      this.productsList = res.map(p => ({
        key: `${p.companyName} ${p.categoryName} ${p.productCategoryName}`,
        value: p.productId
      }));
      this.updateFieldOptions('product', this.productsList);
    });
  }

  private updateFieldOptions(fieldName: string, options: KeyValuePair[]): void {
    const field = this.fields.find(f => f.name === fieldName);
    if (field) field.options = options;
  }

  private bindProductChange(): void {
    this.formGroup.get('product')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(value => !!value)
    ).subscribe(selected => {
      const selectedProduct = this.products.find(p => p.productId === selected.value);
      if (selectedProduct) this.patchForm(selectedProduct);
    });
  }

  private bindTotalAmountChange(): void {
    const priceControl = this.formGroup.get('price');
    const quantityControl = this.formGroup.get('quantity');
    const mrpControl = this.formGroup.get('mrp');
    const availableQtyControl = this.formGroup.get('availableQuantity');
    const totalAmountControl = this.formGroup.get('totalAmount');

    if (!priceControl || !quantityControl || !mrpControl || !availableQtyControl || !totalAmountControl) return;

    const getNum = (ctrl: AbstractControl | null) => +ctrl?.value || 0;

    merge(priceControl.valueChanges, quantityControl.valueChanges, mrpControl.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        let price = getNum(priceControl);
        let quantity = getNum(quantityControl);
        const mrp = getNum(mrpControl);
        const availableQty = getNum(availableQtyControl);

        if (price > mrp) {
          priceControl.setValue(mrp, { emitEvent: false });
          return;
        }

        if (quantity > availableQty) {
          quantityControl.setValue(availableQty, { emitEvent: false });
          return;
        }

        totalAmountControl.setValue(price * quantity, { emitEvent: false });
      });
  }

  private patchForm(product: ProductsResponse): void {
    this.formGroup.patchValue({
      mrp: product.mrp,
      availableQuantity: product.quantity,
      totalAmount: 0,
      salesPrice: product.salesPrice,
      landingPrice: product.landingPrice
    });
  }

  onAction(event: { row: ProductEntry; action: string }) {
    const { row, action } = event;
    if (action === 'edit') this.onEdit(row);
    if (action === 'delete') this.handleCancel();
  }

  private handleSave(params: any): void {
    const isValid = this.addProduct(params.form.value);
    const netAmount = this.formGroup.get('netAmount')?.value;
    if (isValid) this.formGroup.reset();
    this.formGroup.patchValue({ netAmount }, { emitEvent: false });
  }

  private handleCancel(): void {
    if (!this.productSales.length) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '100%',
      maxWidth: '350px',
      disableClose: true,
      data: {
        title: 'Sale Items',
        message: 'Are you sure do you want to clear?..',
        okBtn: { title: 'Yes, Confirm', isHiden: true },
        cancel: { title: 'Cancel', isHiden: true }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productSales = [];
        this.formGroup.reset();
      }
    });
  }

  private handleConfirm(): void {
    if (!this.productSales.length) {
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
      });
      return;
    }

    const totalAmount = this.productSales.reduce((sum, item) => sum + item.totalAmount, 0);

    const dialogRef = this.dialog.open(SalesConfirmDialogComponent, {
      width: '90%',
      maxWidth: '600px',
      height: '470px',
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
        givenAmount: result.givenAmount,
        gstNumber: result.gstNumber,
        isGst: !!result.isGst
      };

      this.orderService.createOrder(request).subscribe(response => {
        if (response > 0) {
          const printDialog = this.dialog.open(ConfirmDialogComponent, {
            width: '100%',
            maxWidth: '400px',
            disableClose: true,
            data: {
              title: 'Print Invoice',
              message: 'Do you want to print invoice..',
              okBtn: { title: 'Yes, Confirm', isHiden: true },
              cancel: { title: 'No', isHiden: true }
            }
          });

          printDialog.afterClosed().subscribe(result => {
            if (result) this.onPrint(response);
          });

          this.commonService.showSuccess('Order created successfully.');
          this.formGroup.reset();
          this.productSales = [];
        }
      });
    });
  }

  private addProduct(form: any): boolean {
    const { product, price, quantity, serialNo } = form;
    const productId = product?.value;
    if (this.productSales.some(p => p.productId === productId)) {
      this.commonService.showWarning('Product already exists.');
      return false;
    }
    if (!price || Number(price) === 0) {
      this.commonService.showWarning('Please enter unit price.');
      return false;
    }

    if (!quantity || Number(quantity) === 0) {
      this.commonService.showWarning('Please enter quantity.');
      return false;
    }
    const selectedProduct = this.products.find(p => p.productId === productId);
    if (!selectedProduct) {
      this.commonService.showWarning('Selected product not found.');
      return false;
    }
    if (selectedProduct.quantity === 0) {
      this.commonService.showWarning('This product is currently out of stock.');
      return false;
    }
    if (Number(price) < selectedProduct.landingPrice) {
      this.commonService.showWarning('Unit price should not be less than Landing Price.');
      return false;
    }
    const newProduct: ProductEntry = {
      productId: selectedProduct.productId,
      id: selectedProduct.productId,
      productName: `${selectedProduct.companyName} ${selectedProduct.categoryName} ${selectedProduct.productCategoryName}`,
      mrp: selectedProduct.mrp,
      salesPrice: selectedProduct.salesPrice,
      price: Number(price),
      quantity: Number(quantity),
      totalAmount: Number(price) * Number(quantity),
      serialNo
    };

    this.productSales = [...this.productSales, newProduct];
    return true;
  }


  onEdit(entry: ProductEntry): void {
    this.productSales = this.productSales.filter(p => p.id !== entry.id);
    const selectedProduct = this.products.find(p => p.productId === entry.id);

    this.formGroup.patchValue({
      product: { key: entry.productName, value: entry.id },
      mrp: entry.mrp,
      price: entry.price,
      quantity: entry.quantity,
      totalAmount: entry.price * entry.quantity,
      availableQuantity: selectedProduct?.quantity,
      serialNo: entry.serialNo
    });
  }

  async onPrint(orderId: number): Promise<void> {
    this.isPrint = true;
    await this.commonService.onPrint(orderId, this.invoiceComponent, this.printFrame);
  }
}
