import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface GetCompanyQueryResponse extends TableRow {
  companyId: number;
  companyName: string;
  isActive: boolean;
  createdDate: Date;
  createdBy: string;
  description: string;
  rowVersion: number;
}
