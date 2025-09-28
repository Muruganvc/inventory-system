import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../services/order.service';
import { PaymentHistoryResponse } from '../../../../models/PaymentHistoryResponse';

@Component({
  selector: 'app-payment-history-dialog',
  standalone: true,
  imports: [MatButtonModule, CommonModule, MatDialogModule, MatTableModule, MatPaginatorModule, MatCardModule, MatIconModule],
  templateUrl: './payment-history-dialog.component.html',
  styleUrl: './payment-history-dialog.component.scss'
})
export class PaymentHistoryDialogComponent implements OnInit {
  isMobile = false;
  displayedColumns: string[] = ['customerName', 'finalAmount', 'amountPaid', 'balanceRemainingToPay', 'paymentAt', 'paymentMethod', 'transactionRefNo'];
  paymentHistory: PaymentHistoryResponse[] = [];
  private readonly orderService = inject(OrderService);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private breakpointObserver: BreakpointObserver
  ) { }
 

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });

    this.orderService.getPaymentHistory(this.data.orderId).subscribe({
      next: (res) => {
        this.paymentHistory = res.map(item => ({
          ...item,
          cardColor: this.getRandomColor()
        }));
      },
      error: (err) => {
        console.error('Error fetching payment history', err);
      }
    });

  }
  getRandomColor(): string {
    const colors = [
      '#e3f2fd', // light blue
      '#fce4ec', // pink
      '#e8f5e9', // green
      '#fff3e0', // orange
      '#ede7f6', // purple
      '#f9fbe7', // lime
      '#f3e5f5', // violet
      '#fbe9e7', // peach
      '#e0f7fa', // teal
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
}