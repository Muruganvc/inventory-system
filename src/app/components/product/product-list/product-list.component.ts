import { Component, inject } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductsResponse } from '../../../models/ProductsResponse';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CustomTableComponent } from "../../../shared/components/custom-table/custom-table.component";
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
 private readonly authService = inject(AuthService);
 private readonly commonService = inject(CommonService);
  constructor(private router: Router, private productService: ProductService, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.getProducts();
  } 


  tableActions =
    [
      {
        iconClass: 'fas fa-pencil-alt',
        color: 'green',
        tooltip: 'Edit',
        action: 'edit',
        condition: (row: any) => !row.isEditing
      },
      {
        iconClass: 'fas fa-trash-alt',
        color: 'red',
        tooltip: 'Delete',
        action: 'delete',
        condition: (row: any) => !row.isEditing
      }
      // ,{
      //   iconClass: 'fas fa-save',
      //   color: 'green',
      //   tooltip: 'Save',
      //   action: 'save',
      //   condition: (row: any) => row.isEditing
      // },
      // {
      //   iconClass: 'fas fa-times',
      //   color: 'gray',
      //   tooltip: 'Cancel',
      //   action: 'cancel',
      //   condition: (row: any) => row.isEditing
      // },
      // {
      //   iconClass: 'fas fa-print',
      //   color: 'red',
      //   tooltip: 'Print',
      //   action: 'print',
      //   condition: (row: any) => !row.isEditing // or `true` if always visible
      // }
    ];


  onAction(event: { row: ProductsResponse; action: string }) {
    const { row, action } = event;
    switch (action) {
      case 'edit': this.onEdit(row); break;
      // case 'delete': this.deleteRow(row); break;
      // case 'save': this.saveRow(row); break;
      // case 'cancel': this.cancelEdit(row); break;
    }
  }



  role: boolean =true;
  products: ProductsResponse[] = [];

  getProducts(): void {
    this.productService.getProducts('product').subscribe({
      next: (result) => {
        this.products = result;
        const hasIsActiveColumn = this.columns.some(col => col.key === 'isActive');
        const isAdmin = this.authService.hasRole(["Admin"])
        if (isAdmin && !hasIsActiveColumn) {
          this.columns.push({
            key: 'isActive',
            label: 'Active',
            align: 'right',
            type: 'checkbox',
            isHidden: false
          });
        }
      },
      error: (error) => {
        console.error('Failed to load products:', error);
      }
    });
  }


  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean }[] = [
    { key: 'productName', label: 'Prod.Name', align: 'left', isHidden: false },
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
    this.productService.setActiveProduct(event.row.productId ?? 0).subscribe({
      next: result => {
        if (result) {
          this.getProducts();
          this.commonService.showSuccessMessage("Updated.");
        }
      }
    });
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
