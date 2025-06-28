import { Component, inject, OnInit } from '@angular/core';
import { CustomTableComponent } from "../../../shared/components/custom-table/custom-table.component";
import { OrderListReponse } from '../../../models/OrderList';
import { OrderService } from '../../../services/order.service';
import { CustomerOrderList } from '../../../models/CustomerOrderList';

@Component({
  selector: 'app-sales-orders',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './sales-orders.component.html',
  styleUrl: './sales-orders.component.scss'
})
export class SalesOrdersComponent implements OnInit {
  customerOrderList: CustomerOrderList[] = [];
  private readonly orderService = inject(OrderService);
  ngOnInit(): void {
    this.getOrderSummary();
  }


  
    tableActions =
      [
        {
          iconClass: 'fas fa-print',
          color: 'green',
          tooltip: 'Print',
          action: 'print',
          condition: (row: any) => !row.isEditing // or `true` if always visible
        }
      ];
  
  
    onAction(event: { row: CustomerOrderList; action: string }) {
      const { row, action } = event;
      switch (action) {
        case 'print': this.onPrint(row); break; 
      }
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

  getOrderSummary = (): void => {
    this.orderService.getCustomerOrders().subscribe({
      next: result => {
        this.customerOrderList = result
      }
    });
  }

  onPrint(a: CustomerOrderList) {
    const popup = window.open('/invoice-print', '_blank', 'width=900,height=800');

    if (!popup) {
      alert('Popup blocked. Please allow popups in your browser.');
    }
  }
  newOpen(a: any) {

  }

  handleFieldChange(a: any) {

  }
  onDelete(a: CustomerOrderList) {

  }
} 
