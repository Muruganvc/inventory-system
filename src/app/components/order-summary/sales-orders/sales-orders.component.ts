import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { CustomTableComponent } from '../../../shared/components/custom-table/custom-table.component';
import { OrderService } from '../../../services/order.service';
import { InvoiceComponent } from '../invoice/invoice.component';
import { CustomerOrderList } from '../../../models/CustomerOrderList';

@Component({
  selector: 'app-sales-orders',
  standalone: true,
  imports: [CustomTableComponent, InvoiceComponent],
  templateUrl: './sales-orders.component.html',
  styleUrl: './sales-orders.component.scss'
})
export class SalesOrdersComponent implements OnInit {
  customerOrderList: CustomerOrderList[] = [];
  isPrint: boolean;

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
      { key: 'orderDate', label: 'Order Date', align: 'center', isHidden: false, pipe: 'date' },
      { key: 'totalAmount', label: 'Total ₹', align: 'center', isHidden: false },
      {
        key: 'finalAmount', label: 'Final ₹', align: 'right', isHidden: false
      },
      {
        key: 'balanceAmount', label: 'Balance ₹', align: 'right', isHidden: false, highLight: {
          class: 'error',
          condition: row => row.balanceAmount > 100
        }
      }
    ];

  tableActions = [
    {
      iconClass: 'fas fa-print',
      color: 'green',
      tooltip: 'Print',
      action: 'print',
      condition: (row: any) => !row.isEditing
    }
  ];

  getOrderSummary(): void {
    this.orderService.getCustomerOrders().subscribe({
      next: result => {
        this.customerOrderList = result;
      }
    });
  }

  onAction(event: { row: CustomerOrderList; action: string }): void {
    const { row, action } = event;
    if (action === 'print') {
      this.onPrint(row);
    }
  }

  async onPrint(order: CustomerOrderList): Promise<void> {
    this.isPrint = true;
    const content = await this.invoiceComponent.getContentHtml(order.orderId);
    const frame: HTMLIFrameElement = this.printFrame.nativeElement;
    const doc = frame.contentWindow?.document!;

    doc.open();

    const html = `
      <html>
        <head>
          <title>Print Invoice</title>
          <style>
            @media print {
              @page { size: A4; margin: 20mm; }
              body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                margin: 0; padding: 0;
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

    console.log(html)
    doc.write(html);
    doc.close();

    setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    }, 500);
  }

  // Placeholder methods (can be removed if unused)
  newOpen(_item: any): void {}
  handleFieldChange(_change: any): void {}
  onDelete(_order: CustomerOrderList): void {}
}
