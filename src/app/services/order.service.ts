import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { OrderCreateRequest } from '../models/CustomerRequest';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../shared/common/ApiResponse';

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
}
