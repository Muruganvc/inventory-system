import { Component } from '@angular/core';
import { TableColumn } from '../../../shared/common/ActionButton';
import { ReusableTableComponent } from "../../../shared/components/reusable-table/reusable-table.component";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  products = [
  {
    id: 1,
    name: 'Laptop',
    price: 1200,
    category: 'electronics',
    available: true,
    releaseDate: new Date('2023-01-01'),
    brand: 'Dell',
    rating: 4.5,
    stock: 10,
    color: 'Black',
    weight: '2kg',
    warranty: '2 years',
    featured: true,
    supplier: 'TechWorld',
    model: 'XPS 13'
  },
  {
    id: 2,
    name: 'Phone',
    price: 800,
    category: 'electronics',
    available: false,
    releaseDate: new Date('2023-03-15'),
    brand: 'Apple',
    rating: 4.7,
    stock: 5,
    color: 'Silver',
    weight: '0.3kg',
    warranty: '1 year',
    featured: false,
    supplier: 'GadgetHub',
    model: 'iPhone 14'
  },
  {
    id: 3,
    name: 'T-shirt',
    price: 20,
    category: 'clothing',
    available: true,
    releaseDate: new Date('2023-02-10'),
    brand: 'Nike',
    rating: 4.1,
    stock: 50,
    color: 'Red',
    weight: '0.2kg',
    warranty: '6 months',
    featured: false,
    supplier: 'FashionHouse',
    model: 'Slim Fit'
  },
  {
    id: 4,
    name: 'Shoes',
    price: 60,
    category: 'clothing',
    available: false,
    releaseDate: new Date('2023-04-01'),
    brand: 'Adidas',
    rating: 4.3,
    stock: 20,
    color: 'Blue',
    weight: '1kg',
    warranty: '1 year',
    featured: true,
    supplier: 'StepUp',
    model: 'Runner Pro'
  },
  {
    id: 5,
    name: 'Desk',
    price: 150,
    category: 'furniture',
    available: true,
    releaseDate: new Date('2023-01-25'),
    brand: 'IKEA',
    rating: 4.0,
    stock: 8,
    color: 'Brown',
    weight: '10kg',
    warranty: '5 years',
    featured: false,
    supplier: 'WoodMart',
    model: 'WorkPro'
  },
  {
    id: 6,
    name: 'Chair',
    price: 90,
    category: 'furniture',
    available: true,
    releaseDate: new Date('2023-02-14'),
    brand: 'IKEA',
    rating: 3.9,
    stock: 12,
    color: 'Gray',
    weight: '7kg',
    warranty: '3 years',
    featured: true,
    supplier: 'WoodMart',
    model: 'SitEase'
  },
  {
    id: 7,
    name: 'Book',
    price: 15,
    category: 'books',
    available: true,
    releaseDate: new Date('2023-03-01'),
    brand: 'Penguin',
    rating: 4.8,
    stock: 100,
    color: 'White',
    weight: '0.5kg',
    warranty: 'None',
    featured: false,
    supplier: 'BookVerse',
    model: 'First Edition'
  },
  {
    id: 8,
    name: 'Monitor',
    price: 250,
    category: 'electronics',
    available: false,
    releaseDate: new Date('2023-03-20'),
    brand: 'Samsung',
    rating: 4.2,
    stock: 6,
    color: 'Black',
    weight: '5kg',
    warranty: '2 years',
    featured: true,
    supplier: 'DisplayMart',
    model: 'Curved 27"'
  },
  {
    id: 9,
    name: 'Keyboard',
    price: 45,
    category: 'electronics',
    available: true,
    releaseDate: new Date('2023-04-10'),
    brand: 'Logitech',
    rating: 4.4,
    stock: 15,
    color: 'Black',
    weight: '1.2kg',
    warranty: '2 years',
    featured: false,
    supplier: 'TechWorld',
    model: 'MX Keys'
  },
  {
    id: 10,
    name: 'Backpack',
    price: 35,
    category: 'clothing',
    available: true,
    releaseDate: new Date('2023-01-18'),
    brand: 'Wildcraft',
    rating: 4.1,
    stock: 25,
    color: 'Green',
    weight: '0.8kg',
    warranty: '1 year',
    featured: true,
    supplier: 'BagStation',
    model: 'Urban Pack'
  }
];

tableColumns: TableColumn[] = [
  { field: 'name', header: 'Name', type: 'input', align: 'left', editable: true },
  { field: 'price', header: 'Price', type: 'input', align: 'left', editable: true },
  {
    field: 'category', header: 'Category', type: 'select', align: 'left', editable: true,
    options: [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
      { label: 'Furniture', value: 'furniture' },
      { label: 'Books', value: 'books' }
    ]
  },
  { field: 'available', header: 'Available', type: 'checkbox', align: 'center', editable: true },
  { field: 'releaseDate', header: 'Release Date', type: 'date', align: 'left', editable: true },
  { field: 'brand', header: 'Brand', type: 'input', align: 'left', editable: true },
  { field: 'rating', header: 'Rating', type: 'input', align: 'right', editable: true },
  { field: 'stock', header: 'Stock', type: 'input', align: 'right', editable: true },
  { field: 'color', header: 'Color', type: 'input', align: 'left', editable: true },
  { field: 'weight', header: 'Weight', type: 'input', align: 'right', editable: true },
  { field: 'warranty', header: 'Warranty', type: 'input', align: 'left', editable: true },
  { field: 'featured', header: 'Featured', type: 'checkbox', align: 'center', editable: true },
  { field: 'supplier', header: 'Supplier', type: 'input', align: 'left', editable: true },
  { field: 'model', header: 'Model', type: 'input', align: 'left', editable: true },
  {
    field: 'actions',
    header: 'Actions',
    type: 'actions',
    align: 'center',
    buttons: [
      {
        icon: 'edit',
        label: 'Edit',
        color: 'primary',
        action: (row) => this.startEdit(row)
      },
      {
        icon: 'delete',
        label: 'Delete',
        color: 'warn',
        action: (row) => this.onDelete(row)
      }
    ]
  }
];

  onUpdate(updatedRow: any) {
    const index = this.products.findIndex(p => p.id === updatedRow.id);
    if (index !== -1) this.products[index] = { ...updatedRow };
  }

  onDelete(row: any) {
    this.products = this.products.filter(p => p.id !== row.id);
  }

  startEdit(row: any) {
    // Optional: can trigger modal/dialog or pre-fill form
    console.log('Editing row:', row);
  }

}
