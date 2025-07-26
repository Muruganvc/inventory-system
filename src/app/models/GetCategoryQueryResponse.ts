import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface GetCategoryQueryResponse extends TableRow {
  companyId: number;
  companyName: string;
  categoryId: number;
  categoryName: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  productCategoryName:string;
  companyCategoryName : string;
  rowVersion :number;
}
