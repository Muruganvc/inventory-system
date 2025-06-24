import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { map, Observable } from 'rxjs';
import { MenuItem } from '../shared/common/MenuItem';
import { ApiResponse } from '../shared/common/ApiResponse';
import { Customer } from '../models/Customer';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly api = inject(ApiService)

  getUserMenu = (userId: number): Observable<MenuItem[]> => {
    return this.api
      .get<MenuItem[]>(`menus/${userId}`)
      .pipe(map((res: ApiResponse<MenuItem[]>) => res.data));
  }

  getCustomers = (): Observable<Customer[]> => {
    return this.api
      .get<Customer[]>(`customers`)
      .pipe(map((res: ApiResponse<Customer[]>) => res.data));
  }
  
}
