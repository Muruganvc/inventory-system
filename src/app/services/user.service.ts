import { inject, Injectable } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { map, Observable } from 'rxjs';
import { MenuItem } from '../shared/common/MenuItem';
import { ApiResponse } from '../shared/common/ApiResponse';
import { Customer } from '../models/Customer';
import { LoginUserResponse } from '../models/LoginUser';
import { UpdateUserRequest } from '../models/UpdateUserRequest';
import { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import { NewUserRequest } from '../models/NewUserRequest';
import { UserListResponse } from '../models/UserListResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly api = inject(ApiService)

  getUserMenu = (userId: number): Observable<MenuItem[]> => {
    return this.api
      .get<MenuItem[]>(`menus/${userId}`)
      .pipe(map((res: ApiResponse<MenuItem[]>) => res.data));
  }

  getCustomers = (): Observable<Customer[]> => {
    return this.api
      .get<Customer[]>(`customers`)
      .pipe(map((res: ApiResponse<Customer[]>) => res.data));
  }

  getUser = (userName: string): Observable<LoginUserResponse> => {
    return this.api.get<LoginUserResponse>(`user/${userName}`)
      .pipe(map((res: ApiResponse<LoginUserResponse>) => res.data));
  }

  updateUser = (userId: number, update: UpdateUserRequest): Observable<number> => {
    return this.api.put<UpdateUserRequest, number>(`update/${userId}`, update)
      .pipe(map((res: ApiResponse<number>) => res.data));
  }

  updatePassword = (userId: number, updatePwd: ChangePasswordRequest): Observable<number> => {
    return this.api.put<ChangePasswordRequest, number>(`password-change/${userId}`, updatePwd)
      .pipe(map((res: ApiResponse<number>) => res.data));
  }

  createNewUser = (user: NewUserRequest): Observable<number> => {
    return this.api.post<NewUserRequest, number>(`new-user`, user)
      .pipe(map((res: ApiResponse<number>) => res.data));
  }

  
  getUsers = (): Observable<UserListResponse[]> => {
    return this.api.get<UserListResponse[]>(`users`)
      .pipe(map((res: ApiResponse<UserListResponse[]>) => res.data));
  }

   setActiveUser = (userId: number): Observable<boolean> => {
    return this.api.put<null,boolean>(`user/activate/${userId}`,null)
      .pipe(map((res: ApiResponse<boolean>) => res.data));
  }

}
