import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { LoginRequest, LoginResponse } from '../models/LoginRequest';
import { map, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonService } from '../shared/services/common.service';
export interface DecodedToken {
  exp: number;
  role: string | string[];
  name?: string;
  email?: string;
  userId: number;
  [key: string]: any;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'authToken';
  private refreshTokenKey = 'refreshToken';
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly commonService = inject(CommonService);

  login(login: LoginRequest): Observable<LoginResponse> {
    return this.api
      .post<LoginRequest, LoginResponse>('login', login)
      .pipe(
        map(res => this.api.handleResult(res)),
        tap(response => {
          if (!response.invCompanyInfo?.isActive) {
            this.router.navigate(['/company-expired']);
            return;
          }
          if (response.token) {
            this.setToken(response.token);
            this.setRefreshToken(response.refreshToken);
          }
          if (response.invCompanyInfo) {
            this.commonService.setInventoryCompanyInfo(response.invCompanyInfo);
          }
        })
      );
  }

  logout = (redirectTo: string = '/login'): void => {
    this.removeToken();
    localStorage.clear();
    this.router.navigate([redirectTo]);
    location.reload;
  }

  logoutSession(): void {
    this.api.put<null, boolean>(`user/${+this.getUserId()}/session`, null).subscribe(result => {
      if (result) {
       this.logout('/home');
      }
    })
  } 

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }


  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available');
    }

    try {
      const res = await firstValueFrom(
        this.api.post<null, LoginResponse>(`refresh-token/${refreshToken}`, null)
      );

      const response = this.api.handleResult(res);

      if (response.token) {
        this.setToken(response.token);
        this.setRefreshToken(response.refreshToken);
      }

      return {
        token: response.token,
        refreshToken: response.refreshToken,
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error; // You can handle or re-throw the error as needed
    }
  }

  refreshTokenOld(): Observable<{ token: string, refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return new Observable();
    }

    return this.api
      .post<null, LoginResponse>(`refresh-token/${refreshToken}`, null)
      .pipe(
        map(res => this.api.handleResult(res)),
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
            this.setRefreshToken(response.refreshToken);
          }
        })
      );
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.getDecodedToken();
    if (!decoded) return false;

    // const now = Date.now().valueOf() / 1000;
    // return decoded.exp > now;
    return true;
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (err) {
      return null;
    }
  }

  // hasRole(requiredRoles: string[]): boolean {
  //   const decoded = this.getDecodedToken();
  //   if (!decoded) return false;

  //   const userRoles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
  //   return requiredRoles.some(role => userRoles.includes(role));
  // }
  // hasRole(requiredRoles: string[]): boolean {
  //   const decoded = this.getDecodedToken();
  //   if (!decoded || !decoded.role) return false;

  //   const userRoles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
  //   return requiredRoles.some(role => userRoles.includes(role));
  // }

  getUserName(): string {
    const decoded = this.getDecodedToken();
    return decoded?.name ?? decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  }

  getEmail(): string {
    const decoded = this.getDecodedToken();
    return decoded?.email ?? decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
  }

  getUserId(): string {
    const decoded = this.getDecodedToken();
    return decoded?.userId ?? decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  }

  getUserRoles(): string[] {
    const decoded = this.getDecodedToken();
    if (!decoded) return [];

    const roleClaimKey = Object.keys(decoded).find(k => k.endsWith('/identity/claims/role'));
    if (!roleClaimKey) return [];

    const roles = decoded[roleClaimKey];
    return Array.isArray(roles) ? roles : [roles];
  }
  // getUserRoles(): string[] {
  //   const decoded = this.getDecodedToken();
  //   if (!decoded) return [];

  //   const roleClaimKey = Object.keys(decoded).find(key =>
  //     key.endsWith('/identity/claims/role')
  //   );
  //   if (!roleClaimKey) return [];

  //   const roles = decoded[roleClaimKey];
  //   return Array.isArray(roles) ? roles : [roles];
  // }


  hasRole(requiredRoles: string[]): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return false;

    const roleClaimKey = Object.keys(decoded).find(key =>
      key.endsWith('/identity/claims/role')
    );
    if (!roleClaimKey) return false;

    const roles = decoded[roleClaimKey];
    const userRoles = Array.isArray(roles) ? roles : [roles];

    if (userRoles.includes('SUPERADMIN')) return true;

    return requiredRoles.some(role => userRoles.includes(role));
  }

  getClaim(decoded: any, shortName: string): any {
    const key = Object.keys(decoded).find(k => k.endsWith(`/identity/claims/${shortName}`));
    return key ? decoded[key] : null;
  }
}