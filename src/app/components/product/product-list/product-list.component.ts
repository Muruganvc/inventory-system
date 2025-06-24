import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductsResponse } from '../../../models/ProductsResponse';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CustomTableComponent } from "../../../shared/components/custom-table/custom-table.component";
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
 
  constructor(private router: Router, private productService: ProductService, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.getProducts();
  } 
  products: ProductsResponse[] = [];

  getProducts() {
    this.productService.getProducts().subscribe({
      next: result => {
        this.products = result;
      }
    });

    if (true) {
      this.columns.push(
        { key: 'isActive', label: 'Active', align: 'right', type: 'checkbox', isHidden: true },
      );
    }
  }

  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean }[] = [
    // { key: 'companyName', label: 'Company', align: 'left', isHidden: false },
    // { key: 'categoryName', label: 'Cat.Name', align: 'right', isHidden: false },
    { key: 'productName', label: 'Prod.Name', align: 'left', isHidden: false },
    // { key: 'description', label: 'Description', align: 'left', isHidden: false },
    { key: 'mrp', label: 'Mrp ₹', align: 'left', isHidden: false },
    { key: 'salesPrice', label: 'Sales Price ₹', align: 'left', isHidden: false },
    { key: 'taxPercent', label: 'Tax %', align: 'left', isHidden: false },
    { key: 'quantity', label: 'Quantity', align: 'left', isHidden: false },
    { key: 'userName', label: 'Creator', align: 'left', isHidden: false } 
  ];

  onEdit(product: ProductsResponse) { 
    this.router.navigate(['/product'], {
      state: { data: product }
    });
  }

  handleFieldChange(event: { row: ProductsResponse; key: string; value: any }) {
    // this.productService.activatProduct(event.row.productId ?? 0).subscribe({
    //   next: result => {
    //     if (result) {
    //       // this.getProducts();
    //     }
    //   }
    // })
  }

  onDelete(product: ProductsResponse) {
    alert('Not yet Implemented.'); return;
    this.openConfirm(product['key']);
  }

  openConfirm(key: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '100%',
      maxWidth: '400px',
      disableClose: true,
      data: {
        title: 'Delete Product',
        message: 'Are you sure you want to delete this product?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  newOpen(a: any) {
    this.router.navigate(['/product']);
  }

}
