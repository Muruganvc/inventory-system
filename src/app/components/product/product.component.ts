import { Component } from '@angular/core';
import { ReusableTableComponent } from "../../shared/components/reusable-table/reusable-table.component";
import { TableColumn } from '../../shared/common/ActionButton';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ReusableTableComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  tableColumns: TableColumn[] = [
    {
      field: 'id', header: 'ID', type: 'text', align: 'center',
      visible: false,
      editable: false
    },
    {
      field: 'name', header: 'Name', type: 'input', align: 'left', editable: true,
      visible: false
    },
    {
      field: 'role',
      header: 'Role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Guest', value: 'guest' }
      ],
      editable: true,
      align: 'left',
      visible: false
    },
    {
      field: 'isActive',
      header: 'Active',
      type: 'checkbox',
      editable: true,
      align: 'center',
      visible: false
    },
    {
      field: 'dob',
      header: 'DOB',
      type: 'date',
      editable: true,
      align: 'center',
      visible: false
    },
    {
      field: 'actions',
      header: 'Actions',
      type: 'actions',
      align: 'center',
      buttons: [
        {
          icon: 'edit',
          label: 'Edit',
          color: 'primary',
          action: (row) => this.startEdit(row)
        },
        {
          icon: 'delete',
          label: 'Delete',
          color: 'warn',
          action: (row) => this.onDelete(row)
        }
      ],
      visible: false,
      editable: false
    }
  ];

  tableData = [
    { id: 1, name: 'John Doe', role: 'admin', isActive: true, dob: new Date('1990-01-01') },
    { id: 2, name: 'Jane Smith', role: 'user', isActive: false, dob: new Date('1995-05-15') }
  ];
  onDelete(row: any) {
    console.log('Deleted row:', row);
    this.tableData = this.tableData.filter(r => r.id !== row.id);
  }

  startEdit(row: any) {
    console.log('Edit row:', row);
    // optionally you can trigger editing mode via a service or state
  }
}
