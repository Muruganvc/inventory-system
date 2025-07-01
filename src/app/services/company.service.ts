import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { CompanyCreate } from '../models/CompanyCreate';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../shared/common/ApiResponse';
import { GetCompanyQueryResponse } from '../models/GetCompanyQueryResponse';
import { CompanyUpdateCommand } from '../models/CompanyUpdateCommand';
import { GetCategoryQueryResponse } from '../models/GetCategoryQueryResponse';
import { CategoryCreateRequest } from '../models/CategoryCreateRequest';
import { CategoryUpdateRequest } from '../models/CategoryUpdateRequest';
import { GetProductCategoryQueryResponse } from '../models/GetProductCategoryQueryResponse';
import { ProductCategoryCreateCommand } from '../models/ProductCategoryCreateCommand';
import { ProductCategoryUpdateRequest } from '../models/ProductCategoryUpdateRequest';

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

  createCategory = (create: CategoryCreateRequest): Observable<number> => {
    return this.api
      .post<CategoryCreateRequest, number>('category', create)
      .pipe(map((res: ApiResponse<number>) => res.data));
  }

   getCategories = (): Observable<GetCategoryQueryResponse[]> => {
    return this.api
      .get<GetCategoryQueryResponse[]>('categories')
      .pipe(map((res: ApiResponse<GetCategoryQueryResponse[]>) => res.data));
  }

    updateCategory = (categoryId: number, update: CategoryUpdateRequest): Observable<number> => {
    return this.api
      .put<CategoryUpdateRequest, number>(`category/${categoryId}`, update)
      .pipe(map((res: ApiResponse<number>) => res.data));
  }

  createProductCategory = (create: ProductCategoryCreateCommand): Observable<number> => {
    return this.api
      .post<ProductCategoryCreateCommand, number>('product-category', create)
      .pipe(map((res: ApiResponse<number>) => res.data));
  }

   getProductCategories = (): Observable<GetProductCategoryQueryResponse[]> => {
    return this.api
      .get<GetProductCategoryQueryResponse[]>('product-categories')
      .pipe(map((res: ApiResponse<GetProductCategoryQueryResponse[]>) => res.data));
  }

    updateProductCategory = (productCategoryId: number, update: ProductCategoryUpdateRequest): Observable<number> => {
    return this.api
      .put<ProductCategoryUpdateRequest, number>(`product-category/${productCategoryId}`, update)
      .pipe(map((res: ApiResponse<number>) => res.data));
  }

}
