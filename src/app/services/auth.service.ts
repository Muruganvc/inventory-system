import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { LoginRequest, LoginResponse } from '../models/LoginRequest';
import { map, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { Result } from '../shared/common/ApiResponse';
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
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  login(login: LoginRequest): Observable<LoginResponse> {
    return this.api
      .post<LoginRequest, LoginResponse>('user-login', login)
      .pipe(
        map(res => this.api.handleResult(res)),
        tap(response => {
          if (response.token) {
            this.setToken(response.token);
          }
        })
      );
  }

  logout(redirectTo: string = '/login'): void {
    this.removeToken();
    localStorage.clear();
    this.router.navigate([redirectTo]);
    location.reload;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.getDecodedToken();
    if (!decoded) return false;

    const now = Date.now().valueOf() / 1000;
    return decoded.exp > now;
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



  hasRole(requiredRoles: string[]): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded) return false;

    const roleClaimKey = Object.keys(decoded).find(key =>
      key.endsWith('/identity/claims/role')
    );
    if (!roleClaimKey) return false;

    const roles = decoded[roleClaimKey];
    const userRoles = Array.isArray(roles) ? roles : [roles];

    if (userRoles.includes('SuperAdmin')) return true;

    return requiredRoles.some(role => userRoles.includes(role));
  }

  getClaim(decoded: any, shortName: string): any {
    const key = Object.keys(decoded).find(k => k.endsWith(`/identity/claims/${shortName}`));
    return key ? decoded[key] : null;
  }
}