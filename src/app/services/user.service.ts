import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { map, Observable } from 'rxjs';
import { MenuItem } from '../shared/common/MenuItem';
import { ApiResponse } from '../shared/common/ApiResponse';

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
  
}
