import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { DaywiseComponent } from './daywise/daywise.component';
import { WeekwiseComponent } from './weekwise/weekwise.component';
import { MonthwiseComponent } from './monthwise/monthwise.component';
import { YearwiseComponent } from './yearwise/yearwise.component';
import { CompayWiseBalanceComponent } from './compay-wise-balance/compay-wise-balance.component';

import { ProductSummary, CompanyGroup } from '../../models/ProductSummary';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CompanyWiseIncomeComponent } from "./company-wise-income/company-wise-income.component";
import { DashboardService } from '../../services/dashboard.service';
import { TotalProductQueryResponse } from '../../models/CompanyWiseIncomeQueryResponse';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DaywiseComponent,
    WeekwiseComponent,
    MonthwiseComponent,
    YearwiseComponent,
    CompayWiseBalanceComponent,
    MatMenuModule,
    MatButtonModule,
    CompanyWiseIncomeComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentCompanyIndex = 0;
  private autoSlideInterval: any;
  private readonly dashBoardService = inject(DashboardService);
  productSoldOut :TotalProductQueryResponse;



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
      partyName: 'kalaiyarsan',
      totalBalanceAmount: 90000,
      balanceAmount: 80000,
      transactions: [
        { date: '2025-06-01', description: 'Invoice #1001', amount: 25000 },
        { date: '2025-06-15', description: 'Payment Received', amount: -10000 }
      ]
    }
  ];
 

  companyData: CompanyGroup[] = [];

  ngOnInit(): void {
    this.startAutoSlider();
    this.getProductSoldOut();
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSlideInterval);
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

  getProductSoldOut = (): void => {
    this.dashBoardService.getProductSoldOut().subscribe({
      next: result => {
        this.productSoldOut = result;
      }
    });
  }


}
