import { Component, inject, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MenuItem } from '../../shared/common/MenuItem';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-custom-menu',
  standalone: true,
  imports: [MatListModule, RouterModule, MenuItemComponent],
  templateUrl: './custom-menu.component.html',
  styleUrl: './custom-menu.component.scss'
})
export class CustomMenuComponent implements OnInit {
  ngOnInit(): void {
    this.getMenus();
  }

  fullName = 'Muruganvc';

  private readonly userService = inject(UserService);
  readonly menuItems = signal<MenuItem[]>([]);

  getMenus() {
    this.userService.getUserMenu(1).subscribe({
      next: (items) => this.menuItems.set(items),
      error: (err) => console.error('Failed to load menu', err)
    });
  }

  readonly menuItems1 = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard'
    },
    {
      icon: 'settings',
      label: 'Settings',
      route: 'setting',
      subMenuItem: [
        {
          icon: 'person',
          label: 'Add new user',
          route: 'user-list'
        },
        {
          icon: 'add_shopping_cart',
          label: 'Password change',
          route: 'change-password'
        },
        {
          icon: 'person',
          label: 'User Permission',
          route: 'user-permission'
        },
      ]
    },
    {
      icon: 'add_shopping_cart',
      label: 'Product',
      route: 'product-list'
    },
    {
      icon: 'remove_shopping_cart',
      label: 'Sales',
      route: 'sales'
    },
  ]);
}
