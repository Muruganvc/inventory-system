import { Component, inject, OnInit } from '@angular/core';
import { DatabaseBackupResponse } from '../../shared/common/DatabaseBackupResponse';
import { BackupService } from '../../services/backup.service';
import { CustomTableComponent } from "../../shared/components/custom-table/custom-table.component";
import { CommonService } from '../../shared/services/common.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './backup.component.html',
  styleUrl: './backup.component.scss'
})
export class BackupComponent implements OnInit {

  private readonly backUpService = inject(BackupService);
  private readonly commonService = inject(CommonService);
  backUpResponse: DatabaseBackupResponse[] = [];

  ngOnInit(): void {
  }

  columns: {
    key: string; label: string; align: 'left' | 'center' | 'right', type?: string, pipe?: string, isHidden: boolean, highLight?: {
      class: string,
      condition: (row: any) => boolean;
    }
  }[] = [
      { key: 'backupNo', label: '#', align: 'left', isHidden: false },
      { key: 'creator', label: 'Created By', align: 'left', isHidden: false },
      { key: 'backUpDate', label: 'BackUp Date', align: 'left', isHidden: false, pipe: 'date' },
      { key: 'fileName', label: 'File Name', align: 'left', isHidden: false },
      {
        key: 'status', label: 'Status', align: 'left', isHidden: false,
        highLight: {
          class: 'error',
          condition: row => row.status != 'success'
        }
      }
    ];

  createBack = (): void => {
    this.backUpService.createBackupNew().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
 
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}_` +
          `${currentDate.getHours().toString().padStart(2, '0')}-${currentDate.getMinutes().toString().padStart(2, '0')}-${currentDate.getSeconds().toString().padStart(2, '0')}`;
 
        a.href = url;
        a.download = `database_backup_${formattedDate}.sql`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.commonService.showSuccess('SQL backup downloaded successfully!');
      },
      error: (error) => {
        console.error('Error downloading SQL file', error); // Handle error properly
      },
    });
  };

}
