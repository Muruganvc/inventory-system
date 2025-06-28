import { inject, Injectable } from '@angular/core';
import { DatabaseBackupResponse } from '../shared/common/DatabaseBackupResponse';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../shared/common/ApiResponse';
import { ApiService } from '../shared/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  private readonly api = inject(ApiService)

  createBackup = (userName: string): Observable<DatabaseBackupResponse[]> => {
    return this.api
      .post<{ userName: string }, DatabaseBackupResponse[]>(`database-backup?userName=${userName}`, { userName: userName })
      .pipe(map((res: ApiResponse<DatabaseBackupResponse[]>) => res.data));
  }

  getBackUp = (): Observable<DatabaseBackupResponse[]> => {
    return this.api
      .get<DatabaseBackupResponse[]>(`backup`)
      .pipe(map((res: ApiResponse<DatabaseBackupResponse[]>) => res.data));
  }
}
