export interface GetCompanyCategoryProductsQueryResponse {
  productCategoryId: number;
  productCategoryName: string;
  categoryId: number;
  categoryName: string;
  companyId: number;
  companyName: string;
  description?: string | null;
  isActive: boolean;
  rowVersion: number;
  username: string;
  createdAt: Date;
}
