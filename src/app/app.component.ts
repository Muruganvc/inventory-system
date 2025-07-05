import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SpinnerComponent } from "./shared/components/spinner/spinner.component";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterOutlet } from '@angular/router';
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
    private readonly router = inject(Router);
    ngOnInit(): void {
        if (this.router.url != '/') {
            this.idleService.onIdle().subscribe(() => {
                alert('You have been idle for 5 minutes!');
                this.authService.logout();
            });
        }
    }
}
