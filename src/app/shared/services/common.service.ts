import { ElementRef, inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { InvoiceComponent } from '../../components/order-summary/invoice/invoice.component';
import { BehaviorSubject } from 'rxjs';
import { GetInventoryCompanyInfo } from '../../models/GetInventoryCompanyInfo';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';

export interface ExcelColumn<T> {
  header: string;
  key: keyof T;
  width?: number;
  formatter?: (value: T[keyof T]) => string | number | Date;
}


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private readonly snackBar = inject(MatSnackBar);
  private toastr = inject(ToastrService);

  showSuccess = (message: string): void => {
    this.toastr.success(message, 'Success');
  }

  showError = (message: string): void => {
    this.toastr.error(message, 'Error');
  }

  showInfo = (message: string): void => {
    this.toastr.info(message, 'Information');
  }

  showWarning = (message: string): void => {
    this.toastr.warning(message, 'Warning');
  }


  async onPrint(orderId: number, component: InvoiceComponent, printFrame: ElementRef): Promise<void> {
    const content = await component.getContentHtml(orderId);
    const frame: HTMLIFrameElement = printFrame.nativeElement;
    const doc = frame.contentWindow?.document!;

    doc.open();

    const html = `
       <html>
         <head>
          <title>TAX INVOICE - ORIGINAL FOR RECIPIENT</title>
           <style>
             @media print {
               @page { size: A4; margin: 20mm; }
               body {
                 font-family: Arial, sans-serif;
                 font-size: 12px;
                 margin: 0; padding: 0;
               }
                 .centered-cell {
                  vertical-align: middle;
  
               }
               .invoice-title {
                 text-align: center;
                 margin: 20px 0;
               }
               .invoice-title .original {
                 font-size: 12px;
                 font-style: italic;
               }
               .details {
                 display: flex;
                 justify-content: space-between;
                 margin-bottom: 20px;
                 font-size: 14px;
               }
               .invoice-container {
                 width: 100%;
                 margin: 0 auto;
               }
               table {
                 width: 100%;
                 border-collapse: collapse;
                 margin-top: 10px;
               }
               th, td {
                 border: 1px solid black;
                 padding: 6px;
                 text-align: left;
                 vertical-align: top;
               }
               th {
                 background-color: #f2f2f2;
               }
               h1, h2, h3, h4, h5 {
                 margin: 0;
                 padding: 0;
               }
               .signature-block {
                 text-align: right;
                 font-style: italic;
               }
               .text-alg {
                 text-align: right;
               }
               .company-bank-row {
                 margin-bottom: 1rem;
               }
               .company-header {
                 text-align: center;
                 margin-bottom: 1rem;
               }
               .row-content {
                 display: flex;
                 justify-content: space-between;
                 gap: 2rem;
               }
               .company-info,
               .bank-section {
                 flex: 1;
                 min-width: 45%;
               }
             }
           </style>
         </head>
         <body>
           <div class="invoice-container">
             ${content}
           </div>
         </body>
       </html>
     `;
    doc.write(html);
    doc.close();
    setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    }, 500);
  }


  private dataSubject = new BehaviorSubject<string>('');
  sharedProfileImageData$ = this.dataSubject.asObservable();

  setProfileImageData(data: string) {
    this.dataSubject.next(data);
  }


  private readonly invCompanyDataSubject = new BehaviorSubject<GetInventoryCompanyInfo | null>(null);
  readonly sharedInvCompanyInfoData$ = this.invCompanyDataSubject.asObservable();
  setInvCompanyInfoData(data: GetInventoryCompanyInfo | undefined): void {
    this.invCompanyDataSubject.next(data ?? null); // Assuming you use null as fallback
  }

  sortByKey<T>(
    array: T[],
    key: keyof T,
    direction: 'asc' | 'desc' = 'asc'
  ): T[] {
    const sorted = [...array].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];

      // Handle string comparison
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        const result = valueA.localeCompare(valueB);
        return direction === 'asc' ? result : -result;
      }

      // Handle number or date comparison
      if (valueA instanceof Date && valueB instanceof Date) {
        const result = valueA.getTime() - valueB.getTime();
        return direction === 'asc' ? result : -result;
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        const result = valueA - valueB;
        return direction === 'asc' ? result : -result;
      }

      // Handle boolean (true before false if ascending)
      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        const result = Number(valueB) - Number(valueA);
        return direction === 'asc' ? -result : result;
      }

      return 0;
    });

    return sorted;
  }

  exportToExcel<T>(data: T[], columns: ExcelColumn<T>[], sheetName: string, fileName: string, totalKey?: string): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = columns.map(col => ({
      header: col.header,
      key: col.key as string,
      width: col.width || 10
    }));
    data.forEach(item => {
      const row: Record<string, any> = {};
      columns.forEach(col => {
        const rawValue = item[col.key];
        row[col.key as string] = col.formatter ? col.formatter(rawValue) : rawValue;
      });
      worksheet.addRow(row);
    });

    worksheet.addRow([]);  // Add an empty row before total row (if any)

    // If a totalKey is provided, calculate the total for that key (numeric values)
    if (totalKey) {
      // Calculate the total for the specified column
      const total = data.reduce((sum, item) => {
        const value = item[totalKey as keyof T];
        // Ensure value is a number before summing
        return sum + (typeof value === 'number' ? value : 0);
      }, 0);

      const columnCount = columns.length - 1;

      // Add the total row, where "Total" goes in the first column and the sum goes in the last column
      const totalRow = worksheet.addRow({
        [columns[0].key]: 'Total',  // "Total" in the first column
        [columns[columnCount].key]: total  // The total amount goes in the last column
      });

      // Apply styles to the total row
      applyBorders(totalRow);
      totalRow.eachCell((cell, colNumber) => {
        // Left-align "Total" in the first column
        if (colNumber === 1) {
          cell.alignment = { horizontal: 'left' };
        } else {
          // Right-align the total value in the last column
          cell.alignment = { horizontal: 'right' };
        }

        // Make the total row bold
        cell.font = { bold: true };
      });
    }


    // Style header row (bold, yellow text, red background)
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFF00' } }; // Yellow text
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' } // Red background
      };
    });

    // Apply borders to all rows (including header)
    for (let i = 1; i <= worksheet.rowCount; i++) {
      worksheet.getRow(i).eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }

    // Save the Excel file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, `${fileName}.xlsx`);
    });

    // Helper function to apply borders to rows
    function applyBorders(row: ExcelJS.Row) {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }
  }
  base64ToFile = (base64: string, fileName: string): File => {
    const base64Data = base64.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  }

}
