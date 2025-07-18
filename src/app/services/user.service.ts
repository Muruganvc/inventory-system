import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { map, Observable } from 'rxjs';
import { MenuItem } from '../shared/common/MenuItem';
import { Customer } from '../models/Customer';
import { LoginUserResponse } from '../models/LoginUser';
import { UpdateUserRequest } from '../models/UpdateUserRequest';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { NewUserRequest } from '../models/NewUserRequest';
import { UserListResponse } from '../models/UserListResponse';
import { GetMenuItemPermissionQueryResponse } from '../models/GetMenuItemPermissionQueryResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly api = inject(ApiService)

  getUserMenu = (userId: number): Observable<MenuItem[]> => {
    return this.api
      .get<MenuItem[]>(`menus/${userId}`)
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

  getUser = (userName: string): Observable<LoginUserResponse> => {
    return this.api
      .get<LoginUserResponse>(`user/${userName}`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  updateUser = (userId: number, update: UpdateUserRequest): Observable<number> => {
    return this.api
      .put<UpdateUserRequest, number>(`update/${userId}`, update)
      .pipe(map(res => this.api.handleResult(res)));
  };

  updatePassword = (userId: number, updatePwd: ChangePasswordRequest): Observable<number> => {
    return this.api
      .put<ChangePasswordRequest, number>(`password-change/${userId}`, updatePwd)
      .pipe(map(res => this.api.handleResult(res)));
  };

  createNewUser = (user: NewUserRequest): Observable<number> => {
    return this.api
      .post<NewUserRequest, number>(`new-user`, user)
      .pipe(map(res => this.api.handleResult(res)));
  };

  getUsers = (): Observable<UserListResponse[]> => {
    return this.api
      .get<UserListResponse[]>(`users`)
      .pipe(map(res => this.api.handleResult(res)));
  };

  setActiveUser = (userId: number): Observable<boolean> => {
    return this.api
      .put<null, boolean>(`user/activate/${userId}`, null)
      .pipe(map(res => this.api.handleResult(res)));
  };

  addOrRemoveUserMenuItem = (userId: number, menuId: number): Observable<boolean> => {
    return this.api
      .post<null, boolean>(`menu/${userId}/${menuId}`, null)
      .pipe(map(res => this.api.handleResult(res)));
  };

}
