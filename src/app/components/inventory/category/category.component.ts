import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';
import { ActionButtons } from '../../../shared/common/ActionButton';
import { KeyValuePair } from '../../../shared/common/KeyValuePair';

import { CommonService } from '../../../shared/services/common.service';
import { CompanyService } from '../../../services/company.service';

import { GetCategoryQueryResponse } from '../../../models/GetCategoryQueryResponse';
import { CategoryCreateRequest } from '../../../models/CategoryCreateRequest';
import { CategoryUpdateRequest } from '../../../models/CategoryUpdateRequest';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  formGroup!: FormGroup;
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];
  selectedCategory!: GetCategoryQueryResponse;

  private readonly router = inject(Router);
  private readonly commonService = inject(CommonService);
  private readonly companyService = inject(CompanyService);

  ngOnInit(): void {
    this.selectedCategory = history.state.data;
    this.initForm();
    this.initFields();
    this.initActionButtons();
    this.loadAllCompanies();

    if (this.selectedCategory) {
      this.loadCategory();
    }
  }

  private initForm(): void {
    this.formGroup = new FormGroup({
      company: new FormControl(null, Validators.required),
      categoryName: new FormControl(null, Validators.required),
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
        colSpan: 4,
        options: [],
        clear: () => { }
      },
      {
        type: 'input',
        name: 'categoryName',
        label: 'Category Name',
        colSpan: 4,
        maxLength: 20,
        icon: 'fas fa-layer-group'
      },
      {
        type: 'toggle',
        name: 'isActive',
        label: 'Is Active',
        colSpan: 4
      },
      {
        type: 'textarea',
        name: 'description',
        label: 'Description',
        colSpan: 12,
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
        callback: () => this.createCategory(),
        params: { form: this.formGroup },
        validate: true,
        isHidden: !!this.selectedCategory
      },
      {
        label: 'Update',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: () => this.updateCategory(),
        params: { form: this.formGroup },
        validate: true,
        isHidden: !this.selectedCategory
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
        callback: () => this.router.navigate(['/inventory/category-list']),
        validate: false,
        isHidden: false
      }
    ];
  }

  private loadCategory(): void {
    this.formGroup.patchValue({
      company: {
        value: this.selectedCategory.companyId,
        key: this.selectedCategory.companyName
      },
      categoryName: this.selectedCategory.categoryName,
      isActive: this.selectedCategory.isActive,
      description: this.selectedCategory.description
    });
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

  private updateFieldOptions(fieldName: string, options: KeyValuePair[]): void {
    const field = this.fields.find(f => f.name === fieldName);
    if (field) {
      field.options = options;
    }
  }

  private createCategory(): void {
    const formValue = this.formGroup.value;

    const request: CategoryCreateRequest = {
      companyId: formValue.company.value,
      categoryName: formValue.categoryName,
      isActive: !!formValue.isActive,
      description: formValue.description
    };

    this.companyService.createCategory(request).subscribe({
      next: result => {
        if (result > 0) {
          this.commonService.showSuccess('New Category created.');
          this.formGroup.reset();
        } else {
          this.commonService.showInfo('New Category not created.');
        }
      }
    });
  }

  private updateCategory(): void {
    const formValue = this.formGroup.value;

    const request: CategoryUpdateRequest = {
      companyId: formValue.company.value,
      categoryName: formValue.categoryName,
      isActive: formValue.isActive,
      description: formValue.description,
      rowVersion: this.selectedCategory.rowVersion
    };

    this.companyService.updateCategory(this.selectedCategory.categoryId, request).subscribe({
      next: result => {
        if (result) {
          this.commonService.showSuccess('Successfully updated');
          this.formGroup.reset();
          this.router.navigate(['/inventory/category-list']);
        } else {
          this.commonService.showInfo('Selected category not updated.');
        }
      }
    });
  }
}
