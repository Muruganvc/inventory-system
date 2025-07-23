import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CustomTableComponent } from '../../../../shared/components/custom-table/custom-table.component';
import { CompanyService } from '../../../../services/company.service';
import { AuthService } from '../../../../services/auth.service';
import { GetCompanyQueryResponse } from '../../../../models/GetCompanyQueryResponse';
import { MatButtonModule } from '@angular/material/button'; 
import { CommonService, ExcelColumn } from '../../../../shared/services/common.service';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CustomTableComponent, MatButtonModule],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss',
})
export class CompanyListComponent implements OnInit {
  companies: GetCompanyQueryResponse[] = [];

  // Injected services
  private readonly router = inject(Router);
  private readonly companyService = inject(CompanyService);
  private readonly authService = inject(AuthService);
  private readonly commonService = inject(CommonService);

  // Table column configuration
  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean }[] = [
    { key: 'companyName', label: 'Company Name', align: 'left', isHidden: false },
    { key: 'description', label: 'Description', align: 'left', isHidden: true },
    { key: 'isActive', label: 'Is Active', align: 'left', isHidden: false },
    { key: 'createdBy', label: 'Created By', align: 'left', isHidden: false },
  ];
  // Action buttons for the table
  tableActions = [
    {
      iconClass: 'fas fa-pencil-alt',
      color: 'green',
      tooltip: 'Edit',
      action: 'edit',
      condition: (row: any) => !row.isEditing
    }
  ];

  ngOnInit(): void {
    this.loadCompanies();
  }

  private loadCompanies(): void {
    this.companyService.getCompanies(true).subscribe({
      next: (result) => (this.companies = result)
    });
  }

  isUser(): boolean {
    return !this.authService.hasRole(['Admin']);
  }

  onAction(event: { row: any; action: string }): void {
    if (event.action === 'edit') {
      this.onEdit(event.row);
    }
  }

  onEdit(company: GetCompanyQueryResponse): void {
    this.router.navigate(['/inventory/company'], {
      state: { data: company }
    });
  }

  newOpen(_: any): void {
    this.router.navigate(['/inventory/company']);
  }

  exportToExcel = (): void => {
    const columns: ExcelColumn<GetCompanyQueryResponse>[] = [
      { header: 'Company ID', key: 'companyId', width: 10 },
      { header: 'Company Name', key: 'companyName', width: 25 },
      { header: 'Active Status', key: 'isActive', width: 15, formatter: value => value ? 'Active' : 'Inactive' },
      { header: 'Created Date', key: 'createDate', width: 20, formatter: value => new Date(value).toLocaleDateString() },
      { header: 'Created By', key: 'createdBy', width: 20 }
    ];
    this.companies = this.commonService.sortByKey(this.companies, 'companyName', 'asc');
    this.commonService.exportToExcel<GetCompanyQueryResponse>(this.companies, columns, 'Companies', 'CompanyList');
  }
}
