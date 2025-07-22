import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CustomTableComponent } from '../../../../shared/components/custom-table/custom-table.component';
import { CompanyService } from '../../../../services/company.service';
import { AuthService } from '../../../../services/auth.service';
import { GetCompanyQueryResponse } from '../../../../models/GetCompanyQueryResponse';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss',
})
export class CompanyListComponent implements OnInit {
  companies: GetCompanyQueryResponse[] = [];

  // Injected services
  private readonly router = inject(Router);
  private readonly companyService = inject(CompanyService);
  private readonly authService = inject(AuthService);

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
}
