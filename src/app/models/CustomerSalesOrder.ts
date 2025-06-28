export interface CustomerSalesOrder {
    productName: string;
    qty: number;
    rate: number;
    total: number;
}

export interface InvoiceItem {
  name: string;
  qty: number;
  unit: string;
  rate: number;
  taxableValue: number;
  igstPercent: number;
  igstAmount: number;
  total: number;
}

export interface Invoice {
  invoiceNo: string;
  invoiceDate: string;
  items: InvoiceItem[];
  totalTaxable: number;
  totalAmount: number;
  amountInWords: string;
}