import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { OrderCreateRequest } from '../models/CustomerRequest';
import { map, Observable } from 'rxjs';
import { OrderListReponse } from '../models/OrderList';
import { CustomerOrderList } from '../models/CustomerOrderList';

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

}
