import { ChangeDetectorRef, Component, effect, EventEmitter, input, Input, OnChanges, OnInit, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon'
import { LayoutModule } from '@angular/cdk/layout';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NumberOnlyDirective } from '../../services/NumberOnlyDirective ';
import { MatMenuModule } from '@angular/material/menu';

export interface TableRow {
  id: string | number;
  [key: string]: any;
}

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  type?: string;
  isHidden: boolean;
  pipe?: string;
  highLight?: {
    class: string,
    condition: (row: any) => boolean;
  }
}

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule, MatIconModule,
    LayoutModule, MatExpansionModule, MatCheckboxModule,
    MatTooltipModule, NumberOnlyDirective, MatMenuModule
  ],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss'
})
export class CustomTableComponent<T extends TableRow> implements OnChanges {
  searchTerm = '';
  applyFilter(): void {
    if (!this.isMobile) {
      this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    }
    this.filterData();
  }
  @Input() data: T[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() showCheckbox = false;
  @Input() showActions = true;
  @Output() fieldChanged = new EventEmitter<{ row: any; key: string; value: any }>();

  title = input.required();
  addBtnTitle = input();

  @Input() showHeader: boolean = true;

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];

  editRowId: TableRow['id'] | null = null;
  editedRow: Partial<T> = {};

  isMobile = false;
  isTablet = false;
  @Input() actions: {
    iconClass: string;
    color: string;
    tooltip: string;
    action: string;
    condition: (row: any) => boolean;
  }[] = [];
  @Output() actionClick = new EventEmitter<{ row: any; action: string }>();
  @Input() filterProperties: string[] = [];
  @Input() buttons: { icon: string; action: string, label: string, tooltip: string, class: string }[] = [];
  @Output() buttonClicked = new EventEmitter<string>();
  onButtonClick(action: string) {
    this.buttonClicked.emit(action);
  }

  @Input() IsShowSearch = true;

  @Input() filterActions: { iconClass: string; action: string, label: string }[] = [];
  @Output() filterActionClick = new EventEmitter<{ action: string }>();

  onActionClick(action: string) {
    this.filterActionClick.emit({ action });
  }

  constructor(private breakpointObserver: BreakpointObserver, private cd: ChangeDetectorRef) {
    this.breakpointObserver.observe([
      '(max-width: 699px)',                                 // Mobile
      '(min-width: 700px) and (max-width: 1024px)',         // Tablet
      '(min-width: 1025px)'                                 // Desktop
    ]).subscribe(result => {
      this.isMobile = result.breakpoints['(max-width: 699px)'];
      this.isTablet = result.breakpoints['(min-width: 700px) and (max-width: 1024px)'];
    });

  }
  getCellClasses(col: TableColumn, row: any): { [key: string]: boolean } {
    const classes: { [key: string]: boolean } = {};
    if (col.highLight) {
      classes['highlight-cell'] = true;
      if (col.highLight.class && col.highLight.condition?.(row)) {
        classes[col.highLight.class] = true;
      }
    }
    return classes;
  }

  getRowClass(row: any): string {
    const match = this.columns.find(col => col.highLight?.condition?.(row));
    return match ? match.highLight?.class || 'highlight-row' : '';
  }

  get filteredData(): T[] {
    const term = this.searchTerm?.toLowerCase() || '';
    if (!term) return this.data;

    return this.data.filter(row =>
      this.columns.some(col => {
        const value = row[col.key];
        return value?.toString().toLowerCase().includes(term);
      })
    );
  }
  pageIndex = 0;
  pageSize = 10;
  get paginatedMobileData(): T[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
  get paginatorLength(): number {
    return Math.max(this.dataSource.filteredData.length, 1);
  }

  actionClick1(row: any, action: string) {
    this.actionClick.emit({ row, action });
  }


  filterData() {
    this.paginatedMobileData.filter(row => {
      return Object.keys(row).some(key => {
        return String(row[key]).toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    });
  }

  ngOnInit() {
    this.breakpointObserver.observe([
      '(max-width: 699px)',    // mobile
      '(max-width: 1024px)'    // tablet
    ]).subscribe(result => {
      this.isMobile = result.breakpoints['(max-width: 699px)'];
      this.isTablet = result.breakpoints['(max-width: 1024px)'] && !this.isMobile;
    });

    // ✅ Set displayedColumns correctly on init
    this.displayedColumns = this.columns
      .filter(col => !col.isHidden)
      .map(col => col.key);

    this.displayedColumns = this.columns.map(c => c.key);
    if (this.showActions) this.displayedColumns.push('actions');

    // if (this.showActions) this.displayedColumns.push('actions');
    // if (this.showCheckbox) this.displayedColumns.unshift('select');
  }
  trackByKey(index: number, item: any): string {
    return item.key;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] && changes['columns'].currentValue) {
      this.columns = [...changes['columns'].currentValue];
      this.cd.detectChanges();
    }

    if (changes['data'] && changes['data'].currentValue) {
      this.data = [...changes['data'].currentValue];
      this.dataSource = new MatTableDataSource<T>(this.data);

      setTimeout(() => {
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          this.applyFIlterAnyKey();
        }
      });
    }

    this.displayedColumns = this.columns
      ?.filter(col => !col.isHidden)
      .map(col => col.key) ?? [];

    if (this.showActions && !this.displayedColumns.includes('actions')) {
      this.displayedColumns.push('actions');
    }

    this.displayedColumns = [...new Set(this.displayedColumns)];
  }



  ngAfterViewInit() {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.applyFIlterAnyKey();
    }
  }



  startEdit(row: T) {
    this.editRowId = row.id;
    this.editedRow = { ...row };
    console.log('Editing row ID:', this.editRowId);
  }

  saveRow() {
    const updated = { ...this.editedRow } as T;
    const index = this.data.findIndex(d => d.id === updated.id);
    if (index > -1) {
      this.data[index] = updated;
      this.dataSource.data = [...this.data];
      this.applyFIlterAnyKey();
      this.edit.emit(updated);
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editRowId = null;
    this.editedRow = {};
  }

  deleteRow(row: T) {
    this.delete.emit(row);
  }

  isEditing(row: T) {
    return this.editRowId === row.id
  }
  getIconClass(type: string): string {
    switch (type) {
      case 'info': return 'icon-info';
      case 'warning': return 'icon-warning';
      case 'error': return 'icon-error';
      default: return 'icon-default';
    }
  }
  onFieldChange(row: any, key: string, value: any): void {
    const updatedRow = { ...row, [key]: value };
    this.fieldChanged.emit({ row: updatedRow, key, value });
  }

  private readonly dynamicColors: string[] = [
    '#5bc0de', '#4caf50', '#3f51b5', '#ff9800', '#9c27b0',
    '#009688', '#c2185b', '#00bcd4', '#8bc34a', '#ffc107',
    '#795548', '#e91e63', '#607d8b', '#2196f3', '#ff5722',
    '#673ab7', '#03a9f4', '#aed581', '#f06292', '#90a4ae',
    '#f44336', '#26a69a', '#ffb74d', '#b39ddb', '#689f38'
  ];

  getCardColor(index: number): string {
    return this.dynamicColors[index % this.dynamicColors.length];
  }

  getOppositeColor(hex: string): string {
    // Remove '#' and parse to integer
    const r = 255 - parseInt(hex.substr(1, 2), 16);
    const g = 255 - parseInt(hex.substr(3, 2), 16);
    const b = 255 - parseInt(hex.substr(5, 2), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }

  handleMobileAction(row: any, action: string) {
    if (action === 'editQty') {
      this.startEdit(row);
    } else {
      this.actionClick.emit({ row, action });
    }
  }

  applyFIlterAnyKey = (): void => {
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const searchWords = filter
        .toLowerCase()
        .split(' ')
        .filter(word => word.trim() !== '');

      let targetStr: string;

      if (this.filterProperties.length === 0) {
        // Search all properties
        targetStr = Object.values(data)
          .map(value => value?.toString().toLowerCase() || '')
          .join(' ');
      } else {
        // Search only specified properties
        targetStr = this.filterProperties
          .map(prop => data?.[prop]?.toString().toLowerCase() || '')
          .join(' ');
      }

      return searchWords.every(word => targetStr.includes(word));
    };
  }


}