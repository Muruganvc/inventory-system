import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface OrderListReponse extends TableRow {
  fullProductName: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  subTotal: number;
  netTotal: number;
  orderDate: Date;
  finalAmount: number;
  totalAmount: number;
  balanceAmount: number;
  customerName: string;
  address: string;
  phone: string;
  user:string;
}