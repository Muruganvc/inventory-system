import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { catchError, map, Observable, of } from 'rxjs';
import { MenuItem } from '../shared/common/MenuItem';
import { Customer } from '../models/Customer';
import { LoginUserResponse } from '../models/LoginUser';
import { UpdateUserRequest } from '../models/UpdateUserRequest';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { NewUserRequest } from '../models/NewUserRequest';
import { UserListResponse } from '../models/UserListResponse';
import { GetMenuItemPermissionQueryResponse } from '../models/GetMenuItemPermissionQueryResponse';
import { GetInventoryCompanyInfo } from '../models/GetInventoryCompanyInfo';
import { Role } from '../models/Role';
import { UserRole } from '../models/UserRole';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly api = inject(ApiService)

  getUserMenu = (userId: number): Observable<MenuItem[]> => {
    return this.api
      .get<MenuItem[]>(`menu/${userId}`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getUserMenuPermission = (userId: number): Observable<GetMenuItemPermissionQueryResponse[]> => {
    return this.api
      .get<GetMenuItemPermissionQueryResponse[]>(`menu/${userId}`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getUserMenus = (): Observable<MenuItem[]> => {
    return this.api
      .get<MenuItem[]>(`menus`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getCustomers = (): Observable<Customer[]> => {
    return this.api
      .get<Customer[]>(`customers`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getUser = (userId: number): Observable<LoginUserResponse> => {
    return this.api
      .get<LoginUserResponse>(`user/${userId}`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  updateUser = (userId: number, update: UpdateUserRequest): Observable<number> => {
    return this.api
      .put<UpdateUserRequest, number>(`update/${userId}`, update)
      .pipe(map(res => this.api.handleResult(res)));
  };

  updateUserWithImage = (userId: number, update: FormData): Observable<number> => {
    return this.api
      .put<FormData, number>(`user/${userId}`, update, undefined, undefined, true)
      .pipe(map(res => this.api.handleResult(res)));
  };

  updatePassword = (userId: number, updatePwd: ChangePasswordRequest): Observable<number> => {
    return this.api
      .put<ChangePasswordRequest, number>(`change-password/${userId}`, updatePwd)
      .pipe(map(res => this.api.handleResult(res)));
  };

  createNewUser = (user: NewUserRequest): Observable<number> => {
    return this.api
      .post<NewUserRequest, number>(`user`, user)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getUsers = (): Observable<UserListResponse[]> => {
    return this.api
      .get<UserListResponse[]>(`users`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  setActiveUser = (userId: number,isActive : boolean): Observable<boolean> => {
    return this.api
      .put<null, boolean>(`user/${userId}/status/${isActive}`, null)
      .pipe(map(res => this.api.handleResult(res)));
  };

  addOrRemoveUserMenuItem = (userId: number, menuId: number): Observable<boolean> => {
    return this.api
      .put<null, boolean>(`user-menu/${userId}/menu/${menuId}`, null)
      .pipe(map(res => this.api.handleResult(res)));
  };

  forgetPassword = (userName: string, mobileNo: string): Observable<boolean> => {
    return this.api
      .put<null, boolean>(`forget-password?userName=${userName}&mobileNo=${mobileNo}`, null)
      .pipe(map(res => this.api.handleResult(res)));
  };

  createInventoryCompanyInfo = (companyInfo: FormData): Observable<number> => {
    return this.api
      .post<FormData, number>(`inventory-company-info`, companyInfo, undefined, undefined, true)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getInventoryCompanyInfo = (invCompanyId : number): Observable<GetInventoryCompanyInfo | null> => {
    return this.api.get<GetInventoryCompanyInfo>(`inventory-company-info/${invCompanyId}`).pipe(
      map(res => this.api.handleResult(res)),
      catchError(error => {
        return of(null);
      })
    );
  };

  updateInventoryCompanyInfo = (invCompanyInfoId: number, companyInfo: FormData): Observable<number> => {
    return this.api
      .put<FormData, number>(`inventory-company-info/${invCompanyInfoId}`, companyInfo, undefined, undefined, true)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getRoles = (): Observable<Role[]> => {
    return this.api
      .get<Role[]>(`roles`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getUserRoles = (): Observable<UserRole[]> => {
    return this.api
      .get<UserRole[]>(`user-roles`)
      .pipe(map(res => this.api.handleResult(res)));
  };


  addOrRemoveUserRole = (userId: number, roleId: number): Observable<boolean> => {
    return this.api
      .post<null, boolean>(`add-or-remove-role/user/${userId}/role/${roleId}`, null)
      .pipe(map(res => this.api.handleResult(res)));
  };

}
