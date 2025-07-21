import { Component, inject, OnInit } from '@angular/core';
import { CustomTableComponent } from "../../../../shared/components/custom-table/custom-table.component";
import { Router } from '@angular/router';
import { GetCategoryQueryResponse } from '../../../../models/GetCategoryQueryResponse';
import { CompanyService } from '../../../../services/company.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly companyService = inject(CompanyService);
  private readonly authService = inject(AuthService);
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
    return !this.authService.hasRole(["Admin"]);
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
      // {
      //   iconClass: 'fas fa-trash-alt',
      //   color: 'red',
      //   tooltip: 'Delete',
      //   action: 'delete',
      //   condition: (row: any) => !row.isEditing
      // }
    ];

  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean }[] = [
    { key: 'companyCategoryName', label: 'Company Category Name', align: 'left', isHidden: false },
    { key: 'description', label: 'Description', align: 'left', isHidden: true },
    { key: 'isActive', label: 'Is Active', align: 'left', isHidden: false },
    { key: 'createdBy', label: 'Created By', align: 'left', isHidden: false },
  ];


  onAction(event: { row: any; action: string }) {
    const { row, action } = event;
    switch (action) {
      case 'edit': this.onEdit(row); break;
      // case 'delete': this.deleteRow(row); break;
      // case 'save': this.saveRow(row); break;
      // case 'cancel': this.cancelEdit(row); break;
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
}
