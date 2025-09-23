import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { filter, firstValueFrom } from 'rxjs';

import { OrderService } from '../../../services/order.service';
import { Invoice } from '../../../models/CustomerSalesOrder';
import { UserService } from '../../../services/user.service';
import { GetInventoryCompanyInfo } from '../../../models/GetInventoryCompanyInfo';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
  @ViewChild('invoiceContent', { static: false }) invoiceContent!: ElementRef;

  private readonly orderService = inject(OrderService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly userService = inject(UserService);
  invCompanyInfo: GetInventoryCompanyInfo;
  // Customer Info
  customer = {
    name: '',
    address: '',
    phone: '',
  };
  // Invoice Info
  invoice: Invoice = {
    invoiceNo: '',
    invoiceDate: '',
    items: [],
    totalAmount: 0,
    amountInWords: '',
    totalTaxable: 0,
    user: '',
    disCountPercent: 0,
    balanceAmount: 0,
    isGst: false
  };


  givenAmount = 0;
  qrCodePreview: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    // this.getInvCompanyInfo();
  }

  async getOrder(orderId: number): Promise<void> {
    this.getInvCompanyInfo();
    const result = await firstValueFrom(this.orderService.getOrderSummaries(orderId));
    if (result?.length) {
      const [firstItem] = result;

      this.invoice = {
        ...this.invoice,
        invoiceNo: String(orderId),
        invoiceDate: new Date().toISOString().split('T')[0],
        items: result.map(a => ({
          name: a.fullProductName,
          qty: a.meter > 0 ? a.meter : a.quantity,
          rate: a.unitPrice,
          total: a.meter > 0 ? a.meter * a.unitPrice : a.quantity * a.unitPrice,
          balanceAmount: a.balanceAmount,
          unit: 'PCS',
          productId: a.productId,
          igstAmount: 10, // Hardcoded for now
          igstPercent: 18,
          taxableValue: 18,
          serialNo: a.serialNo
        })),
        user: firstItem.user,
        disCountPercent: firstItem.discountPercent,
      };

      this.invoice.totalAmount = this.getInvoiceTotal(this.invoice.items);
      this.invoice.amountInWords = this.numberToWords(Math.round(this.invoice.totalAmount)) + ' rupees only';
      this.invoice.isGst = firstItem.isGst;

      this.givenAmount = firstItem.finalAmount - firstItem.balanceAmount;

      this.customer = {
        name: firstItem.customerName,
        address: firstItem.address,
        phone: firstItem.phone,
      };
    }
  }
  calculateGST(amount: number, gstRate: number): {
    gstAmount: number,
    cgst: number,
    sgst: number,
    totalAmount: number
  } {
    const gstAmount = (amount * gstRate) / 100;
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const totalAmount = amount + gstAmount;

    return {
      gstAmount,
      cgst,
      sgst,
      totalAmount
    };
  }

  async getContentHtml(orderId: number): Promise<string> {
    this.resetInvoice();
    await this.getOrder(orderId);
    this.cdr.detectChanges();
    await new Promise(r => setTimeout(r, 0));
    return this.invoiceContent.nativeElement.innerHTML;
  }

  private resetInvoice(): void {
    this.invoice.items = [];
    this.invoice.totalAmount = 0;
    this.invoice.amountInWords = '';
    this.customer = { name: '', address: '', phone: '' };
  }

  getInvoiceTotal(items: any[]): number {
    return items.reduce((sum, item) => sum + (item.total || 0), 0);
  }

  calculateDiscount(totalAmount: number, discountPercentage: number): number {
    return (totalAmount * discountPercentage) / 100;
  }

  numberToWords(num: number): string {
    if (num === 0) return 'zero';

    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const getTwoDigitWords = (n: number): string =>
      n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');

    const getThreeDigitWords = (n: number): string => {
      const hundred = Math.floor(n / 100);
      const rest = n % 100;
      return (hundred ? ones[hundred] + ' hundred' + (rest ? ' and ' : '') : '') + getTwoDigitWords(rest);
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

  async getInvCompanyInfo(): Promise<void> {
    const info = await firstValueFrom(this.userService.getInventoryCompanyInfo(1));
    if (!info) return;
    this.invCompanyInfo = info;
    this.qrCodePreview = info.qrCodeBase64 ?? null;
  }
}
