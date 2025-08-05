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
  allCompanies: GetCompanyQueryResponse[] = [];

  // Injected services
  private readonly router = inject(Router);
  private readonly companyService = inject(CompanyService);
  private readonly authService = inject(AuthService);
  private readonly commonService = inject(CommonService);

  // Table column configuration
  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean, pipe?: string, }[] = [
    { key: 'companyName', label: 'Company Name', align: 'left', isHidden: false },
    { key: 'description', label: 'Description', align: 'left', isHidden: true },
    { key: 'isActive', label: 'Is Active', align: 'left', isHidden: false },
    { key: 'createdDate', label: 'Created Date', align: 'left', isHidden: false, pipe: 'date' },
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
      next: (result) => {
        this.companies = result;
        this.allCompanies = result;
      }
    });
  }

  isUser(): boolean {
    return !this.authService.hasRole(['ADMIN']);
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

  filterActions = [
    {
      iconClass: 'fas fa-sort-alpha-down',
      action: 'CompanyNameAsc',
      label: 'Company Name: A to Z'
    },
    {
      iconClass: 'fas fa-sort-alpha-up-alt',
      action: 'CompanyNameAscDesc',
      label: 'Company Name: Z to A'
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
      class :'excel-button'
    },
    {
      label: 'Add Company',
      icon: 'fas fa-circle-plus',
      tooltip: 'Add Company',
      action: 'addCompany',
      class :'add-new-item-button'
    }
  ];


  onButtonClicked(action: string) {
    if (action === 'excelExport') {
      this.exportToExcel();
    } else if (action === 'addCompany') {
      this.router.navigate(['/inventory/company']);
    }
  }


  onFilterActionClick(event: { action: string }) {
    let filteredcompanies: GetCompanyQueryResponse[] = [];
    switch (event.action) {
      case 'CompanyNameAsc':
        filteredcompanies = [...this.allCompanies].sort((a, b) => a.companyName.localeCompare(b.companyName));
        break;
      case 'CompanyNameAscDesc':
        filteredcompanies = [...this.allCompanies].sort((a, b) => b.companyName.localeCompare(a.companyName));
        break;
      case 'IsActiveTrue':
        filteredcompanies = this.allCompanies.filter(comp => comp.isActive === true);
        break;
      case 'IsActiveFalse':
        filteredcompanies = this.allCompanies.filter(comp => comp.isActive === false);
        break;
      case 'Reset':
        filteredcompanies = [...this.allCompanies]
        break;
      default:
        break;
    }
    this.companies = filteredcompanies;
  }
}
