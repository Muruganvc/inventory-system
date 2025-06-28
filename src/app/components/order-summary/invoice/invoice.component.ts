import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {
   today: Date = new Date();
  invoice = {
    company: {
      name: 'Company Name',
      address: 'Street Address, City, ST ZIP Code',
      phone: '123-456-7890',
      email: 'company@example.com',
      gstin: '22AAAAA0000A1Z5'
    },
    customer: {
      name: 'Customer Name',
      company: 'Customer Company',
      address: 'Street Address, City, ST ZIP Code',
      phone: '987-654-3210'
    },
    items: [
      { id: 1, description: 'Item 1', quantity: 5, unitPrice: 500 },
      { id: 2, description: 'Item 2', quantity: 100, unitPrice: 30 },
      { id: 3, description: 'Item 3', quantity: 230, unitPrice: 80 },
      { id: 4, description: 'Item 4', quantity: 25, unitPrice: 1200 }
    ],
    taxRate: 5,
    shipping: 2500
  };

  get subtotal() {
    return this.invoice.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }

  get tax() {
    return this.subtotal * this.invoice.taxRate / 100;
  }

  get total() {
    return this.subtotal + this.tax + this.invoice.shipping;
  }
    ngOnInit(): void {
    // setTimeout(() => {
    //   window.print();
    //   // Optionally close window after printing
    //   window.close();
    // }, 500); // Delay to ensure rendering
  }
}
