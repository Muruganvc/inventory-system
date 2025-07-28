import { Component, HostListener, inject } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { GetMenuItemPermissionQueryResponse } from '../../../models/GetMenuItemPermissionQueryResponse';
import { UserService } from '../../../services/user.service';
import { MenuItem } from '../../../shared/common/MenuItem';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { Role } from '../../../models/Role';

@Component({
  selector: 'app-user-role-menu-permission',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, MatTableModule, MatFormFieldModule, MatCheckboxModule, MatIconModule],
  templateUrl: './user-role-menu-permission.component.html',
  styleUrl: './user-role-menu-permission.component.scss'
})
export class UserRoleMenuPermissionComponent {
  private readonly userService = inject(UserService);
  private readonly commonService = inject(CommonService);

  screenHeight: number = window.innerHeight;
  users: {
    id: number,
    name: string
  }[] = [];
  selectedUserId: number;

  roles: Role[] = [];

  ngOnInit(): void {
    this.getUsers();
    this.userService.getRoles().subscribe({
      next: (role: Role[]) => {
        this.roles = role;
      }
    });
  }


  getUsers = (): void => {
    this.userService.getUsers().subscribe({
      next: result => {
        if (!!result) {
          this.users = result.map(a => ({
            id: a.userId,
            name: a.firstName
          }));
        }
      }
    });
  }

  @HostListener('window:resize')
  updateHeight(): void {
    this.screenHeight = window.innerHeight;
  }

  addOrRemoveRole = (row: { roleId: number }): void => {
    if (!this.selectedUserId || this.selectedUserId <= 0) {
      this.commonService.showWarning("Please select a valid user.");
      this.roles = this.roles.map(role => ({
        ...role,
        permission: false
      }));
      return;
    }

    this.userService.addOrRemoveUserRole(this.selectedUserId, row.roleId).subscribe({
      next: (result: boolean) => {
        if (result) {
          this.commonService.showSuccess("Role updated successfully.");
        } else {
          this.commonService.showWarning("Role update failed.");
          this.revertPermission(row.roleId);
        }
      }
    });
  }

  private revertPermission(roleId: number): void {
    this.roles = this.roles.map(role =>
      role.roleId === roleId ? { ...role, permission: false } : role
    );
  }


  onUserSelected = (event: any): void => {
    if (!event || !event.id) {
      return;
    }
    const userId = event.id;
    this.userService.getUserRoles(userId).subscribe({
      next: result => {
        const userRoles = result.filter(r => r.userId === userId);
        const userRoleIds = userRoles.map(r => r.roleId);
        this.roles.forEach(role => {
          role.permission = userRoleIds.includes(role.roleId);
        });
      },
      error: err => {
        console.error('Failed to load user roles:', err);
      }
    });
  };


}
