import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { OrderCreateRequest } from '../models/CustomerRequest';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../shared/common/ApiResponse';
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
        .pipe(map((res: ApiResponse<number>) => res.data));
    }

     getOrderSummaries = (orderId : number): Observable<OrderListReponse[]> => {
      return this.api
        .get<OrderListReponse[]>(`order-summary?OrderId=${orderId}`)
        .pipe(map((res: ApiResponse<OrderListReponse[]>) => res.data));
    }
 
     getCustomerOrders = (): Observable<CustomerOrderList[]> => {
      return this.api
        .get<CustomerOrderList[]>('customer-orders')
        .pipe(map((res: ApiResponse<CustomerOrderList[]>) => res.data));
    }
}
