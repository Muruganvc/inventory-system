import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';
import { TableColumn, DynamicTableComponent } from '../../shared/components/dynamic-table/dynamic-table.component';
import { ReusableTableComponent } from "../../shared/components/reusable-table/reusable-table.component";
import { InvoiceComponent } from "../order-summary/invoice/invoice.component";
import { DaywiseComponent } from "./daywise/daywise.component";
import { WeekwiseComponent } from "./weekwise/weekwise.component";
import { MonthwiseComponent } from "./monthwise/monthwise.component";
import { YearwiseComponent } from "./yearwise/yearwise.component";
import { CompayWiseBalanceComponent } from "./compay-wise-balance/compay-wise-balance.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule, CommonModule, FormsModule, DaywiseComponent, WeekwiseComponent, MonthwiseComponent, YearwiseComponent, CompayWiseBalanceComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    clearInterval(this.autoSlideInterval); // prevent memory leaks
  }
  ngOnInit(): void {
    this.startAutoSlider();
  }

  companies = [
    {
      name: 'Company A', id: 1, partyName: 'Muruganvc', totalBalanceAmount: 50000, balanceAmount: 40000,
      transactions: [
        { date: '2025-06-01', description: 'Invoice #1001', amount: 25000 },
        { date: '2025-06-15', description: 'Payment Received', amount: -10000 },
      ]
    },
    {
      name: 'Company B', id: 2, partyName: 'Gokul', totalBalanceAmount: 70000, balanceAmount: 50000, transactions: [
        { date: '2025-06-01', description: 'Invoice #1001', amount: 25000 },
        { date: '2025-06-15', description: 'Payment Received', amount: -10000 },
      ]
    },
    {
      name: 'Company C', id: 3, partyName: 'kalaiyarsan', totalBalanceAmount: 90000, balanceAmount: 80000, transactions: [
        { date: '2025-06-01', description: 'Invoice #1001', amount: 25000 },
        { date: '2025-06-15', description: 'Payment Received', amount: -10000 },
      ]
    }
  ];

  currentCompanyIndex = 0;
  private autoSlideInterval: any;

  nextCompany() {
    if (this.currentCompanyIndex < this.companies.length - 1) {
      this.currentCompanyIndex++;
    }
  }

  previousCompany() {
    if (this.currentCompanyIndex > 0) {
      this.currentCompanyIndex--;
    }
  }

  startAutoSlider(): void {
    this.autoSlideInterval = setInterval(() => {
      this.currentCompanyIndex =
        (this.currentCompanyIndex + 1) % this.companies.length;
    }, 2000); // 2 seconds per slide
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

}
