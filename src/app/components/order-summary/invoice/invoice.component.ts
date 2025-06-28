import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { Invoice } from '../../../models/CustomerSalesOrder';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  ngOnInit(): void {
    this.paginateItems();
  }
  @ViewChild('invoiceContent', { static: false }) invoiceContent!: ElementRef;
  private readonly orderService = inject(OrderService);
private cdr = inject(ChangeDetectorRef);
  customer = {
    name: '',
    address: '',
    phone: '',
  };

  invoice: Invoice = {
    invoiceNo: '',
    invoiceDate: '',
    items: [],
    totalAmount: 0,
    amountInWords: '',
    totalTaxable: 0
  };

  company = {
    name: 'VENNILA ELECTRICAL',
    tagline: 'Electrical and rewinding service',
    address: 'Theerthamalai, Harur - 636906',
    phone: '+91-9994277980',
    email: 'info@gftools.com',
    gstin: '24HDE7487RE5RT4',
  };

  bank = {
    name: 'State Bank of India',
    branch: 'Harur',
    accountNumber: '3615678789',
    ifsc: 'SBIN0000997',
  };
 
  async getOrder(orderId: number): Promise<void> {
    try {
      const result = await firstValueFrom(this.orderService.getOrderSummaries(orderId));

      if (result && result.length > 0) {
        this.invoice.invoiceNo = String(orderId);
        this.invoice.invoiceDate = (new Date().toISOString().split('T')[0]);
        this.invoice.items = result.map(a => ({
          name: a.fullProductName,
          qty: a.quantity,
          rate: a.unitPrice,
          total: a.quantity * a.unitPrice,
          unit: 'PCS',
          igstAmount: 10,     
          igstPercent: 18,   
          taxableValue: 18  
        }));

        this.invoice.totalAmount = this.invoice.items.reduce((sum, item) => sum + item.total, 0);
        this.invoice.amountInWords = this.numberToWords(Math.round(this.invoice.totalAmount)) + ' rupees only';

        const { address, customerName, phone } = result[0];
        this.customer = { address, name: customerName, phone };
      }
      this.paginateItems();
    } catch (err) {
      console.error('Failed to fetch order:', err);
    }
  }

  async getContentHtml1(orderId: number): Promise<string> {
    await this.getOrder(orderId);   
    this.cdr.detectChanges();              
    await new Promise(r => setTimeout(r));   
    return this.invoiceContent.nativeElement.innerHTML;
  }

async getContentHtml(orderId: number): Promise<string> {
  // Clear old invoice data to avoid flickering or stale content
  this.invoice.items = [];
  this.invoice.totalAmount = 0;
  this.invoice.amountInWords = '';
  this.customer = { name: '', address: '', phone: '' };

  await this.getOrder(orderId);            // Step 1: Fetch fresh data
  this.cdr.detectChanges();                // Step 2: Trigger change detection
  await new Promise(r => setTimeout(r, 0)); // Step 3: Wait one tick for DOM update

  return this.invoiceContent.nativeElement.innerHTML;
}

  numberToWords(num: number): string {
    if (num === 0) return 'zero';

    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six',
      'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
      'thirteen', 'fourteen', 'fifteen', 'sixteen',
      'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty',
      'sixty', 'seventy', 'eighty', 'ninety'];

    const getTwoDigitWords = (n: number): string => {
      if (n < 20) return ones[n];
      return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    };

    const getThreeDigitWords = (n: number): string => {
      const hundred = Math.floor(n / 100);
      const rest = n % 100;
      return (
        (hundred ? ones[hundred] + ' hundred' + (rest ? ' and ' : '') : '') +
        getTwoDigitWords(rest)
      );
    };

    let result = '';

    const crore = Math.floor(num / 10000000);
    num %= 10000000;
    if (crore) result += getTwoDigitWords(crore) + ' crore ';

    const lakh = Math.floor(num / 100000);
    num %= 100000;
    if (lakh) result += getTwoDigitWords(lakh) + ' lakh ';

    const thousand = Math.floor(num / 1000);
    num %= 1000;
    if (thousand) result += getTwoDigitWords(thousand) + ' thousand ';

    const hundredAndBelow = num;
    if (hundredAndBelow) result += getThreeDigitWords(hundredAndBelow);

    return result.trim();
  }
  paginatedItems: any[][] = [];
paginateItems() {
  const pageSize = 15; // ← Now showing 15 items per page
  const items = this.invoice.items;
  this.paginatedItems = [];

  for (let i = 0; i < items.length; i += pageSize) {
    this.paginatedItems.push(items.slice(i, i + pageSize));
  }
}
pageSize = 15; //
  getPageTotal(page: any[]): number {
    return page.reduce((acc, item) => acc + item.total, 0);
  }

}
