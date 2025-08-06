import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicFormComponent } from '../../../shared/components/dynamic-form/dynamic-form.component';

import { ActionButtons } from '../../../shared/common/ActionButton';
import { CommonService } from '../../../shared/services/common.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { CompanyService } from '../../../services/company.service';

import { CompanyCreate } from '../../../models/CompanyCreate';
import { CompanyUpdateCommand } from '../../../models/CompanyUpdateCommand';
import { GetCompanyQueryResponse } from '../../../models/GetCompanyQueryResponse';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  formGroup!: FormGroup;
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly commonService = inject(CommonService);
  private readonly companyService = inject(CompanyService);

  selectedCompany!: GetCompanyQueryResponse;

  ngOnInit(): void {
    this.selectedCompany = history.state.data;
    this.initForm();
    this.initFields();
    this.initActionButtons();

    if (this.selectedCompany) {
      this.loadCompany();
    }
  }

  private loadCompany(): void {
    this.formGroup.patchValue({
      companyName: this.selectedCompany.companyName,
      isActive: this.selectedCompany.isActive,
      description: this.selectedCompany.description
    });
  }

  private initForm(): void {
    this.formGroup = new FormGroup({
      companyName: new FormControl(null, Validators.required),
      isActive: new FormControl(null),
      description: new FormControl(null)
    });
  }

  private initFields(): void {
    this.fields = [
      { type: 'input', name: 'companyName', label: 'Company Name', colSpan: 6, maxLength: 20 },
      { type: 'checkbox', name: 'isActive', label: 'Is Active', colSpan: 6 },
      { type: 'textarea', name: 'description', label: 'Description', colSpan: 12,isHidden: true }
    ];
  }

  private initActionButtons(): void {
    this.actionButtons = [
      {
        label: 'Save',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: () => this.createCompany(),
        params: { form: this.formGroup },
        validate: true,
        isHidden: !!this.selectedCompany
      },
      {
        label: 'Update',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: () => this.updateCompany(),
        params: { form: this.formGroup },
        validate: true,
        isHidden: !this.selectedCompany
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
        callback: () => this.router.navigate(['/inventory/company-list']),
        validate: false,
        isHidden: false
      }
    ];
  }

  private createCompany(): void {
    if(this.formGroup.invalid) return;
    const formValue = this.formGroup.value;

    const createCommand: CompanyCreate = {
      companyName: formValue.companyName,
      isActive: !!formValue.isActive,
      description: formValue.description
    };

    this.companyService.createCompany(createCommand).subscribe({
      next: result => {
        if (result > 0) {
          this.commonService.showSuccess('New Company created.');
          this.formGroup.reset();
        } else {
          this.commonService.showInfo('New Company not created.');
        }
      } 
    });
  }

  private updateCompany(): void {
    const formValue = this.formGroup.value;

    const updateCommand: CompanyUpdateCommand = { 
      companyName: formValue.companyName,
      isActive: formValue.isActive,
      description: formValue.description,
      rowVersion : this.selectedCompany.rowVersion
    };

    this.companyService.updateCompany(this.selectedCompany.companyId, updateCommand).subscribe({
      next: result => {
        if (result) {
          this.commonService.showSuccess('Successfully updated');
          this.formGroup.reset();
          this.router.navigate(['/inventory/company-list']);
        }else{
           this.commonService.showInfo('Selected company not updated.');
        }
      }
    });
  }
}
