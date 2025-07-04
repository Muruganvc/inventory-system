import { Component, inject, OnInit } from '@angular/core';
import { CustomTableComponent } from "../../../../shared/components/custom-table/custom-table.component";
import { GetProductCategoryQueryResponse } from '../../../../models/GetProductCategoryQueryResponse';
import { CompanyService } from '../../../../services/company.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-category-list',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.scss'
})
export class ProductCategoryListComponent implements OnInit {
  productCategories: GetProductCategoryQueryResponse[] = [];
  private readonly companyService = inject(CompanyService);
  private readonly router = inject(Router);
  ngOnInit(): void {
    this.companyService.getProductCategories().subscribe({
      next: result => {
        if (!!result) {
          this.productCategories = result;
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
      },
      // {
      //   iconClass: 'fas fa-trash-alt',
      //   color: 'red',
      //   tooltip: 'Delete',
      //   action: 'delete',
      //   condition: (row: any) => !row.isEditing
      // }
    ];

  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean, pipe?: string }[] = [
    { key: 'companyName', label: 'Company Name', align: 'left', isHidden: false },
    { key: 'categoryName', label: 'Category Name', align: 'left', isHidden: false },
    { key: 'productCategoryName', label: 'Product Category Name', align: 'left', isHidden: false },
    { key: 'description', label: 'Description', align: 'left', isHidden: true },
    { key: 'isActive', label: 'Is Active', align: 'left', isHidden: false },
    { key: 'createdAt', label: 'Created Date', align: 'left', isHidden: false, pipe: 'date' },
    { key: 'username', label: 'Creator By', align: 'left', isHidden: false },
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

  onEdit(productCategory: GetProductCategoryQueryResponse) {
    this.router.navigate(['/inventory/product-category'], {
      state: { data: productCategory }
    });
  }

  newOpen(a: any) {
    this.router.navigate(['/inventory/product-category']);
  }

}
