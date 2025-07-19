export interface AuditLog {
  id: number;
  tableName: string;
  action: 'Added' | 'Modified' | 'Deleted';
  changedBy: string;
  changedAt: Date;
  keyValues: Record<string, any>;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}
