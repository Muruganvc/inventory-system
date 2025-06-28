import { TableRow } from "../components/custom-table/custom-table.component";

export interface DatabaseBackupResponse extends TableRow {
    backupNo: number;
    creator: string;
    backUpDate: Date;
    fileName: string;
    status: string;
}