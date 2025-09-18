import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicFormComponent } from '../../shared/components/dynamic-form/dynamic-form.component';
import { ProductService } from '../../services/product.service';
import { ProductRequest } from '../../models/ProductRequest';
import { UpdateProductRequest } from '../../models/UpdateProductRequest';
import { ProductsResponse } from '../../models/ProductsResponse';
import { KeyValuePair } from '../../shared/common/KeyValuePair';
import { ActionButtons } from '../../shared/common/ActionButton';
import { map, pairwise, startWith } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../shared/services/common.service';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [DynamicFormComponent, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly commonService = inject(CommonService);
  private readonly companyService = inject(CompanyService);
  errorHtml: string;
  formGroup!: FormGroup;
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];
  submitBtntitle = 'Submit';
  pageHeader = 'New Product';
  productResponse: ProductsResponse;

  ngOnInit(): void {
    this.initForm();
    this.productResponse = history.state.data;

    if (this.productResponse) {
      this.patchForm(this.productResponse);
      this.pageHeader = 'Update Product';
    } else {
      this.pageHeader = 'New Product';
    }

    this.initFields();
    this.loadCompanyCategoryProduct();
    this.initActionButtons();
    this.bindQuantityChange();
  }

  ngOnDestroy(): void { }

  /** -------------------- INIT -------------------- */

  private initForm(): void {
    this.formGroup = new FormGroup({
      companyCategoryProduct: new FormControl(null, Validators.required),
      product: new FormControl(null),
      mrp: new FormControl(null, Validators.required),
      salesPrice: new FormControl(null, Validators.required),
      landingPrice: new FormControl(null, Validators.required),
      meter: new FormControl(null, Validators.required),
      quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
      availableQuantity: new FormControl({ value: null, disabled: true }),
      isActive: new FormControl(null)
    }, {
      validators: [
        salesPriceLessThanMRPValidator(),
        landingPriceLessThanSalesPriceValidator()
      ]
    });
  }

  private initFields(): void {
    const IsProductActive = !this.authService.hasRole(["ACTIVEPRODUCT"]);
    this.fields = [
      {
        type: 'searchable-select', name: 'companyCategoryProduct', label: 'Company Product ', colSpan: 6, options: [],
        clear: (fieldName: string) => {
          this.formGroup.get(fieldName)?.reset();
          this.formGroup.reset();
        },
        isReadOnly: this.productResponse ? true : false
      },
      {
        type: 'input', name: 'quantity', label: 'Quantity', colSpan: 2, isNumOnly: true, maxLength: 8, isNumberOnly: true,
        isReadOnly: this.productResponse ? true : false
      },
      {
        type: 'input', name: 'meter', label: 'Length(Meter)', colSpan: 2, maxLength: 8, isNumberOnly: true,
        isReadOnly: this.productResponse ? true : false
      },
      { type: 'input', name: 'availableQuantity', label: 'Avail.Qty', colSpan: 2, isReadOnly: false, isNumberOnly: false },
      { type: 'input', name: 'mrp', label: 'MRP ₹', colSpan: 2, isNumOnly: true, maxLength: 8, isNumberOnly: true },
      { type: 'input', name: 'salesPrice', label: 'Sales Price ₹', colSpan: 2, isNumOnly: true, maxLength: 8, isNumberOnly: true },
      { type: 'input', name: 'landingPrice', label: 'Landing Price ₹', colSpan: 2, isNumOnly: true, maxLength: 8, isNumberOnly: true },
      { type: 'checkbox', name: 'isActive', label: 'Is Active', colSpan: 2, isReadOnly: false, isHidden: IsProductActive }
    ];
  }
  createNewProduct(term: string) {
    const newProduct = { key: term, value: term };
    const productField = this.fields.find(f => f.name === 'ACTIVEPRODUCT');
    productField?.options?.push(newProduct);
    return newProduct;
  }

  private initActionButtons(): void {
    this.actionButtons = [
      {
        label: 'Save',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: this.handleSave.bind(this),
        params: { form: this.formGroup },
        validate: true,
        isHidden: this.pageHeader !== 'New Product'
      },
      {
        label: 'Update',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: this.handleUpdate.bind(this),
        params: { form: this.formGroup },
        validate: true,
        isHidden: this.pageHeader === 'New Product'
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
        label: 'Back',
        icon: 'fas fa-arrow-left',
        class: 'btn-back',
        callback: this.handleBack.bind(this),
        validate: false,
        isHidden: false
      }
    ];
  }

  /** -------------------- PATCH -------------------- */

  private patchForm(product: ProductsResponse): void {
    this.formGroup.patchValue({
      product: { value: product.productId, key: product.productName },
      companyCategoryProduct: { value: product.productCategoryId, key: product.productFullName },
      mrp: product.mrp,
      salesPrice: product.salesPrice,
      landingPrice: product.landingPrice,
      quantity: product.quantity,
      isActive: product.isActive,
      meter: product.meter
    });
  }

  /** -------------------- DATA LOADERS -------------------- */

  private loadCompanyCategoryProduct = (): void => {
    this.companyService.getCompanyCategoryProduct(true).subscribe({
      next: res => {
        const options: KeyValuePair[] = res.map(item => ({
          key: `${item.companyName} ${item.categoryName} ${item.productCategoryName}`,
          value: item.productCategoryId
        }));
        this.updateFieldOptions('companyCategoryProduct', options);
      }
    });
  }

  private updateFieldOptions(fieldName: string, options: KeyValuePair[]): void {
    const field = this.fields.find(f => f.name === fieldName);
    if (field) field.options = options;
  }

  private bindQuantityChange(): void {
    const quantityControl = this.formGroup.get('quantity');
    const availableControl = this.formGroup.get('availableQuantity');
    const meterControl = this.formGroup.get('meter');
    if (!quantityControl || !availableControl) return;
    const initialQuantity = Number(quantityControl.value) || 0;
    availableControl.setValue(initialQuantity > 0 ? initialQuantity : meterControl?.value, { emitEvent: true });
    quantityControl.valueChanges.pipe(
      startWith(initialQuantity),
      map(value => Number(value) || 0),
      pairwise(),
      map(([prev, curr]) => curr - prev) // Calculate difference
    ).subscribe(diff => {
      const currentAvailable = Number(availableControl.value) || 0;
      const updatedAvailable = currentAvailable + diff;
      const lengthValue = meterControl?.value;
      const newValue = lengthValue !== '' && lengthValue !== null && lengthValue !== undefined
        ? lengthValue
        : updatedAvailable;
      availableControl.setValue(newValue, { emitEvent: true });
    });
  }
 
 
  /** -------------------- ACTION HANDLERS -------------------- */

  private handleSave(params: any): void {

    if (this.formGroup.get('meter')?.value !== '') {
      this.formGroup.get('quantity')?.clearValidators();
      this.formGroup.get('quantity')?.updateValueAndValidity();
    } else if (this.formGroup.get('quantity')?.value !== '') {
      this.formGroup.get('meter')?.clearValidators();
      this.formGroup.get('meter')?.updateValueAndValidity();
    }

    if (params.form.invalid) return;
    const formErrors = params.form.errors;
    const errorMessages = formErrors
      ? Object.values(formErrors)
        .map((err: any) => err?.message)
        .filter(Boolean)
      : [];

    if (errorMessages.length) {
      this.commonService.showError(errorMessages.join('<br>'));
      return;
    }

    const request = this.buildProductRequest(params.form.value);

    this.productService.createProduct(request).subscribe({
      next: (result) => {
        if (result === 0) {
          this.commonService.showWarning('Product already exists.');
        } else {
          this.commonService.showSuccess('New Product created.');
          this.ngOnInit();
        }
      }
    });
  }
  private handleUpdate(params: any): void {
    var update: UpdateProductRequest = {
      productId: params.form.value.product.value,
      productName: params.form.value.companyCategoryProduct.key,
      mrp: params.form.value.mrp,
      salesPrice: params.form.value.salesPrice,
      landingPrice: params.form.value.landingPrice,
      quantity: params.form.value.quantity,
      isActive: params.form.value.isActive,
      rowVersion: this.productResponse.rowVersion,
      productCategoryId: params.form.value.companyCategoryProduct.value,
      meter: params.form.value.meter
    };
    this.productService.updateProduct(Number(params.form.value.product.value), update).subscribe({
      next: () => {
        this.commonService.showSuccess('Product updated.');
        this.resetForm();
        this.router.navigate(['/product-list']);
      }
    });
  }

  private handleCancel(): void {
    this.resetForm();
  }

  private handleBack(): void {
    this.router.navigate(['/product-list']);
  }

  /** -------------------- HELPERS -------------------- */

  private resetForm(): void {
    this.formGroup.reset()
    this.formGroup.markAsPristine();
    this.formGroup.markAsUntouched();
    Object.values(this.formGroup.controls).forEach(control => control.setErrors(null));
    this.initForm();
  }
  private buildProductRequest(value: any): ProductRequest {
    const {
      key: productName,
      value: productCategoryId
    } = value.companyCategoryProduct || {};

    return {
      productName: productName || '',
      productCategoryId: productCategoryId ?? null,
      description: value.description || '',
      mrp: Number(value.mrp) || 0,
      salesPrice: Number(value.salesPrice) || 0,
      landingPrice: Number(value.landingPrice) || 0,
      quantity: Number(value.quantity) || 0,
      isActive: !!value.isActive,
      meter: value.meter
    };
  }


  // private buildUpdateProductRequest(value: any): UpdateProductRequest {
  //   return {
  //     ...this.buildProductRequest(value),
  //     productId: this.productResponse.productId
  //   };
  // }
}

/** -------------------- VALIDATORS -------------------- */

function salesPriceLessThanMRPValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const mrp = group.get('mrp')?.value;
    const salesPrice = group.get('salesPrice')?.value;

    if (mrp != null && salesPrice != null && Number(salesPrice) > Number(mrp)) {
      return {
        salesPriceExceedsMRP: {
          message: 'Sales Price should not exceed MRP'
        }
      };
    }
    return null;
  };
}

function landingPriceLessThanSalesPriceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const salesPrice = group.get('salesPrice')?.value;
    const landingPrice = group.get('landingPrice')?.value;

    if (salesPrice != null && landingPrice != null && Number(landingPrice) > Number(salesPrice)) {
      return {
        salesPriceExceedsMRP: {
          message: 'Landing Price should not Exceed Sales Price'
        }
      };
    }
    return null;
  };
}