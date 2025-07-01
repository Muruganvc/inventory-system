import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';

@Component({
  selector: 'app-monthwise',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './monthwise.component.html',
  styleUrl: './monthwise.component.scss'
})
export class MonthwiseComponent {
  chart = new Chart({
    chart: {
      type: 'column'
    },
    title: {
      text: 'Switch Type 5A Sales - Month Wise by Company'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Sales (Units)'
      }
    },
    tooltip: {
      shared: true,
      valueSuffix: ' units'
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        name: 'Lisha',
        data: [120, 130, 140, 135, 150]
      },
      {
        name: 'Goldmedal',
        data: [100, 115, 105, 120, 110]
      },
      {
        name: 'GM',
        data: [90, 95, 85, 100, 95]
      },
      {
        name: 'Anchor',
        data: [130, 145, 135, 140, 150]
      },
      {
        name: 'Philips',
        data: [110, 125, 120, 130, 125]
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
