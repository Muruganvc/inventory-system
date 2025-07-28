import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-expired-notice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-expired-notice.component.html',
  styleUrl: './company-expired-notice.component.scss'
})
export class CompanyExpiredNoticeComponent {
 
  constructor(private router: Router) {}

  navigateToRenewal() {
    // this.router.navigate(['/company/renew']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
