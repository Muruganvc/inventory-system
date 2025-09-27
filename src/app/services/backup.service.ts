import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiService } from '../shared/services/api.service';
import { BackupResponse } from '../models/Backup';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private readonly api = inject(ApiService);



  createBackupNew(): Observable<Blob> {
    return this.api
      .downloadSqlFile(
        `database-backup`
      );
  }

  getBackUp(): Observable<BackupResponse[]> {
    return this.api
      .get<BackupResponse[]>('backup')
      .pipe(
        map(res => this.api.handleResult(res))
      );
  }
}
