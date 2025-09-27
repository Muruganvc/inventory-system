import { Component, inject, OnInit } from '@angular/core';
import { BackupService } from '../../services/backup.service';
import { CustomTableComponent } from "../../shared/components/custom-table/custom-table.component";
import { CommonService } from '../../shared/services/common.service';
import { MatButtonModule } from '@angular/material/button';
import { BackupResponse } from '../../models/Backup';

@Component({
  selector: 'app-backup',
  standalone: true,
  imports: [MatButtonModule, CustomTableComponent],
  templateUrl: './backup.component.html',
  styleUrl: './backup.component.scss'
})
export class BackupComponent implements OnInit {

  backup: BackupResponse[] = [];

  private readonly backUpService = inject(BackupService);
  private readonly commonService = inject(CommonService);

  ngOnInit(): void {
    this.loadBackupDetails();
  }

  private loadBackupDetails = (): void => {
    this.backUpService.getBackUp().subscribe({
      next: (response) => {
        this.backup = [...response];
      },
      error: (error) => console.error('Failed to load backup details:', error)
    });
  }



  columns: {
    key: string; label: string; align: 'left' | 'center' | 'right', type?: string, pipe?: string, isHidden: boolean, highLight?: {
      class: string,
      condition: (row: any) => boolean;
    }
  }[] = [
      { key: 'backupId', label: '#', align: 'left', isHidden: false },
      { key: 'createdBy', label: 'Created By', align: 'left', isHidden: false },
      { key: 'backupDate', label: 'BackUp Date', align: 'left', isHidden: false, pipe: 'date' },
      { key: 'isActive', label: 'Is Active', align: 'left', isHidden: false },
      { key: 'backupStatus', label: 'Backup Status', align: 'left', isHidden: false },
      {
        key: 'errorMessage', label: 'Error Message', align: 'left', isHidden: false,
        highLight: {
          class: 'error',
          condition: row => row.backupStatus === 'FAILED'
        }
      }
    ];

  buttons = [
    {
      label: 'Data Backup',
      icon: 'fas fa-circle-plus',
      tooltip: 'Data Backup',
      action: 'dataBackup',
      class: 'add-new-item-button'
    }
  ];

  onButtonClicked(action: string) {
    if (action === 'dataBackup') {
      this.createBack();
    }
  }


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
      complete: () => {
        this.loadBackupDetails();
      }
    });
  };
}
