import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-compay-wise-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compay-wise-balance.component.html',
  styleUrl: './compay-wise-balance.component.scss'
})
export class CompayWiseBalanceComponent {
@Input() company: any
showHistory = false;

toggleHistory() {
  this.showHistory = !this.showHistory;
}

}
