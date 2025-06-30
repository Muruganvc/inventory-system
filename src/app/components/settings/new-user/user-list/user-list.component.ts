import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from '../../../../shared/services/common.service';
import { CustomTableComponent } from "../../../../shared/components/custom-table/custom-table.component";
import { UserService } from '../../../../services/user.service';
import { UserListResponse } from '../../../../models/UserListResponse';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  ngOnInit(): void {
    this.getUsers();
  }

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

  newOpen(a: any) {
    this.router.navigate(['/setting/user']);
  }

  getUsers = (): void => {
    this.userService.getUsers().subscribe({
      next: result => {
        if (!!result) {
          this.users = result;
          const hasIsActiveColumn = this.columns.some(col => col.key === 'isActive');
          const isAdmin = this.authService.hasRole(["Admin"])
          if (isAdmin && !hasIsActiveColumn) {
            this.columns.push({
              key: 'isActive',
              label: 'Active',
              align: 'right',
              type: 'checkbox',
              isHidden: false
            });
          }
        }
      }
    });
  }
  handleFieldChange(event: { row: UserListResponse; key: string; value: any }) {
    this.userService.setActiveUser(event.row.userId ?? 0).subscribe({
      next: result => {
        if (result) {
          this.getUsers();
          this.commonService.showSuccess("Updated.");
        }
      }
    });
  }
}
