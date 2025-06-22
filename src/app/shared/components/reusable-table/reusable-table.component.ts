import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatTableModule
} from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActionButton, TableColumn } from '../../common/ActionButton';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  templateUrl: './reusable-table.component.html',
  styleUrls: ['./reusable-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class ReusableTableComponent implements OnInit {
  @Input() columns: TableColumn[] = [];
  @Input() dataSource: any[] = [];
  @Input() rowKey: string = 'id';

  @Output() delete = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();

  displayedColumns: string[] = [];
  editedRow: any = null;
  isMobile: boolean = false;
  currentPage = 0;
  pageSize = 6;
  pagedData: any[] = [];

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnInit(): void {
    this.onResize();

    this.displayedColumns = this.columns
      .filter(c => c.type !== 'actions')
      .map(c => c.field);

    if (this.hasActions) {
      this.displayedColumns.push('actions');
    }
  }

  get hasActions(): boolean {
    return this.columns.some(c => c.type === 'actions');
  }

  get actionButtons(): ActionButton[] {
    return this.columns.find(c => c.type === 'actions')?.buttons || [];
  }

  getLabel(column: TableColumn, value: any): string {
    return column.options?.find(opt => opt.value === value)?.label || '';
  }

  isEditing(row: any): boolean {
    return this.editedRow && this.editedRow[this.rowKey] === row[this.rowKey];
  }

  startEdit(row: any) {
    this.editedRow = { ...row };
  }

  cancelEdit() {
    this.editedRow = null;
  }

  saveEdit(row: any) {
    Object.assign(row, this.editedRow);
    this.update.emit(row);
    this.editedRow = null;
  }

  // handleAction(btn: ActionButton, row: any) {
  //   if (btn.action) {
  //     btn.action(row);
  //   }
  // }

  handleAction(btn: ActionButton, row: any) {
    if (btn.label.toLowerCase() === 'edit') {
      this.startEdit(row); // triggers edit mode
    } else if (btn.action) {
      btn.action(row); // fallback for other actions like delete
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedData();
  }

  updatePagedData() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.dataSource.slice(start, end);
  }

}
