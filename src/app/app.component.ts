import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { interval, Subscription, switchMap } from 'rxjs';

import { NgSelectModule } from '@ng-select/ng-select';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { IdleService } from './shared/services/idle.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    NgSelectModule,
    SpinnerComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly idleService = inject(IdleService);
  private readonly userService = inject(UserService);

  private healthCheckSub?: Subscription;

  ngOnInit(): void {

    this.watchIdleTimeout();
    // this.startHealthCheck();

  }

  ngOnDestroy(): void {
    this.healthCheckSub?.unsubscribe();
  }

  private watchIdleTimeout(): void {
    this.idleService.onIdle().subscribe(() => {
      this.authService.logout('', false);
    });
  }

  private startHealthCheck(): void {
    // Initial health check
    this.userService.checkHealth().subscribe({
      next: res => console.log('Initial health check:', res),
      error: err => console.error('Initial health check failed:', err)
    });

    // Poll every 4.5 minutes
    this.healthCheckSub = interval(4.5 * 60 * 1000).pipe(
      switchMap(() => this.userService.checkHealth())
    ).subscribe({
      next: res => console.log('Health check success:', res),
      error: err => console.error('Health check failed:', err)
    });
  }
}
