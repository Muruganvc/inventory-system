export interface paymentHistoryRequest {
    orderId: number;
    customerId: number;
    amountPaid: number;
    paymentMethod: string;
    transactionRefNo: string;
    balanceRemainingToPay: number;
}