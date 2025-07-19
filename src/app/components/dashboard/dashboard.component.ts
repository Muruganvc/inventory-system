import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

import { DaywiseComponent } from './daywise/daywise.component';
import { WeekwiseComponent } from './weekwise/weekwise.component';
import { MonthwiseComponent } from './monthwise/monthwise.component';
import { YearwiseComponent } from './yearwise/yearwise.component';
import { CompanyWiseIncomeComponent } from './company-wise-income/company-wise-income.component';
import { ProductAvailableQauntityComponent } from './product-available-qauntity/product-available-qauntity.component';

import { DashboardService } from '../../services/dashboard.service';
import { TotalProductQueryResponse } from '../../models/CompanyWiseIncomeQueryResponse';
import { CompanyGroup } from '../../models/ProductSummary';
import { AuditLog } from '../../models/AuditLog';
import { AuditComponent } from "./audit/audit.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatButtonModule,
    MatMenuModule,
    DaywiseComponent,
    WeekwiseComponent,
    MonthwiseComponent,
    YearwiseComponent,
    CompanyWiseIncomeComponent,
    ProductAvailableQauntityComponent,
    AuditComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly dashBoardService = inject(DashboardService);
  private autoSlideInterval: any;

  currentCompanyIndex = 0;
  productSoldOut: TotalProductQueryResponse;
  auditLog: AuditLog[] = [];
  companyData: CompanyGroup[] = [];
 

  companies = [
    {
      name: 'Company A',
      id: 1,
      partyName: 'Muruganvc',
      totalBalanceAmount: 50000,
      balanceAmount: 40000,
      transactions: [
        { date: '2025-06-01', description: 'Invoice #1001', amount: 25000 },
        { date: '2025-06-15', description: 'Payment Received', amount: -10000 }
      ]
    },
    {
      name: 'Company B',
      id: 2,
      partyName: 'Gokul',
      totalBalanceAmount: 70000,
      balanceAmount: 50000,
      transactions: [
        { date: '2025-06-01', description: 'Invoice #1001', amount: 25000 },
        { date: '2025-06-15', description: 'Payment Received', amount: -10000 }
      ]
    },
    {
      name: 'Company C',
      id: 3,
      partyName: 'Kalaiyarsan',
      totalBalanceAmount: 90000,
      balanceAmount: 80000,
      transactions: [
        { date: '2025-06-01', description: 'Invoice #1001', amount: 25000 },
        { date: '2025-06-15', description: 'Payment Received', amount: -10000 }
      ]
    }
  ];

ngOnInit(): void {
  this.productSoldOut = {
    totalQuantity: 0,
    totalNetAmount: 0,
    balanceAmount: 0,
    companyWiseSales: []
  };

  this.startAutoSlider();
  this.getProductSoldOut();
  this.getAuditLogs();
}

  ngOnDestroy(): void {
    this.stopAutoSlider();
  }

  nextCompany(): void {
    if (this.currentCompanyIndex < this.companies.length - 1) {
      this.currentCompanyIndex++;
    }
  }

  previousCompany(): void {
    if (this.currentCompanyIndex > 0) {
      this.currentCompanyIndex--;
    }
  }

  startAutoSlider(): void {
    this.autoSlideInterval = setInterval(() => {
      this.currentCompanyIndex =
        (this.currentCompanyIndex + 1) % this.companies.length;
    }, 2000);
  }

  stopAutoSlider(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  onMouseEnter(): void {
    this.stopAutoSlider();
  }

  onMouseLeave(): void {
    this.startAutoSlider();
  }

  getProductSoldOut(): void {
    this.dashBoardService.getProductSoldOut().subscribe({
      next: result => (this.productSoldOut = result)
    });
  }

  getAuditLogs(): void {
    this.dashBoardService.getAuditLogs().subscribe({
      next: result => (this.auditLog = result)
    });
  }
}
