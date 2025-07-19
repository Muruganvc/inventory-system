import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CustomMenuComponent } from "../custom-menu/custom-menu.component";
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../shared/services/config.service';
import { UserService } from '../../services/user.service';
import { CommonService } from '../../shared/services/common.service';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatTooltipModule, MatSidenavModule, RouterModule, MatListModule, CustomMenuComponent, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  // readonly isMobile = signal(true);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly commonService = inject(CommonService);

  companyName: string = '';
  isMobileDevice = false;
  sidebarExpanded = true;
  userName: string = '';
  role: string = '';
  apiVersion: string = '';
  uiVersion: string = '';
  databaseName: string = '';

  dashBoardView: string = 'Product Availability';

  isAdmin = (): boolean => {
    return this.authService.hasRole(["Admin"])
  }

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private dialog: MatDialog, private configService: ConfigService) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobileDevice = result.matches;
        if (this.isMobileDevice) this.sidebarExpanded = false;
      });
  }
  ngOnInit(): void {
    this.companyName = this.configService.companyName;
    this.userName = this.authService.getUserName();
    this.role = this.authService.getUserRoles()[0];
    this.apiVersion = this.configService.apiVersion;
    this.uiVersion = this.configService.uiVersion;
    this.databaseName = this.configService.dbName;
    this.loadUser();
  }

  isMobile(): boolean {
    return this.isMobileDevice;
  }

  toggleSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  onNavigate() {
    if (this.isMobile()) {
      document.querySelector('mat-sidenav')?.dispatchEvent(new Event('closedStart'));
    }
  }

  toggleSubMenu(item: any) {
    if (item.children) {
      item.expanded = !item.expanded;
    } else {
      this.router.navigate([item.route]);
      this.onNavigate();
    }
  }

  isActive(item: any): boolean {
    return this.router.url === item.route;
  }

  onLogout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '100%',
      maxWidth: '400px',
      disableClose: true,
      data: {
        title: 'Logout',
        okBtn: {
          title: 'Yes, Confirm',
          isHiden: true
        },
        cancel: {
          title: 'Cancel',
          isHiden: true
        },
        message: 'Are you sure you want to Logout?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }
  onNewUser = (): void => {
    this.router.navigate(['/setting/user-list']);

  }
  onProfile = (): void => {
    this.router.navigate(['/setting/profile']);
  }

  onChangePassword = (): void => {
    this.router.navigate(['/setting/change-password']);
  }

  onMenuPermission = (): void => {
    this.router.navigate(['/setting/user-menu-permission']);
  }

  onAuditTableView =():void =>{
    this.router.navigate(['/setting/audit-table-view']);
  }

  onGridView(): void {
    const isGridView = this.router.url === '/product-availability';

    this.dashBoardView = !isGridView ? 'Dashboard' : 'Product Availability';
    this.router.navigate([isGridView ? '/dashboard' : '/product-availability']);
  }

  showPopup = false;

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  imagePreview: string | ArrayBuffer | null = null;

  private loadUser(): void {
     this.commonService.setProfileImageData('')
    const userName = this.authService.getUserName();
    this.userService.getUser(userName).subscribe({
      next: user => {
        if (user.profileImageBase64) {
          this.imagePreview = user.profileImageBase64;
          this.commonService.setProfileImageData(user.profileImageBase64);
        }
      }
    });
  }
}