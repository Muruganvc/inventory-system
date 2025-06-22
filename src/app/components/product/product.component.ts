import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReusableTableComponent } from "../../shared/components/reusable-table/reusable-table.component";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DynamicFormComponent } from "../../shared/components/dynamic-form/dynamic-form.component";
import { filter } from 'rxjs';
function salesPriceLessThanMRPValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
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
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    this.initForm();
    this.initFields();
    this.bindCompanyChange();
  }
  formGroup!: FormGroup;
  submitBtntitle = 'Submit';
  fields: any[] = [];
  private initForm(): void {
    this.formGroup = new FormGroup({
      company: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      product: new FormControl(null),
      mrp: new FormControl('', Validators.required),
      salesPrice: new FormControl('', Validators.required),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
      availableQuantity: new FormControl(100),
      taxPercent: new FormControl(''),
      taxType: new FormControl(''),
      barCode: new FormControl(''),
      brandName: new FormControl(''),
      description: new FormControl('')
    }, { validators: salesPriceLessThanMRPValidator() });
  }

  private initFields(): void {
    this.fields = [
      {
        type: 'searchable-select', name: 'company', label: 'Company', colSpan: 3, options: [{ value: 1, key: 'Vilnius' },
        { value: 2, key: 'Kaunas' },
        { value: 3, key: 'Pavilnys', disabled: true },
        { value: 4, key: 'Pabradė' },
        { value: 5, key: 'Klaipėda' }]
      },
      {
        type: 'searchable-select', name: 'category', label: 'Category', colSpan: 3, options: [{ value: 1, key: 'Vilnius' },
        { value: 2, key: 'Kaunas' },
        { value: 3, key: 'Pavilnys', disabled: true },
        { value: 4, key: 'Pabradė' },
        { value: 5, key: 'Klaipėda' }]
      },
      {
        type: 'searchable-select', name: 'product', label: 'Product Name', colSpan: 6, options: [{ value: 1, key: 'Vilnius' },
        { value: 2, key: 'Kaunas' },
        { value: 3, key: 'Pavilnys', disabled: true },
        { value: 4, key: 'Pabradė' },
        { value: 5, key: 'Klaipėda' }]
      },
      { type: 'input', name: 'mrp', label: 'MRP ₹', colSpan: 3, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'salesPrice', label: 'Sales Price ₹', colSpan: 3, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'quantity', label: 'Quantity', colSpan: 3, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'availableQuantity', label: 'Available Quantity', colSpan: 3, isReadOnly: true },
      { type: 'input', name: 'taxPercent', label: 'Tax %', colSpan: 3, isNumOnly: true, maxLength: 2 },
      { type: 'input', name: 'taxType', label: 'Tax Type', colSpan: 3, maxLength: 5 },
      { type: 'input', name: 'barCode', label: 'Bar Code', colSpan: 3 },
      { type: 'input', name: 'brandName', label: 'Brand Name', colSpan: 3 },
      { type: 'textarea', name: 'description', label: 'Description', colSpan: 12 },
    ];
  }

  private bindCompanyChange(): void {
    console.log(this.fields);
    this.formGroup.get('company')?.valueChanges.pipe(
      filter(value => !!value)
    ).subscribe(selected => {

      const options = this.fields.find(a => a.name?.toLowerCase() === 'company')?.options;
 
      console.log('Company selected:', selected);
    });
  }

  handleSubmit(event: any) {
    console.log(event);
  }

  cancel() {

  }

  dropdownChange = (a: any, b: any): void => {
    console.log(a, b);
  }

}
