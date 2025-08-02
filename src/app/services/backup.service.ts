import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiService } from '../shared/services/api.service';
import { DatabaseBackupResponse } from '../shared/common/DatabaseBackupResponse';

@Injectable({
  providedIn: 'root',
})
export class BackupService {
  private readonly api = inject(ApiService);

  createBackup(userName: string): Observable<DatabaseBackupResponse[]> {
    return this.api
      .post<{ userName: string }, DatabaseBackupResponse[]>(
        `database-backup?userName=${encodeURIComponent(userName)}`,
        { userName }
      )
      .pipe(
        map(res => this.api.handleResult(res))
      );
  }


  createBackupNew(): Observable<Blob> {
    return this.api
      .downloadSqlFile(
        `database-backup`
      );
  }

  getBackUp(): Observable<DatabaseBackupResponse[]> {
    return this.api
      .get<DatabaseBackupResponse[]>('backup')
      .pipe(
        map(res => this.api.handleResult(res))
      );
  }
}
