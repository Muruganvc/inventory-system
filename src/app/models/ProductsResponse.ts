import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface RowVersion {
  rowVersion: number;
}
 
export interface UpdateProductQuantityPayload extends RowVersion {
  quantity: number;
}

export interface ProductsResponse extends TableRow,RowVersion {
  productFullName: string;
  productId: number;
  productName: string;
  productCategoryId: number;
  productCategoryName?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  companyId?: number | null;
  companyName?: string | null;
  description?: string | null;
  mrp: number;
  salesPrice: number;
  landingPrice: number;
  quantity: number;
  isActive: boolean;
  userName?: string | null;
  isEditing: boolean; 
}
 