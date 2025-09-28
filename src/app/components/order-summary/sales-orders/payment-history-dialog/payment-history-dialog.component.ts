import { Component, inject, Inject, OnInit } from '@angular/core';
import { CustomTableComponent } from "../../../../shared/components/custom-table/custom-table.component";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from '../../../../services/order.service';
import { PaymentHistoryResponse } from '../../../../models/PaymentHistoryResponse';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-payment-history-dialog',
  standalone: true,
  imports: [CustomTableComponent,MatButtonModule,MatDialogModule],
  templateUrl: './payment-history-dialog.component.html',
  styleUrl: './payment-history-dialog.component.scss'
})
export class PaymentHistoryDialogComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  orderId: number;
  paymentHistory: PaymentHistoryResponse[] = [];
  constructor(
    public dialogRef: MatDialogRef<PaymentHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderId = data.orderId;
  }
  ngOnInit(): void {
    this.orderService.getPaymentHistory(this.orderId).subscribe({
      next: result => {
        this.paymentHistory = [...result];
      }
    });
  }
  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean, pipe?: string, }[] = [
    { key: 'customerName', label: 'Company Name', align: 'left', isHidden: false },
    { key: 'finalAmount', label: 'Final Amount', align: 'left', isHidden: true },
    { key: 'amountPaid', label: 'Amount Paid', align: 'left', isHidden: false },
    { key: 'balanceRemainingToPay', label: 'Balance To Pay', align: 'left', isHidden: false },
    { key: 'paymentAt', label: 'payment At', align: 'left', isHidden: false, pipe: 'date' },
    { key: 'paymentMethod', label: 'Payment Method', align: 'left', isHidden: false },
    { key: 'transactionRefNo', label: 'Transaction Ref No', align: 'left', isHidden: false },
  ];
}
