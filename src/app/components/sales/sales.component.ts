import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActionButtons } from '../../shared/common/ActionButton';
import { DynamicFormComponent } from "../../shared/components/dynamic-form/dynamic-form.component";
import { CustomTableComponent } from "../../shared/components/custom-table/custom-table.component";
import { ProductEntry } from '../../models/ProductEntry';
import { ProductService } from '../../services/product.service';
import { ProductsResponse } from '../../models/ProductsResponse';
import { KeyValuePair } from '../../shared/common/KeyValuePair';

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
      product: new FormControl(null),
      mrp: new FormControl({ value: null, disabled: true }, Validators.required),
      price: new FormControl(null, Validators.required),
      quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
      availableQuantity: new FormControl({ value: null, disabled: true }),
      taxPercent: new FormControl({ value: null, disabled: true }),
      totalAmount: new FormControl({ value: null, disabled: true })
    });
  }

  private initFields(): void {
    const isAdmin = false;
    this.fields = [
      { type: 'searchable-select', name: 'product', label: 'Product Name', colSpan: 6, options: [] },
      { type: 'input', name: 'availableQuantity', label: 'Available Qty', colSpan: 2, isReadOnly: true },
      { type: 'input', name: 'mrp', label: 'MRP ₹', colSpan: 2, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'taxPercent', label: 'Tax %', colSpan: isAdmin ? 3 : 2, isNumOnly: true, maxLength: 2 },
      { type: 'input', name: 'price', label: 'Price ₹', colSpan: 2, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'quantity', label: 'Quantity', colSpan: 2, isNumOnly: true, maxLength: 8 },
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
        icon: 'fas fa-arrow-left',
        class: 'btn-confirm',
        callback: this.handleBack.bind(this),
        validate: false,
        isHidden: false
      }
    ];
  }

  /** -------------------- DATA BINDING -------------------- */

  private getProducts(): void {
    this.productService.getProducts().subscribe({
      next: res => {
        this.products = res.data;
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

    if (!priceControl || !quantityControl || !mrpControl) return;

    merge(priceControl.valueChanges, quantityControl.valueChanges, mrpControl.valueChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const mrp = +mrpControl.value || 0;
        const price = +priceControl.value || 0;
        const quantity = +quantityControl.value || 0;

        if (price > mrp) {
          priceControl.setValue(mrp, { emitEvent: false }); // prevent further event loop
          return;
        }

        const total = price * quantity;
        this.formGroup.get('totalAmount')?.setValue(total, { emitEvent: false });
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
    this.formGroup.reset();
  }

  private handleCancel(): void {
    this.formGroup.reset();
  }

  private handleBack(): void {
    // Future: back navigation
  }

  /** -------------------- PRODUCT ADD -------------------- */

  private addProduct(form: any): void {
    const selectedProduct = this.products.find(p => p.productId === form.product.value);
    if (!selectedProduct) return;

    const totalAmount = this.calculateGSTFromBasePrice((form.price * form.quantity), selectedProduct.taxPercent).totalPrice;

    const newProduct: ProductEntry = {
      id: crypto.randomUUID(),
      productName: selectedProduct.productName,
      mrp: selectedProduct.mrp,
      taxPercent: selectedProduct.taxPercent,
      price: form.price,
      quantity: form.quantity,
      totalAmount
    };

    this.productSales = [...this.productSales, newProduct];
  }

  /** -------------------- TABLE EVENTS -------------------- */

  onEdit(entry: ProductEntry): void {
    // Future: implement edit
  }

  onDelete(entry: ProductEntry): void {
    this.productSales = this.productSales.filter(p => p.id !== entry.id);
  }

  handleFieldChange(event: any): void {
    // Future: handle dynamic field change
  }
}
