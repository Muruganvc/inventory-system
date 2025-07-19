import { ElementRef, inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { InvoiceComponent } from '../../components/order-summary/invoice/invoice.component';
import { BehaviorSubject } from 'rxjs';
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


  private dataSubject = new BehaviorSubject<string>(''); // Or any default
  sharedProfileImageData$ = this.dataSubject.asObservable();

  setProfileImageData(data: string) {
    this.dataSubject.next(data);
  }
}
