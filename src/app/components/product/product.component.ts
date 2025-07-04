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
import { filter, map, pairwise, startWith } from 'rxjs';
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
    }
    this.initFields();
    this.loadAllCompanies();
    this.bindCompanyChange();
    this.bindCategoryChange();
    // this.bindProductChange();
    this.initActionButtons();
    this.bindQuantityChange();
  }

  ngOnDestroy(): void { }

  /** -------------------- INIT -------------------- */

  private initForm(): void {
    this.formGroup = new FormGroup({
      company: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      product: new FormControl(null),
      mrp: new FormControl(null, Validators.required),
      salesPrice: new FormControl(null, Validators.required),
      landingPrice: new FormControl(null, Validators.required),
      quantity: new FormControl(null, [Validators.required, Validators.min(1)]),
      availableQuantity: new FormControl({ value: null, disabled: true }),
      // description: new FormControl(null),
      isActive: new FormControl(null)
    }, {
      validators: [
        salesPriceLessThanMRPValidator(),
        landingPriceLessThanSalesPriceValidator()
      ]
    });
  }


  private initFields(): void {
    const isAdmin = !this.authService.hasRole(["Admin"])
    this.fields = [
      {
        type: 'searchable-select', name: 'company', label: 'Company', colSpan: 3, options: [],
        clear: (value: string) => this.clearDropDwon(value)
      },
      {
        type: 'searchable-select', name: 'category', label: 'Category', colSpan: 3, options: [],
        clear: (value: string) => this.clearDropDwon(value)
      },
      {
        type: 'searchable-select', name: 'product', label: 'Product Name', colSpan: 6, options: [],
        addTag: true,
        // add: (term: string) => this.clearDropDwon(term),
        clear: (value: string) => this.clearDropDwon(value)
      },
      { type: 'input', name: 'mrp', label: 'MRP ₹', colSpan: 2, isNumOnly: true, maxLength: 8, isNumberOnly: true },
      { type: 'input', name: 'salesPrice', label: 'Sales Price ₹', colSpan: 2, isNumOnly: true, maxLength: 8, isNumberOnly: true },
      { type: 'input', name: 'landingPrice', label: 'Landing Price ₹', colSpan: 2, isNumOnly: true, maxLength: 8, isNumberOnly: true },
      { type: 'input', name: 'quantity', label: 'Quantity', colSpan: 2, isNumOnly: true, maxLength: 8, isNumberOnly: true },
      { type: 'input', name: 'availableQuantity', label: 'Avail.Quantity', colSpan: 2, isReadOnly: true, isNumberOnly: true },
      {
        type: 'checkbox', name: 'isActive', label: 'Is Active', colSpan: 2, isReadOnly: false, isHidden: isAdmin,
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ]
      },
      { type: 'textarea', name: 'description', label: 'Description', colSpan: 12, isHidden: true }
    ];
  }
  createNewProduct(term: string) {
    const newProduct = { key: term, value: term }; // can replace with ID later
    const productField = this.fields.find(f => f.name === 'product');
    productField?.options?.push(newProduct);
    return newProduct;
  }

  clearDropDwon(value: string) {
    if (value == 'company') {
      this.formGroup.patchValue({ category: null, product: null });
      this.updateFieldOptions('category', []);
      this.updateFieldOptions('product', []);
    } else if (value == 'category') {
      this.formGroup.patchValue({ product: null });
      var category = this.formGroup.get('category')?.value;
      this.updateFieldOptions('product', []);
      this.loadProducts(category.value);
    }
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
      company: { value: product.companyId, key: product.companyName },
      category: { value: product.categoryId, key: product.categoryName },
      product: { value: product.productId, key: product.productName },
      mrp: product.mrp,
      salesPrice: product.salesPrice,
      landingPrice: product.landingPrice,
      quantity: product.quantity,
      availableQuantity: product.quantity,
      // description: product.description,
      isActive: product.isActive
    });
  }

  /** -------------------- DATA LOADERS -------------------- */

  private loadAllCompanies(): void {
    this.companyService.getCompanies().subscribe({
      next: res => {
        const keyValue: KeyValuePair[] = res.map(company => ({
          key: company.companyName,
          value: company.companyId
        }));

        this.updateFieldOptions('company', keyValue);
      },
      error: err => console.error('Company Load Error:', err)
    });
  }

  private loadCategories(companyId: number): void {
    this.productService.getCategories(companyId).subscribe({
      next: res => this.updateFieldOptions('category', res),
      error: err => console.error('Category Load Error:', err)
    });
  }

  private loadProducts(categoryId: number): void {
    this.productService.getProductCategories(categoryId).subscribe({
      next: res => this.updateFieldOptions('product', res),
      error: err => console.error('Product Load Error:', err)
    });
  }

  private updateFieldOptions(fieldName: string, options: KeyValuePair[]): void {
    const field = this.fields.find(f => f.name === fieldName);
    if (field) field.options = options;
  }


  private bindCompanyChange(): void {
    this.formGroup.get('company')?.valueChanges
      .pipe(
        filter(value => !!value)
      )
      .subscribe(selected => {
        const categoryControl = this.formGroup.get('category');
        const productControl = this.formGroup.get('product');
        if (categoryControl?.value || productControl?.value) {
          categoryControl?.reset(null);
          productControl?.reset(null);
        }
        this.updateFieldOptions('category', []);
        this.updateFieldOptions('product', []);

        if (selected?.value) {
          this.loadCategories(selected.value);
        }
      });
  }


  // private bindCategoryChange(): void {
  //   this.formGroup.get('category')?.valueChanges.subscribe(selected => {
  //     this.formGroup.patchValue({ product: null });
  //     // this.updateFieldOptions('product', []);
  //     if (selected?.value) this.loadProducts(selected.value);
  //   });
  // }

  private bindCategoryChange(): void {
    this.formGroup.get('category')?.valueChanges.pipe(filter(value => !!value)).subscribe(selected => {
      this.formGroup.patchValue({ product: null });
      this.updateFieldOptions('product', []);
      if (selected?.value) this.loadProducts(selected.value);
    });
  }

  // private bindProductChange(): void {
  //   this.formGroup.get('product')?.valueChanges
  //     .pipe(filter((value) => !!value))
  //     .subscribe((selected) => {
  //       const patchedValue = { key: selected.key, value: selected.value ?? 0 };
  //       this.formGroup.patchValue({ product: patchedValue }, { emitEvent: true });
  //       // this.updateFieldOptions('product', [patchedValue]);
  //     });
  // }


  private bindQuantityChange(): void {
    const quantityControl = this.formGroup.get('quantity');
    const availableControl = this.formGroup.get('availableQuantity');
    availableControl?.setValue(+quantityControl?.value, { emitEvent: true });
    quantityControl?.valueChanges.pipe(
      startWith(''),
      map(val => Number(val) || 0),   // convert to number, treat empty as 0
      pairwise(),                     // gives [previous, current]
      map(([prev, curr]) => {
        const diff = curr - prev;
        return diff;
      })
    ).subscribe(diff => {
      const current = Number(availableControl?.value) || 0;
      const updated = current + diff;
      availableControl?.setValue(updated, { emitEvent: true });
    });
  }


  /** -------------------- ACTION HANDLERS -------------------- */

  private handleSave(params: any): void {
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


    // if (request.salesPrice > request.mrp) {
    //   this.commonService.showWarning('The sales price must not exceed the MRP');
    //   return
    // }

    // if (request.landingPrice > request.salesPrice) {
    //   this.commonService.showWarning('The landing price must not exceed the sales price');
    //   return
    // }

    this.productService.createProduct(request).subscribe({
      next: (result) => {
        if (result === 0) {
          this.commonService.showWarning('Product already exists.');
        } else {
          this.commonService.showSuccess('New Product created.');
          this.ngOnInit();
        }
      },
      error: (err) => {
        console.error('Failed to create product:', err);
      }
    });

  }


  private handleUpdate(params: any): void {
    const request = this.buildUpdateProductRequest(params.form.value);
    this.productService.updateProduct(request.productId, request).subscribe({
      next: () => {
        this.commonService.showSuccess('Product updated.');
        this.resetForm();
        this.router.navigate(['/product-list']);
      },
      error: err => console.error('Failed to update product:', err)
    });
  }

  private handleCancel(): void {
    this.formGroup.reset();
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
    const { company, category, product } = value;
    // const productName = [company?.key, category?.key, product?.key].filter(Boolean).join(' ');
    const productName = product?.key ? product.key : `${company?.key ?? ''} ${category?.key ?? ''}`.trim();
    return {
      productCategoryId: product?.value ?? null,
      categoryId: category?.value,
      companyId: company?.value,
      // description: value.description,
      mrp: value.mrp,
      productName,
      totalQuantity: value.quantity,
      salesPrice: value.salesPrice,
      isActive: !!value.isActive,
      landingPrice: value.landingPrice
    };
  }

  private buildUpdateProductRequest(value: any): UpdateProductRequest {
    return {
      ...this.buildProductRequest(value),
      productId: value.product?.value
    };
  }
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
          message: 'Landing Price should not Sales Price'
        }
      };
    }
    return null;
  };
}
