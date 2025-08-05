import { Component, inject } from '@angular/core';
import { CustomTableComponent } from "../../../shared/components/custom-table/custom-table.component";
import * as XLSX from 'xlsx';
import { BulkUpload } from '../../../models/BulkUpload';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { CommonService } from '../../../shared/services/common.service';
@Component({
  selector: 'app-bulkcreate-company-category-product',
  standalone: true,
  imports: [CustomTableComponent, CommonModule],
  templateUrl: './bulkcreate-company-category-product.component.html',
  styleUrl: './bulkcreate-company-category-product.component.scss'
})
export class BulkcreateCompanyCategoryProductComponent {

  bulkCompnay: BulkUpload[] = [];
  tableHeaders: string[] = [];
  selectedFileName: string | null = null;

  private readonly productService = inject(ProductService);
  private readonly commonService = inject(CommonService);


  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean }[] = [
    { key: 'CompanyName', label: 'Company Name', align: 'left', isHidden: false },
    { key: 'CategoryName', label: 'Category Name', align: 'left', isHidden: false },
    { key: 'ProductCategoryName', label: 'Product Name', align: 'left', isHidden: false },
    { key: 'fullName', label: 'Full Product Name', align: 'left', isHidden: false }
  ];
  onAction(event: { row: any; action: string }) {
    const { row, action } = event;
    switch (action) {
      //  case 'edit': this.onEdit(row); break;
      // case 'delete': this.deleteRow(row); break;
      // case 'save': this.saveRow(row); break;
      // case 'cancel': this.cancelEdit(row); break;
    }
  }
  newOpen(a: any) {

    
  }


  buttons = [
    {
      label: 'Upload',
      icon: 'fas fa-circle-plus',
      tooltip: 'Upload',
      action: 'Upload',
      class: 'excel-button'
    }
  ];


  onButtonClicked(_: string) {
    if (this.bulkCompnay.length == 0) {
      this.commonService.showInfo("Please upload file to save."); return;
    } 
    this.productService.bulkCreateCompany(this.bulkCompnay).subscribe({
      next: result => {
        if (result) {
          this.commonService.showSuccess("All Products created.");
        } else {
          this.commonService.showInfo("Product not created, May product already exists. Please check.");
        }
      }
    });
  }
  tableActions =
    [
      {
        iconClass: 'fas fa-pencil-alt',
        color: 'green',
        tooltip: 'Edit',
        action: 'edit',
        condition: (row: any) => !row.isEditing
      }
    ];

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      alert('Please upload a valid Excel file.');
      return;
    }

    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file format. Please upload a .xls or .xlsx file.');
      return;
    }

    // Optional: Max 2MB file size
    const maxSizeInMB = 2;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      alert(`File size should not exceed ${maxSizeInMB}MB.`);
      return;
    }

    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const binaryString = e.target?.result as string;
      const workbook = XLSX.read(binaryString, { type: 'binary' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (jsonData.length === 0) {
        alert('The Excel file is empty.');
        return;
      }

      const requiredHeaders = ['CompanyName', 'CategoryName', 'ProductCategoryName'];
      const headers = Object.keys(jsonData[0]);
      const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));


      const filteredData = jsonData.filter(row => row['CompanyName']?.trim());

      if (filteredData.length === 0) {
        alert('No valid data found (all rows missing company name).');
        return;
      }

      if (missingHeaders.length > 0) {
        alert(`Missing required columns: ${missingHeaders.join(', ')}`);
        return;
      }

      const fullNameAdd = filteredData.map(row => ({
        ...row,
        fullName: `${row['CompanyName']} ${row['CategoryName']} ${row['ProductCategoryName']}`
      }));

      this.bulkCompnay = fullNameAdd as BulkUpload[];
      this.tableHeaders = [...headers, 'FullName'];
    };

    reader.readAsBinaryString(file);
  }
  resetUpload(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    this.selectedFileName = '';
    this.bulkCompnay = [];
    this.tableHeaders = [];
  }
}
