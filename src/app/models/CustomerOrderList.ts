import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface CustomerOrderList extends TableRow {
    orderId: number;
    customerName: string;
    phone: string;
    address: string;
    orderDate: Date;
    totalAmount: number;
    finalAmount: number;
    balanceAmount: number;
    customerId: number;
}