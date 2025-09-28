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
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { MAT_DATE_FORMATS } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CUSTOM_DATE_FORMATS } from '../../../shared/services/CUSTOM_DATE_FORMATS';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from '../../../shared/services/CustomDateAdapter';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { paymentHistoryRequest } from '../../../models/paymentHistoryRequest';
import { PaymentHistoryDialogComponent } from './payment-history-dialog/payment-history-dialog.component';
@Component({
  selector: 'app-sales-orders',
  standalone: true,
  imports: [CustomTableComponent, CommonModule, FormsModule, MatButtonModule, InvoiceComponent, MatNativeDateModule, MatFormFieldModule, MatDatepickerModule],
  templateUrl: './sales-orders.component.html',
  styleUrl: './sales-orders.component.scss',
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ]
})
export class SalesOrdersComponent implements OnInit {
  customerOrderList: CustomerOrderList[] = [];
  filteredCustomerOrderList: CustomerOrderList[] = [];
  isPrint: boolean;

  @ViewChild('printFrame', { static: true }) printFrame!: ElementRef;
  @ViewChild(InvoiceComponent) invoiceComponent!: InvoiceComponent;

  private readonly orderService = inject(OrderService);
  private readonly commonService = inject(CommonService);
  private readonly dialog = inject(MatDialog);
  private readonly dateAdapter = inject(DateAdapter<Date>);

  startDate: Date | null = null;
  endDate: Date | null = null;

  ngOnInit(): void {
    this.dateAdapter.setLocale('en-US');
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
      { key: 'phone', label: 'Phone', align: 'left', isHidden: false },
      { key: 'address', label: 'Address', align: 'left', isHidden: false },
      { key: 'orderDate', label: 'Order Date', align: 'center', isHidden: false, pipe: 'date' },
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
      condition: (row: any) => true
    },
    {
      iconClass: 'fas fa-credit-card',
      color: 'red',
      tooltip: 'Payement',
      action: 'payement',
      condition: (row: any) => row.balanceAmount !== 0
    },
    {
      iconClass: 'fas fa-eye',
      color: 'green',
      tooltip: 'Payment History',
      action: 'paymentHistory',
      condition: (row: any) => true
    }
  ];

  getOrderSummary(): void {
    this.orderService.getCustomerOrders().subscribe({
      next: result => {
        this.customerOrderList = result;
        this.filteredCustomerOrderList = [...result]; // default view
      }
    });
  }

  onAction(event: { row: CustomerOrderList; action: string }): void {
    const { row, action } = event;
    if (action === 'print') {
      this.onPrint(row);
    } else if (action === 'payement') {
      this.payment(row);
    }
    else if (action === 'paymentHistory') {
      this.paymentHistory(row);
    }
  }

  async onPrint(order: CustomerOrderList): Promise<void> {
    this.isPrint = true;
    const content = await this.invoiceComponent.getContentHtml(order.orderId);
    const frame: HTMLIFrameElement = this.printFrame.nativeElement;
    const doc = frame.contentWindow?.document!;

    await this.commonService.onPrint(order.orderId, this.invoiceComponent, this.printFrame);

  }

  // Placeholder methods (can be removed if unused)
  newOpen(_item: any): void { }
  handleFieldChange(_change: any): void { }
  onDelete(_order: CustomerOrderList): void { }

  filterByDateRange(): void {
    if (!this.startDate || !this.endDate) return;

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    // Normalize end date to end of the day to include all orders on that day
    end.setHours(23, 59, 59, 999);

    this.filteredCustomerOrderList = this.customerOrderList.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= start && orderDate <= end;
    });
  }

  resetFilter(): void {
    this.startDate = null;
    this.endDate = null;
    this.filteredCustomerOrderList = [...this.customerOrderList]; // restore full list
  }

  private payment = (value: CustomerOrderList): void => {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '95%',
      maxWidth: '600px',
      // height: '500px',
      disableClose: true,
      panelClass: 'no-radius-dialog',
      data: {
        customerName: value.customerName,
        mobileNo: value.phone,
        currentAmount: value.balanceAmount
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      let paymentHistrory: paymentHistoryRequest = {
        orderId: value.orderId,
        customerId: value.customerId,
        amountPaid: result.amountPaid,
        paymentMethod: result.paymentMethod,
        transactionRefNo: result.transactionRefNo,
        balanceRemainingToPay: result.balanceRemainingToPay
      };

      this.orderService.createPaymentHistory(paymentHistrory).subscribe({
        next: result => {
          if (result) {
            this.getOrderSummary();
            this.commonService.showSuccess("Payment successfully created.");
          }
        }
      });
    });
  }
  private paymentHistory = (value: CustomerOrderList): void => {
    const dialogRef = this.dialog.open(PaymentHistoryDialogComponent, {
      width: '95%',
      maxWidth: '1000px',
      // height: '500px',
      disableClose: true,
      panelClass: 'no-radius-dialog',
      data: {
        orderId: value.orderId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
