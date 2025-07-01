import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
@Component({
  selector: 'app-daywise',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './daywise.component.html',
  styleUrl: './daywise.component.scss'
})
export class DaywiseComponent {
  chart = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: 'Day-wise Sales'
    },
    xAxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      title: {
        text: 'Sales'
      }
    },
    series: [
      {
        name: 'Orders',
        data: [5, 10, 15, 8, 12, 20, 18]
      }
    ] as any,
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }
      ]
    }
  });
}
