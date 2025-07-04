import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface ProductEntry  extends TableRow{ 
  productId:number;
  productName: string;
  mrp: number;
  price: number;
  quantity: number;
  totalAmount: number;
}
