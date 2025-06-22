import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
 imports: [CommonModule, NgSelectModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
 private http = inject(HttpClient);
    private toastr = inject(ToastrService);
    cities = [
        { id: 1, name: 'Vilnius' },
        { id: 2, name: 'Kaunas' },
        { id: 3, name: 'Pavilnys', disabled: true },
        { id: 4, name: 'Pabradė' },
        { id: 5, name: 'Klaipėda' }
    ];

    data = signal<any>(null);
    selectedCity: any;
    fetchData() {

        this.http
            .get('https://jsonplaceholder.typicode.com/posts?_limit=50000')
            .subscribe((res) => this.data.set(res));
    }
}
