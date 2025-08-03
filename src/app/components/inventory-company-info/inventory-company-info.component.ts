import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../shared/services/common.service';

import { DynamicFormComponent } from '../../shared/components/dynamic-form/dynamic-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ActionButtons } from '../../shared/common/ActionButton';

@Component({
  selector: 'app-inventory-company-info',
  standalone: true,
  templateUrl: './inventory-company-info.component.html',
  styleUrl: './inventory-company-info.component.scss',
  imports: [
    CommonModule,
    DynamicFormComponent,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ]
})
export class InventoryCompanyInfoComponent implements OnInit {
  title = 'Inventory Company Info';
  formGroup!: FormGroup;
  fields: any[] = [];
  actionButtons: ActionButtons[] = [];
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  invCompanyInfoId: number = 0;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly commonService = inject(CommonService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.initializeForm();
    this.initializeFields();
    this.loadCompanyInfo();
  }

  private initializeForm(): void {
    this.formGroup = new FormGroup({
      invCompanyName: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      mobileNo: new FormControl(null, [Validators.required, Validators.maxLength(10)]),
      gstNo: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
      apiVersion: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      uiVersion: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      bankName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      bankBranchName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      bankAccountNo: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      bankBranchIFSC: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
    });
  }

  private initializeFields(): void {
    const fieldsConfig = [
      { name: 'invCompanyName', label: 'Inventory Company Name', colSpan: 6, maxLength: 100 },
      { name: 'description', label: 'Description', colSpan: 6, maxLength: 100 },
      { name: 'address', label: 'Address', maxLength: 100 },
      { name: 'email', label: 'Email', colSpan: 6, maxLength: 50 },
      { name: 'mobileNo', label: 'Mobile No', colSpan: 6, maxLength: 10 },
      { name: 'gstNo', label: 'GST Number', maxLength: 15 },
      { name: 'apiVersion', label: 'API Version', colSpan: 6, maxLength: 20 },
      { name: 'uiVersion', label: 'UI Version', colSpan: 6, maxLength: 20 },
      { name: 'bankName', label: 'Bank Name', colSpan: 6, maxLength: 20 },
      { name: 'bankBranchName', label: 'Bank Branch Name', colSpan: 6, maxLength: 20 },
      { name: 'bankAccountNo', label: 'Bank Account No.', colSpan: 6, maxLength: 20 },
      { name: 'bankBranchIFSC', label: 'Bank Branch IFSC', colSpan: 6, maxLength: 10 }
    ];

    this.fields = fieldsConfig.map(f => ({
      type: 'input',
      name: f.name,
      label: f.label,
      colSpan: f.colSpan ?? 12,
      maxLength: f.maxLength
    }));
  }

  private initializeButtons(isNew: boolean): void {
    this.actionButtons = [
      {
        label: isNew ? 'Update' : 'Save',
        icon: 'fas fa-save',
        class: 'btn-save',
        callback: () => this.updateCompanyInfo(),
        validate: true,
        isHidden: false,
        params: { form: this.formGroup }
      },
      {
        label: 'Cancel',
        icon: 'fas fa-times mr-2',
        class: 'btn-cancel',
        callback: () => this.router.navigate(['/dashboard']),
        validate: false,
        isHidden: false
      }
    ];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.imagePreview = null;
    }
  }

 


  private loadCompanyInfo(): void {
    this.userService.getInventoryCompanyInfo(1).subscribe({
      next: info => {
        if (info) {
          this.formGroup.patchValue({
            invCompanyName: info.inventoryCompanyInfoName,
            description: info.description,
            address: info.address,
            email: info.email,
            mobileNo: info.mobileNo,
            gstNo: info.gstNumber,
            apiVersion: info.apiVersion,
            uiVersion: info.uiVersion,
            bankName: info.bankName,
            bankBranchName: info.bankBranchName,
            bankAccountNo: info.bankAccountNo,
            bankBranchIFSC: info.bankBranchIFSC
          });

          if (info.qrCodeBase64) {
            this.imagePreview = info.qrCodeBase64;
            this.selectedFile = this.commonService.base64ToFile(info.qrCodeBase64, 'file');
          }

          this.title = `Update ${this.title}`;
          this.invCompanyInfoId = info.inventoryCompanyInfoId;
          this.initializeButtons(true);
        } else {
          this.initializeButtons(false);
        }
      }
    });
  }

  private updateCompanyInfo(): void {
    if (this.formGroup.invalid) return;

    const value = this.formGroup.value;
    const formData = new FormData();

    const append = (key: string, val: string | null | undefined) => {
      if (val !== null && val !== undefined) formData.append(key, val);
    };

    append('inventoryCompanyInfoName', value.invCompanyName);
    append('description', value.description);
    append('address', value.address);
    append('email', value.email);
    append('mobileNo', value.mobileNo);
    append('gstNumber', value.gstNo);
    append('apiVersion', value.apiVersion);
    append('uiVersion', value.uiVersion);
    append('bankName', value.bankName);
    append('bankBranchName', value.bankBranchName);
    append('bankAccountNo', value.bankAccountNo);
    append('bankBranchIFSC', value.bankBranchIFSC);

    if (this.selectedFile) {
      formData.append('QrCode', this.selectedFile);
    }

    const request$ = this.invCompanyInfoId === 0
      ? this.userService.createInventoryCompanyInfo(formData)
      : this.userService.updateInventoryCompanyInfo(this.invCompanyInfoId, formData);

    request$.subscribe({
      next: result => {
        if (result) {
          this.commonService.showSuccess('Successfully updated');
          this.openConfirmDialog();
        }
      }
    });
  }

  private openConfirmDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '100%',
      maxWidth: '400px',
      disableClose: true,
      data: {
        title: 'Reload',
        message: 'Are you sure you want to reload?',
        okBtn: { title: 'Yes, Confirm', isHiden: true },
        cancel: { title: 'Cancel', isHiden: true }
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        window.location.reload();
      }
    });
  }
}
