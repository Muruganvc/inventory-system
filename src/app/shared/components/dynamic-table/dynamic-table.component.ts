import { Component, EventEmitter, Input, Output } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import{ MatSelectModule} from '@angular/material/select';


export interface TableColumn {
  field: string;
  header: string;
  type: 'text' | 'input' | 'select' | 'checkbox' | 'date' | 'actions' | 'button'; // remove `| undefined`
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  options?: { label: string; value: any }[];
  highLight?: boolean;
}


@Component({
  selector: 'app-dynamic-table',
  standalone: true,
   imports: [CommonModule, FormsModule,MatInputModule,MatFormFieldModule,MatSelectModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss'
})
export class DynamicTableComponent {
@Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];

  @Output() rowClick = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  filterText: string = '';
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  pageSize = 5;
  currentPage = 1;

  get filteredData(): any[] {
    let filtered = this.data;

    if (this.filterText) {
      const filter = this.filterText.toLowerCase();
      filtered = filtered.filter(row =>
        this.columns.some(col =>
          String(row[col.field] || '').toLowerCase().includes(filter)
        )
      );
    }

    if (this.sortField) {
      filtered = [...filtered].sort((a, b) => {
        const valA = a[this.sortField];
        const valB = b[this.sortField];
        return (valA < valB ? -1 : valA > valB ? 1 : 0) * (this.sortDirection === 'asc' ? 1 : -1);
      });
    }

    const start = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

  trackByIndex(index: number) {
    return index;
  }

  getCellLabel(col: any, row: any): string {
  if (col.type === 'select') {
    const option = (col.options || []).find((opt: { value: any; }) => opt.value === row[col.field]);
    return option ? option.label : row[col.field];
  }
  return row[col.field];
}

}
