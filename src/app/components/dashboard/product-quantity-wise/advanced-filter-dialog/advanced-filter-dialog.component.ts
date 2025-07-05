import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ActionButtons } from '../../../../shared/common/ActionButton';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { SalesConfirmDialogComponent } from '../../../sales/sales-confirm-dialog/sales-confirm-dialog.component';
@Component({
  selector: 'app-advanced-filter-dialog',
  standalone: true,
  imports: [MatInputModule, DynamicFormComponent, MatFormFieldModule, MatButtonModule, FormsModule, MatDialogModule],
  templateUrl: './advanced-filter-dialog.component.html',
  styleUrl: './advanced-filter-dialog.component.scss'
})
export class AdvancedFilterDialogComponent {
  filterForm: FormGroup;
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SalesConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filterForm = new FormGroup({
      companyName: new FormControl(null),
      categoryName: new FormControl(null), 
      quantity: new FormControl(null), 
    });
  }
  ngOnInit(): void {
    this.initFields();
    this.initActionButtons();
  }

  initFields = (): void => {
    this.fields = [
      { type: 'input', name: 'companyName', label: 'Company Name', colSpan: 12, maxLength: 20 },
      { type: 'input', name: 'categoryName', label: 'Category Name', colSpan: 12,maxLength: 20 },
      { type: 'input', name: 'quantity', label: 'Quantity', colSpan: 12, isNumberOnly: true,maxLength: 8 } 
    ];
  }

  initActionButtons = (): void => {
    this.actionButtons = [
      {
        label: 'Filter',
        icon: 'fas fa-filter',
        class: 'btn-filter',
        callback: this.handleFilter.bind(this),
        params: { form: this.filterForm },
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
handleFilter() {
  const result = {
    company: 'Hi',
    category: 'Sw',
    minQty: 0,        
    maxQty: 10000
  };
  this.dialogRef.close(result);
}

  handleCancel() {
    this.dialogRef.close();
  }
}
