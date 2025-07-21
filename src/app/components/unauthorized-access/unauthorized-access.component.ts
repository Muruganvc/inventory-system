import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized-access',
  standalone: true,
  imports: [],
  templateUrl: './unauthorized-access.component.html',
  styleUrl: './unauthorized-access.component.scss'
})
export class UnauthorizedAccessComponent {
  constructor(private router: Router) {

  }

  goToDashBoard = (): void => {
    this.router.navigate(['/dashboard']);
  }
}
