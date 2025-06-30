import { Component } from '@angular/core';
import { CustomTableComponent } from "../../../../shared/components/custom-table/custom-table.component";

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CustomTableComponent],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss'
})
export class CategoryListComponent {
tableActions =
    [
      {
        iconClass: 'fas fa-pencil-alt',
        color: 'green',
        tooltip: 'Edit',
        action: 'edit',
        condition: (row: any) => !row.isEditing
      },
      {
        iconClass: 'fas fa-trash-alt',
        color: 'red',
        tooltip: 'Delete',
        action: 'delete',
        condition: (row: any) => !row.isEditing
      }
    ];

  columns: { key: string; label: string; align: 'left' | 'center' | 'right', type?: string, isHidden: boolean }[] = [
    { key: 'category', label: 'Category Name', align: 'left', isHidden: false },
    { key: 'company', label: 'Company Name', align: 'left', isHidden: false },
    { key: 'description', label: 'Description', align: 'left', isHidden: false },
    { key: 'creator', label: 'Creator By', align: 'left', isHidden: false },
  ];


  onAction(event: { row: any; action: string }) {
    const { row, action } = event;
    switch (action) {
      // case 'edit': this.onEdit(row); break;
      // case 'delete': this.deleteRow(row); break;
      // case 'save': this.saveRow(row); break;
      // case 'cancel': this.cancelEdit(row); break;
    }
  }

  newOpen(a: any) {

  }
}
