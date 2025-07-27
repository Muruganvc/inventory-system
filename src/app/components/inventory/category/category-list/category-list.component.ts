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
  ngOnInit(): void {
    this.companyService.getCategories(true).subscribe({
      next: result => {
        if (result && Array.isArray(result)) {
          this.categories = result.map(a => ({
            ...a,
            companyCategoryName: `${a.companyName} ${a.categoryName}`
          }));
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

  newOpen(a: any) {
    this.router.navigate(['/inventory/category']);
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
    this.commonService.exportToExcel<GetCategoryQueryResponse>(this.categories, columns, 'Category', 'Category List');
  }

}
