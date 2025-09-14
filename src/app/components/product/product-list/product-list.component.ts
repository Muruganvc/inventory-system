import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { CommonService, ExcelColumn } from '../../../shared/services/common.service';

import { ProductsResponse, RowVersion, UpdateProductQuantityPayload } from '../../../models/ProductsResponse';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CustomTableComponent } from '../../../shared/components/custom-table/custom-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgSelectModule } from "@ng-select/ng-select";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CustomTableComponent, MatButtonModule, MatCheckboxModule, NgSelectModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly commonService = inject(CommonService);

  products: ProductsResponse[] = [];
  allProducts: ProductsResponse[] = [];
  tableActions: any[] = [];
  backupRow: { [id: string]: ProductsResponse } = {};
  role: boolean = true;

  columns: {
    key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean, isEditable?: boolean
  }[] = [
      { key: 'productFullName', label: 'Product Name', align: 'left', isHidden: false },
      { key: 'mrp', label: 'Mrp ₹', align: 'left', isHidden: false },
      { key: 'salesPrice', label: 'Sales ₹', align: 'left', isHidden: false },
      { key: 'landingPrice', label: 'Landing', align: 'left', isHidden: false },
      { key: 'quantity', label: 'Quantity', align: 'left', isHidden: false },
      { key: 'createdBy', label: 'Created By', align: 'left', isHidden: false }
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

 
  buttons = [
    {
      label: 'Excel Export',
      icon: 'fas fa-file-excel',
      tooltip: 'Excel Export',
      action: 'excelExport', 
      class :'excel-button'
    },
    {
      label: 'Add Product',
      icon: 'fas fa-circle-plus',
      tooltip: 'Add Product',
      action: 'addProduct',
      class :'add-new-item-button'
    }
  ];


  onButtonClicked(action: string) {
    if (action === 'excelExport') {
      this.exportToExcel();
    } else if (action === 'addProduct') {
      this.router.navigate(['/product']);
    }
  }

  filterActions = [
    {
      iconClass: 'fas fa-sort-alpha-down',
      action: 'ProductNameAsc',
      label: 'Product Name: A to Z'
    },
    {
      iconClass: 'fas fa-sort-alpha-up-alt',
      action: 'ProductNameAscDesc',
      label: 'Product Name: Z to A'
    },
    {
      iconClass: 'fas fa-check-circle',  // Active icon
      action: 'IsActiveTrue',
      label: 'Is Active: True'
    },
    {
      iconClass: 'fas fa-times-circle',  // Inactive icon
      action: 'IsActiveFalse',
      label: 'Is Active: False'
    },
    {
      iconClass: 'fas fa-sync-alt',  // Reset icon
      action: 'Reset',
      label: 'Reset'
    }
  ];


  onFilterActionClick(event: { action: string }) {
    let filteredProducts: ProductsResponse[] = [];
    switch (event.action) {
      case 'ProductNameAsc':
        filteredProducts = [...this.allProducts].sort((a, b) => a.productFullName.localeCompare(b.productFullName));
        break;
      case 'ProductNameAscDesc':
        filteredProducts = [...this.allProducts].sort((a, b) => b.productFullName.localeCompare(a.productFullName));
        break;
      case 'IsActiveTrue':
        filteredProducts = this.allProducts.filter(product => product.isActive === true);
        break;
      case 'IsActiveFalse':
        filteredProducts = this.allProducts.filter(product => product.isActive === false);
        break;
      case 'Reset':
        filteredProducts = [...this.allProducts]
        break;
      default:
        break;
    }
    this.products = filteredProducts;
  }

  isUser = (): boolean => {
    return !this.authService.hasRole(["ADMIN"]);
  }

  getProducts(): void {
    this.productService.getProducts('product').subscribe({
      next: (result) => {
        result.forEach(a => {
          a.id = a.productId;
          const company = a.companyName || '';
          const category = a.categoryName || '';
          const productCategory = a.productCategoryName || '';
          a.productFullName = `${company} ${category} ${productCategory}`;
        });

        this.products = result;
        this.allProducts = result;
        this.appendIsActiveColumnIfAdmin();
      }
    });
  }

  appendIsActiveColumnIfAdmin(): void {
    const hasIsActiveColumn = this.columns.some(col => col.key === 'isActive');
    const IsProductActive = this.authService.hasRole(["ACTIVEPRODUCT"]);
    if (IsProductActive && !hasIsActiveColumn) {
      this.columns = [
        ...this.columns,
        {
          key: 'isActive',
          label: 'Active',
          align: 'right',
          type: 'checkbox',
          isHidden: false
        }
      ];
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

    const updateQty: UpdateProductQuantityPayload = {
      quantity: product.quantity,
      rowVersion: product.rowVersion
    }

    this.productService.updateProductQty(product.productId, updateQty).subscribe({
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

  // resetTableActions(): void {
  //   this.tableActions = this.getDefaultActions();

  // }
  resetTableActions(): void {
    // Reset all rows to not be in edit mode
    this.products = this.products.map(p => ({
      ...p,
      isEditing: false
    }));

    // Reset table actions with a fresh reference
    this.tableActions = [...this.getDefaultActions()];
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
    var rowVersion: RowVersion = {
      rowVersion: event.row.rowVersion
    }
    this.productService.setActiveProduct(event.row.productId ?? 0, rowVersion).subscribe({
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
 
  exportToExcel = (): void => {

    this.products = this.products.map(product => { 
      const totalAmount = product.salesPrice * product.quantity;
      return { ...product, totalAmount };
    });

    const columns: ExcelColumn<ProductsResponse>[] = [
      { header: 'Product ID', key: 'productId', width: 12 },
      { header: 'Product Name', key: 'productName', width: 25 },
      { header: 'Product Category ID', key: 'productCategoryId', width: 20 },
      { header: 'Product Category Name', key: 'productCategoryName', width: 25 },
      { header: 'Category ID', key: 'categoryId', width: 15 },
      { header: 'Category Name', key: 'categoryName', width: 25 },
      { header: 'Company ID', key: 'companyId', width: 15 },
      { header: 'Company Name', key: 'companyName', width: 25 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'MRP', key: 'mrp', width: 12 },
      { header: 'Sales Price', key: 'salesPrice', width: 15 },
      { header: 'Landing Price', key: 'landingPrice', width: 15 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Is Active', key: 'isActive', width: 10 },
      { header: 'User Name', key: 'createdBy', width: 20 },
      { header: 'Total Amount', key: 'totalAmount', width: 20 }
    ];

    this.products = this.commonService.sortByKey(this.products, 'productFullName', 'asc');
    this.commonService.exportToExcel<ProductsResponse>(this.products, columns, 'Products', 'Products', 'totalAmount');
  }



  onCheckboxChange1(event: any): void {
    const isChecked = event.checked;
    this.products = isChecked
      ? this.allProducts.filter(product => product.isActive === isChecked)
      : [...this.allProducts]; // Make a copy when unchecked to restore the original
  }
}
