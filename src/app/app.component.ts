import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SpinnerComponent } from "./shared/components/spinner/spinner.component"; 
import { RouterOutlet } from '@angular/router';
import { IdleService } from './shared/services/idle.service';
import { AuthService } from './services/auth.service'; 
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, NgSelectModule, RouterOutlet, ReactiveFormsModule, CommonModule, FormsModule, SpinnerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    private readonly authService = inject(AuthService)
    private readonly idleService = inject(IdleService); 
    ngOnInit(): void {
        this.idleService.onIdle().subscribe(() => {
            // alert('You have been idle for 2 minutes!');
            this.authService.logout();
        });
    }
}
