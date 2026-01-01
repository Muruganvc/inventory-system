import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { signal } from '@angular/core';

import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MenuItem } from '../../shared/common/MenuItem';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommonService } from '../../shared/services/common.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-custom-menu',
  standalone: true,
  imports: [MatListModule, RouterModule, MenuItemComponent],
  templateUrl: './custom-menu.component.html',
  styleUrl: './custom-menu.component.scss'
})
export class CustomMenuComponent implements OnInit, OnDestroy {

  fullName: string = '';
  role: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  readonly menuItems = signal<MenuItem[]>([]);

  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly commonService = inject(CommonService);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.setUserDetails();
    this.loadMenus();
    this.subscribeToProfileImage();
  }

  private setUserDetails(): void {
    this.fullName = this.authService.getUserName();
    this.role = this.authService.getUserRoles()[0];
  }

  private loadMenus(): void {
    const userId = this.authService.getUserId();
    this.userService.getUserMenu(+userId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (items) => this.menuItems.set(items),
      error: (err) => console.error('Failed to load menus', err)
    });
  }

  private subscribeToProfileImage(): void {
    this.commonService.sharedProfileImageData$.subscribe(value => {
      this.imagePreview = value;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
