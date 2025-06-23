import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface ProductEntry  extends TableRow{
  id: string;
  productName: string;
  mrp: number;
  taxPercent: number;
  salesPrice: number;
  quantity: number;
  totalAmount: number;
}
