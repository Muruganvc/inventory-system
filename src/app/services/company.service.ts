import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { CompanyCreate } from '../models/CompanyCreate';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../shared/common/ApiResponse';
import { GetCompanyQueryResponse } from '../models/GetCompanyQueryResponse';
import { CompanyUpdateCommand } from '../models/CompanyUpdateCommand';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly api = inject(ApiService);
  createCompany = (create: CompanyCreate): Observable<number> => {
    return this.api
      .post<CompanyCreate, number>('company', create)
      .pipe(map((res: ApiResponse<number>) => res.data));
  }

  getCompanies = (): Observable<GetCompanyQueryResponse[]> => {
    return this.api
      .get<GetCompanyQueryResponse[]>('company')
      .pipe(map((res: ApiResponse<GetCompanyQueryResponse[]>) => res.data));
  }

  updateCompany = (companyId: number, update: CompanyUpdateCommand): Observable<number> => {
    return this.api
      .put<CompanyUpdateCommand, number>(`company/${companyId}`, update)
      .pipe(map((res: ApiResponse<number>) => res.data));
  }
}
