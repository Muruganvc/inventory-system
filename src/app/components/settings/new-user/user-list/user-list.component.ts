import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from '../../../../shared/services/common.service';
import { CustomTableComponent } from "../../../../shared/components/custom-table/custom-table.component";
import { UserService } from '../../../../services/user.service';
import { UserListResponse } from '../../../../models/UserListResponse';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    this.getUsers();
  }
  private destroy$ = new Subject<void>();
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly commonService = inject(CommonService);
  private readonly userService = inject(UserService);

  users: UserListResponse[] = [];

  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean }[] = [
    { key: 'firstName', label: 'First Name', align: 'left', isHidden: false },
    { key: 'lastName', label: 'Last Name', align: 'left', isHidden: false },
    { key: 'userName', label: 'User Name', align: 'left', isHidden: false },
    { key: 'email', label: 'Email', align: 'left', isHidden: false }
  ];

  buttons = [
    {
      label: 'Add User',
      icon: 'fas fa-circle-plus',
      tooltip: 'Add User',
      action: 'addUser',
      class: 'add-new-item-button'
    }
  ];


  onButtonClicked(action: string) {
    if (action === 'addUser') {
      this.router.navigate(['/setting/user']);
    }
  }

  getUsers = (): void => {
    this.userService.getUsers().pipe(takeUntil(this.destroy$)).subscribe({
      next: result => {
        if (!!result) {
          this.users = result;

          const isAdmin = this.authService.hasRole(["ADMIN"]);
          const hasIsActiveColumn = this.columns.some(col => col.key === 'isActive');

          if (isAdmin && !hasIsActiveColumn) {
            this.columns = [
              ...this.columns,
              {
                key: 'isActive',
                label: 'Active',
                align: 'right',
                type: 'checkbox',
                isHidden: false
              },
              {
                key: 'isSessionActive',
                label: 'Session Active',
                align: 'right',
                type: 'checkbox',
                isHidden: false
              }
            ];
          }
        }
      }
    });
  }

  handleFieldChange(event: { row: UserListResponse; key: string; value: any }) {
    if (event.key === "isActive") {
      this.userService.setActiveUser(event.row.userId ?? 0, event.value).pipe(takeUntil(this.destroy$)).subscribe({
        next: result => {
          if (result) {
            this.getUsers();
            this.commonService.showSuccess("Updated.");
          }
        }
      });
    } else if (event.key === "isSessionActive") {
      this.userService.updateUserSession(event.row.userId ?? 0).pipe(takeUntil(this.destroy$)).subscribe({
        next: result => {
          if (result) {
            this.getUsers();
            this.commonService.showSuccess("Updated.");
          }
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
