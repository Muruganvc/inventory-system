import { Component, HostListener, inject } from '@angular/core';
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
@Component({
  selector: 'app-user-menu-permission',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, MatTableModule, MatFormFieldModule, MatCheckboxModule, MatIconModule],
  templateUrl: './user-menu-permission.component.html',
  styleUrl: './user-menu-permission.component.scss'
})
export class UserMenuPermissionComponent {

  private readonly userService = inject(UserService);
  private readonly commonService = inject(CommonService);
  
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
    this.userService.getUserMenus().subscribe({
      next: (menu: MenuItem[]) => {
        this.flatMenu = [];
        this.originalMenu = menu;
        this.flattenMenu(menu);
      },
      error: (err) => {
        console.error('Failed to load menu:', err);
      }
    });

    this.updateHeight();
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

  flattenMenu(
    menuItems: MenuItem[],
    permissionItems: GetMenuItemPermissionQueryResponse[] = [],
    level: number = 0
  ): void {
    for (const item of menuItems) {
      const matched = permissionItems.find(p => p.id === item.id);
      const hasPermission = matched ? matched.hasPermission === true : false;

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

    this.userService.getUserMenuPermission(event.id).subscribe({
      next: permissionResult => {
        this.flatMenu = [];
        this.flattenMenu(this.originalMenu, permissionResult);
      },
      error: err => console.error('Permission fetch failed', err)
    });
  }

  addOrRemoveMenu = (row: any): void => {
    if (this.selectedUserId > 0) {
      this.userService.addOrRemoveUserMenuItem(this.selectedUserId, row.id).subscribe({
        next: result => {
          if (!!result) {
          }
        }
      });
    }else{
      this.commonService.showWarning("Must be select user.");
    }
   
  }
}
