import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuditLog } from '../../../models/AuditLog';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-audit-table-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-table-view.component.html',
  styleUrls: ['./audit-table-view.component.scss']
})
export class AuditTableViewComponent implements OnInit {

  auditLogs: AuditLog[] = [];
  expandedIndex: number | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getAuditLogs().subscribe({
      next: (logs) => {
        this.auditLogs = logs || [];
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
}
