import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface PaymentHistoryResponse extends TableRow {
    customerName: string;
    finalAmount: number;
    amountPaid: number;
    balanceRemainingToPay: number;
    paymentAt: Date;
    paymentMethod: string;
    transactionRefNo: string;
    userName: string;
    cardColor: string;
}