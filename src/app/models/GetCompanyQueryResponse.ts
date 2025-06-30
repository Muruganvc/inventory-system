import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface GetCompanyQueryResponse extends TableRow {
  companyId: number;
  companyName: string;
  isActive: boolean;
  createDate: Date;
  createdBy: string;
  description:string;
}
