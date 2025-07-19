import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../shared/services/common.service';

import { ProductsResponse } from '../../../models/ProductsResponse';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CustomTableComponent } from '../../../shared/components/custom-table/custom-table.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly commonService = inject(CommonService);

  products: ProductsResponse[] = [];
  tableActions: any[] = [];
  backupRow: { [id: string]: ProductsResponse } = {};
  role: boolean = true;

  columns: {
    key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean, isEditable?: boolean
  }[] = [
      { key: 'companyName', label: 'Company Name', align: 'left', isHidden: true },
      { key: 'categoryName', label: 'Category Name', align: 'left', isHidden: true },
      { key: 'productName', label: 'Prod.Name', align: 'left', isHidden: true },
      { key: 'productFullName', label: 'Product Name', align: 'left', isHidden: false },
      { key: 'mrp', label: 'Mrp ₹', align: 'left', isHidden: false },
      { key: 'salesPrice', label: 'Sales ₹', align: 'left', isHidden: false },
      { key: 'landingPrice', label: 'Landing', align: 'left', isHidden: false },
      { key: 'quantity', label: 'Quantity', align: 'left', isHidden: false },
      { key: 'userName', label: 'Created By', align: 'left', isHidden: false }
    ];

  constructor(
    private router: Router,
    private productService: ProductService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.resetTableActions();
  }

  getProducts(): void {
    this.productService.getProducts('product').subscribe({
      next: (result) => {
        result.forEach(a => {
          const company = a.companyName || '';
          const category = a.categoryName || '';
          const productCategory = a.productCategoryName || '';
          a.productFullName = `${company} ${category} ${productCategory}`;
        });

        this.products = result;
        this.appendIsActiveColumnIfAdmin();
      }
    });
  }

  appendIsActiveColumnIfAdmin(): void {
    const hasIsActiveColumn = this.columns.some(col => col.key === 'isActive');
    const isAdmin = this.authService.hasRole(["Admin"]);
    if (isAdmin && !hasIsActiveColumn) {
      this.columns.push({
        key: 'isActive',
        label: 'Active',
        align: 'right',
        type: 'checkbox',
        isHidden: false
      });
    }
  }

  onAction(event: { row: ProductsResponse; action: string }) {
    const { row, action } = event;
    switch (action) {
      case 'edit': this.onEdit(row); break;
      case 'editQty': this.editQty(row); break;
      case 'save': this.save(row); break;
      case 'close': this.close(row); break;
    }
  }

  onEdit(product: ProductsResponse): void {
    this.router.navigate(['/product'], { state: { data: product } });
  }

  editQty(product: ProductsResponse): void {
    this.setColumnType('quantity', 'textbox');
    this.products.forEach(p => (p.isEditing = false));
    product.isEditing = true;
    this.backupRow[product.productId] = { ...product };

    this.tableActions = [
      ...this.getDefaultActions(),
      {
        iconClass: 'fas fa-save',
        color: 'green',
        tooltip: 'Save',
        action: 'save',
        condition: (row: any) => row.productId === product.productId
      },
      {
        iconClass: 'fas fa-times',
        color: 'red',
        tooltip: 'Close',
        action: 'close',
        condition: (row: any) => row.productId === product.productId
      }
    ];
  }

  save(product: ProductsResponse): void {
    this.productService.updateProductQty(product.productId, product.quantity).subscribe({
      next: result => {
        if (result) {
          this.getProducts();
          this.resetTableActions();
          this.setColumnType('quantity', '');
          delete this.backupRow[product.productId];
        }
      }
    });
  }

  close(product: ProductsResponse): void {
    const original = this.backupRow[product.productId];
    if (original) {
      const index = this.products.findIndex(p => p.productId === product.productId);
      if (index !== -1) {
        this.products[index] = { ...original };
        this.products = [...this.products];
      }
      delete this.backupRow[product.productId];
    }

    this.products.forEach(p => (p.isEditing = false));
    this.setColumnType('quantity', '');
    this.resetTableActions();
  }

  resetTableActions(): void {
    this.tableActions = this.getDefaultActions();
  }

  getDefaultActions(): any[] {
    return [
      {
        iconClass: 'fas fa-pencil-alt',
        color: 'green',
        tooltip: 'Edit',
        action: 'edit',
        condition: (row: any) => !row.isEditing
      },
      {
        iconClass: 'fas fa-pen-to-square',
        color: 'red',
        tooltip: 'Edit only Quantity',
        action: 'editQty',
        condition: (row: any) => !row.isEditing
      }
    ];
  }

  setColumnType(key: string, type: string): void {
    this.columns = this.columns.map(col =>
      col.key === key ? { ...col, type } : col
    );
  }

  handleFieldChange(event: { row: ProductsResponse; key: string; value: any }) {
    this.productService.setActiveProduct(event.row.productId ?? 0).subscribe({
      next: result => {
        if (result) {
          this.getProducts();
          this.commonService.showSuccess("Updated.");
        }
      }
    });
  }

  onDelete(product: ProductsResponse): void {
    alert('Not yet Implemented.'); 
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
        // Handle delete
      }
    });
  }

  newOpen(_: any): void {
    this.router.navigate(['/product']);
  }
}
