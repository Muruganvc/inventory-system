import { Component, inject, OnInit } from '@angular/core';
import { CustomTableComponent } from "../../../../shared/components/custom-table/custom-table.component";
import { GetProductCategoryQueryResponse } from '../../../../models/GetProductCategoryQueryResponse';
import { CompanyService } from '../../../../services/company.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonService, ExcelColumn } from '../../../../shared/services/common.service';

@Component({
  selector: 'app-product-category-list',
  standalone: true,
  imports: [CustomTableComponent, MatButtonModule],
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.scss'
})
export class ProductCategoryListComponent implements OnInit {
  productCategories: GetProductCategoryQueryResponse[] = [];
  allProductCategories: GetProductCategoryQueryResponse[] = [];
  private readonly companyService = inject(CompanyService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly commonService = inject(CommonService);
  ngOnInit(): void {
    this.companyService.getProductCategories(true).subscribe({
      next: result => {
        if (!!result) {
          this.productCategories = result.map(a => ({
            ...a,
            productFullName: `${a.companyName} ${a.categoryName} ${a.productCategoryName}`
          }));
          this.allProductCategories = this.productCategories;
        }
      }
    });
  }

  tableActions =
    [
      {
        iconClass: 'fas fa-pencil-alt',
        color: 'green',
        tooltip: 'Edit',
        action: 'edit',
        condition: (row: any) => !row.isEditing
      }
    ];

  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean, pipe?: string }[] = [
    { key: 'productFullName', label: 'Product Name', align: 'left', isHidden: false },
    // { key: 'companyName', label: 'Company Name', align: 'left', isHidden: true },
    // { key: 'categoryName', label: 'Category Name', align: 'left', isHidden: true },
    // { key: 'productCategoryName', label: 'Product Category Name', align: 'left', isHidden: true },
    // { key: 'description', label: 'Description', align: 'left', isHidden: true },
    { key: 'isActive', label: 'Is Active', align: 'left', isHidden: false },
    { key: 'createdAt', label: 'Created Date', align: 'left', isHidden: false, pipe: 'date' },
    { key: 'username', label: 'Created By', align: 'left', isHidden: false },
  ];

  isUser = (): boolean => {
    return !this.authService.hasRole(["ADMIN"]);
  }

  onAction(event: { row: any; action: string }) {
    const { row, action } = event;
    switch (action) {
      case 'edit': this.onEdit(row); break;
    }
  }

  onEdit(productCategory: GetProductCategoryQueryResponse) {
    this.router.navigate(['/inventory/product-category'], {
      state: { data: productCategory }
    });
  }
 

  exportToExcel = (): void => {
    const columns: ExcelColumn<GetProductCategoryQueryResponse>[] = [
      { header: 'Product Full Name', key: 'productFullName', width: 30 },
      { header: 'Company ID', key: 'companyId', width: 12 },
      { header: 'Company Name', key: 'companyName', width: 25 },
      { header: 'Category ID', key: 'categoryId', width: 12 },
      { header: 'Category Name', key: 'categoryName', width: 25 },
      { header: 'Product Category ID', key: 'productCategoryId', width: 18 },
      { header: 'Product Category Name', key: 'productCategoryName', width: 30 },
      {
        header: 'Active Status',
        key: 'isActive',
        width: 15,
        formatter: value => value ? 'Active' : 'Inactive'
      },
      {
        header: 'Created At',
        key: 'createdAt',
        width: 20,
        formatter: value => new Date(value).toLocaleDateString()
      },
      { header: 'Created By', key: 'username', width: 20 }
    ];

    this.productCategories = this.commonService.sortByKey(this.productCategories, 'productFullName', 'asc');

    this.commonService.exportToExcel<GetProductCategoryQueryResponse>(this.productCategories, columns, 'Company Category Product', 'Company Category Product');
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
      label: 'Add Product Category',
      icon: 'fas fa-circle-plus',
      tooltip: 'Add Product Category',
      action: 'addProductCategory',
      class :'add-new-item-button'
    }
  ];


  onButtonClicked(action: string) {
    if (action === 'excelExport') {
      this.exportToExcel();
    } else if (action === 'addProductCategory') {
      this.router.navigate(['/inventory/product-category']);
    }
  }


  filterActions = [
    {
      iconClass: 'fas fa-sort-alpha-down',
      action: 'CategoryNameAsc',
      label: 'Category Name: A to Z'
    },
    {
      iconClass: 'fas fa-sort-alpha-up-alt',
      action: 'CategoryNameAscDesc',
      label: 'Category Name: Z to A'
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
    let filteredCategories: GetProductCategoryQueryResponse[] = [];
    switch (event.action) {
      case 'CategoryNameAsc':
        filteredCategories = [...this.allProductCategories].sort((a, b) => a.productFullName.localeCompare(b.productFullName));
        break;
      case 'CategoryNameAscDesc':
        filteredCategories = [...this.allProductCategories].sort((a, b) => b.productFullName.localeCompare(a.productFullName));
        break;
      case 'IsActiveTrue':
        filteredCategories = this.allProductCategories.filter(cat => cat.isActive === true);
        break;
      case 'IsActiveFalse':
        filteredCategories = this.allProductCategories.filter(cat => cat.isActive === false);
        break;
      case 'Reset':
        filteredCategories = [...this.allProductCategories]
        break;
      default:
        break;
    }
    this.productCategories = filteredCategories;
  }

}
