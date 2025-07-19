import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuditLog } from '../../../models/AuditLog';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-audit-table-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-table-view.component.html',
  styleUrls: ['./audit-table-view.component.scss']
})
export class AuditTableViewComponent implements OnInit {
  auditLogs: AuditLog[] = [];
  filteredAuditLogs: AuditLog[] = [];
  expandedIndex: number | null = null;

  // Filters
  selectedTable: string = '';
  selectedAction: string = '';
  changedByFilter: string = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getAuditLogs().subscribe({
      next: (logs) => {
        this.auditLogs = logs || [];
        this.filteredAuditLogs = [...this.auditLogs];
      },
      error: (err) => console.error('Failed to load audit logs', err),
    });
  }

  toggleDetails(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  parseJson(value: any): Record<string, any> {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value || {};
    } catch {
      return {};
    }
  }

  getChangedKeys(oldVal: Record<string, any>, newVal: Record<string, any>): string[] {
    return Array.from(new Set([
      ...Object.keys(oldVal || {}),
      ...Object.keys(newVal || {}),
    ]));
  }

  applyFilters(): void {
    this.filteredAuditLogs = this.auditLogs.filter(log => {
      const matchesTable = !this.selectedTable || log.tableName === this.selectedTable;
      const matchesAction = !this.selectedAction || log.action === this.selectedAction;
      const matchesUser = !this.changedByFilter || log.changedBy?.toLowerCase().includes(this.changedByFilter.toLowerCase());
      return matchesTable && matchesAction && matchesUser;
    });

    // Reset expanded rows after filtering
    this.expandedIndex = null;
  }

 getUniqueValues(field: keyof AuditLog): string[] {
  return Array.from(
    new Set(
      this.auditLogs
        .map(x => x[field])
        .filter(value => value !== undefined && value !== null)
    )
  ).map(String);
}
}
