import { Component, inject } from '@angular/core';
import { OrderListReponse } from '../../../models/OrderList';
import { OrderService } from '../../../services/order.service';
import { CustomTableComponent } from "../../../shared/components/custom-table/custom-table.component";

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './sales-history.component.html',
  styleUrl: './sales-history.component.scss'
})
export class SalesHistoryComponent {
salesOrderList: OrderListReponse[] = [];
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
    this.orderService.getOrderSummaries().subscribe({
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
}
