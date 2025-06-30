import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface UserListResponse extends TableRow {
  userId: number;
  userName: string;
  email: string;
  firstName: string;
  lastName?: string;   
  isActive: boolean;  
}
