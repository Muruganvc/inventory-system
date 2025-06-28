export interface CustomerRequest {
  customerId: number;
  customerName: string;
  phone: string;
  address?: string;
}

export interface OrderItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  remarks?: string;
}

export interface OrderCreateRequest {
  customer: CustomerRequest;
  orderItemRequests: OrderItemRequest[];
  balanceAmount: number;
}
