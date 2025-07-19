import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../shared/services/api.service';
import { CompanyWiseIncomeQueryResponse, TotalProductQueryResponse } from '../models/CompanyWiseIncomeQueryResponse';
import { ProductQuantities } from '../models/ProductQuantities';
import { AuditLog } from '../models/AuditLog';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  private readonly api = inject(ApiService)

  getCompanyWiseIncome = (): Observable<CompanyWiseIncomeQueryResponse[]> => {
    return this.api
      .get<CompanyWiseIncomeQueryResponse[]>('company-wise-income')
      .pipe(map(res => this.api.handleResult(res)));
  };

  getProductSoldOut = (): Observable<TotalProductQueryResponse> => {
    return this.api
      .get<TotalProductQueryResponse>('product-sold')
      .pipe(map(res => this.api.handleResult(res)));
  };

  getProductQuantity = (): Observable<ProductQuantities[]> => {
    return this.api
      .get<ProductQuantities[]>('product-quantity')
      .pipe(map(res => this.api.handleResult(res)));
  };

  getAuditLogs = (): Observable<AuditLog[]> => {
    return this.api
      .get<AuditLog[]>('audit-log')
      .pipe(map(res => this.api.handleResult(res)));
  };

}
