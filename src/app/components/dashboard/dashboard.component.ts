import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { TableColumn, DynamicTableComponent } from '../../shared/components/dynamic-table/dynamic-table.component';
import { ReusableTableComponent } from "../../shared/components/reusable-table/reusable-table.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, NgSelectModule, ReactiveFormsModule, CommonModule, FormsModule, ReusableTableComponent, DynamicTableComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
    private http = inject(HttpClient);
 
    data = signal<any>(null);
    selectedCity: any;
    fetchData() {

        this.http
            .get('https://jsonplaceholder.typicode.com/posts?_limit=50000')
            .subscribe((res) => this.data.set(res));
    }
 

 
  tableColumns: TableColumn[] = [
  { field: 'id', header: 'ID', type: 'text', width: '60px', align: 'center', sortable: true },
  { field: 'name', header: 'Name', type: 'input', editable: true, width: '150px', align: 'left', filterable: true },
  { field: 'category', header: 'Category', type: 'select', editable: true, options: [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Books', value: 'books' },
  ], width: '130px', align: 'left' },
  { field: 'available', header: 'Available', type: 'checkbox', editable: true, width: '100px', align: 'center' },
  { field: 'releaseDate', header: 'Release Date', type: 'date', editable: true, width: '150px', align: 'center' },
  { field: 'brand', header: 'Brand', type: 'text', width: '120px', align: 'left' },
  { field: 'price', header: 'Price', type: 'input', editable: true, width: '100px', align: 'right' },
  { field: 'rating', header: 'Rating', type: 'text', width: '100px', align: 'center' },
  { field: 'color', header: 'Color', type: 'text', width: '100px', align: 'left' },
  { field: 'actions', header: 'Actions', type: 'actions', width: '150px', align: 'center' },
];

tableData = [
  {
    id: 1, name: 'Laptop', category: 'electronics', available: true, releaseDate: '2023-01-01',
    brand: 'Dell', price: 1200, rating: 4.5, color: 'Black'
  },
  {
    id: 2, name: 'Jeans', category: 'clothing', available: true, releaseDate: '2022-06-10',
    brand: 'Levi\'s', price: 60, rating: 4.2, color: 'Blue'
  },
  {
    id: 3, name: 'Smartphone', category: 'electronics', available: false, releaseDate: '2024-03-15',
    brand: 'Samsung', price: 899, rating: 4.7, color: 'Silver'
  },
  {
    id: 4, name: 'T-Shirt', category: 'clothing', available: true, releaseDate: '2022-12-25',
    brand: 'H&M', price: 25, rating: 4.1, color: 'White'
  },
  {
    id: 5, name: 'Tablet', category: 'electronics', available: true, releaseDate: '2023-05-05',
    brand: 'Apple', price: 699, rating: 4.6, color: 'Gray'
  },
  {
    id: 6, name: 'Book', category: 'books', available: true, releaseDate: '2021-11-11',
    brand: 'Penguin', price: 20, rating: 4.8, color: 'Yellow'
  },
  {
    id: 7, name: 'Monitor', category: 'electronics', available: false, releaseDate: '2022-08-30',
    brand: 'LG', price: 300, rating: 4.3, color: 'Black'
  },
  {
    id: 8, name: 'Shoes', category: 'clothing', available: true, releaseDate: '2023-02-18',
    brand: 'Nike', price: 120, rating: 4.4, color: 'Red'
  },
  {
    id: 9, name: 'Notebook', category: 'books', available: true, releaseDate: '2024-01-01',
    brand: 'Moleskine', price: 15, rating: 4.9, color: 'Green'
  },
  {
    id: 10, name: 'Jacket', category: 'clothing', available: false, releaseDate: '2022-03-09',
    brand: 'Zara', price: 90, rating: 4.2, color: 'Black'
  }
];
onRowClick(a:any){

}
onActionClick(a:any){

}
}
