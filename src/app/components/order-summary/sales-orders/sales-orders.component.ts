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
import { CommonService } from '../../../shared/services/common.service';

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
  private readonly commonService = inject(CommonService);

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

    await this.commonService.onPrint(order.orderId,this.invoiceComponent,this.printFrame);

   }

  // Placeholder methods (can be removed if unused)
  newOpen(_item: any): void {}
  handleFieldChange(_change: any): void {}
  onDelete(_order: CustomerOrderList): void {}
}
