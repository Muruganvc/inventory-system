import { Component, inject, Input, OnInit } from '@angular/core';
import { AuditLog } from '../../../models/AuditLog';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'] 
})
export class AuditComponent implements OnInit {
  @Input() auditLog!: AuditLog;

  oldValues: Record<string, any> = {};
  newValues: Record<string, any> = {};

  ngOnInit(): void {
    try {
      this.oldValues = typeof this.auditLog.oldValues === 'string'
        ? JSON.parse(this.auditLog.oldValues)
        : this.auditLog.oldValues || {};

      this.newValues = typeof this.auditLog.newValues === 'string'
        ? JSON.parse(this.auditLog.newValues)
        : this.auditLog.newValues || {};
    } catch (error) {
      console.error('Error parsing audit values:', error);
    }
  }

  get changedKeys(): string[] {
    return Array.from(new Set([
      ...Object.keys(this.oldValues),
      ...Object.keys(this.newValues)
    ]));
  }
}
