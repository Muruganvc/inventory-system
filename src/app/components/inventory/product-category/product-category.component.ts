import { Component, inject } from '@angular/core';
import { DynamicFormComponent } from "../../../shared/components/dynamic-form/dynamic-form.component";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyService } from '../../../services/company.service';
import { ActionButtons } from '../../../shared/common/ActionButton';
import { KeyValuePair } from '../../../shared/common/KeyValuePair';
import { CommonService } from '../../../shared/services/common.service';
import { ProductService } from '../../../services/product.service';
import { filter } from 'rxjs';
import { ProductCategoryCreateCommand } from '../../../models/ProductCategoryCreateCommand';
import { ProductCategoryUpdateRequest } from '../../../models/ProductCategoryUpdateRequest';
import { GetProductCategoryQueryResponse } from '../../../models/GetProductCategoryQueryResponse';

@Component({
  selector: 'app-product-category',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './product-category.component.html',
  styleUrl: './product-category.component.scss'
})
export class ProductCategoryComponent {
  formGroup!: FormGroup;
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];
  title: string = 'New Product Category';
  selectedProductCategory!: GetProductCategoryQueryResponse;
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly commonService = inject(CommonService);
  private readonly companyService = inject(CompanyService);

  ngOnInit(): void {
    this.selectedProductCategory = history.state.data;
    this.initForm();
    if (this.selectedProductCategory) {
      this.title = 'Update Product Category';
      this.loadProductCategory();
      this.loadCategories(this.selectedProductCategory.companyId);
    }
    this.initFields();
    this.initActionButtons();
    this.loadAllCompanies();
    this.bindCompanyChange();
  }

  private initForm(): void {
    this.formGroup = new FormGroup({
      company: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      productCategoryName: new FormControl(null),
      isActive: new FormControl(null),
      description: new FormControl(null)
    });
  }

  private initFields(): void {
    this.fields = [
      {
        type: 'searchable-select',
        name: 'company',
        label: 'Company Name',
        colSpan: 3,
        options: [],
        clear: () => { this.formGroup.patchValue({ category: null }) }
      },
      {
        type: 'searchable-select',
        name: 'category',
        label: 'Category Name',
        colSpan: 3,
        options: [],
        clear: () => { }
      },
      {
        type: 'input',
        name: 'productCategoryName',
        label: 'Product Category Name',
        colSpan: 4,
        maxLength: 20,
        icon: 'fas fa-layer-group'
      },
      {
        type: 'toggle',
        name: 'isActive',
        label: 'Is Active',
        colSpan: 2
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Description',
        colSpan: 10,
        isHidden: true
      }
    ];
  }

  private initActionButtons(): void {
    this.actionButtons = [
      {
        label: 'Save',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: () => this.createProductCategory(),
        params: { form: this.formGroup },
        validate: true,
        isHidden: !!this.selectedProductCategory
      },
      {
        label: 'Update',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: () => this.updateProductCategory(),
        params: { form: this.formGroup },
        validate: true,
        isHidden: !this.selectedProductCategory
      },
      {
        label: 'Clear',
        icon: 'fas fa-broom',
        class: 'btn-clear',
        callback: () => this.formGroup.reset(),
        validate: false,
        isHidden: false
      },
      {
        label: 'Back',
        icon: 'fas fa-arrow-left',
        class: 'btn-back',
        callback: () => this.router.navigate(['/inventory/product-category-list']),
        validate: false,
        isHidden: false
      }
    ];
  }

  private loadProductCategory(): void {
    this.formGroup.patchValue({
      company: {
        value: this.selectedProductCategory.companyId,
        key: this.selectedProductCategory.companyName
      },
      category: {
        value: this.selectedProductCategory.categoryId,
        key: this.selectedProductCategory.categoryName
      },
      productCategoryName: this.selectedProductCategory.productCategoryName,
      isActive: this.selectedProductCategory.isActive,
      description: this.selectedProductCategory.description
    });
    this.formGroup.get('company')?.disable();
  }

  private loadAllCompanies(): void {
    this.companyService.getCompanies(false).subscribe({
      next: res => {
        const options: KeyValuePair[] = res.map(company => ({
          key: company.companyName,
          value: company.companyId
        }));
        this.updateFieldOptions('company', options);
      }
    });
  }

  private bindCompanyChange(): void {
    this.formGroup.get('company')?.valueChanges
      .pipe(
        filter(value => !!value)
      )
      .subscribe(selected => {
        const categoryControl = this.formGroup.get('category');

        if (categoryControl?.value) {
          categoryControl?.reset(null);
        }
        this.updateFieldOptions('category', []);

        if (selected?.value) {
          this.loadCategories(selected.value);
        }
      });
  }

  private loadCategories(companyId: number): void {
    this.productService.getCategoriesByCompany(companyId).subscribe({
      next: result => {
        if (!!result) {
          const options: KeyValuePair[] = result.map(category => ({
            key: category.categoryName,
            value: category.categoryId
          }));
          this.updateFieldOptions('category', options)
        }
      }
    });
  }

  private updateFieldOptions(fieldName: string, options: KeyValuePair[]): void {
    const field = this.fields.find(f => f.name === fieldName);
    if (field) {
      field.options = options;
    }
  }

  private createProductCategory(): void {
    const formValue = this.formGroup.value;

    const request: ProductCategoryCreateCommand = {
      categoryId: formValue.category.value,
      categoryProductName: formValue.productCategoryName,
      isActive: !!formValue.isActive,
      description: formValue.description
    };

    this.companyService.createProductCategory(request).subscribe({
      next: result => {
        if (result > 0) {
          this.commonService.showSuccess('New Product Category created.');
          this.formGroup.reset();
        } else {
          this.commonService.showInfo('New Product Category not created.');
        }
      }
    });
  }

  private updateProductCategory(): void {
    const formValue = this.formGroup.value;
    const request: ProductCategoryUpdateRequest = {
      categoryId: formValue.category.value,
      isActive: formValue.isActive,
      description: formValue.description,
      productCategoryName: formValue.productCategoryName,
      rowVersion: this.selectedProductCategory.rowVersion
    };

    this.companyService.updateProductCategory(this.selectedProductCategory.productCategoryId, request).subscribe({
      next: result => {
        if (result) {
          this.commonService.showSuccess('Selected Product category successfully updated.');
          this.formGroup.reset();
          this.router.navigate(['/inventory/product-category-list']);
        } else {
          this.commonService.showInfo('Selected Product category not updated.');
        }
      }
    });
  }
}
