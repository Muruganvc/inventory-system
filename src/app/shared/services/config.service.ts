import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface AppConfig {
  apiBaseUrl: string;
  companyName: string;
  apiVersion: string;
  uiVersion: string;
  dbName: string;
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: AppConfig | null = null;

  constructor(private http: HttpClient) { }

  async load(): Promise<void> {
    this.config = await firstValueFrom(this.http.get<AppConfig>('/config.json'));
  }

  get baseUrl(): string {
    return this.config?.apiBaseUrl ?? '';
  }

  get companyName(): string {
    return this.config?.companyName ?? '';
  }

  get apiVersion(): string {
    return this.config?.apiVersion ?? '';
  }

  get uiVersion(): string {
    return this.config?.uiVersion ?? '';
  }
  get dbName(): string {
    return this.config?.dbName ?? '';
  }
}
