import { Component, HostListener } from '@angular/core';
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
@Component({
  selector: 'app-user-menu-permission',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, MatTableModule, MatFormFieldModule, MatCheckboxModule, MatIconModule],
  templateUrl: './user-menu-permission.component.html',
  styleUrl: './user-menu-permission.component.scss'
})
export class UserMenuPermissionComponent {

  constructor(private readonly userService: UserService) { }
  screenHeight: number = window.innerHeight;
  users: {
    id: number,
    name: string
  }[] = [];
  selectedUserId: number;

  flatMenu: any[] = [];
  menu : GetMenuItemPermissionQueryResponse[] =[];
  displayedColumns: string[] = ['label', 'icon'];

  ngOnInit(): void {
    this.getUsers();
    this.getUserMenu();
    this.userService.getUserMenus().subscribe({
      next: (menu: MenuItem[]) => {
        this.flatMenu = [];
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
          debugger;
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
  flattenMenu(menuItems: MenuItem[], level: number = 0): void {
    for (let item of menuItems) {
      this.flatMenu.push({ ...item, level });
      if (item.subMenuItem?.length) {
        this.flattenMenu(item.subMenuItem, level + 1);
      }
    }
  }

  getUserMenu = (): void => {
    this.userService.getUserMenuPermission(1).subscribe({
      next: result => {
          this.menu = result;
      }
    });
  }
}
