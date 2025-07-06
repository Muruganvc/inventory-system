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
  // configService = inject(ConfigService); 

  companyName : string='';
  isMobileDevice = false;
  sidebarExpanded = true;
  userName : string ='';
  role : string ='';

  dashBoardView: string = 'Product Availability';

  isAdmin = (): boolean => {
    return this.authService.hasRole(["Admin"])
  }

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private dialog: MatDialog,private configService: ConfigService) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobileDevice = result.matches;
        if (this.isMobileDevice) this.sidebarExpanded = false;
      }); 
  }
  ngOnInit(): void {
      this.companyName = this.configService.companyName;
      this.userName= this.authService.getUserName();
      this.role = this.authService.getUserRoles()[0];
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

  onGridView(): void {
    const isGridView = this.router.url === '/product-availability';

    this.dashBoardView = !isGridView ? 'Dashboard' : 'Product Availability';
    this.router.navigate([isGridView ? '/dashboard' : '/product-availability']);
  }


  openAppInfoWindow() {
  const htmlContent = `
    <html>
      <head>
        <title>App Info</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            padding: 20px;
            background-color: #f5f5f5;
            color: #333;
          }
          h2 {
            color: #444;
          }
          .info-box {
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
          }
          a {
            color: #007bff;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <h2>📦 Application Information</h2>

        <div class="info-box">
          <h4>🔧 Versions</h4>
          <p><strong>API Version:</strong> 0.0.1</p>
          <p><strong>UI Version:</strong> 0.0.1</p>
          <p><strong>Database:</strong> Invenstory</p>
        </div>

        <div class="info-box">
          <h4>👨‍💻 Developer Info</h4>
          <p><strong>Name:</strong> Muruganvc</p>
          <p><strong>Phone:</strong> <a href="tel:+919994277980">+91-99942-77980</a></p>
          <p><strong>Email:</strong> <a href="mailto:vcmuruganmca@gmail.com">vcmuruganmca@gmail.com</a></p>
        </div>

        <div class="info-box">
          <h4>🔐 User Session</h4>
          <p><strong>User:</strong> ${this.userName}</p>
          <p><strong>Role:</strong> ${this.role}</p>
        </div>
      </body>
    </html>
  `;

  const infoWindow = window.open('', '_blank', 'width=400,height=400');
  if (infoWindow) {
    infoWindow.document.write(htmlContent);
    infoWindow.document.close();
  } else {
    alert('Popup blocked. Please allow popups for this site.');
  }
}



}
