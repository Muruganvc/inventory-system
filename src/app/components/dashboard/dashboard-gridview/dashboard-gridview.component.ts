import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ProductQuantities } from '../../../models/ProductQuantities';
import { DashboardService } from '../../../services/dashboard.service';
import { AdvancedFilterDialogComponent } from './advanced-filter-dialog/advanced-filter-dialog.component';

@Component({
  selector: 'app-dashboard-gridview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule
  ],
  templateUrl: './dashboard-gridview.component.html',
  styleUrl: './dashboard-gridview.component.scss'
})
export class DashboardGridviewComponent implements OnInit {
  searchText: string = '';
  productList: ProductQuantities[] = [];
  allProducts: ProductQuantities[] = [];

  private readonly dashBoardService = inject(DashboardService);
  private readonly dialog = inject(MatDialog);

  private readonly dynamicColors: string[] = [
    '#5bc0de', '#4caf50', '#3f51b5', '#ff9800', '#9c27b0',
    '#009688', '#c2185b', '#00bcd4', '#8bc34a', '#ffc107',
    '#795548', '#e91e63', '#607d8b', '#2196f3', '#ff5722',
    '#673ab7', '#03a9f4', '#aed581', '#f06292', '#90a4ae',
    '#f44336', '#26a69a', '#ffb74d', '#b39ddb', '#689f38'
  ];

  ngOnInit(): void {
    this.getProductsList();
  }

  getProductsList(): void {
    this.dashBoardService.getProductQuantity().subscribe({
      next: result => {
        let colorIndex = 0;
        this.allProducts = result.map(item => ({
          ...item,
          color: item.quantity <= 50 ? 'red' : this.dynamicColors[colorIndex++ % this.dynamicColors.length]
        }));
        this.productList = [...this.allProducts];
      }
    });
  }

  applyFilter(): void {
    const search = this.searchText.toLowerCase().trim();
    this.productList = this.allProducts.filter(product =>
      product.companyName.toLowerCase().includes(search) ||
      product.categoryName.toLowerCase().includes(search) ||
      product.productCategoryName.toLowerCase().includes(search)
    );
  }

  resetFilter(): void {
    this.searchText = '';
    this.applyFilter();
  }
  sortByCompanyAsc(): void {
    this.productList = [...this.productList].sort((a, b) =>
      a.companyName.localeCompare(b.companyName)
    );
  }

  sortByCompanyDesc(): void {
    this.productList = [...this.productList].sort((a, b) =>
      b.companyName.localeCompare(a.companyName)
    );
  }

  sortByQuantityAsc(): void {
    this.productList = [...this.productList].sort((a, b) => a.quantity - b.quantity);
  }

  sortByQuantityDesc(): void {
    this.productList = [...this.productList].sort((a, b) => b.quantity - a.quantity);
  }
  openAdvancedFilter(event: MouseEvent): void {
    const dialogRef = this.dialog.open(AdvancedFilterDialogComponent, {
      width: '320px',
      disableClose: true,
      hasBackdrop: true, // ✅ shows backdrop
      autoFocus: false,
      backdropClass: 'custom-backdrop', // ✅ custom class for styling
      data: {
        company: '',
        category: '',
        minQty: 0,
        maxQty: 9999
      }
    });
    dialogRef.afterClosed().subscribe(filter => {
      if (!filter) return;

      const company = (filter.company ?? '').toLowerCase().trim();
      const category = (filter.category ?? '').toLowerCase().trim();
      const minQty = filter.minQty ?? 0;
      const maxQty = filter.maxQty ?? Infinity;

      this.productList = this.allProducts.filter(product => {
        const productCompany = product.companyName.toLowerCase();
        const productCategory = product.categoryName.toLowerCase();

        return (
          (!company || productCompany.includes(company)) &&
          (!category || productCategory.replace(/[^a-z0-9]/gi, '').includes(category.replace(/[^a-z0-9]/gi, ''))) &&
          product.quantity >= minQty &&
          product.quantity <= maxQty
        );
      });
    });
  }

}
