import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { CompanyCreate } from '../models/CompanyCreate';
import { map, Observable } from 'rxjs';
import { GetCompanyQueryResponse } from '../models/GetCompanyQueryResponse';
import { CompanyUpdateCommand } from '../models/CompanyUpdateCommand';
import { GetCategoryQueryResponse } from '../models/GetCategoryQueryResponse';
import { CategoryCreateRequest } from '../models/CategoryCreateRequest';
import { CategoryUpdateRequest } from '../models/CategoryUpdateRequest';
import { GetProductCategoryQueryResponse } from '../models/GetProductCategoryQueryResponse';
import { ProductCategoryCreateCommand } from '../models/ProductCategoryCreateCommand';
import { ProductCategoryUpdateRequest } from '../models/ProductCategoryUpdateRequest';
import { GetCompanyCategoryProductsQueryResponse } from '../models/GetCompanyCategoryProductsQueryResponse';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly api = inject(ApiService);
  createCompany = (create: CompanyCreate): Observable<number> => {
    return this.api
      .post<CompanyCreate, number>('companies', create)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getCompanies = (isAllActiveCompany: boolean): Observable<GetCompanyQueryResponse[]> => {
    return this.api
      .get<GetCompanyQueryResponse[]>(`companies?isAllActiveCompany=${isAllActiveCompany}`)
      .pipe(map(res => this.api.handleResult(res)));
  };


  getCompanyCategoryProduct = (isAllProduct : boolean): Observable<GetCompanyCategoryProductsQueryResponse[]> => {
    return this.api
      .get<GetCompanyCategoryProductsQueryResponse[]>(`company-category-products/${isAllProduct}`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  updateCompany = (companyId: number, update: CompanyUpdateCommand): Observable<number> => {
    return this.api
      .put<CompanyUpdateCommand, number>(`companies/${companyId}`, update)
      .pipe(map(res => this.api.handleResult(res)));
  };

  createCategory = (create: CategoryCreateRequest): Observable<number> => {
    return this.api
      .post<CategoryCreateRequest, number>('categories', create)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getCategories = (isAllActive: boolean): Observable<GetCategoryQueryResponse[]> => {
    return this.api
      .get<GetCategoryQueryResponse[]>(`categories/?isAllActive=${isAllActive}`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  updateCategory = (categoryId: number, update: CategoryUpdateRequest): Observable<number> => {
    return this.api
      .put<CategoryUpdateRequest, number>(`categories/${categoryId}`, update)
      .pipe(map(res => this.api.handleResult(res)));
  };

  createProductCategory = (create: ProductCategoryCreateCommand): Observable<number> => {
    return this.api
      .post<ProductCategoryCreateCommand, number>('company-category-product', create)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getProductCategories = (isAllActive: boolean): Observable<GetProductCategoryQueryResponse[]> => {
    return this.api
      .get<GetProductCategoryQueryResponse[]>(`company-category-products/${isAllActive}`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  updateProductCategory = (productCategoryId: number, update: ProductCategoryUpdateRequest): Observable<number> => {
    return this.api
      .put<ProductCategoryUpdateRequest, number>(`company-category-product/${productCategoryId}`, update)
      .pipe(map(res => this.api.handleResult(res)));
  };
}
