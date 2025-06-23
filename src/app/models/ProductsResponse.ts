import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface ProductsResponse extends TableRow {
  productId: number;
  productName: string;
  productCategoryId?: number;
  productCategoryName?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  companyId?: number | null;
  companyName?: string | null;
  description?: string | null;
  mrp: number;
  salesPrice: number;
  quantity: number;
  taxPercent: number;
  taxType?: string | null;
  barcode?: string | null;
  brandName?: string | null;
  isActive: boolean;
  userName?: string | null;
}