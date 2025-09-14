import { Component, inject, OnInit } from '@angular/core';
import { CustomTableComponent } from "../../../../shared/components/custom-table/custom-table.component";
import { Router } from '@angular/router';
import { GetCategoryQueryResponse } from '../../../../models/GetCategoryQueryResponse';
import { CompanyService } from '../../../../services/company.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonService, ExcelColumn } from '../../../../shared/services/common.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CustomTableComponent, MatButtonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly companyService = inject(CompanyService);
  private readonly authService = inject(AuthService);
  private readonly commonService = inject(CommonService);
  categories: GetCategoryQueryResponse[] = [];
  allCategories: GetCategoryQueryResponse[] = [];
  ngOnInit(): void {
    this.companyService.getCategories(true).subscribe({
      next: result => {
        if (result && Array.isArray(result)) {
          this.categories = result.map(a => ({
            ...a,
            companyCategoryName: `${a.companyName} ${a.categoryName}`
          }));

          this.allCategories = this.categories;
        }
      }
    });

  }

  isUser = (): boolean => {
    return !this.authService.hasRole(["ADMIN"]);
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
    ];

  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean, pipe?: string }[] = [
    { key: 'companyCategoryName', label: 'Company Category Name', align: 'left', isHidden: false },
    { key: 'description', label: 'Description', align: 'left', isHidden: true },
    { key: 'isActive', label: 'Is Active', align: 'left', isHidden: false },
    { key: 'createdAt', label: 'Created Date', align: 'left', isHidden: false, pipe: 'date' },
    { key: 'createdBy', label: 'Created By', align: 'left', isHidden: false },
  ];


  onAction(event: { row: any; action: string }) {
    const { row, action } = event;
    switch (action) {
      case 'edit': this.onEdit(row); break
    }
  }
  onEdit(company: GetCategoryQueryResponse) {
    this.router.navigate(['/inventory/category'], {
      state: { data: company }
    });
  }

  exportToExcel = (): void => {
    const columns: ExcelColumn<GetCategoryQueryResponse>[] = [
      { header: 'Company Category Name', key: 'companyCategoryName', width: 25 },
      { header: 'Company ID', key: 'companyId', width: 12 },
      { header: 'Company Name', key: 'companyName', width: 25 },
      { header: 'Category ID', key: 'categoryId', width: 12 },
      { header: 'Category Name', key: 'categoryName', width: 25 },
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
      { header: 'Created By', key: 'createdBy', width: 20 }

    ];
    this.categories = this.commonService.sortByKey(this.categories, 'companyCategoryName', 'asc');
    this.commonService.exportToExcel<GetCategoryQueryResponse>(this.categories, columns, 'Company Category', 'Category List');
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

  buttons = [
    {
      label: 'Excel Export',
      icon: 'fas fa-file-excel',
      tooltip: 'Excel Export',
      action: 'excelExport',
      class: 'excel-button'
    },
    {
      label: 'Add Category',
      icon: 'fas fa-circle-plus',
      tooltip: 'Add Product',
      action: 'addCategory',
      class: 'add-new-item-button'
    }
  ];


  onButtonClicked(action: string) {
    if (action === 'excelExport') {
      this.exportToExcel();
    } else if (action === 'addCategory') {
      this.router.navigate(['/inventory/category']);
    }
  }


  onFilterActionClick(event: { action: string }) {
    let filteredCategories: GetCategoryQueryResponse[] = [];
    switch (event.action) {
      case 'CategoryNameAsc':
        filteredCategories = [...this.allCategories].sort((a, b) => a.companyCategoryName.localeCompare(b.companyCategoryName));
        break;
      case 'CategoryNameAscDesc':
        filteredCategories = [...this.allCategories].sort((a, b) => b.companyCategoryName.localeCompare(a.companyCategoryName));
        break;
      case 'IsActiveTrue':
        filteredCategories = this.allCategories.filter(cat => cat.isActive === true);
        break;
      case 'IsActiveFalse':
        filteredCategories = this.allCategories.filter(cat => cat.isActive === false);
        break;
      case 'Reset':
        filteredCategories = [...this.allCategories]
        break;
      default:
        break;
    }
    this.categories = filteredCategories;
  }

}
