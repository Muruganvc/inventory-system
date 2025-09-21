import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { ActionButtons } from '../../common/ActionButton';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NumberOnlyDirective } from '../../services/NumberOnlyDirective ';
@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    NgSelectModule,
    NumberOnlyDirective
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DynamicFormComponent {
  @Input() formGroup!: FormGroup;
  @Input() fields: any[] = [];
  @Input({ required: true }) title!: string;
  @Input({ required: true }) buttons: ActionButtons[] = [];
  isMobileView: boolean = false;
  @Input() isPopup: boolean = false;
  constructor(private breakpointObserver: BreakpointObserver) { }
  get form() {
    return this.formGroup;
  }
  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobileView = result.matches;
      });
    this.fields.forEach(field => {
      if (!this.formGroup.get(field.name)) {
        this.formGroup.addControl(field.name, new FormControl(null));
      }
    });
  }
  compareFn = (a: any, b: any) => a && b && a.value === b.value;

  onClick(btn: ActionButtons): void {
    const form: FormGroup = btn.params?.form;
    if (btn.validate && form?.invalid) {
      this.markFormGroupTouched(form);
      // return;
    }
    btn.callback?.(btn.params);
  }
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  setMaxLength(ngSelectRef: NgSelectComponent, maxLength: number) {
    setTimeout(() => {
      const input: HTMLInputElement | null = ngSelectRef.element?.querySelector('input');
      if (input) {
        input.setAttribute('maxlength', maxLength.toString());
      }
    });
  }

  customSearchFn = (term: string, item: any): boolean => {
    const searchWords = term.toLowerCase().split(' ').filter(w => !!w.trim());
    const searchableText = `${item.key}`.toLowerCase();
    return searchWords.every(word => searchableText.includes(word));
  }
  trackByName(index: number, field: any): string {
    return field.name;
  }
}
