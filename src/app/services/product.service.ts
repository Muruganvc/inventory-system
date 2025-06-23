import { inject, Injectable } from '@angular/core';
import { KeyValuePair } from '../shared/common/KeyValuePair';
import { ApiService } from '../shared/services/api.service';
import { ProductRequest } from '../models/ProductRequest';
import { ProductsResponse } from '../models/ProductsResponse';
import { UpdateProductRequest } from '../models/UpdateProductRequest';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly api = inject(ApiService)
  getCompany(companyName?: string) {
    const url = companyName
      ? `companyName=${encodeURIComponent(companyName)}`
      : `company`;

    return this.api.get<KeyValuePair[]>(url);
  }

  getCategories(companyId: number) {
    return this.api.get<KeyValuePair[]>(`category/${companyId}`);
  }
  getProductCategories(categoryId: number) {
    return this.api.get<KeyValuePair[]>(`product-category/${categoryId}`);
  }

  createProduct(product: ProductRequest) {
    return this.api.post<ProductRequest, number>('product', product);
  }
  updateProduct(productId: number, product: UpdateProductRequest) {
    return this.api.put<UpdateProductRequest, number>(`product/${productId}`, product);
  }
  getProducts() {
    return this.api.get<ProductsResponse[]>('products');
  }


}
