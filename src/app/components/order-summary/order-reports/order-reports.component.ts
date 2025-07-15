import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { Workbook } from 'exceljs';
import { BulkUpload } from '../../../models/BulkUpload';

@Component({
  selector: 'app-order-eports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-reports.component.html',
  styleUrl: './order-reports.component.scss'
})
export class OrderReportsComponent {
  excelData: BulkUpload[] = [];
  tableHeaders: string[] = [];

  getCellValue(row: BulkUpload, header: string): any {
  return (row as any)[header];
}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      alert('Please upload a valid Excel file.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const binaryString = e.target?.result as string;
      const workbook = XLSX.read(binaryString, { type: 'binary' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      // this.excelData = jsonData.map(row => ({
      //   companyName: row['companyName'] || '',
      //   categoryName: row['categoryName'] || '',
      //   productCategoryName: row['productCategoryName'] || '' 
      // })) as BulkUpload[];
      this.excelData = jsonData as BulkUpload[];
      this.tableHeaders = jsonData.length ? Object.keys(jsonData[0]) : [];
    };
    reader.readAsBinaryString(file);
  }
}