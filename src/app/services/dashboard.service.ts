import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../shared/common/ApiResponse';
import { ApiService } from '../shared/services/api.service';
import { CompanyWiseIncomeQueryResponse, TotalProductQueryResponse } from '../models/CompanyWiseIncomeQueryResponse';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  private readonly api = inject(ApiService)

  getCompanyWiseIncome = (): Observable<CompanyWiseIncomeQueryResponse[]> => {
    return this.api
      .get<CompanyWiseIncomeQueryResponse[]>(`company-wise-income`)
      .pipe(map((res: ApiResponse<CompanyWiseIncomeQueryResponse[]>) => res.data));
  }

  getProductSoldOut = (): Observable<TotalProductQueryResponse> => {
    return this.api
      .get<TotalProductQueryResponse>(`product-sold`)
      .pipe(map((res: ApiResponse<TotalProductQueryResponse>) => res.data));
  }

}
