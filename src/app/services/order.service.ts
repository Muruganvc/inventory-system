import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { OrderCreateRequest } from '../models/CustomerRequest';
import { map, Observable } from 'rxjs';
import { OrderListReponse } from '../models/OrderList';
import { CustomerOrderList } from '../models/CustomerOrderList';
import { paymentHistoryRequest } from '../models/paymentHistoryRequest';
import { PaymentHistoryResponse } from '../models/PaymentHistoryResponse';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly api = inject(ApiService);

  createOrder = (orderItem: OrderCreateRequest): Observable<number> => {
    return this.api
      .post<OrderCreateRequest, number>('new-order', orderItem)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getOrderSummaries = (orderId: number): Observable<OrderListReponse[]> => {
    return this.api
      .get<OrderListReponse[]>(`order-summary?OrderId=${orderId}`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getCustomerOrders = (): Observable<CustomerOrderList[]> => {
    return this.api
      .get<CustomerOrderList[]>('customer-orders')
      .pipe(map(res => this.api.handleResult(res)));
  };

  createPaymentHistory = (payment: paymentHistoryRequest): Observable<boolean> => {
    return this.api
      .post<paymentHistoryRequest, boolean>('payment-history', payment)
      .pipe(map(res => this.api.handleResult(res)));
  }

  getPaymentHistory = (orderId: number): Observable<PaymentHistoryResponse[]> => {
    return this.api
      .get<PaymentHistoryResponse[]>(`payment-history/${orderId}`)
      .pipe(map(res => this.api.handleResult(res)));
  };
}
