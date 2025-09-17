import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductQuantities } from '../../../models/ProductQuantities';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdvancedFilterDialogComponent } from './advanced-filter-dialog/advanced-filter-dialog.component';
import * as FileSaver from 'file-saver';
import * as ExcelJS from 'exceljs';
@Component({
  selector: 'app-product-available-qauntity',
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
  templateUrl: './product-available-qauntity.component.html',
  styleUrl: './product-available-qauntity.component.scss'
})
export class ProductAvailableQauntityComponent {
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
          color: item.quantity <= 10 ? 'red' : 'green' // this.dynamicColors[colorIndex++ % this.dynamicColors.length]
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

  exportToProductQuantitiesExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Product Quantities');

    // Define columns
    worksheet.columns = [
      { header: 'Company Name', key: 'companyName', width: 25 },
      { header: 'Category Name', key: 'categoryName', width: 25 },
      { header: 'Product Category', key: 'productCategoryName', width: 25 },
      { header: 'Available Quantity', key: 'quantity', width: 18 } 
    ];

    // Add data rows
    this.productList.forEach(item => worksheet.addRow(item));

    // Add total row
    // const totalQuantity = this.productList.reduce(
    //   (sum, item) => sum + (item.quantity || 0),
    //   0
    // );

    worksheet.addRow([]);
    // const totalRow = worksheet.addRow({
    //   productCategoryName: 'Total',
    //   quantity: totalQuantity
    // });

    // 🔶 Style Header
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFF00' } }; // Yellow
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' } // Red
      };
    });

    // 🔶 Add Borders to All Rows
    const applyBorders = (row: ExcelJS.Row) => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    };

    // Apply borders to all rows
    for (let i = 1; i <= worksheet.rowCount; i++) {
      applyBorders(worksheet.getRow(i));
    }

    // Bold total row
    // totalRow.eachCell(cell => {
    //   cell.font = { bold: true };
    // });

    // Save file
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, 'ProductQuantities.xlsx');
    });
  }
}
