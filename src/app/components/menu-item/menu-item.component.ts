import { Component, Input, signal } from '@angular/core';
import { MenuItem } from '../../shared/common/MenuItem';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'app-menu-item',
  standalone: true,
   imports: [RouterModule, MatListModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
 @Input() item: MenuItem

  nestedMenuItem = signal(false);

  toggleNested() {
    if (!this.item.subMenuItem) {
      return;
    }
    this.nestedMenuItem.set(!this.nestedMenuItem());
  }
}
