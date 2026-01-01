import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from '../../../shared/common/MenuItem';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { GetMenuItemPermissionQueryResponse } from '../../../models/GetMenuItemPermissionQueryResponse';
import { CommonService } from '../../../shared/services/common.service';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-user-menu-permission',
  standalone: true,
  imports: [CommonModule, MatButtonModule, NgSelectModule, FormsModule, MatTableModule, MatFormFieldModule, MatCheckboxModule, MatIconModule],
  templateUrl: './user-menu-permission.component.html',
  styleUrl: './user-menu-permission.component.scss'
})
export class UserMenuPermissionComponent implements OnInit, OnDestroy {

  private readonly userService = inject(UserService);
  private readonly commonService = inject(CommonService);
  private destroy$ = new Subject<void>();
  screenHeight: number = window.innerHeight;
  users: {
    id: number,
    name: string
  }[] = [];
  selectedUserId: number;

  flatMenu: any[] = [];
  originalMenu: MenuItem[] = [];
  displayedColumns: string[] = ['label', 'icon'];

  ngOnInit(): void {
    this.getUsers();
    this.userService.getUserMenus().pipe(takeUntil(this.destroy$)).subscribe({
      next: (menu: MenuItem[]) => {
        this.flatMenu = [];
        this.originalMenu = menu;
        this.flattenMenu(menu);
      }
    });

    this.updateHeight();
  }


  getUsers = (): void => {
    this.userService.getUsers().pipe(takeUntil(this.destroy$)).subscribe({
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

  flattenMenu(
    menuItems: MenuItem[],
    permissionItems: GetMenuItemPermissionQueryResponse[] = [],
    level: number = 0
  ): void {
    for (const item of menuItems) {
      const matched = permissionItems.find(p => p.id === item.id || p.id === item.parentId);
      const hasPermission = Boolean(matched);
      this.flatMenu.push({
        ...item,
        permission: hasPermission,
        level
      });
      if (item.subMenuItem?.length) {
        this.flattenMenu(item.subMenuItem, permissionItems, level + 1);
      }
    }
  }

  onUserSelected = (event: any): void => {
    if (!event) {
      this.flatMenu = [];
      this.flattenMenu(this.originalMenu, []);
      return;
    }

    this.userService.getUserMenuPermission(event.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: permissionResult => {
        this.flatMenu = [];
        this.flattenMenu(this.originalMenu, permissionResult);
      }
    });
  }

  addOrRemoveMenu = (menuItem: any): void => {
    const userId = this.selectedUserId;

    if (typeof userId !== 'number' || userId <= 0) {
      this.commonService.showWarning("Please select a valid user.");
      this.flatMenu = this.flatMenu.map(item => ({ ...item, permission: false }));
      return;
    }

    this.userService.addOrRemoveUserMenuItem(userId, menuItem.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (isUpdated) => {
        if (isUpdated) {
          this.commonService.showSuccess("User menu access updated successfully.");
        }
      },
      error: () => {
        this.commonService.showError("An error occurred while updating menu access.");
      }
    });
  };
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
