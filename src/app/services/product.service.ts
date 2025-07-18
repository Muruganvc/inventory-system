import { inject, Injectable } from '@angular/core';
import { KeyValuePair } from '../shared/common/KeyValuePair';
import { ApiService } from '../shared/services/api.service';
import { ProductRequest } from '../models/ProductRequest';
import { ProductsResponse } from '../models/ProductsResponse';
import { UpdateProductRequest } from '../models/UpdateProductRequest';
import { map, Observable } from 'rxjs';
import { BulkUpload, BulkUploadRequest } from '../models/BulkUpload';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly api = inject(ApiService)

  getCategories = (companyId: number): Observable<KeyValuePair[]> => {
    return this.api
      .get<KeyValuePair[]>(`category/${companyId}`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getProductCategories = (categoryId: number): Observable<KeyValuePair[]> => {
    return this.api
      .get<KeyValuePair[]>(`product-category/${categoryId}`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  createProduct = (product: ProductRequest): Observable<number> => {
    return this.api
      .post<ProductRequest, number>('product', product)
      .pipe(map(res => this.api.handleResult(res)));
  };

  updateProduct = (productId: number, product: UpdateProductRequest): Observable<number> => {
    return this.api
      .put<UpdateProductRequest, number>(`product/${productId}`, product)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getProducts = (type: string): Observable<ProductsResponse[]> => {
    return this.api
      .get<ProductsResponse[]>(`products/${type}`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  setActiveProduct = (productId: number): Observable<boolean> => {
    return this.api
      .put<null, boolean>(`product/activate/${productId}`, null)
      .pipe(map(res => this.api.handleResult(res)));
  };

  updateProductQty = (productId: number, qty: number): Observable<boolean> => {
    return this.api
      .put<null, boolean>(`product/${productId}/${qty}`, null)
      .pipe(map(res => this.api.handleResult(res)));
  };

  bulkCreateCompany = (data: BulkUpload[]): Observable<boolean> => {
    return this.api
      .post<BulkUpload[], boolean>('bulk-company', data)
      .pipe(map(res => this.api.handleResult(res)));
  };


}
