import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface GetProductCategoryQueryResponse extends TableRow {
  companyId: number;
  companyName: string;
  categoryId: number;
  categoryName: string;
  productCategoryId: number;
  productCategoryName: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  username: string;
  productFullName: string;
  rowVersion: number;
}
