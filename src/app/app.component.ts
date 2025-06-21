import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SpinnerComponent } from "./shared/components/spinner/spinner.component";
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { RouterOutlet } from '@angular/router';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, NgSelectModule, ReactiveFormsModule, CommonModule, FormsModule, SpinnerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
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
