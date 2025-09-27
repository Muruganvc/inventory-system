import { TableRow } from "../shared/components/custom-table/custom-table.component";

export interface BackupResponse extends TableRow {
    backupId: number;
    backupDate: string;
    isActive: boolean;
    createdBy: string;
    backupStatus: string;
    errorMessage: string;
}
