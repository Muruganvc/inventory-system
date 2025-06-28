import { Component, inject, OnInit } from '@angular/core';
import { DatabaseBackupResponse } from '../../shared/common/DatabaseBackupResponse';
import { BackupService } from '../../services/backup.service';
import { AuthService } from '../../services/auth.service';
import { CustomTableComponent } from "../../shared/components/custom-table/custom-table.component";

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './backup.component.html',
  styleUrl: './backup.component.scss'
})
export class BackupComponent implements OnInit {

  private readonly backUpService = inject(BackupService);
  private readonly authService = inject(AuthService);
  backUpResponse: DatabaseBackupResponse[] = [];

  ngOnInit(): void {
    this.getBack();
  }
 
  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, pipe?: string,isHidden: boolean,   highLight?: {
      class: string,
      condition: (row: any) => boolean;
    } }[] = [
    { key: 'backupNo', label: 'Backup No', align: 'left', isHidden: false },
    { key: 'creator', label: 'Creator', align: 'left', isHidden: false },
    { key: 'backUpDate', label: 'BackUp Date', align: 'left', isHidden: false, pipe: 'date' },
    { key: 'fileName', label: 'File Name', align: 'left', isHidden: false },
    { key: 'status', label: 'Status', align: 'left', isHidden: false,
      highLight: {
          class: 'error',
          condition: row => row.status  !='success'
        }
     }
  ];

  getBack = (): void => {
    this.backUpService.getBackUp().subscribe({
      next: result => {
        if (!!result) {
          this.backUpResponse = result;
        }
      }
    });
  }

  createBack = (event:any): void => {
    this.backUpService.createBackup(this.authService.getUserName()).subscribe({
      next: result => {
        if (!!result) {
          this.backUpResponse = result;
        }
      }
    });
  } 
}
