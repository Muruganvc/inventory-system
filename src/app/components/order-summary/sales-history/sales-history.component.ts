import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { OrderListReponse } from '../../../models/OrderList';
import { OrderService } from '../../../services/order.service';
import { CustomTableComponent } from "../../../shared/components/custom-table/custom-table.component";
import { InvoiceComponent } from "../invoice/invoice.component";

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CustomTableComponent, InvoiceComponent],
  templateUrl: './sales-history.component.html',
  styleUrl: './sales-history.component.scss'
})
export class SalesHistoryComponent {
salesOrderList: OrderListReponse[] = [];

  @ViewChild('printFrame', { static: true }) printFrame!: ElementRef;
  @ViewChild(InvoiceComponent) invoiceComponent!: InvoiceComponent;

  private readonly orderService = inject(OrderService);
  ngOnInit(): void {
    this.getOrderSummary();
  }

  columns: {
    key: string;
    label: string;
    align: 'left' | 'center' | 'right';
    type?: string;
    isHidden: boolean;
    pipe?: string,
    highLight?: {
      class: string,
      condition: (row: any) => boolean;
    }
  }[] = [
    { key: 'customerName', label: 'Customer', align: 'left', isHidden: false },
      { key: 'address', label: 'Address', align: 'left', isHidden: false },
      { key: 'phone', label: 'Phone', align: 'left', isHidden: false },
      { key: 'fullProductName', label: 'Prod. Name', align: 'left', isHidden: false },
       { key: 'orderDate', label: 'Order Date', align: 'center', isHidden: false, pipe: 'date' },
      { key: 'quantity', label: 'Quantity', align: 'center', isHidden: false },
      { key: 'unitPrice', label: 'Unit ₹', align: 'right', isHidden: false },
      { key: 'discountPercent', label: 'Discount %', align: 'right', isHidden: false },
      { key: 'discountAmount', label: 'Discount ₹', align: 'right', isHidden: false },
      { key: 'subTotal', label: 'Sub Total ₹', align: 'right', isHidden: false },
      {
        key: 'netTotal', label: 'Net Total ₹', align: 'right', isHidden: false, highLight: {
          class: 'success',
          condition: row => row.netTotal >= 5000
        }
      },
      {
        key: 'balanceAmount', label: 'Balance ₹', align: 'right', isHidden: false, highLight: {
          class: 'error',
          condition: row => row.balanceAmount > 100
        }
      }
    ];

  getOrderSummary = (): void => {
    this.orderService.getOrderSummaries(1).subscribe({
      next: result => {
        this.salesOrderList = result
      }
    });
  }

  onEdit(a: OrderListReponse) {

  }
  newOpen(a: any) {

  }

  handleFieldChange(a: any) {

  }
  onDelete(a: OrderListReponse) {

  }

  printInvoice() {
    const content = this.invoiceComponent.getContentHtml(1); // <-- Safe call
    const frame: HTMLIFrameElement = this.printFrame.nativeElement;

    const doc = frame.contentWindow?.document!;
    doc.open();

    const html = `<html>
    <head>
      <title>Print Invoice</title>
      <style>
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            margin: 0;
            padding: 0;
          }
            .signature-block {
  text-align: right;
  font-style: italic;
}
.text-alg{
  text-align: left;
}

tfoot {
    display: table-row-group;
  }

  .company-bank-row {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1rem;
}

.company-info, .bank-section {
  flex: 1;
  min-width: 45%;
}

  .summary-only-on-last-page {
    page-break-before: avoid;
    page-break-after: always;
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
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        ${content}
      </div>
    </body>
  </html>`

    console.log(html);

    doc.write(html);

    doc.close();

    setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    }, 500);
  }

}
