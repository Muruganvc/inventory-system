import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { DashboardService } from '../../../services/dashboard.service';
import { IncomeOrOutcomeSummaryReportQueryResponse } from '../../../models/IncomeOrOutcomeSummaryReportQueryResponse';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from '../../../shared/services/CUSTOM_DATE_FORMATS';
import { CustomDateAdapter } from '../../../shared/services/CustomDateAdapter';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
@Component({
  selector: 'app-income-outcome-summary-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './income-outcome-summary-report.component.html',
  styleUrls: ['./income-outcome-summary-report.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ]
})
export class IncomeOutcomeSummaryReportComponent implements OnInit {
  products: IncomeOrOutcomeSummaryReportQueryResponse[] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;

  private readonly dashboardService = inject(DashboardService);

  private readonly dynamicColors: string[] = [
    '#5bc0de', '#4caf50', '#3f51b5', '#ff9800', '#9c27b0',
    '#009688', '#c2185b', '#00bcd4', '#8bc34a', '#ffc107',
    '#795548', '#e91e63', '#607d8b', '#2196f3', '#ff5722',
    '#673ab7', '#03a9f4', '#aed581', '#f06292', '#90a4ae',
    '#f44336', '#26a69a', '#ffb74d', '#b39ddb', '#689f38'
  ];

  ngOnInit(): void {
    this.loadReport();
  }

  private loadReport(): void {
    this.dashboardService.getIncomeOutcomeSummaryReport().subscribe({
      next: result => {
        this.products = result ?? [];
      }
    });
  }

  filterByDateRange(): void {
    if (!this.startDate || !this.endDate) return;

    const from = new Date(this.startDate);
    const to = new Date(this.endDate);
    to.setHours(23, 59, 59, 999); // Include full end day

    this.dashboardService.getIncomeOutcomeSummaryReport(from, to).subscribe({
      next: result => {
        this.products = result ?? [];
      }
    });
  }

  resetFilter(): void {
    this.startDate = null;
    this.endDate = null;
    this.loadReport();
  }

  getDynamicColor(seed: string | number): string {
    const hash = typeof seed === 'string'
      ? seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : seed;
    return this.dynamicColors[hash % this.dynamicColors.length];
  }
  get totalGainedAmount(): number {
    return this.products.reduce((sum, p) => sum + (p.totalGainedAmount || 0), 0);
  }

  get totalQuantity(): number {
    return this.products.reduce((sum, p) => sum + (p.totalQuantity || 0), 0);
  }

  // exportToExcel1(): void {
  //   // Step 1: Calculate total
  //   const totalGainedAmount = this.products.reduce((sum, item) => sum + (item.totalGainedAmount || 0), 0);

  //   // Step 2: Convert data to worksheet manually
  //   const dataWithHeaders = [
  //     Object.keys(this.products[0]), // headers
  //     ...this.products.map(p => Object.values(p)), // data rows
  //     [] // empty row for spacing
  //   ];

  //   // Step 3: Add total row
  //   const totalRow = ['Total', '', '', '', '', '', '', totalGainedAmount]; // adjust based on column positions
  //   dataWithHeaders.push(totalRow);

  //   // Step 4: Create worksheet and workbook
  //   const worksheet = XLSX.utils.aoa_to_sheet(dataWithHeaders);
  //   const workbook = { Sheets: { 'Sheet1': worksheet }, SheetNames: ['Sheet1'] };
  //   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //   const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  //   FileSaver.saveAs(blob, 'ProductData.xlsx');
  // }

  exportToExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Summary Report');
    worksheet.columns = [
      { header: 'Product ID', key: 'productId', width: 12 },
      { header: 'Product Name', key: 'productName', width: 25 },
      { header: 'Sales Price', key: 'salesPrice', width: 15 },
      { header: 'Landing Price', key: 'landingPrice', width: 15 },
      { header: 'MRP', key: 'mrp', width: 10 },
      { header: 'Avg Unit Price', key: 'avgUnitPrice', width: 18 },
      { header: 'Total Quantity', key: 'totalQuantity', width: 16 },
      { header: 'Total Gained Amount', key: 'totalGainedAmount', width: 22 }
    ];
 
    this.products.forEach(product => {
      worksheet.addRow(product);
    });
 
    worksheet.addRow([]);
 
    const totalGainedAmount = this.products.reduce(
      (sum, item) => sum + (item.totalGainedAmount || 0),
      0
    );
    const totalRow = worksheet.addRow({
      productName: 'Total',
      totalGainedAmount: totalGainedAmount
    });

    const applyBorders = (row: ExcelJS.Row) => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    };
 
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFF00' } }; // Yellow text
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' } // Red background
      };
    });
    applyBorders(headerRow);
 
    this.products.forEach((_, index) => {
      const row = worksheet.getRow(index + 2); // +2 to skip header (1-based)
      applyBorders(row);
    });

    // Style total row
    applyBorders(totalRow);
    totalRow.eachCell(cell => {
      cell.font = { bold: true };
    });

    // Save the file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, 'IncomeOrOutcomeSummary.xlsx');
    });
  }
}
