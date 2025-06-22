import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';
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

 form: FormGroup;

  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      selectedItem: [null, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      alert('Form submitted with: ' + JSON.stringify(this.form.value));
    } else {
      this.form.markAllAsTouched();
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

}
