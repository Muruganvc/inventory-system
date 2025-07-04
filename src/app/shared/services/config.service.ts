import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    this.config = await firstValueFrom(this.http.get('/config.json'));
  }

  get baseUrl(): string {
    return this.config?.apiBaseUrl ?? '';
  }

   get companyName(): string {
    return this.config?.companyName ?? '';
  }
}
